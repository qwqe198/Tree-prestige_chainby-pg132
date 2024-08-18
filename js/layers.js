function getPointGen(){
	let ret = getPointConstant()
        ret = ret.times(getPointMultiplier())
        ret = ret.pow(getPointExponentiation())
        ret = dilate(ret, getPointDilationExponent())

	return ret
}

function getPointConstant(){
        let ret = decimalOne

        return ret
}

function getPointMultiplier(){
        let ret = decimalOne

        for (let i = 0; i < LAYERS.length; i++){
                if (layers[LAYERS[i]].row == "side") continue
                                        ret = ret.times(tmp[LAYERS[i]].effect || decimalOne)
        }

        if (hasUpgrade("a", 11))        ret = ret.times(tmp.a.upgrades[11].effect)
                                        ret = ret.times(CURRENT_BUYABLE_EFFECTS["a11"])
        if (hasUpgrade("a", 12))        ret = ret.times(tmp.a.upgrades[12].effect)

        return ret
}

function getPointExponentiation(){
        let ret = decimalOne

        if (hasUpgrade("a", 15))        ret = ret.times(1.01)
        if (hasMilestone("a", 2)) {
                let base = 1.01
                if (player.b.times > 0 || player.c.unlocked) base = 1.03
                                        ret = ret.times(Decimal.pow(base, player.a.milestones.length))
        }
        
        return ret
}

function getPointDilationExponent(){
        let ret = decimalOne
        
        return ret
}

function getDilationExponent(){
        return getPointDilationExponent()
}

function sortStrings(l){
        l.sort(function(a,b){return Number(a)-Number(b)})
}

var br = "<br>"
var br2= br + br

function dilate(x, exponent, base = 10){
        if (x.lt(base)) return x
        return Decimal.pow(base, x.log(base).pow(exponent))
}

/*
All option+character:
¡™£¢∞§¶•ªº–≠
œ∑´®¥¨ˆøπ“‘«
åß∂ƒ©˙∆˚¬…æ
Ω≈ç√∫˜µ≤≥÷

All option+shift+character:
⁄€‹›ﬁﬂ‡°·‚—±
Œ„´‰ˇÁ¨Ø∏”’»
ÍÎÏ˝ÓÔÒÚÆ
¸˛Ç◊ı˜Â¯˘¿

Made 
𝞀
*/

function makeRed(c){
        return "<bdi style='color:#CC0033'>" + c + "</bdi>"
}

function makeBlue(c){
        return "<bdi style='color:#3379E3'>" + c + "</bdi>"
}

function makeGreen(c){
        return "<bdi style='color:#66E000'>" + c + "</bdi>"
}

function makePurple(c){
        return "<bdi style='color:#66297D'>" + c + "</bdi>"
}
                                                                                                                                                                                                                                                                        
function filter(list, keep){
        return list.filter(x => keep.includes(x) || keep.includes(Number(x)))
}

function filterOut(list, out){
        return list.filter(x => !out.includes(x) && !out.includes(Number(x)))
}

addLayer("a", {
        name: "Alligators", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#BB4C83",
        branches: [],
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "Alligators", // Name of prestige currency
        baseResource: "Points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("a").pow(hasMilestone("d", 1) + 1)
        },
        getBaseDiv(){
                return decimalOne
        },
        getGainExp(){
                let ret = new Decimal(2)

                if (hasUpgrade("a", 13)) ret = ret.max(player.a.upgrades.length)
                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["a31"])

                return ret
        },
        getGainMultPre(){
                let ret = decimalOne

                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["a32"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b31"])

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("a")

                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["a12"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["a33"].pow(player.a.upgrades.length))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b12"])

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("a")) return decimalOne

                let amt = player.a.points

                let exp = new Decimal(.5)
                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["a23"])

                let ret = amt.plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("a")
        },
        getNextAt(){
                return getGeneralizedNextAt("a")
        },
        update(diff){
                let data = player.a

                if (tmp.a.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("a", diff)
                
                if (hasMilestone("b", 3) || player.c.unlocked) {
                        handleGeneralizedBuyableAutobuy(diff, "a")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        layerShown(){return true},
        prestigeButtonText(){
                if (isPassiveGainActive("a")) return ""
                return getGeneralizedPrestigeButtonText("a")
        },
        canReset(){
                return player.a.time >= 2 && !isPassiveGainActive("a") && tmp.a.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-ligator"
                        },
                        description(){
                                let a = "Alligators multiply point gain"
                                if (player.shiftAlias) return "log10(x+10)<sup>3</sup>"
                                return a + br + "Currently: " + format(tmp.a.upgrades[11].effect)
                        },
                        cost: new Decimal(2),
                        effect(){
                                let exp = CURRENT_BUYABLE_EFFECTS["a22"].plus(3)
                                return player.a.points.plus(10).log10().pow(exp)
                        },
                        unlocked(){
                                return player.a.best.gt(0) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al-igator"
                        },
                        description(){
                                return "Each of the first nine upgrades unlocks an Alligator buyable and doubles point gain"
                        },
                        cost: new Decimal(30),
                        effect(){
                                return Decimal.pow(2, player.a.upgrades.length).min(512)
                        },
                        unlocked(){
                                return player.a.best.gt(10) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A--igator"
                        },
                        description(){
                                return "Alligator initial gain exponent is the number of Alligator upgrades"
                        },
                        cost: new Decimal(500),
                        unlocked(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>All-gator"
                        },
                        description(){
                                return "Gain 100% of Alligator gained on reset and one reset per second but lose the ability to prestige"
                        },
                        cost: new Decimal(3e10),
                        unlocked(){
                                return hasUpgrade("a", 13) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-l-gator"
                        },
                        description(){
                                return "Add .005 to A 13 base and raise Point gain ^1.01"
                        },
                        cost: new Decimal(1e20),
                        unlocked(){
                                return hasUpgrade("a", 14) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al--gator"
                        },
                        description(){
                                return "Remove A 1X base costs"
                        },
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("a", 15) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A---gator"
                        },
                        description(){
                                return "Remove the linear exponential component of A 11's cost"
                        },
                        cost: new Decimal(1e70),
                        unlocked(){
                                return hasUpgrade("a", 21) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Alli-ator"
                        },
                        description(){
                                return "Remove A 22's base cost"
                        },
                        cost: new Decimal(1e119),
                        unlocked(){
                                return hasUpgrade("a", 22) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-li-ator"
                        },
                        description(){
                                return "Remove A 23's base cost and unlock Beavers"
                        },
                        cost: new Decimal(5e192),
                        unlocked(){
                                return hasUpgrade("a", 23) || player.b.unlocked
                        }, 
                }, // hasUpgrade("a", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al-i-ator"
                        },
                        description(){
                                return "Remove A 21's base cost and per upgrade add .01 to A 13's base"
                        },
                        cost: new Decimal("1e636"),
                        unlocked(){
                                return hasUpgrade("b", 12) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A--i-ator"
                        },
                        description(){
                                return "Remove A 21's linear exponential cost component and A 23 gives free A 22 levels"
                        },
                        cost: new Decimal("1e705"),
                        unlocked(){
                                return player.b.best.gte(1e4) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>All--ator"
                        },
                        description(){
                                return "You get 100% of Beavers upon reset per second and add 1 to its effect exponent"
                        },
                        cost: new Decimal("1e819"),
                        unlocked(){
                                return hasUpgrade("a", 31) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-l--ator"
                        },
                        description(){
                                return "<bdi style='font-size: 80%'>Per upgrade upgrades/10 multiplies Beaver gain and All--ator adds to Beaver upgrade per this row upgrade</bdi>"
                        },
                        cost: new Decimal("1e942"),
                        unlocked(){
                                return hasUpgrade("a", 32) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al---ator"
                        },
                        description(){
                                return "B 12 gives free A 32 levels and add .5 to the Beaver gain exponent"
                        },
                        cost: new Decimal("1e2048"),
                        unlocked(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A----ator"
                        },
                        description(){
                                return "Remove A buyable's base cost and per row 2 Beaver upgrade add .5 to the Beaver gain exponent"
                        },
                        cost: new Decimal("1e5600"),
                        unlocked(){
                                return hasUpgrade("b", 21) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 35)
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Allig-tor"
                        },
                        description(){
                                return "Remove B 11's base cost and A 31 gives free A 21 levels"
                        },
                        cost: new Decimal("1e38200"),
                        unlocked(){
                                return hasUpgrade("b", 25) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 41)
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-lig-tor"
                        },
                        description(){
                                return "Each this row upgrade adds 1 to B 31's base and B 22 gives free B 12 levels"
                        },
                        cost: new Decimal("1e270000"),
                        unlocked(){
                                return hasUpgrade("a", 41) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 42)
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al-ig-tor"
                        },
                        description(){
                                return "B 23 gives free B 21 levels"
                        },
                        cost: new Decimal("1e305800"),
                        unlocked(){
                                return hasUpgrade("a", 42) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 43)
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A--ig-tor"
                        },
                        description(){
                                return "B 31 gives free B 13 levels and multiplies A 11 base"
                        },
                        cost: new Decimal("1e544600"),
                        unlocked(){
                                return hasUpgrade("a", 43) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 44)
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>All-g-tor"
                        },
                        description(){
                                return "B 31 gives free B 21 levels and multiplies A 13 base"
                        },
                        cost: new Decimal("1e861300"),
                        unlocked(){
                                return hasUpgrade("a", 44) || player.c.unlocked
                        }, 
                }, // hasUpgrade("a", 45)
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-l-g-tor"
                        },
                        description(){
                                return "Remove C 13 base cost and each upgrade in this row doubles Beaver bulk amount"
                        },
                        cost: new Decimal("e6e25"),
                        unlocked(){
                                return hasUpgrade("c", 23) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 51)
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Al--g-tor"
                        },
                        description(){
                                return "This row upgrades multiplies base Capybara gain"
                        },
                        cost: new Decimal("e2e26"),
                        unlocked(){
                                return hasUpgrade("a", 51) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 52)
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A---g-tor"
                        },
                        description(){
                                return "B 22 gives free B 21 levels"
                        },
                        cost: new Decimal("e8.64e26"),
                        unlocked(){
                                return hasUpgrade("a", 52) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 53)
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Alli--tor"
                        },
                        description(){
                                return "Each C 23 adds 1 to the C 23 base"
                        },
                        cost: new Decimal("e4.68e28"),
                        unlocked(){
                                return hasUpgrade("a", 53) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 54)
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>A-li--tor"
                        },
                        description(){
                                return "Each C 12 subtracts 1 from the C 21 linear cost base"
                        },
                        cost: new Decimal("e1.28e30"),
                        unlocked(){
                                return hasUpgrade("a", 54) || player.d.unlocked
                        }, 
                }, // hasUpgrade("a", 55)
        },
        buyables: getLayerGeneralizedBuyableData("a", [
                        function(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 13) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 14) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 15) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 21) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 22) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 23) || player.b.unlocked
                        },
                        function(){
                                return hasUpgrade("a", 24) || player.b.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "4 A22"
                        },
                        done(){
                                return player.a.buyables[22].gte(4)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per milestone add .001 to A 21's base."
                        },
                }, // hasMilestone("a", 1)
                2: {
                        requirementDescription(){
                                return "1e300 Points"
                        },
                        done(){
                                return player.points.gte(1e300)
                        },
                        unlocked(){
                                return hasMilestone("a", 1)
                        },
                        effectDescription(){
                                if (player.b.times > 0 || player.c.unlocked) return "Reward: Per milestone raise point gain ^" + makeRed("1.03") + "."
                                return "Reward: Per milestone raise point gain ^1.01."
                        },
                }, // hasMilestone("a", 2)
                3: {
                        requirementDescription(){
                                return "1e650 Points"
                        },
                        done(){
                                return player.points.gte("1e650")
                        },
                        unlocked(){
                                return hasMilestone("a", 2)
                        },
                        effectDescription(){
                                return "Reward: Remove the linear component of A 13's cost."
                        },
                }, // hasMilestone("a", 3)
                4: {
                        requirementDescription(){
                                return "1e1375 Points"
                        },
                        done(){
                                return player.points.gte("1e1375")
                        },
                        unlocked(){
                                return hasMilestone("a", 3)
                        },
                        effectDescription(){
                                return "Reward: Remove the linear component of A 22's cost and A buyables cost nothing."
                        },
                }, // hasMilestone("a", 4)
        },
        infoboxes: {
                introBox: {
                        title: "Introduction",
                        body(){
                                let a = "<h1>" + makeRed("Welcome to PRESTIGE CHAIN REINCARNATED!") + "</h1>"
                                let b = "There are seven pieces of information you should be aware of:"
                                let c = "First, pressing shift (and control occasionally) can often allow you to see more information."
                                let d = "Second, buyables are a key feature of every layer in the main chain, of which the ninth of each layer gives free levels to all prior in its layer."
                                let e = "Furthermore, later layers' buyables give free levels to the same positions in lower layers."
                                let f = "Third, there is a save bank. View it by going to the info tab and clicking \"Show built in saves\" and scrolling down."
                                let g = "Fourth, this game is designed to be played on a computer on Google Chrome. If this does not apply to you there might be some bugs or other issues you run into." 
                                let h = "Fifth, things in " +  makeRed("red") + " are buffs the next layer gives which are automatically given upon resetting once (and not viewable before so)."
                                let i = "Sixth, \"per upgrade\" and \"per milestone\" refer to the number of upgrades or milestones in the layer that the upgrade, milestone, or buyable is in."
                                let j = "Finally, you can click and drag to buy lots of upgrades at once!"

                                return a + br2 + b + br2 + c + br2 + d + br + e + br2 + f + br2 + g + br2 + h + br2 + i + br2 + j
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("a") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Alligators is " + format(player.a.best) : "You have done " + formatWhole(player.a.times) + " Alligator resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("a")) {
                                                        if (player.shiftAlias) return "Alligator gain formula is " + getGeneralizedPrestigeButtonText("a")
                                                        return "You are gaining " + format(tmp.a.getResetGain) + " Alligators per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.a.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades",
                                ["infobox", "introBox"],],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("a")) return "You are gaining " + format(tmp.a.getResetGain) + " Alligators per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("a", 12) || player.b.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.a.times) + " Alligator resets"
                                        }
                                ],
                                "milestones"],
                        unlocked(){
                                return player.a.buyables[22].gt(0) || player.b.unlocked
                        },
                },
        },
        onPrestige(gain){
                player.a.times += player.b.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.a
                if (layer == "a") data.time = 0
                if (!getsReset("a", layer)) return
                
                data.times = 0

                if (!player.e.unlocked) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("b", 2)) keptUpgrades += player.b.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!player.d.unlocked) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("b", 2)) keptMilestones += player.b.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.a.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("b", {
        name: "Beavers", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 1, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#EC7D20",
        branches: ["a"],
        requires: new Decimal("1e250"), // Can be a function that takes requirement increases into account
        resource: "Beavers", // Name of prestige currency
        baseResource: "Alligators", // Name of resource prestige is based on
        baseAmount() {return player.a.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("b").pow(1 + hasMilestone("e", 1))
        },
        getBaseDiv(){
                return hasUpgrade("c", 51) ? decimalOne : new Decimal(1e230)
        },
        getGainExp(){
                let ret = new Decimal(2)

                if (hasUpgrade("a", 34))        ret = ret.plus(.5)
                if (hasUpgrade("a", 35))        ret = ret.plus(.5 * player.b.upgrades.filter(x => x < 30 && x > 20).length)
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["b23"])

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.05)

                if (inChallenge("c", 21))       return ret

                if (hasUpgrade("b", 23))        ret = ret.times(20)
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c22"])

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("b")

                if (hasUpgrade("b", 13))        ret = ret.times(Decimal.pow(2, player.b.upgrades.length))
                if (hasUpgrade("a", 33))        ret = ret.times(Decimal.pow(player.a.upgrades.length/10, player.a.upgrades.length).max(1))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b11"])
                if (hasMilestone("b", 8))       ret = ret.times(Decimal.pow(player.b.milestones.length/6, player.b.milestones.length).max(1))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b31"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["b33"].pow(player.b.upgrades.length))
                if (hasUpgrade("b", 44))        ret = ret.times(CURRENT_BUYABLE_EFFECTS["b12"])

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("b")) return decimalOne

                let amt = player.b.points

                let exp = new Decimal(1)
                if (hasUpgrade("a", 32))        exp = exp.plus(hasUpgrade("a", 33) ? player.a.upgrades.filter(x => x < 40 && x > 30).length : 1)
                                                exp = exp.plus(CURRENT_BUYABLE_EFFECTS["b13"])

                let ret = amt.times(4).plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("b")
        },
        getNextAt(){
                return getGeneralizedNextAt("b")
        },
        update(diff){
                let data = player.b

                if (tmp.b.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("b", diff)
                
                if (hasMilestone("c", 1) || player.d.unlocked) {
                        handleGeneralizedBuyableAutobuy(diff, "b")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        layerShown(){return hasUpgrade("a", 24) || player.b.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("b")) return ""
                return getGeneralizedPrestigeButtonText("b")
        },
        canReset(){
                return player.b.time >= 2 && !isPassiveGainActive("b") && tmp.b.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-aver"
                        },
                        description(){
                                let a = "The Alligator autobuy speed is multiplied by 1 + Beaver resets"
                                return a
                        },
                        cost: new Decimal(20),
                        unlocked(){
                                return hasMilestone("b", 3) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be-ver"
                        },
                        description(){
                                let a = "A 32 gives free A 22 levels and you can bulk [upgrades]x Alligator buyables"
                                return a
                        },
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("b", 11) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B--ver"
                        },
                        description(){
                                let a = "Per upgrade double Beaver gain and A 22 gives free A 13 and A 11 levels"
                                return a
                        },
                        cost: new Decimal(2000),
                        unlocked(){
                                return hasUpgrade("a", 25) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Bea-er"
                        },
                        description(){
                                let a = "Per upgrade add .2 to A 32's base and A 31 gives free A 22 levels"
                                return a
                        },
                        cost: new Decimal(1e6),
                        unlocked(){
                                return hasUpgrade("a", 32) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-a-er"
                        },
                        description(){
                                let a = "A 32 gives free A 21 and A 13 levels and unlock Beaver buyables"
                                return a
                        },
                        cost: new Decimal(6e7),
                        unlocked(){
                                return hasUpgrade("a", 33) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be--er"
                        },
                        description(){
                                let a = "A 21 gives free A 12 and A 13 levels and unlock another buyable"
                                return a
                        },
                        cost: new Decimal(1e13),
                        unlocked(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B---er"
                        },
                        description(){
                                let a = "B 13 gives free B 11 levels"
                                return a
                        },
                        cost: new Decimal(3e18),
                        unlocked(){
                                return hasUpgrade("b", 21) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Beav-r"
                        },
                        description(){
                                let a = "Gain 20x Base Beaver gain"
                                return a
                        },
                        cost: new Decimal(3e24),
                        unlocked(){
                                return hasUpgrade("b", 22) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-av-r"
                        },
                        description(){
                                let a = "Each B 12 past 50 adds .01 to the B 11 base"
                                return a
                        },
                        cost: new Decimal(2e36),
                        unlocked(){
                                return hasUpgrade("b", 23) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be-v-r"
                        },
                        description(){
                                let a = "B 21 gives free A 33 levels"
                                return a
                        },
                        cost: new Decimal(3e66),
                        unlocked(){
                                return hasUpgrade("b", 24) || player.c.unlocked
                        }, 
                }, // hasUpgrade("b", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B--v-r"
                        },
                        description(){
                                let a = "B 31 gives free B 22 levels, add 1 to the Capybara gain exponent, and buy a Capybara buyable per second"
                                return a
                        },
                        cost: new Decimal("ee6"),
                        unlocked(){
                                return hasUpgrade("c", 22) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Bea--r"
                        },
                        description(){
                                let a = "Remove C 12 linear cost base and each upgrade in this row or below adds .0001 to the C 13 base"
                                return a
                        },
                        cost: new Decimal("e39.9e6"),
                        unlocked(){
                                return hasUpgrade("b", 31) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-a--r"
                        },
                        description(){
                                let a = "C 11 gives free B 33 levels"
                                return a
                        },
                        cost: new Decimal("e157e6"),
                        unlocked(){
                                return hasUpgrade("b", 32) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be---r"
                        },
                        description(){
                                let a = "B 22 gives free B 13 levels"
                                return a
                        },
                        cost: new Decimal("e737.5e6"),
                        unlocked(){
                                return hasUpgrade("b", 33) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B----r"
                        },
                        description(){
                                let a = "B 23 gives free B 22 levels"
                                return a
                        },
                        cost: new Decimal("e4025e6"),
                        unlocked(){
                                return hasUpgrade("b", 34) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 35)
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Beave-"
                        },
                        description(){
                                let a = "A 32 gives free A 23 levels and square Beaver buyable bulk amount"
                                return a
                        },
                        cost: new Decimal("e1.62e10"),
                        unlocked(){
                                return hasUpgrade("b", 35) || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 41)
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-ave-"
                        },
                        description(){
                                let a = "C 32's after 26 count towards Capybara milestone 14 and A---g-tor"
                                return a
                        },
                        cost: new Decimal("e6.75e10"),
                        unlocked(){
                                return hasUpgrade("b", 41) && player.c.best.gte("1e4989") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 42)
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be-ve-"
                        },
                        description(){
                                let a = "A 12 gives free A 11 levels"
                                return a
                        },
                        cost: new Decimal("e2.01e11"),
                        unlocked(){
                                return hasUpgrade("b", 42) && player.c.best.gte("1e5577") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 43)
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B--ve-"
                        },
                        description(){
                                let a = "B 12 affects Beaver gain"
                                return a
                        },
                        cost: new Decimal("e9.94e11"),
                        unlocked(){
                                return hasUpgrade("b", 43) && player.c.best.gte("1e6614") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 44)
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Bea-e-"
                        },
                        description(){
                                let a = "Disable B-av-r and unlock a challenge"
                                return a
                        },
                        cost: new Decimal("e1.00e12"),
                        unlocked(){
                                return hasUpgrade("b", 44) && player.c.best.gte("1e7182") || player.d.unlocked
                        }, 
                }, // hasUpgrade("b", 45)
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-a-e-"
                        },
                        description(){
                                let a = "Alligator buyable max amount is 1e100 and Duck upgrades count towards Duck milestone 5"
                                return a
                        },
                        cost: new Decimal("e2.39e18"),
                        unlocked(){
                                return hasUpgrade("d", 15) || player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 51)
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Be--e-"
                        },
                        description(){
                                let a = "C 22 gives free C 13 levels"
                                return a
                        },
                        cost: new Decimal("e2.24e19"),
                        unlocked(){
                                return hasUpgrade("b", 51) || player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 52)
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B---e-"
                        },
                        description(){
                                let a = "C 21 gives free C 13 levels"
                                return a
                        },
                        cost: new Decimal("e9.70e20"),
                        unlocked(){
                                return player.d.buyables[11].gte(6) || player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 53)
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Beav--"
                        },
                        description(){
                                let a = "C 21 gives free C 11 levels"
                                return a
                        },
                        cost: new Decimal("e1.36e21"),
                        unlocked(){
                                return player.d.buyables[11].gte(12) || player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 54)
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>B-av--"
                        },
                        description(){
                                let a = "C 13 gives free C 11 levels and square Capybara bulk buy amount"
                                return a
                        },
                        cost: new Decimal("e2.02e26"),
                        unlocked(){
                                return player.d.buyables[11].gte(870) || player.e.unlocked
                        }, 
                }, // hasUpgrade("b", 55)
        },
        buyables: getLayerGeneralizedBuyableData("b", [
                        function(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        },
                        function(){
                                return hasMilestone("b", 5) || player.c.unlocked
                        },
                        function(){
                                return hasUpgrade("b", 21) || player.c.unlocked
                        },
                        function(){
                                return player.b.best.gte(1e48) || player.c.unlocked
                        },
                        function(){
                                return hasMilestone("b", 9) || player.c.unlocked
                        },
                        function(){
                                return hasMilestone("b", 10) || player.c.unlocked
                        },
                        function(){
                                return player.b.buyables[23].gte(8) || player.c.unlocked
                        },
                        function(){
                                return player.b.buyables[31].gte(58) || player.c.unlocked
                        },
                        function(){
                                return player.b.buyables[31].gte(71) || player.c.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Beaver reset"
                        },
                        done(){
                                return player.b.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A13 gives free A11 levels."
                        },
                }, // hasMilestone("b", 1)
                2: {
                        requirementDescription(){
                                return "2 Beaver resets"
                        },
                        done(){
                                return player.b.times >= 2
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep an Alligator upgrade and milestone and remove A 23's linear cost component."
                        },
                }, // hasMilestone("b", 2)
                3: {
                        requirementDescription(){
                                return "4 Beaver resets"
                        },
                        done(){
                                return player.b.times >= 4
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Autobuy an Alligator buyable once per second and A 31 gives free A 23 levels."
                        },
                }, // hasMilestone("b", 3)
                4: {
                        requirementDescription(){
                                return "8 Beaver resets"
                        },
                        done(){
                                return player.b.times >= 8
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: The Alligator autobuyer triggers on every buyable per activation and A 32 gives free A 12 levels."
                        },
                }, // hasMilestone("b", 4)
                5: {
                        requirementDescription(){
                                return "500,000,000 Beavers"
                        },
                        done(){
                                return player.b.points.gte(5e8)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A 32 gives free A 31 levels and unlock another buyable."
                        },
                }, // hasMilestone("b", 5)
                6: {
                        requirementDescription(){
                                return "1e23 Beavers"
                        },
                        done(){
                                return player.b.points.gte(1e23)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A 31 gives free A 12 levels and remove the linear cost component of A buyables."
                        },
                }, // hasMilestone("b", 6)
                7: {
                        requirementDescription(){
                                return "1 B 21"
                        },
                        done(){
                                return player.b.buyables[21].gte(1)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 21 affects A 32 and gives free B 11 and B 12 levels."
                        },
                }, // hasMilestone("b", 7)
                8: {
                        requirementDescription(){
                                return "5e54 Beavers"
                        },
                        done(){
                                return player.b.points.gte(5e54)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: (Milestones / 6)<sup>Milestones</sup> multiplies Beaver gain."
                        },
                }, // hasMilestone("b", 8)
                9: {
                        requirementDescription(){
                                return "1e99 Beavers"
                        },
                        done(){
                                return player.b.points.gte(1e99)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 13 gives free B 12 levels, remove B 12 base costs, and unlock a new Beaver buyable."
                        },
                }, // hasMilestone("b", 9)
                10: {
                        requirementDescription(){
                                return "25 B 22"
                        },
                        done(){
                                return player.b.buyables[22].gte(25)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Unlock a new Beaver buyable and remove B 13's base cost."
                        },
                }, // hasMilestone("b", 10)
                11: {
                        requirementDescription(){
                                return "1e1112 Beavers"
                        },
                        done(){
                                return player.b.points.gte("1e1112")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: A 32 qudratic cost base and B 11 linear cost bases are 1.3."
                        },
                }, // hasMilestone("b", 11)
                12: {
                        requirementDescription(){
                                return "1e1168 Beavers"
                        },
                        done(){
                                return player.b.points.gte("1e1168")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 32 gives free B 31 levels."
                        },
                }, // hasMilestone("b", 12)
                13: {
                        requirementDescription(){
                                return "1e1671 Beavers"
                        },
                        done(){
                                return player.b.points.gte("1e1671")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 11 linear cost component."
                        },
                }, // hasMilestone("b", 13)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("b") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Beavers is " + format(player.b.best) : "You have done " + formatWhole(player.b.times) + " Beaver resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("b")) {
                                                        if (player.shiftAlias) return "Beaver gain formula is " + getGeneralizedPrestigeButtonText("b")
                                                        return "You are gaining " + format(tmp.b.getResetGain) + " Beavers per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.b.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("b")) return "You are gaining " + format(tmp.b.getResetGain) + " Beavers per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("b", 15) || player.c.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.b.times) + " Beaver resets"
                                        }
                                ],
                                "milestones"],
                        unlocked(){
                                return player.b.times > 0 || player.c.unlocked
                        },
                },
        },
        onPrestige(gain){
                player.b.times += player.c.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.b
                if (layer == "b") data.time = 0
                if (!getsReset("b", layer)) return
                
                data.times = Math.min(data.times, hasMilestone("c", 4) ? player.c.times : 0)

                if (!player.f.unlocked) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("c", 3)) keptUpgrades += player.c.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!player.e.unlocked) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("c", 2)) keptMilestones += player.c.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("c", {
        name: "Capybaras", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 2, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                everC12: false,
        }},
        color: "#6B8B2E",
        branches: ["b"],
        requires: new Decimal("1e1971"), // Can be a function that takes requirement increases into account
        resource: "Capybaras", // Name of prestige currency
        baseResource: "Beavers", // Name of resource prestige is based on
        baseAmount() {return player.b.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("c")
        },
        getBaseDiv(){
                return hasUpgrade("c", 51) ? decimalOne : new Decimal("1e1871")
        },
        getGainExp(){
                let ret = new Decimal(4)

                if (hasUpgrade("c", 11))        ret = ret.plus(player.c.upgrades.length)
                if (hasUpgrade("b", 31))        ret = ret.plus(1)
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["c21"])

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.01)

                if (hasUpgrade("a", 52))        ret = ret.times(player.a.upgrades.filter(x => x > 50 && x < 60).length)
                                        
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c31"])
                if (hasUpgrade("d", 15))        ret = ret.times(2)
                if (hasUpgrade("d", 34))        ret = ret.times(player.e.points.max(1).pow(hasUpgrade("c", 52) ? player.c.upgrades.filter(x => x > 50).length ** 2 : 1))

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("c")

                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c11"])
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c22"])
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["c33"].pow(player.c.upgrades.length))
                
                if (player.c.everC12)           ret = ret.times(10)
                if (hasMilestone("c", 21))      ret = ret.times(getBuyableAmount("c", 33).sub(33).max(0).div(4).floor().pow10())
                if (hasMilestone("c", 26))      ret = ret.times(getBuyableAmount("c", 33).sub(58).pow10().min(100).max(1))

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("c")) return decimalOne

                let amt = player.c.points

                let exp = new Decimal(5)
                if (hasUpgrade("c", 11))        exp = exp.plus(player.c.upgrades.length)

                                                exp = exp.times(CURRENT_BUYABLE_EFFECTS["c23"])
                if (hasMilestone("c", 27))      exp = exp.times(10)
                if (hasMilestone("c", 29))      exp = exp.times(2.5)
                if (hasMilestone("c", 30))      exp = exp.times(getBuyableAmount("c", 33).max(40).log(40).pow(getBuyableAmount("c", 33).sub(94).max(0).min(3)))
                if (hasUpgrade("c", 31))        exp = exp.times(player.d.points.max(10).log10())

                let ret = amt.times(2).plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("c")
        },
        getNextAt(){
                return getGeneralizedNextAt("c")
        },
        update(diff){
                let data = player.c

                if (tmp.c.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("c", diff)
                
                if (hasUpgrade("b", 31) || hasMilestone("d", 1) || player.e.unlocked) {
                        handleGeneralizedBuyableAutobuy(diff, "c")
                } else {
                        data.abtime = 0
                }
                data.time += diff

                if (hasChallenge("c", 12)) player.c.everC12 = true
        },
        layerShown(){return player.b.best.gte("1e1900") || player.c.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("c")) return ""
                return getGeneralizedPrestigeButtonText("c")
        },
        canReset(){
                return player.c.time >= 2 && !isPassiveGainActive("c") && tmp.c.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-pybara"
                        },
                        description(){
                                let a = "Each upgrade adds 1 to the Capybara effect and gain exponents and you can bulk 10x more Alligator buyables"
                                return a
                        },
                        cost: new Decimal(100),
                        unlocked(){
                                return true
                        }, 
                }, // hasUpgrade("c", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca-ybara"
                        },
                        description(){
                                let a = "The number of upgrades multiplies B bulk amount and exponentiates A bulk amount and remove B 13 linear cost base"
                                return a
                        },
                        cost: new Decimal(3e7),
                        unlocked(){
                                return hasUpgrade("c", 11) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C--ybara"
                        },
                        description(){
                                let a = "Remove B 22 base cost and gain 100% of your Capybara's per reset per second but you can no longer prestige"
                                return a
                        },
                        cost: new Decimal(3e9),
                        unlocked(){
                                return hasUpgrade("c", 12) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Cap-bara"
                        },
                        description(){
                                let a = "Remove B 23 base cost and A 22 gives free A 21 levels"
                                return a
                        },
                        cost: new Decimal(3e12),
                        unlocked(){
                                return hasUpgrade("c", 13) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-p-bara"
                        },
                        description(){
                                let a = "Remove B 31 base cost and B 2X linear cost bases and B 11 gives free A 33 levels"
                                return a
                        },
                        cost: new Decimal(3e14),
                        unlocked(){
                                return hasUpgrade("c", 14) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca--bara"
                        },
                        description(){
                                let a = "C 12 gives free B 32 levels"
                                return a
                        },
                        cost: new Decimal(3e30),
                        unlocked(){
                                return hasUpgrade("c", 15) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C---bara"
                        },
                        description(){
                                let a = "Remove B 31 linear cost base"
                                return a
                        },
                        cost: new Decimal(3e60),
                        unlocked(){
                                return hasUpgrade("c", 21) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Capy-ara"
                        },
                        description(){
                                let a = "Remove C 11 base cost"
                                if (player.e.unlocked) a += makePurple(" and bulk all Capybara buyables at once")
                                return a
                        },
                        cost: new Decimal("3e1651"),
                        unlocked(){
                                return hasUpgrade("c", 22) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-py-ara"
                        },
                        description(){
                                let a = "Each C 31 divides C 21 and C 22 base cost by 10 (min 1)"
                                return a
                        },
                        cost: new Decimal("3e4461"),
                        unlocked(){
                                return hasUpgrade("c", 23) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca-y-ara"
                        },
                        description(){
                                let a = "C 21 gives free C 12 levels"
                                return a
                        },
                        cost: new Decimal("3e5765"),
                        unlocked(){
                                return hasUpgrade("c", 24) || player.d.unlocked
                        }, 
                }, // hasUpgrade("c", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C--y-ara"
                        },
                        description(){
                                let a = "log10(Ducks) multiplies the Capybara effect exponent"
                                return a
                        },
                        cost: new Decimal("3e37619"),
                        unlocked(){
                                return hasUpgrade("d", 13) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Cap--ara"
                        },
                        description(){
                                let a = "Per Duck upgrade Duck upgrades multiply Duck gain and C 31 gives free C 22 levels"
                                return a
                        },
                        cost: new Decimal("3e39714"),
                        unlocked(){
                                return hasUpgrade("c", 31) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-p--ara"
                        },
                        description(){
                                let a = "Upgrades - 11 multiplies base Duck gain and C 23 gives free C 13 levels"
                                return a
                        },
                        cost: new Decimal("3e94525"),
                        unlocked(){
                                return hasUpgrade("c", 32) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca---ara"
                        },
                        description(){
                                let a = "D 11 gives free C 33 levels and square Beaver buyable bulk amount"
                                return a
                        },
                        cost: new Decimal("3e538070"),
                        unlocked(){
                                return hasUpgrade("c", 33) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C----ara"
                        },
                        description(){
                                let a = "Bulk 5x Duck buyables"
                                if (player.e.unlocked) a += makePurple(" and add .0001 to D 13 base")
                                return a
                        },
                        cost: new Decimal("e73.9e6"),
                        unlocked(){
                                return hasUpgrade("c", 34) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 35)
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Capyb-ra"
                        },
                        description(){
                                let a = "Each upgrade multiplies C 32 and Duck gain by 1.2"
                                return a
                        },
                        cost: new Decimal("e1.52e9"),
                        unlocked(){
                                return hasUpgrade("d", 21) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 41)
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-pyb-ra"
                        },
                        description(){
                                let a = "Each D 11 level past 16,000 decreases D 21 lienar base by .01% (until it is 1)"
                                return a
                        },
                        cost: new Decimal("e4.401e9"),
                        unlocked(){
                                return hasUpgrade("c", 41) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 42)
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca-yb-ra"
                        },
                        description(){
                                let a = "Square Alligator bulk amount, Beaver bulk amount, and Beaver buyable limit"
                                return a
                        },
                        cost: new Decimal("e5.272e9"),
                        unlocked(){
                                return hasUpgrade("c", 42) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 43)
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C--yb-ra"
                        },
                        description(){
                                let a = "D 12 levels past 10,000 decrease D 21 and D 22 base cost by 1%, reapply this effect at 1e14,042 and 1e14,126 Ducks"
                                return a
                        },
                        cost: new Decimal("e5.619e9"),
                        unlocked(){
                                return hasUpgrade("c", 43) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 44)
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Cap-b-ra"
                        },
                        description(){
                                let a = "Per tenth D 22 level past 160 add .0001 to D 21 base and increase D 11 and D 12 base cost by 1e4x (max 10 times)"
                                return a
                        },
                        cost: new Decimal("e5.75247e9"),
                        unlocked(){
                                return hasUpgrade("c", 44) || player.e.unlocked
                        }, 
                }, // hasUpgrade("c", 45)
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-p-b-ra"
                        },
                        description(){
                                let a = "Remove gain dividers for the first five layers and log10(Eagles) multiplies Eagles and base Duck gain"
                                return a
                        },
                        cost: new Decimal("e1.05e11"),
                        unlocked(){
                                return hasUpgrade("d", 23) || player.f.unlocked
                        }, 
                }, // hasUpgrade("c", 51)
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ca--b-ra"
                        },
                        description(){
                                let a = "Apply Du--- per this row upgrade<sup>2</sup> and log10(log10(Capybaras)) multiplies Eagle gain per this row upgrade"
                                return a
                        },
                        cost: new Decimal("e1.76e11"),
                        unlocked(){
                                return player.d.points.gte("e26630") || player.f.unlocked
                        }, 
                }, // hasUpgrade("c", 52)
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C---b-ra"
                        },
                        description(){
                                let a = "Apply C-p-b-ra per this row upgrade"
                                return a
                        },
                        cost: new Decimal("e5e11"),
                        unlocked(){
                                return player.d.points.gte("e28607") || player.f.unlocked
                        }, 
                }, // hasUpgrade("c", 53)
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Capy--ra"
                        },
                        description(){
                                let a = "C--yb-ra affects D 23 and D 23's base cost is 1e483 less but divide base Duck gain by 1e5"
                                return a
                        },
                        cost: new Decimal("e4.29e12"),
                        unlocked(){
                                return player.d.points.gte("e35741") || player.f.unlocked
                        }, 
                }, // hasUpgrade("c", 54)
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>C-py--ra"
                        },
                        description(){
                                let a = "D 1X base cost is 1e140x higher"
                                return a
                        },
                        cost: new Decimal("e1.12e13"),
                        unlocked(){
                                return player.d.points.gte("e37658") || player.f.unlocked
                        }, 
                }, // hasUpgrade("c", 55)
        },
        buyables: getLayerGeneralizedBuyableData("c", [
                        function(){
                                return hasMilestone("c", 6) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(6) || hasMilestone("c", 7) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(125) || player.d.unlocked
                        },
                        function(){
                                return hasMilestone("c", 9) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(2030) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(2550) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(2800) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(3300) || player.d.unlocked
                        },
                        function(){
                                return player.c.buyables[11].gte(3620) || player.d.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Capybara reset"
                        },
                        done(){
                                return player.c.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.d.unlocked) return "Reward: A 22 gives free A 12 levels and autobuy " + makeRed("each") + " Beaver buyable once per second."
                                return "Reward: A 22 gives free A 12 levels and autobuy a Beaver buyable once per second."
                        },
                }, // hasMilestone("c", 1)
                2: {
                        requirementDescription(){
                                return "3 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(3)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 21 base cost and keep a milestone per reset."
                        },
                }, // hasMilestone("c", 2)
                3: {
                        requirementDescription(){
                                return "40 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(40)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep an upgrade per reset and you can buy all Beaver buyables at once."
                        },
                }, // hasMilestone("c", 3)
                4: {
                        requirementDescription(){
                                return "3,000 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(3000)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep a reset per reset, resets multiply Beaver autobuy times per second, and B 32 gives free levels to B 22."
                        },
                }, // hasMilestone("c", 4)
                5: {
                        requirementDescription(){
                                return "1,000,000 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e6)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 32 gives free B 23 levels and you can bulk 2x Beaver buyables."
                        },
                }, // hasMilestone("c", 5)
                6: {
                        requirementDescription(){
                                return "1e17 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e17)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Unlock Capybara buyables, remove B 32 base cost, and per milestone add 1 to the B 13 base."
                        },
                }, // hasMilestone("c", 6)
                7: {
                        requirementDescription(){
                                return "1e29 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e29)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 33 base cost."
                        },
                }, // hasMilestone("c", 7)
                8: {
                        requirementDescription(){
                                return "1e53 Capybaras"
                        },
                        done(){
                                return player.c.points.gte(1e53)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 13 gives free C 12 and B 33 levels and remove B 32 linear cost base."
                        },
                }, // hasMilestone("c", 8)
                9: {
                        requirementDescription(){
                                return "1e1102 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e1102")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove B 33 linear cost base and C 12 cost base and unlock a new Capybara buyable."
                        },
                }, // hasMilestone("c", 9)
                10: {
                        requirementDescription(){
                                return "1e2660 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e2660")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 12 gives free B 11 levels and each milestone adds .01 to the C 22 base."
                        },
                }, // hasMilestone("c", 10)
                11: {
                        requirementDescription(){
                                return "1e2906 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e2906")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 21 gives free B 13 levels and Bea--r affects C 12."
                        },
                }, // hasMilestone("c", 11)
                12: {
                        requirementDescription(){
                                return "3e3213 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("3e3213")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 23 gives free C 22 levels."
                        },
                }, // hasMilestone("c", 12)
                13: {
                        requirementDescription(){
                                return "1e3943 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e3943")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each B 33 subtracts 1 from the C 23 cost base (until 25,000)."
                        },
                }, // hasMilestone("c", 13)
                14: {
                        requirementDescription(){
                                return "1e4210 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e4210")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 22 subtracts .0001 from the C 11 linear cost base until 1."
                        },
                }, // hasMilestone("c", 14)
                15: {
                        requirementDescription(){
                                return "1e4682 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e4682")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 31 gives free B 23 levels."
                        },
                }, // hasMilestone("c", 15)
                16: {
                        requirementDescription(){
                                return "1e4943 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e4943")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C-py-ara affects C 23."
                        },
                }, // hasMilestone("c", 16)
                17: {
                        requirementDescription(){
                                return "1e5325 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e5325")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Square B 11 base."
                        },
                }, // hasMilestone("c", 17)
                18: {
                        requirementDescription(){
                                return "1e6202 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e6202")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: You can bulk 2x more Alligator and Beaver buyables."
                        },
                }, // hasMilestone("c", 18)
                19: {
                        requirementDescription(){
                                return "1e6531 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e6531")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 12 base is raised to the C 33 levels and subtract 1 from the C 32 linear cost base per B 33 (min 100,000)."
                        },
                }, // hasMilestone("c", 19)
                20: {
                        requirementDescription(){
                                return "1e7761 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e7761")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Unlock another challenge, B 23 gives free B 13 levels, and B 32 gives free B 21 levels."
                        },
                }, // hasMilestone("c", 20)
                21: {
                        requirementDescription(){
                                return "1e8443 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e8443")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 33's after 33 divide C 23's linear cost base by 2.5 (until 1) and each 4th gives you 10x Capybaras."
                        },
                }, // hasMilestone("c", 21)
                22: {
                        requirementDescription(){
                                return "1e9214 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9214")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Add .015 to the C 33 base per successive milestone."
                        },
                }, // hasMilestone("c", 22)
                23: {
                        requirementDescription(){
                                return "1e9418 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9418")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 23 gives free B 12 levels."
                        },
                }, // hasMilestone("c", 23)
                24: {
                        requirementDescription(){
                                return "1e9488 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9488")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 32 divides C 31's base cost by 10."
                        },
                }, // hasMilestone("c", 24)
                25: {
                        requirementDescription(){
                                return "1e9658 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e9658")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 33 divides C 32's base cost by 10."
                        },
                }, // hasMilestone("c", 25)
                26: {
                        requirementDescription(){
                                return "1e10,050 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e10050")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: B 22 gives free B 11 levels, each C 33 after 54 to the .8 divides C 31's linear cost base by 40 (min 1), and each C 33 after 58 gives you 10x Capybaras."
                        },
                }, // hasMilestone("c", 26)
                27: {
                        requirementDescription(){
                                return "1e10,933 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e10933")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Raise Capybara effect to the tenth power and each C 33 after 65 divides C 22's linear cost base by 1.4 (min 1)."
                        },
                }, // hasMilestone("c", 27)
                28: {
                        requirementDescription(){
                                return "1e11,116 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e11116")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Raise B 11 base to sqrt(C 33) (exponent becomes .76 at 69 C 33s)."
                        },
                }, // hasMilestone("c", 28)
                29: {
                        requirementDescription(){
                                return "1e11,363 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e11363")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Multiply Capybara effect exponent by 2.5, each C 33 after 74 adds .0008 to the C 31 base, and each C 33 after 72 to the .8 subtracts 6 from the C 13 linear cost base (min 15)."
                        },
                }, // hasMilestone("c", 29)
                30: {
                        requirementDescription(){
                                return "1e12,896 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e12896")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: log40(C 33s)<sup>min(3, C 33 - 94)</sup> multiplies Capybara effect exponent."
                        },
                }, // hasMilestone("c", 30)
                31: {
                        requirementDescription(){
                                return "1e14,001 Capybaras"
                        },
                        done(){
                                return player.c.points.gte("1e14001")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each C 33 after 100 divides its linear cost base by 2.041 (min 1e58)."
                        },
                }, // hasMilestone("c", 31)
        },
        challenges: {
                11: {
                        name: "Challenge?",
                        goal(){
                                let id = player.c.challenges[11]
                                let x = [
                                        4.428e9, 5.305e9, 5.777e9, 6.269e9, 6.7821e9, 
                                        3.586e10, 3.878e10, 4.028e10, 4.181e10, 4.337e10, 
                                        7.432e11, 7.702e11, 7.975e11, 8.533e11, 8.963e11]
                                return Decimal.pow(10, x[id])
                        },
                        canComplete: () => player.b.points.gte(tmp.c.challenges[11].goal),
                        fullDisplay(){
                                let a = "Nullify Capybara and B 23 effects" + br 
                                a += "Goal: " + format(tmp.c.challenges[11].goal, 4) + " Beavers" + br2
                                a += "Reward: Add " + format(tmp.c.challenges[11].rewardEffect) + br
                                a += "to the C 11, C 22, and C 33 bases."
                                return a + br2 + "Completions: " + player.c.challenges[11] + "/15"
                        },
                        rewardEffect(){
                                return new Decimal(player.c.challenges[11] / 100)
                        },
                        unlocked(){
                                return hasUpgrade("b", 45) || player.d.unlocked
                        },
                        countsAs: [],
                        completionLimit: 15,
                }, // inChallenge("c", 11)
                12: {
                        name: "Challenge!",
                        goal(){
                                let id = player.c.challenges[12]
                                return Decimal.pow(10, [3.15e12, 5.99e12, 6.095e12, 6.421e12, 6.615e12][id])
                        },
                        canComplete: () => player.b.points.gte(tmp.c.challenges[12].goal),
                        fullDisplay(){
                                if (player.shiftAlias) return "Formula: (x-1)<sup>1.4</sup>"
                                let a = "Nullify B 12 effect" + br 
                                a += "Goal: " + format(tmp.c.challenges[12].goal, 4) + " Beavers" + br2
                                a += "Reward: C 22 gives free C 12 levels, gain 10x Capybara's permanently, "
                                a += "and per Capybara buyable subtract " + formatWhole(tmp.c.challenges[12].rewardEffect) + br
                                a += "from C 22 linear cost base."
                                return a + br2 + "Completions: " + player.c.challenges[12] + "/5"
                        },
                        rewardEffect(){
                                return new Decimal(player.c.challenges[12]).sub(1).max(0).pow(1.4)
                        },
                        unlocked(){
                                return hasMilestone("c", 20) || player.d.unlocked
                        },
                        countsAs: [],
                        completionLimit: 5,
                }, // inChallenge("c", 12)
                21: {
                        name: "Challenge!?",
                        goal(){
                                let id = player.c.challenges[21]
                                return Decimal.pow(10, [6.7e13, 7.85e13, 1.53e14, 2e14, 2.73e14, 5.46e16, 6.36e16, 1.26e17, 1.462e17, 7.45e17][id])
                        },
                        canComplete: () => player.b.points.gte(tmp.c.challenges[21].goal),
                        fullDisplay(){
                                let a = "Base beaver gain multipliers are disabled" + br 
                                a += "Goal: " + format(tmp.c.challenges[21].goal, 4) + " Beavers" + br2
                                a += "Reward: C 32 gives free C 31/23/22 levels completions after 3 add 1 to the C 33 base"
                                return a + br2 + "Completions: " + player.c.challenges[21] + "/10"
                        },
                        unlocked(){
                                return hasUpgrade("d", 12)
                        },
                        countsAs: [],
                        completionLimit: 10,
                }, // inChallenge("c", 21)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("c") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Capybaras is " + format(player.c.best) : "You have done " + formatWhole(player.c.times) + " Capybara resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("c")) {
                                                        if (player.shiftAlias) return "Capybara gain formula is " + getGeneralizedPrestigeButtonText("c")
                                                        return "You are gaining " + format(tmp.c.getResetGain) + " Capybaras per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.c.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("c")) return "You are gaining " + format(tmp.c.getResetGain) + " Capybara per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasMilestone("c", 6) || player.d.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.c.times) + " Capybara resets"
                                        }
                                ],
                                "milestones"
                        ],
                        unlocked(){
                                return player.c.times > 0 || player.d.unlocked
                        },
                },
                "Challenges": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.c.times) + " Capybara resets"
                                        }
                                ],
                                "challenges"
                        ],
                        unlocked(){
                                return hasUpgrade("b", 45) || player.d.unlocked
                        },
                },
                "Info": {
                        content: [
                                ["display-text", "Unlocking a layer makes layers...<br>" + makeRed("2") + " above it get passive generation and autobuying."],
                                ["display-text", 
                                        function() {
                                                let a = makeRed("3") + " above it keep all milestones and makes the autobuyer buy all buyables at once."
                                                if (player.f.unlocked) return a.replace("buy ", makePurple("bulk 10x "))
                                                return a
                                        }
                                ],
                                ["display-text", makeRed("4") + " above it keep all upgrades."],
                                ["display-text", function(){return player.d.unlocked ? makeRed("5") + " above it keep all challenges." : ""}],
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        onPrestige(gain){
                player.c.times += player.d.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.c
                if (layer == "c") data.time = 0
                if (!getsReset("c", layer)) return
                
                data.times = Math.min(hasMilestone("d", 2) ? player.d.times : 0, data.times)

                if (!false/*player.g.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("d", 5)) keptUpgrades += player.d.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!player.f.unlocked) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("d", 3)) keptMilestones += player.d.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }

                //challenges
                let resetChallenges = [11, 12]
                if (layer != "d") resetChallenges = [11, 12, 13]
                for (let j = 0; j < resetChallenges.length; j++) {
                        if (hasMilestone("d", 4)) break
                        data.challenges[resetChallenges[j]] = 0
                }
        },
})



addLayer("d", {
        name: "Ducks", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 3, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                everU15: false,
        }},
        color: "#6B46B9",
        branches: ["c"],
        requires: new Decimal("1e15020"), // Can be a function that takes requirement increases into account
        resource: "Ducks", // Name of prestige currency
        baseResource: "Capybaras", // Name of resource prestige is based on
        baseAmount() {return player.c.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                return getGeneralizedPrestigeGain("d")
        },
        getBaseDiv(){
                return hasUpgrade("c", 51) ? decimalOne : new Decimal("1e14020")
        },
        getGainExp(){
                let ret = new Decimal(5)

                if (hasUpgrade("d", 11) && !hasUpgrade("d", 41)) {
                                                ret = ret.plus(player.d.upgrades.length)
                }
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["d21"])
                if (hasMilestone("d", 18))      ret = ret.plus(1)
                if (hasMilestone("d", 20) && player.d.points.gte("1e15000") && !hasMilestone("f", 8)) {
                                                ret = ret.sub(6)
                }
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["e12"])

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.001)

                if (!hasMilestone("e", 45))     ret = ret.plus(CURRENT_BUYABLE_EFFECTS["d21"])

                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["d23"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["e11"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["e13"])
                if (hasUpgrade("c", 33))        ret = ret.times(Math.max(player.c.upgrades.length - 11, 1))
                
                /* */
                let eaglesexp = hasMilestone("d", 22) ? 1 : 0
                if (hasUpgrade("c", 51) && !hasMilestone("e", 24)) eaglesexp += hasUpgrade("c", 53) ? player.c.upgrades.filter(x => x > 50).length : 1
                if (hasUpgrade("e", 15)) {
                        eaglesexp += player.e.upgrades.length
                        if (!hasMilestone("f", 4))      ret = ret.div(Decimal.pow(16, player.e.upgrades.length))
                }

                if (hasMilestone("e", 13) && getBuyableAmount("e", 11).gte(150) && !hasMilestone("e", 33)) {
                                                ret = ret.times(player.e.points.max(10).log10().ceil().pow(eaglesexp))
                } else {
                                                ret = ret.times(player.e.points.max(10).log10().pow(eaglesexp))
                }
                /* */ 
                
                if (hasMilestone("d", 24))      ret = ret.div(2)
                if (hasMilestone("d", 25))      ret = ret.div(24)
                if (hasUpgrade("c", 54))        ret = ret.div(1e5)
                if (hasUpgrade("d", 42))        ret = ret.div(65432)
                if (hasMilestone("e", 14) && getBuyableAmount("e", 11).gte(200) && !hasMilestone("f", 5)) {
                                                ret = ret.div(700)
                }
                if (hasMilestone("e", 18))      ret = ret.times(Decimal.pow(10, hasMilestone("f", 5) ? 40 : -4))
                if (hasMilestone("e", 19))      ret = ret.div(1e7)
                if (hasMilestone("e", 20))      ret = ret.div(10)
                if (!hasMilestone("f", 7)) {
                        if (hasMilestone("e", 48) && player.e.points.gte("1e1720")) {
                                ret = ret.div(1e6)
                        }
                        if (hasMilestone("e", 49) && player.e.points.gte("1e1745")) {
                                ret = ret.div(1e6)
                        }
                        if (hasMilestone("e", 50) && player.e.points.gte("1e1776")) {
                                ret = ret.div(1e6)
                        }
                        if (hasMilestone("e", 51) && player.e.points.gte("1e1790")) {
                                ret = ret.div(1e6)
                        }
                }
                if (hasMilestone("e", 58))      ret = ret.div(1e50)
                if (hasMilestone("e", 61)) {
                        ret = ret.div(1e10)
                        if (player.e.best.gte("1e5183")) ret = ret.div(1e51)
                }
                if (hasMilestone("e", 62))      ret = ret.div(1e31)
                if (hasMilestone("e", 67))      ret = ret.div(1e210)
                if (hasMilestone("e", 75))      ret = ret.div("1e409")
                if (hasMilestone("e", 77))      ret = ret.times(Decimal.pow(2, getBuyableAmount("e", 31).sub(100).max(0)))
                if (hasMilestone("f", 8) && hasMilestone("T", 8)) {
                                                ret = ret.times("1e5000")
                }

                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("d")

                if (!hasMilestone("d", 19)) {
                        if (hasUpgrade("c", 32))        ret = ret.times(Decimal.pow(player.d.upgrades.length, player.d.upgrades.length))
                        if (hasUpgrade("c", 41))        ret = ret.times(Decimal.pow(1.2, player.c.upgrades.length))
                }
                if (hasMilestone("e", 5) && player.d.points.lt("1e10000")) {
                        ret = ret.times(1e20)
                }
                if (hasUpgrade("e", 12))                ret = ret.times(Decimal.pow(player.e.upgrades.length, player.e.upgrades.length))
                                                        ret = ret.times(CURRENT_BUYABLE_EFFECTS["d11"])
                                                        ret = ret.times(CURRENT_BUYABLE_EFFECTS["d32"])
                                                        ret = ret.times(CURRENT_BUYABLE_EFFECTS["d33"].pow(player.c.upgrades.length))
                if (hasMilestone("f", 4))               ret = ret.times(1e10)

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("d")) return decimalOne

                let amt = player.d.points

                let exp = amt.plus(999).log10().min(100)
                if (hasUpgrade("d", 24)) exp = exp.times(player.d.upgrades.length ** 2)
                if (hasMilestone("d", 18) && player.d.points.gte("1e14830")) exp = exp.times(5)
                if (hasMilestone("d", 20) && player.d.points.gte("1e15444")) exp = exp.times(2)
                if (hasMilestone("e", 12))      exp = exp.times(player.e.milestones.length ** 2)

                let ret = amt.plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("d")
        },
        getNextAt(){
                return getGeneralizedNextAt("d")
        },
        update(diff){
                let data = player.d

                if (tmp.d.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("d", diff)
                
                if (hasMilestone("d", 11)  || player.f.unlocked) {
                        if (hasMilestone("e", 22) || player.f.unlocked) {
                                handleGeneralizedBuyableAutobuy(diff, "d")
                        } else {
                                let mincost = getBuyableCost("d", 11).min(getBuyableCost("d", 12)).min(getBuyableCost("d", 13))
                                if (mincost.div(10).lte(tmp.d.getResetGain)) {
                                        handleGeneralizedBuyableAutobuy(diff, "d")
                                }
                        }
                } else {
                        data.abtime = 0
                }
                data.time += diff

                if (hasUpgrade("d", 15)) data.everU15 = true
        },
        layerShown(){return player.c.best.gte("1e15000") || player.d.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("d")) return ""
                return getGeneralizedPrestigeButtonText("d")
        },
        canReset(){
                return player.d.time >= 2 && !isPassiveGainActive("d") && tmp.d.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D-cks"
                        },
                        description(){
                                let a = "C 13 linear cost base is .1 less per C 33 past 150 and each upgrade adds 1 to the gain exponent"
                                return a
                        },
                        cost: new Decimal(1e4),
                        unlocked(){
                                return true 
                        }, 
                }, // hasUpgrade("d", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Du-ks"
                        },
                        description(){
                                let a = "Remove the ability to prestige for Ducks but gain 100% of your ducks on reset and a reset per second"
                                return a
                        },
                        cost: new Decimal(1e5),
                        unlocked(){
                                return player.d.times >= 70 || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D--ks"
                        },
                        description(){
                                let a = "C 32's boost to C 21's cap is now .27 and each OoM of Ducks after 1e10 divides C 33's linear cost base by 10"
                                return a
                        },
                        cost: new Decimal(1e10),
                        unlocked(){
                                return hasUpgrade("d", 12) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Duc-s"
                        },
                        description(){
                                let a = "C 31 gives free C 23 levels and triple Beaver bulk amount"
                                return a
                        },
                        cost: new Decimal(5e15),
                        unlocked(){
                                return hasUpgrade("d", 13) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D-c-s"
                        },
                        description(){
                                let a = "Permanently remove C 32's base cost and double base Capybara gain"
                                return a
                        },
                        cost: new Decimal(1e20),
                        unlocked(){
                                return hasUpgrade("d", 14) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Du--s"
                        },
                        description(){
                                let a = "Duck buyables are free"
                                return a
                        },
                        cost: new Decimal(1e41),
                        unlocked(){
                                return hasUpgrade("d", 15) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D---s"
                        },
                        description(){
                                let a = "C 23 gives free C 21 levels"
                                return a
                        },
                        cost: new Decimal(1e66),
                        unlocked(){
                                return hasUpgrade("d", 21) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Duck-"
                        },
                        description(){
                                let a = "If you have above 1e600 Ducks, D 13 gives free D 11 and C 33 levels but D 11 base cost is 1e100 higher"
                                return a
                        },
                        cost: new Decimal("1e613"),
                        unlocked(){
                                return hasUpgrade("d", 22) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D-ck-"
                        },
                        description(){
                                let a = "C 11 subtracts from D 21 linear base (max 900,000) and upgrades<sup>2</sup> multiply Duck effect exponent"
                                return a
                        },
                        cost: new Decimal("1e831"),
                        unlocked(){
                                return hasUpgrade("d", 23) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Du-k-"
                        },
                        description(){
                                let a = "D 21 gives free levels to D 11, D 12, and D 13"
                                return a
                        },
                        cost: new Decimal("1e895"),
                        unlocked(){
                                return hasUpgrade("d", 24) || player.e.unlocked
                        }, 
                }, // hasUpgrade("d", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D--k-"
                        },
                        description(){
                                let a = "C 13 base is raised to the power of cbrt(D 11)"
                                return a
                        },
                        cost: new Decimal("1e21916"),
                        unlocked(){
                                return hasUpgrade("e", 14) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Duc--"
                        },
                        description(){
                                let a = "C 33 base is raised to the power of cbrt(D 12)"
                                return a
                        },
                        cost: new Decimal("1e22675"),
                        unlocked(){
                                return hasUpgrade("d", 31) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D-c--"
                        },
                        description(){
                                let a = "D 22 levels multiply Eagle gain and add .0004 to D 13's base"
                                return a
                        },
                        cost: new Decimal("1e22990"),
                        unlocked(){
                                return hasUpgrade("d", 32) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Du---"
                        },
                        description(){
                                let a = "Eagles multiply base Capybara gain"
                                return a
                        },
                        cost: new Decimal("1e26375"),
                        unlocked(){
                                return hasUpgrade("d", 33) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D----"
                        },
                        description(){
                                let a = "Upgrades multiply Eagle gain"
                                return a
                        },
                        cost: new Decimal("1e27700"),
                        unlocked(){
                                return hasUpgrade("d", 34) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 35)
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>ucks"
                        },
                        description(){
                                let a = "D-cks no longer affects Duck gain exponent, double D 21 base, and multiply D 23 base by 2.5"
                                return a
                        },
                        cost: new Decimal("1e40205"),
                        unlocked(){
                                return hasUpgrade("c", 55) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 41)
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>-cks"
                        },
                        description(){
                                let a = "Divide D 23 base cost by 1e1000 and divide base Duck gain by 65,432"
                                return a
                        },
                        cost: new Decimal("1e40342"),
                        unlocked(){
                                return hasUpgrade("d", 41) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 42)
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>u-ks"
                        },
                        description(){
                                let a = "Each D 12 past 18,000 adds .0002 to the D 23 base, reapply this at 1e43,052 and 1e43,161 Ducks"
                                return a
                        },
                        cost: new Decimal("1e42943"),
                        unlocked(){
                                return hasUpgrade("d", 42) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 43)
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>--ks"
                        },
                        description(){
                                let a = "Each D 23 level (up to 10,000) increases Eagle gain by D 22 levels / 1e5"
                                return a
                        },
                        cost: new Decimal("1e43377"),
                        unlocked(){
                                return hasUpgrade("d", 43) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 44)
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>uc-s"
                        },
                        description(){
                                let a = "log10(log10(Ducks)) multiplies Eagle gain"
                                return a
                        },
                        cost: new Decimal("1e49380"),
                        unlocked(){
                                return getBuyableAmount("e", 11).gte(7) || player.f.unlocked
                        }, 
                }, // hasUpgrade("d", 45)
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>-c-s"
                        },
                        description(){
                                let a = "Exponentiate D 11 base by Tiers^2 and Tiers past 200 subtract .01 from the Faster Shifter base"
                                return a
                        },
                        cost: new Decimal("e3.55e19"),
                        unlocked(){
                                return hasMilestone("f", 8) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("d", 51)
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>u--s"
                        },
                        description(){
                                let a = "Eagle Milestone 83 counts every Tier and Passive Gain completions also subtract from Finch Milestone 7"
                                return a
                        },
                        cost: new Decimal("e2.18e22"),
                        unlocked(){
                                return hasUpgrade("d", 51) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("d", 52)
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>---s"
                        },
                        description(){
                                let a = "Tiers<sup>cbrt(F 11)</sup> multiplies E 31 base"
                                return a
                        },
                        cost: new Decimal("e3.76e25"),
                        unlocked(){
                                return hasUpgrade("d", 52) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("d", 53)
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>uck-"
                        },
                        description(){
                                if (player.shiftAlias) return "Currently: x" + format(tmp.d.upgrades[54].effect) + " per Tier"
                                let a = "Per Tier past 639 each F 12 triples Emerald gain (softcap/hardcap at 1000/10,000 shift for effect)"
                                return a
                        },
                        effect(){
                                let l = getBuyableAmount("f", 12)
                                if (l.gte(4000)) l = l.min(1e4).times(4000).sqrt()//.times(2.5).log10().pow(2.5).times(125)
                                if (l.gte(3600)) l = l.times(3600).sqrt()
                                if (l.gte(1000)) l = l.times(2000).sub(1e6).sqrt()
                                return Decimal.pow(3, l)
                        },
                        cost: new Decimal("e3.81e38"),
                        unlocked(){
                                return hasUpgrade("d", 53) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("d", 54)
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>D<sup>2</sup>-ck-"
                        },
                        description(){
                                let a = "Each tenth F 13 level subtracts .0001 from Tired Tiers quadratic base"
                                return a
                        },
                        cost: new Decimal("e2.58e40"),
                        unlocked(){
                                return hasUpgrade("d", 54) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("d", 55)
        },
        buyables: getLayerGeneralizedBuyableData("d", [
                        function(){
                                return hasMilestone("d", 8) || player.e.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(500) || player.e.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(1100) || player.e.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(3750) || player.e.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(17000) || player.e.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(26700) || player.f.unlocked
                        },
                        function(){
                                return hasMilestone("e", 18) || player.f.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(52e3) || player.f.unlocked
                        },
                        function(){
                                return player.d.buyables[11].gte(62e3) || player.f.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Duck reset"
                        },
                        done(){
                                return player.d.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Autobuy Capybara buyables, each Capybara autobuy tick buys each buyable once, square Alligator gain, and subtract .01 from the C 11 base cost."
                        },
                }, // hasMilestone("d", 1)
                2: {
                        requirementDescription(){
                                return "2 Duck resets"
                        },
                        done(){
                                return player.d.times >= 2
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Bulk 2x Beaver and Capybara buyables, per reset keep a Capybara reset, and C 32's effect past .05 adds to C 22's base."
                        },
                }, // hasMilestone("d", 2)
                3: {
                        requirementDescription(){
                                return "3 Duck resets"
                        },
                        done(){
                                return player.d.times >= 3
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep a milestone and resets multiplies the Capybara autobuyer speed."
                        },
                }, // hasMilestone("d", 3)
                4: {
                        requirementDescription(){
                                return "4 Duck resets"
                        },
                        done(){
                                return player.d.times >= 4
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep challenges and per reset<sup>1.5</sup> divide C 32 linear cost base by 1.02 (min 1)."
                        },
                }, // hasMilestone("d", 4)
                5: {
                        requirementDescription(){
                                return "100 Ducks"
                        },
                        done(){
                                return player.d.points.gte(100)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep a upgrade, triple Capybara bulk amount, and per milestone divide C 33 linear cost base by 10."
                        },
                }, // hasMilestone("d", 5)
                6: {
                        requirementDescription(){
                                return "1000 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1000)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Square Capybara bulk amount and add .0001 to the C 13 base."
                        },
                }, // hasMilestone("d", 6)
                7: {
                        requirementDescription(){
                                return "200,000 Ducks times Duck resets (+1)"
                        },
                        done(){
                                return player.d.points.times(player.d.times + 1).gte(2e5)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Ducks<sup>Duck resets</sup> divides C 33 cost base."
                        },
                }, // hasMilestone("d", 7)
                8: {
                        requirementDescription(){
                                return "1e30 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e30)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 31 gives free C 21 levels and unlock a Duck buyable."
                        },
                }, // hasMilestone("d", 8)
                9: {
                        requirementDescription(){
                                return "1e115 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e115)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 22 gives free C 21 levels."
                        },
                }, // hasMilestone("d", 9)
                10: {
                        requirementDescription(){
                                return "1e168 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e168)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C 33 base is raised to the number of milestones and if you have 1,000 D 11 C 11 gets free levels from C 12."
                        },
                }, // hasMilestone("d", 10)
                11: {
                        requirementDescription(){
                                return "1e196 Ducks"
                        },
                        done(){
                                return player.d.points.gte(1e196)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.unlocked)          return "Reward: Autobuy " + makePurple("every") + " Duck buyable per second and each D 13 decreases D 11 and D 12 cost base by " + makePurple("1.04") + "."
                                if (hasMilestone("e", 22))      return "Reward: Autobuy a Duck buyable per second and each D 13 decreases D 11 and D 12 cost base by 1.03x."
                                return "Reward: Autobuy a Duck buyable per second (if you can buy a level of the first row with ten seconds of production) and each D 13 decreases D 11 and D 12 cost base by 1.03"
                        },
                }, // hasMilestone("d", 11)
                12: {
                        requirementDescription(){
                                return "1e727 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e727")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 13 subtracts from its linear base (max 8) and the previous milestone also affects D 13."
                        },
                }, // hasMilestone("d", 12)
                13: {
                        requirementDescription(){
                                return "1e1134 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e1134")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.shiftAlias) return "Note: Only works above 1e1111 Ducks"
                                return "Reward: D 13 gives free D 12 levels, subtract .1 from D 11's base, and divide D 21 base cost by 1e145."
                        },
                }, // hasMilestone("d", 13)
                14: {
                        requirementDescription(){
                                return "1e4000 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e4000")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: The Duck autobuyer triggers twice as often, for twice as much, and on every buyable at once, and D 21's linear base is 1e6 - C 21."
                        },
                }, // hasMilestone("d", 14)
                15: {
                        requirementDescription(){
                                return "1e12,825 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e12825")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: The Duck autobuyer triggers twice as often and for twice as much and halve D 22 linear base, reapply this at 1e12,859 and 1e13,059 Ducks."
                        },
                }, // hasMilestone("d", 15)
                16: {
                        requirementDescription(){
                                return "1e13,440 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e13440")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Halve D 22 base but multiply D 12 cost base by 1e21. Reapply this 1e13,475 Ducks. At 1e13,631 Ducks, each D 22 level decreases D 21 base by 1 + milestones / 400."
                        },
                }, // hasMilestone("d", 16)
                17: {
                        requirementDescription(){
                                return "1e14,393 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e14393")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Decrease D 22 linear cost base by 1,250,000. Reapply this effect at 203, 214, 215, and 226 D 22 levels."
                        },
                }, // hasMilestone("d", 17)
                18: {
                        requirementDescription(){
                                return "1e14,668 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e14668")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Increase D 11 and D 12 base cost by 1e18 and add 1 to the Duck exponent. At 1e14,830 Ducks multiply Duck effect exponent by 5."
                        },
                }, // hasMilestone("d", 18)
                19: {
                        requirementDescription(){
                                return "1e14,938 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e14938")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Increase D 21 base by .0005 but Cap--ara and Capyb-ra don't multiply Duck gain."
                        },
                }, // hasMilestone("d", 19)
                20: {
                        requirementDescription(){
                                return "1e15,025 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e15025")
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                player.d.buyables[22] = player.d.buyables[22].min(260)
                        },
                        effectDescription(){
                                if (hasMilestone("f", 8) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 8."
                                        return "Reward: Reduce D 22 levels to 260, sextuple its linear base, and it gives free levels to D 12. At 1e15,444 Ducks double Duck effect exponent."
                                }
                                if (player.shiftAlias) return "Only works above 1e15,000 Ducks"
                                return "Reward: Reduce the Duck gain exponent by 6, reduce D 22 levels to 260, sextuple its linear base, and it gives free levels to D 12. At 1e15,444 Ducks double Duck effect exponent."
                        },
                }, // hasMilestone("d", 20)
                21: {
                        requirementDescription(){
                                return "1e19,205 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e19205")
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                player.d.buyables[22] = player.d.buyables[22].min(260)
                        },
                        effectDescription(){
                                return "Reward: D 22 gives free levels to D 13, subtract .1 from the D 11 base, Duck milestone 16 no longer divides D 21 base cost, divide D 22 base cost by 1e2182, and D 22 linear base is 1e5 times more."
                        },
                }, // hasMilestone("d", 21)
                22: {
                        requirementDescription(){
                                return "1e20,480 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e20480")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: log10(Eagles) multiplies Eagles and base Duck gain. Raise C 22 base to sqrt(D 21 levels + 1)."
                        },
                }, // hasMilestone("d", 22)
                23: {
                        requirementDescription(){
                                return hasMilestone("d", 24) ? "1e32,353 Ducks" : "1e31,160 Ducks"
                        },
                        done(){
                                return player.d.points.gte(hasMilestone("d", 24) ? "1e32353" : "1e31160")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("d", 24)) return "Reward: D 23 gives free D 13 levels <i>but multiply D 23 linear base by 8e12</i>. At 1e31,304 Ducks it also gives free D 12 levels."
                                return "Reward: D 23 gives free D 13 levels. At 1e31,304 Ducks it also gives free D 12 levels."
                        },
                }, // hasMilestone("d", 23)
                24: {
                        requirementDescription(){
                                return "1e31,468 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e31468")
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                player.d.milestones = filterOut(player.d.milestones, [23])
                        },
                        effectDescription(){
                                return "Reward: Repeal the previous milestone and increase its requirements. D 23 gives free D 21 levels but halve base Duck gain. At 1e32,132 Ducks, each D 23 reduces it linear cost base by 1%, and at 1e32,232 and 1e32,305 Ducks, reduce D 21 cost base by .1%."
                        },
                }, // hasMilestone("d", 24)
                25: {
                        requirementDescription(){
                                return "1e33,120 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e33120")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 23 gives free D 11 levels and divide base Duck gain by 24."
                        },
                }, // hasMilestone("d", 25)
                26: {
                        requirementDescription(){
                                return "1e40,473 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e40473")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 23 levels multiply Eagle gain."
                        },
                }, // hasMilestone("d", 26)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("d") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Ducks is " + format(player.d.best) : "You have done " + formatWhole(player.d.times) + " Duck resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("d")) {
                                                        if (player.shiftAlias) return "Duck gain formula is " + getGeneralizedPrestigeButtonText("d")
                                                        return "You are gaining " + format(tmp.d.getResetGain) + " Ducks per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.d.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("d")) return "You are gaining " + format(tmp.d.getResetGain) + " Ducks per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasMilestone("d", 8) || player.e.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.d.times) + " Ducks resets"
                                        }
                                ],
                                "milestones"
                        ],
                        unlocked(){
                                return player.d.times > 0 || player.e.unlocked
                        },
                },
        },
        onPrestige(gain){
                player.d.times += player.e.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.d
                if (layer == "d") data.time = 0
                if (!getsReset("d", layer)) return
                
                if (hasMilestone("e", 2)) data.times = Math.min(data.times, player.e.times)
                else data.times = 0

                if (!false/*player.h.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("e", 4)) keptUpgrades += player.e.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!false/*player.g.unlocked*/) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("e", 3)) keptMilestones += player.e.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("e", {
        name: "Eagle", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 4, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#CBC6B9",
        branches: ["d"],
        requires: new Decimal("1e15599"), // Can be a function that takes requirement increases into account
        resource: "Eagles", // Name of prestige currency
        baseResource: "Ducks", // Name of resource prestige is based on
        baseAmount() {return player.d.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                if (inChallenge("f", 21)) {
                        if (player.f.challenges[21] > 3) return tmp.f.effect.pow(3).root(player.f.challenges[21])
                        return tmp.f.effect
                }
                let ret = getGeneralizedPrestigeGain("e")

                if (hasMilestone("e", 11) && !hasMilestone("e", 20)) {
                        let x = ret.max(100).log10().times(.6989700043360189).sub(2).max(player.e.points.max(10).log10()).min(100)
                        ret = ret.div(Decimal.pow(2, x.floor()))
                }

                return ret
        },
        getBaseDiv(){
                return hasUpgrade("c", 51) ? decimalOne : new Decimal("1e15100")
        },
        getGainExp(){
                let ret = new Decimal(2)

                if (hasMilestone("e", 6) && !hasMilestone("e", 63)) {
                        ret = ret.plus(player.e.milestones.length / 25)
                }       
                if (hasUpgrade("e", 14))        ret = ret.plus(player.e.upgrades.length * .08)
                if (hasMilestone("e", 11))      ret = ret.plus(2)
                if (hasMilestone("e", 24))      ret = ret.plus(1)
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["e12"])
                if (hasMilestone("E", 2))       ret = ret.plus(player.T.points)

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(1)

                if (hasUpgrade("e", 12))        ret = ret.times(Decimal.pow(1.1, player.e.upgrades.length))
                if (hasMilestone("e", 18) && !hasMilestone("e", 22)) {
                                                ret = ret.times(2)
                }
                if (hasMilestone("e", 31))      ret = ret.times(7)
                if (hasMilestone("e", 32))      ret = ret.times(100/7)
                if (hasMilestone("e", 34))      ret = ret.div(4)
                if (hasMilestone("e", 35))      ret = ret.div(hasMilestone("f", 5) ? 1 : 2)
                if (hasMilestone("e", 36))      ret = ret.div(hasMilestone("f", 5) ? 1 : 6)
                if (hasMilestone("e", 37)) {
                        let l = new Decimal(player.e.milestones.length).sub(36).max(0)
                        let b = .4
                        if (hasMilestone("f", 7)) {
                                if (hasMilestone("e", 48)) b *= 1.05
                                if (hasMilestone("e", 49)) b *= 1.05
                                if (hasMilestone("e", 50)) b *= 1.05
                                if (hasMilestone("e", 51)) b *= 1.05
                                if (hasMilestone("e", 52)) b *= 1.05
                        } else {
                                if (hasMilestone("e", 48) && player.e.points.gte("1e1795")) b *= 1.05
                                if (hasMilestone("e", 49) && player.e.points.gte("1e1808")) b *= 1.05
                                if (hasMilestone("e", 50) && player.e.points.gte("1e1820")) b *= 1.05
                                if (hasMilestone("e", 51) && player.e.points.gte("1e2127")) b *= 1.02
                                if (hasMilestone("e", 52) && player.e.points.gte("1e2378")) b *= 1.01
                        }
                        if (hasMilestone("f", 5)) {
                                if (hasMilestone("e", 68))                                  b *= 1.03
                                if (hasMilestone("e", 69))                                  b *= 1.03
                                if (hasMilestone("e", 70))                                  b *= 1.03
                        } else {
                                if (hasMilestone("e", 68))                                  b *= 1.01
                                if (hasMilestone("e", 69))                                  b *= 1.01
                                if (hasMilestone("e", 70))                                  b *= 1.01
                                if (hasMilestone("e", 68) && player.e.points.gte("1e8223")) b *= 1.01
                                if (hasMilestone("e", 69) && player.e.points.gte("1e8261")) b *= 1.01
                                if (hasMilestone("e", 70) && player.e.points.gte("1e8300")) b *= 1.01
                        }
                        if (hasMilestone("e", 72) && player.e.points.gte("1e8620")) b *= 1.01
                        if (hasMilestone("e", 73) && player.e.points.gte("1e9496")) b *= 1.01
                        if (hasMilestone("e", 74) && player.e.points.gte("1e9658")) b *= 1.01
                        if (hasMilestone("e", 74) && player.e.points.gte("1e9855")) b *= 1.01
                        if (hasMilestone("e", 74) && player.e.points.gte("1e9895")) b *= 1.01
                        if (hasMilestone("e", 75) && player.e.points.gte("1e9935")) b *= 1.01
                        if (hasMilestone("e", 75) && player.e.points.gte("1e9974")) b *= 1.01
                        if (hasMilestone("e", 79) && player.e.points.gte("1e11607"))b *= 1.01
                        if (hasMilestone("e", 79) && player.e.points.gte("1e11645"))b *= 1.01
                                                ret = ret.times(Decimal.pow(.4, l.min(14)))
                                                ret = ret.times(Decimal.pow(b, l.sub(14).max(0)))
                }
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["e21"])
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["e32"])
                if (hasMilestone("e", 41) && player.e.best.gte("1e1163")) {
                                                ret = ret.times(1e5)
                }
                if (hasMilestone("e", 44))      ret = ret.times(103)
                if (hasMilestone("e", 47)) {
                        if (player.e.points.gte("1e1591")) ret = ret.times(100)
                        if (player.e.points.gte("1e1606")) ret = ret.times(100)
                }
                if (hasMilestone("e", 56))      ret = ret.times(10)
                if (hasMilestone("e", 59))      ret = ret.times(10)
                if (hasMilestone("e", 63)) {
                        if (player.e.points.gte("1e5422")) ret = ret.times(2)
                        if (player.e.points.gte("1e5624")) ret = ret.times(2)
                }
                if (hasMilestone("e", 64))      ret = ret.times(1.24)
                if (hasMilestone("e", 65) && player.e.points.gte("1e6563")) {
                                                ret = ret.times(1.01)
                }
                if (hasMilestone("e", 66)) {
                        if (player.e.points.gte("1e6829"))      ret = ret.times(1.02)
                        if (player.e.points.gte("1e6906"))      ret = ret.times(1.02)
                        if (player.e.points.gte("1e7067"))      ret = ret.times(1.02)
                        if (player.e.points.gte("1e7267"))      ret = ret.times(1.02)
                        if (player.e.points.gte("1e7765"))      ret = ret.times(1.02)
                }
                if (hasMilestone("e", 71)) {
                        if (hasMilestone("f", 5))               ret = ret.times(1.06) 
                        else {
                                if (player.e.points.gte("1e8401"))      ret = ret.times(1.015)
                                if (player.e.points.gte("1e8420"))      ret = ret.times(1.015)
                                if (player.e.points.gte("1e8461"))      ret = ret.times(1.015)
                                if (player.e.points.gte("1e8500"))      ret = ret.times(1.015)
                        }
                }
                if (hasMilestone("e", 73))      ret = ret.times(10)
                if (hasMilestone("e", 74))      ret = ret.times(10)
                if (hasMilestone("e", 76)) {
                        if (player.e.points.gte("1e10117"))     ret = ret.times(1.01)
                        if (player.e.points.gte("1e10155"))     ret = ret.times(1.01)
                        if (player.e.points.gte("1e10157"))     ret = ret.times(1.01)
                        if (player.e.points.gte("1e10277"))     ret = ret.times(1.01)
                        if (player.e.points.gte("1e10593"))     ret = ret.times(1.01)
                        if (player.e.points.gte("1e11161"))     ret = ret.times(1.01)
                        if (player.e.points.gte("1e11197"))     ret = ret.times(1.01)
                }
                if (hasMilestone("e", 79)) {
                        ret = ret.times(1.2)
                        if (player.e.points.gte("1e11607")) ret = ret.times(.76)
                        if (player.e.points.gte("1e11645")) ret = ret.times(.76)
                }
                if (hasUpgrade("E", 11))        ret = ret.times(Decimal.pow(1.01, player.E.upgrades.length))
                if (hasMilestone("T", 1))       ret = ret.times(Decimal.pow(1.02, player.T.points))
                if (hasMilestone("T", 2))       ret = ret.times(Decimal.pow(1.02, player.T.milestones))
                if (hasUpgrade("e", 31))        ret = ret.times(Decimal.pow(1.1, player.e.upgrades.length).pow(layerChallengeCompletions("f")))
                                                ret = ret.times(tmp.f.challenges[12].rewardEffect)
                if (hasUpgrade("E", 22))        ret = ret.times(player.T.points.max(1))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["f12"])
                
                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("e")

                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["e11"].pow(player.e.milestones.length))

                                                ret = ret.div(25e4)
                if (hasMilestone("e", 7))       ret = ret.times(player.e.milestones.length)
                if (hasUpgrade("e", 13))        ret = ret.times(Decimal.pow(2, player.e.upgrades.length))
                if (hasMilestone("d", 22))      ret = ret.times(player.e.points.max(10).log10())
                if (hasUpgrade("c", 51) && !hasMilestone("e", 24)) {
                                                ret = ret.times(player.e.points.max(10).log10().pow(hasUpgrade("c", 53) ? player.c.upgrades.filter(x => x > 50).length : 1))
                }
                if (hasUpgrade("d", 33) && !hasMilestone("e", 25)) {
                                                ret = ret.times(getBuyableAmount("d", 22).max(1))
                }
                if (hasUpgrade("c", 52) && !hasMilestone("e", 23)) {
                                                ret = ret.times(player.c.points.max(10).log10().max(10).log10().pow(player.c.upgrades.filter(x => x > 50).length))
                }
                if (hasUpgrade("d", 35))        ret = ret.times(player.d.upgrades.length)
                if (hasMilestone("e", 10))      ret = ret.div(100)
                if (hasMilestone("e", 11))      ret = ret.div(250)
                if (hasMilestone("e", 20))      ret = ret.div(4e32)
                if (hasMilestone("e", 21))      ret = ret.div(56789)
                if (hasMilestone("e", 32))      ret = ret.div(1e35)
                if (hasUpgrade("e", 24))        ret = ret.div(Decimal.pow(10, player.e.upgrades.length))
                if (hasUpgrade("e", 25))        ret = ret.div(Decimal.pow(150, player.e.upgrades.length))
                if (hasMilestone("d", 26))      ret = ret.times(getBuyableAmount("d", 23).max(1))
                if (hasUpgrade("d", 44))        ret = ret.times(getBuyableAmount("d", 22).div(1e5).plus(1).pow(getBuyableAmount("d", 23).min(10000)))
                if (hasUpgrade("d", 45))        ret = ret.times(player.d.points.max(10).log10().max(10).log10())
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["e13"])
                if (hasMilestone("e", 41) && player.e.best.gte("1e1163")) {
                                                ret = ret.div(1e200)
                }
                if (hasMilestone("e", 44))      ret = ret.div(1e103)
                if (hasMilestone("e", 47)) {
                        if (player.e.points.gte("1e1591")) ret = ret.div(1e100)
                        if (player.e.points.gte("1e1606")) ret = ret.div(1e100)
                }
                if (hasMilestone("e", 56))      ret = ret.div(1e85)
                if (hasMilestone("e", 58) && player.e.best.gte("1e3922")) {
                                                ret = ret.div(1e29)
                }
                
                if (hasMilestone("e", 63)) {
                        ret = ret.div(1e6)
                        if (player.e.points.gte("1e5422")) ret = ret.div(3e35)
                        if (player.e.points.gte("1e5624")) ret = ret.div(3e36)
                }
                if (!hasMilestone("f", 5)) {
                        if (hasMilestone("e", 59))      ret = ret.div(1e100)
                        if (hasMilestone("e", 68))      ret = ret.div(1e8)
                        if (hasMilestone("e", 68) && player.e.points.gte("1e8223")) ret = ret.div(1e13)
                        if (hasMilestone("e", 69))      ret = ret.div(3e7)
                        if (hasMilestone("e", 69) && player.e.points.gte("1e8261")) ret = ret.div(15e11)
                        if (hasMilestone("e", 70))      ret = ret.div(3e7)
                        if (hasMilestone("e", 70) && player.e.points.gte("1e8300")) ret = ret.div(3e12)
                }
                if (hasMilestone("e", 71))      ret = ret.div(1e40)
                if (hasMilestone("e", 72) && player.e.points.gte("1e8620")) ret = ret.div(1e16)
                if (hasMilestone("e", 73) && player.e.points.gte("1e9496")) ret = ret.div(1e18)
                if (hasMilestone("e", 74) && player.e.points.gte("1e9658")) ret = ret.div(1e19)
                if (hasMilestone("e", 74) && player.e.points.gte("1e9855")) ret = ret.div(1e19)
                if (hasMilestone("e", 74) && player.e.points.gte("1e9895")) ret = ret.div(1e19)
                if (hasMilestone("e", 75) && player.e.points.gte("1e9935")) ret = ret.div(1e20)
                if (hasMilestone("e", 75) && player.e.points.gte("1e9974")) ret = ret.div(1e20)

                if (hasMilestone("e", 73))      ret = ret.div(1e176)
                if (hasMilestone("e", 74))      ret = ret.div(1e190)

                if (hasMilestone("T", 3))       ret = ret.times(player.E.best.max(1).pow(player.T.milestones.length))
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["e33"])
                if (hasMilestone("T", 8))       ret = ret.times(Decimal.pow10(hasMilestone("f", 8) ? 5000 : -2650))
                if (hasUpgrade("T", 14))        ret = ret.div("1e3500")
                if (hasMilestone("E", 5))       ret = ret.div("1e600")
                if (hasMilestone("f", 7))       ret = ret.times(tmp.f.milestones[7].effectPer.pow(player.T.points.sub(tmp.f.milestones[7].start).max(0)))

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("e") || player.e.points.lt(1)) return decimalOne

                let amt = player.e.points
                amtlog = hasMilestone("e", 33) ? amt.log10() : amt.log10().floor()

                let exp = amtlog.plus(hasUpgrade("e", 13) ? 0 : 1).min(20)

                if (hasMilestone("e", 37)) {
                        exp = new Decimal(5)
                        if (hasMilestone("e", 46)) {
                                exp = exp.plus(1)
                                if (player.e.points.gte("1e1469")) exp = exp.plus(1)
                                if (player.e.points.gte("1e1499")) exp = exp.plus(1)
                                if (player.e.points.gte("1e1527")) exp = exp.plus(1)
                                if (player.e.points.gte("1e1554")) exp = exp.plus(1)
                        }
                        exp = exp.times(CURRENT_BUYABLE_EFFECTS["e23"])
                }
                else {
                        if (hasMilestone("e", 12))      exp = exp.div(2)
                        if (hasMilestone("e", 13))      exp = exp.div(2)
                        if (hasMilestone("e", 16))      exp = exp.sub(1)
                        if (hasMilestone("e", 17))      exp = exp.sub(1)
                        if (hasMilestone("e", 24))      exp = exp.plus(1.5)
                        if (hasMilestone("e", 33))      exp = exp.plus(.25)
                }

                let ret = amtlog.pow10().plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("e")
        },
        getNextAt(){
                return getGeneralizedNextAt("e")
        },
        update(diff){
                let data = player.e

                if (tmp.e.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("e", diff)
                
                if (hasMilestone("T", 1) || (hasMilestone("e", 23) && player.f.unlocked) || hasMilestone("f", 5)) {
                        handleGeneralizedBuyableAutobuy(diff, "e")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        layerShown(){return player.d.best.gte("1e15600") || player.e.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("e")) return ""
                return getGeneralizedPrestigeButtonText("e")
        },
        canReset(){
                return player.e.time >= 2 && !isPassiveGainActive("e") && tmp.e.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E-gle"
                        },
                        description(){
                                let a = "Note: Each upgrade in this tab is applied per upgrade. Add .0001 to D 13 base."
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                return player.e.best.gte(10) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ea-le"
                        },
                        description(){
                                let a = "Multiply Duck gain by upgrades and multiply pre-exponent Eagle gain by 1.1"
                                return a
                        },
                        cost: new Decimal(10),
                        unlocked(){
                                return player.e.best.gte(61) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E--le"
                        },
                        description(){
                                let a = "Double Eagle gain but remove the +1 in the Eagle effect exponent"
                                return a
                        },
                        cost: new Decimal(1e4),
                        unlocked(){
                                return player.e.best.gte(3000) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Eag-e"
                        },
                        description(){
                                let a = "Add .08 to the Eagle gain exponent and add .0001 to the D 21 base but multiply D 1X base cost by 1e7"
                                return a
                        },
                        cost: new Decimal(1e9),
                        unlocked(){
                                return player.e.best.gte(5e8) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E-g-e"
                        },
                        description(){
                                let a = "Multiply base Duck gain by log10(Eagles)/16"
                                if (hasMilestone("f", 4)) a = a.replace("/16", "")
                                return a
                        },
                        cost: new Decimal(1e16),
                        unlocked(){
                                return player.e.best.gte(2e15) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ea--e"
                        },
                        description(){
                                let a = "Each D 22 multiplies its linear base by .9999"
                                return a
                        },
                        cost: new Decimal(1e25),
                        unlocked(){
                                return player.e.best.gte(1e20) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E---e"
                        },
                        description(){
                                let a = "Each D 23 multiplies its linear base by .9998 but multiply D 2X base cost by 1e22"
                                return a
                        },
                        cost: new Decimal(1e36),
                        unlocked(){
                                return player.e.best.gte(1e35) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Eagl-"
                        },
                        description(){
                                let a = "Multiply E 11 base cost by 10 and add .0003 to its base"
                                return a
                        },
                        cost: new Decimal(1e64),
                        unlocked(){
                                return player.e.best.gte(1e63) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E-gl-"
                        },
                        description(){
                                let a = "Cube C 22 and C 33 bases but tenth Eagle gain"
                                return a
                        },
                        cost: new Decimal(1e256),
                        unlocked(){
                                return player.e.best.gte(1e200) || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ea-l-"
                        },
                        description(){
                                let a = "Divide Eagle gain by 150 and add .1 to the E 13 base"
                                return a
                        },
                        cost: new Decimal("1e521"),
                        unlocked(){
                                return player.e.best.gte("1e510") || player.f.unlocked
                        }, 
                }, // hasUpgrade("e", 25)
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E--l-"
                        },
                        description(){
                                let a = "cbrt(Finches) divide E 32 base and per Finch challenge completion multiply Finch and Base Eagle gain by 1.1"
                                return a
                        },
                        cost: new Decimal("e1450e3"),
                        unlocked(){
                                return player.f.challenges[11] > 0 // || player.g.unlocked
                        }, 
                }, // hasUpgrade("e", 31)
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Eag--"
                        },
                        description(){
                                let a = "Finches (max 1e250) multiply Emerald gain and improve Finch milestone 7"
                                return a
                        },
                        cost: new Decimal("e3381e3"),
                        unlocked(){
                                return player.f.challenges[12] > 0 // || player.g.unlocked
                        }, 
                }, // hasUpgrade("e", 32)
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E-g--"
                        },
                        description(){
                                let a = "Per Tier past 350 double Emerald gain per Finch challenge"
                                return a
                        },
                        cost: new Decimal("ee7"),
                        unlocked(){
                                return player.f.challenges[21] > 0 // || player.g.unlocked
                        }, 
                }, // hasUpgrade("e", 33)
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Ea---"
                        },
                        description(){
                                let a = "Increase F 11 linear cost base by .005 (disabled below 1e400 Finches)"
                                return a
                        },
                        cost: new Decimal("e67676767"),
                        unlocked(){
                                return hasUpgrade("e", 33) // || player.g.unlocked
                        }, 
                }, // hasUpgrade("e", 34)
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E----"
                        },
                        description(){
                                let a = "Double E 22 and E 32 bases"
                                return a
                        },
                        cost: new Decimal("e123456789"),
                        unlocked(){
                                return hasUpgrade("e", 34) // || player.g.unlocked
                        }, 
                }, // hasUpgrade("e", 35)
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E<sup>2</sup>agle"
                        },
                        description(){
                                let a = "Multiply F 11 base cost by 10,000"
                                return a
                        },
                        cost: new Decimal("e4450600e3"),
                        unlocked(){
                                return hasUpgrade("f", 15) // || player.g.unlocked
                        }, 
                }, // hasUpgrade("e", 41)
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>E<sup>2</sup>-gle"
                        },
                        description(){
                                let a = "Multiply F 12 cost base by 1e6"
                                return a
                        },
                        cost: new Decimal("e3.23e10"),
                        unlocked(){
                                return hasUpgrade("e", 41) // || player.g.unlocked
                        }, 
                }, // hasUpgrade("e", 42)
        },
        buyables: getLayerGeneralizedBuyableData("e", [
                        function(){
                                return hasUpgrade("e", 22) || player.f.unlocked
                        },
                        function(){
                                return (getBuyableAmount("e", 11).gte(150) && hasMilestone("e", 13)) || player.f.unlocked
                        },
                        function(){
                                return getBuyableAmount("e", 11).gte(1790) || player.f.unlocked
                        },
                        function(){
                                return hasMilestone("e", 40) //|| player.g.unlocked
                        },
                        function(){
                                return hasMilestone("e", 51) //|| player.g.unlocked
                        },
                        function(){
                                return getBuyableAmount("e", 11).gte(4550) //|| player.g.unlocked
                        },
                        function(){
                                return getBuyableAmount("e", 11).gte(6950) //|| player.g.unlocked
                        },
                        function(){
                                return hasMilestone("e", 79) //|| player.g.unlocked
                        },
                        function(){
                                return hasMilestone("T", 7) //|| player.g.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Eagle reset"
                        },
                        done(){
                                return player.e.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Square beaver gain, double and square Capybara bulk amount, and add 1.5 to C 33's base."
                        },
                }, // hasMilestone("e", 1)
                2: {
                        requirementDescription(){
                                return "2 Eagle resets"
                        },
                        done(){
                                return player.e.times >= 2
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep a Duck reset and D 12 gives free levels to C 32."
                        },
                }, // hasMilestone("e", 2)
                3: {
                        requirementDescription(){
                                return "3 Eagle resets"
                        },
                        done(){
                                return player.e.times >= 3
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep a Duck milestone, multiply Duck autobuyer speed and bulk amount by resets + 1, and D 11 gives free C 32 levels."
                        },
                }, // hasMilestone("e", 3)
                4: {
                        requirementDescription(){
                                return "4 Eagles"
                        },
                        done(){
                                return player.e.points.gte(4)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep a Duck upgrade and each of the first forty resets gives a free D 11 level."
                        },
                }, // hasMilestone("e", 4)
                5: {
                        requirementDescription(){
                                return "50 Eagles (or 17 Eagle resets)"
                        },
                        done(){
                                return player.e.points.gte(50) || player.e.times >= 17
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Gain 1e20x Ducks below 1e10,000 and square C 22 base."
                        },
                }, // hasMilestone("e", 5)
                6: {
                        requirementDescription(){
                                return "150 Eagles"
                        },
                        done(){
                                return player.e.points.gte(150)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 22 linear base is 7e10 and its base is .0001 more. Increase the Eagle gain exponent by .04 per milestone."
                        },
                }, // hasMilestone("e", 6)
                7: {
                        requirementDescription(){
                                return "1000 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1000)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 22 linear base is 1e14 and decreases by .1% per level. D 22 gives free levels to D 11 and milestones multiplies Eagle gain."
                        },
                }, // hasMilestone("e", 7)
                8: {
                        requirementDescription(){
                                return "200,000 Eagles"
                        },
                        done(){
                                return player.e.points.gte(2e5)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove the ability to Eagle prestige, gain 100% of your Eagle gained on reset per second, and gain one Eagle reset per second. Eagle resets no longer give free D 11 levels."
                        },
                }, // hasMilestone("e", 8)
                9: {
                        requirementDescription(){
                                return "1e28,369 Ducks"
                        },
                        done(){
                                return player.d.points.gte("1e28369")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 12 gives free C 31 and C 33 levels."
                        },
                }, // hasMilestone("e", 9)
                10: {
                        requirementDescription(){
                                return "5e26 Eagles"
                        },
                        done(){
                                return player.e.points.gte("5e26")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Divide Eagle gain by 100x and raise C 11 base to the number of milestones."
                        },
                }, // hasMilestone("e", 10)
                11: {
                        requirementDescription(){
                                return "7e30 Eagles"
                        },
                        done(){
                                return player.e.points.gte("7e30")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Divide Eagle gain by 250, each order of magnitude (up to 100) of Eagles halves Eagle, add 2 to the Eagle gain exponent, and divide D 23 linear base by 1e5 but multiply its base cost by 1e1000."
                        },
                }, // hasMilestone("e", 11)
                12: {
                        requirementDescription(){
                                return "4.34e34 Eagles"
                        },
                        done(){
                                return player.e.points.gte("4.34e34")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Halve Eagle effect exponent, multiply Duck exponent by milestones squared and divide D 23 linear cost base by 123,456. At 1e46,428 Ducks further halve D 23's linear cost base."
                        },
                }, // hasMilestone("e", 12)
                13: {
                        requirementDescription(){
                                return "121 E 11 levels"
                        },
                        done(){
                                return getBuyableAmount("e", 11).gte(121) || player.e.points.gte(1e100)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Halve Eagle effect exponent and sixth D 22 base. At 150 E 11 levels, unlock a new buyable and log10(Eagles) that multiply base Duck gain is ceilinged."
                        },
                }, // hasMilestone("e", 13)
                14: {
                        requirementDescription(){
                                return "2e47 Eagles"
                        },
                        done(){
                                return player.e.points.gte(2e47)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "Reward: E 11 levels subtract .0001 from the E 12 linear base and vice versa. E 11 level decrease 23 base by 1%."
                                }
                                return "Reward: E 11 levels subtract .0001 from the E 12 linear base and vice versa. At 200 E 11 levels, its levels decrease D 23 base by 1% but divide base Duck gain by 700."
                        },
                }, // hasMilestone("e", 14)
                15: {
                        requirementDescription(){
                                return "2e52 Eagles"
                        },
                        done(){
                                return player.e.points.gte(2e52)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each milestone squares Alligator buyable limit and bulk amount and adds .0001 to the E 12 base."
                        },
                }, // hasMilestone("e", 15)
                16: {
                        requirementDescription(){
                                return "2e58 Eagles"
                        },
                        done(){
                                return player.e.points.gte(2e58)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Subtract 1 from the Eagle effect exponent. At 1e62,000 Ducks, E 12 adds to D 23 base and add .0002 to the E 11 base."
                        },
                }, // hasMilestone("e", 16)
                17: {
                        requirementDescription(){
                                return "2e71 Eagles"
                        },
                        done(){
                                return player.e.points.gte(2e71)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Subtract 1 from the Eagle effect exponent. At 100 E 12 levels, divide E 11 base cost by 10."
                        },
                }, // hasMilestone("e", 17)
                18: {
                        requirementDescription(){
                                return "2e80 Eagles"
                        },
                        done(){
                                return player.e.points.gte(2e80)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return  "Reward: Multiply base duck gain by 1e40 and unlock a Duck buyable and double base Eagle gain."
                                }
                                return "Reward: Divide base duck gain by 10,000 but unlock a Duck buyable and double base Eagle gain."
                        },
                }, // hasMilestone("e", 18)
                19: {
                        requirementDescription(){
                                return "2e93 Eagles"
                        },
                        done(){
                                return player.e.points.gte(2e93)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Divide base duck gain by 10,000,000 but E 11 gives free D 31 levels."
                        },
                }, // hasMilestone("e", 19)
                20: {
                        requirementDescription(){
                                return "1e102 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e102)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                tmp.e.getGainMultPost = decimalOne
                        },
                        effectDescription(){
                                return "Reward: Divide Eagle gain by 4e32, tenth base Duck gain, no longer halve Eagle gain every order of magnitude, and each Eagle buyable reduces D 31 base by E 11 effect."
                        },
                }, // hasMilestone("e", 20)
                21: {
                        requirementDescription(){
                                return "1e116 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e116)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Divide Eagle gain by 56789, E 11 no longer gives free D 31 levels, but D 31 gives free D 21 levels and affect E 12."
                        },
                }, // hasMilestone("e", 21)
                22: {
                        requirementDescription(){
                                return "1.32e132 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1.32e132)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Eagle Milestone 16 no longer adds to the E 11 base, Eagle Milestone 18 no longer affects base Eagle gain, and permanently remove the restriction on the Duck autobuyer."
                        },
                }, // hasMilestone("e", 22)
                23: {
                        requirementDescription(){
                                return "1e137 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e137)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.unlocked) return "Reward: Ca--b-ra no longer multiplies Eagle gain and add .0001 to D 31's base" + makePurple(" and autobuy Eagle buyables") + "."
                                return "Reward: Ca--b-ra no longer multiplies Eagle gain and add .0001 to D 31's base."
                        },
                }, // hasMilestone("e", 23)
                24: {
                        requirementDescription(){
                                return "1e141 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e141)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: C-p-b-ra is disabled (except first half), add .0002 to D 31's base, add 1 to the Eagle gain exponent, and add 1.5 to the Eagle effect exponent."
                        },
                }, // hasMilestone("e", 24)
                25: {
                        requirementDescription(){
                                return "1e174 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e174)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                player.d.buyables[31] = decimalZero
                        },
                        effectDescription(){
                                return "Reward: D 22 levels no longer multiply Eagle gain, D 31 gives free D 23 levels, but reset its levels, multiply its effect by 2.5, and increase its linear cost base to 1e175."
                        },
                }, // hasMilestone("e", 25)
                26: {
                        requirementDescription(){
                                return "1e192 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e192)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                CURRENT_BUYABLE_BASES["e11"] = decimalOne
                                CURRENT_BUYABLE_EFFECTS["e11"] = decimalOne
                        },
                        effectDescription(){
                                return "Reward: Each of the next five milestones subtracts .0004 from the E 11 base and increase the D 31 base cost by 1e10,00 but each D 12 past 16,000 divides D 31 linear cost base by 1.01."
                        },
                }, // hasMilestone("e", 26)
                27: {
                        requirementDescription(){
                                return "1e206 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e206)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                CURRENT_BUYABLE_BASES["e11"] = decimalOne
                                CURRENT_BUYABLE_EFFECTS["e11"] = decimalOne
                        },
                        effectDescription(){
                                return "Reward: D 31 gives free D 22 levels and add .0001 to the D 22 base but D 23 no longer gives D 11 levels."
                        },
                }, // hasMilestone("e", 27)
                28: {
                        requirementDescription(){
                                return "1e226 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e226)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                CURRENT_BUYABLE_BASES["e11"] = decimalOne
                                CURRENT_BUYABLE_EFFECTS["e11"] = decimalOne
                        },
                        effectDescription(){
                                return "Reward: Square Beaver buyable limit, sources to D 23 base multiply instead of add, and 1 + milestones / 100 exponentiates its base."
                        },
                }, // hasMilestone("e", 28)
                29: {
                        requirementDescription(){
                                return "1e234 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e234)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                CURRENT_BUYABLE_BASES["e11"] = decimalOne
                                CURRENT_BUYABLE_EFFECTS["e11"] = decimalOne
                        },
                        effectDescription(){
                                return "Reward: E 12 levels divide D 31 base by 1.01."
                        },
                }, // hasMilestone("e", 29)
                30: {
                        requirementDescription(){
                                return "1e243 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e243)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                CURRENT_BUYABLE_BASES["e11"] = decimalOne
                                CURRENT_BUYABLE_EFFECTS["e11"] = decimalOne
                        },
                        effectDescription(){
                                return "Reward: D 31 affects itself at 30x rate."
                        },
                }, // hasMilestone("e", 30)
                31: {
                        requirementDescription(){
                                return "1e265 Eagles"
                        },
                        done(){
                                return player.e.points.gte(1e265)
                        },
                        unlocked(){
                                return true
                        },
                        onComplete(){
                                CURRENT_BUYABLE_BASES["e11"] = decimalOne
                                CURRENT_BUYABLE_EFFECTS["e11"] = decimalOne
                        },
                        effectDescription(){
                                return "Reward: Multiply base Eagle gain by 7 but subtract .001 from the E 11 base."
                        },
                }, // hasMilestone("e", 31)
                32: {
                        requirementDescription(){
                                return "1e313 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e313")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each D 32 adds 1 to its base, its linear cost base is 1e20, multiply base Eagle gain by 100/7, but divide Eagle gain by 1e35."
                        },
                }, // hasMilestone("e", 32)
                33: {
                        requirementDescription(){
                                return "1e331 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e331")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 13 no longer gives free levels to D 12 but D 23 gives free levels to D 22, add .25 to the Eagle effect exponent, and no longer floor or ceiling Eagle to Duck gain."
                        },
                }, // hasMilestone("e", 33)
                34: {
                        requirementDescription(){
                                return "1e410 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e410")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 11 gives free D 32 levels but quarter base Eagle gain and subtract 1 from the D 11 base. At 1e416 Eagles, Eagle Milestone 30 affects D 32 and square Capybara bulk amount."
                        },
                }, // hasMilestone("e", 34)
                35: {
                        requirementDescription(){
                                return "1e430 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e430")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "Reward: Remove D 33 linear base and D 32 gives free D 21 levels."
                                }
                                return "Reward: D 33 levels tenth its linear base (softcap after 1e100: x -> log10(x)<sup>5log10(x)<sup>2</sup></sup>) and halve base Eagle gain. D 32 gives free D 21 levels but subtract .0035 / .0001 from the D 21 / D 22 base."
                        },
                }, // hasMilestone("e", 35)
                36: {
                        requirementDescription(){
                                return "1e443 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e443")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "Reward: Raise the D 33 base to the sqrt(milestones) power."
                                }
                                return "Reward: The base effect of the previous milestone becomes the D 33 base and raise the D 33 base to the sqrt(milestones) power. Sixth base Eagle gain."
                        },
                }, // hasMilestone("e", 36)
                37: {
                        requirementDescription(){
                                return "1e500 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e500")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 13 gives free D 32 levels and this and all following milestones multiply base Eagle gain by .4, and at 1e508 Eagles, the Eagle effect exponent is 5."
                        },
                }, // hasMilestone("e", 37)
                38: {
                        requirementDescription(){
                                return "1e547 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e547")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 13 levels subtract .1 from its linear base (fifthed below 90, halve below 25, become every other below 14, and tenth below 5) and divide D 33 base cost by 1e900."
                        },
                }, // hasMilestone("e", 38)
                39: {
                        requirementDescription(){
                                return "1e578 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e578")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Multiply D 32 / D 33 base cost by 1e3000 / 1e7000 and E 13 gives free D 31 levels."
                        },
                }, // hasMilestone("e", 39)
                40: {
                        requirementDescription(){
                                return "1e1039 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1039")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Eagle Milestone 36 no longer affects D 33, unlock a new Eagle buyable, and add 8.5 to D 33 base. At 1e1041 / 1e1045 / 1e1055 Eagles divide E 21 cost base by 1e13 / 1e13 / 1e7. At 1e1078 Eagles, E 21 gives free levels to E 13 and subtract from its linear cost base (tenth below 250, halve below 75, and fifth below 50)."
                        },
                }, // hasMilestone("e", 40)
                41: {
                        requirementDescription(){
                                return "1e1095 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1095")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Divide D 22 / D 23 base cost by 1e10,000 / 1e30,000 but multiply E 11 / E 12 / E 13 base cost by 1e4 / 1e4 / 1e35. At 1e1163 Eagles, gain 1e5x base Eagles, but divide Eagle gain by 1e200."
                        },
                }, // hasMilestone("e", 41)
                42: {
                        requirementDescription(){
                                return "1e1174 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1174")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Total Eagle buyables past 5500 decrease E 11 cost base by 1%; apply this to E 12 once and E 13 ten times. At 1e1180, multiply E 21's base cost by 1e5, and total Eagle buyables past 5500 reduce E 21 base by 12%."
                        },
                }, // hasMilestone("e", 42)
                43: {
                        requirementDescription(){
                                return "1e1214 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1214")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.unlocked) return "Reward: Divide D 33 base cost by 1e10,000 " + makePurple("and double the Eagle autobuyer speed and bulk amount.")
                                return "Reward: Divide D 33 base cost by 1e10,000."
                        },
                }, // hasMilestone("e", 43)
                44: {
                        requirementDescription(){
                                return "1e1283 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1283")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 21 base cost is E 13 base cost squared, rounded down to the nearest OoM, divide E 33 base cost by 1e50,000, and divide Eagle gain by 1e103 but multiply base Eagle gain by 103."
                        },
                }, // hasMilestone("e", 44)
                45: {
                        requirementDescription(){
                                return "1e1375 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1375")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Square Beaver buyable bulk and limit and add .0003 to the D 21 base but it no longer affects base Duck gain. At 1e1402 and 1e1428 Eagles add .0001 to the D 21 base."
                        },
                }, // hasMilestone("e", 45)
                46: {
                        requirementDescription(){
                                return "1e1452 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1452")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Add 1 to the Eagle effect exponent. Reapply this at 1e1469, 1e1499, 1e1527, and 1e1554 Eagles."
                        },
                }, // hasMilestone("e", 46)
                47: {
                        requirementDescription(){
                                return "1e1579 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1579")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 32 base becomes half of its total levels. At 1e1591 and 1e1606 Eagles, multiply base Eagle gain by 100 but divide Eagle gain by 1e100."
                        },
                }, // hasMilestone("e", 47)
                48: {
                        requirementDescription(){
                                return "1e1637 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1637")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 8) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 8."
                                        return "Reward: Add .001 to the D 21 and D 31 base and milestones past 50 increase base Eagle gain by 5%."
                                }
                                return "Reward: Add .0001 to the D 21 base. At 1e1720 Eagles, add .0001 to D 31 base but divide base Duck gain by 1e6. At 1e1795 Eagles, milestones past 50 increase base Eagle gain by 5%."
                        },
                }, // hasMilestone("e", 48)
                49: {
                        requirementDescription(){
                                return "1e1677 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1677")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 8) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 8."
                                        return "Reward: Add .001 to the D 21 and D 31 base and milestones past 50 increase base Eagle gain by 5%."
                                }
                                return "Reward: Add .0001 to the D 21 base. At 1e1745 Eagles, add .0001 to D 31 base but divide base Duck gain by 1e6. At 1e1808 Eagles, milestones past 50 increase base Eagle gain by 5%."
                        },
                }, // hasMilestone("e", 49)
                50: {
                        requirementDescription(){
                                return "1e1700 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1700")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 8) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 8."
                                        return "Reward: Add .001 to the D 21 and D 31 base and milestones past 50 increase base Eagle gain by 5%."
                                }
                                return "Reward: Add .0001 to the D 21 base. At 1e1776 Eagles, add .0001 to D 31 base but divide base Duck gain by 1e6. At 1e1820 Eagles, milestones past 50 increase base Eagle gain by 5%."
                        },
                }, // hasMilestone("e", 50)
                51: {
                        requirementDescription(){
                                return "1e1768 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1768")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 8) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 8."
                                        return "Reward: Add .001 to the D 21 and D 31 base and milestones past 50 increase base Eagle gain by 5%."
                                }
                                return "Reward: Add .0001 to the D 21 base. At 1e1790 Eagles, add .0001 to D 31 base but divide base Duck gain by 1e6. At 1e2127 Eagles, milestones past 50 increase base Eagle gain by 2%."
                        },
                }, // hasMilestone("e", 51)
                52: {
                        requirementDescription(){
                                return "1e1782 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1782")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 8) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 8."
                                        return "Reward: Add .001 to the D 21 and D 31 base and milestones past 50 increase base Eagle gain by 5%."
                                }
                                return "Reward: Add .0001 to the D 21 base. Add .0001 to D 31 base. At 1e2378 Eagles, milestones past 50 increase base Eagle gain by 1%."
                        },
                }, // hasMilestone("e", 52)
                53: {
                        requirementDescription(){
                                return "1e1919 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e1919")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 22 gives free E 11 levels but multiply its linear cost base by 10. At 1e2088 Eagles, E 22 gives free D 33 levels."
                        },
                }, // hasMilestone("e", 53)
                54: {
                        requirementDescription(){
                                return "1e2038 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e2038")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 22 gives free E 12 levels but multiply its linear cost base by 10. At 1e2189, E 22 gives free E 13 levels but increase its base cost by 1e30."
                        },
                }, // hasMilestone("e", 54)
                55: {
                        requirementDescription(){
                                return "1e2259 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e2259")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.unlocked) return "Reward: Raise C 22 base to the log10(10+Eagles)" + makePurple(" and double the Eagle autobuyer speed and bulk amount") + "."
                                return "Reward: Raise C 22 base to the log10(10+Eagles)."
                        },
                }, // hasMilestone("e", 55)
                56: {
                        requirementDescription(){
                                return "1e3081 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e3081")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 23 gives free E 13 levels, divide Eagle gain by 1e85, multiply base Eagle gain by 10, and multiply E 23 linear cost base by 10. At 1e3342 Eagles, each E 23 adds .0001 to its base (doubled at 1e3442)."
                        },
                }, // hasMilestone("e", 56)
                57: {
                        requirementDescription(){
                                return "1e3643 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e3643")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.unlocked) return "Reward: D 31 base becomes E 22's effect, multiply D 32's base by 10, add .0001 to the D 22 base, tenth E 23 linear base, and " + makePurple("autobuy all Eagle buyables at once") + "."
                                return "Reward: D 31 base becomes E 22's effect, multiply D 32's base by 10, and add .0001 to the D 22 base. At 1e3660 and 1e3703 Eagles halve E 23 linear base; at 1e3764 divide it by 2.5."
                        },
                }, // hasMilestone("e", 57)
                58: {
                        requirementDescription(){
                                return "1e3905 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e3905")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 32 gives free D 22 levels but divide base Duck gain by 1e50. At 1e3922 Eagles, divide Eagle gain by 1e29 and E 23 gives free E 13 levels."
                        },
                }, // hasMilestone("e", 58)
                59: {
                        requirementDescription(){
                                return "1e4146 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e4146")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "Multiply base Eagle gain by 10."
                                }
                                return "Reward: Multiply base Eagle gain by 10 but divide Eagle gain by 1e100 and at 100 E 23 levels double its linear cost base."
                        },
                }, // hasMilestone("e", 59)
                60: {
                        requirementDescription(){
                                return "1e4649 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e4649")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 22 levels decrease E 23 linear cost base by .1% and vise versa. Multiply E 23 initial base by 1e22, reduce this to 1e14 / 1e9 at 5e4701 / 1e5000 Eagles."
                        },
                }, // hasMilestone("e", 60)
                61: {
                        requirementDescription(){
                                return "1e5121 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e5121")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 13 gives free levels to D 12 instead of D 23 but divide base Duck gain by 1e10. At 1e5183 Eagles, E 12 gives free D 32 levels but divide base Duck gain by 1e51."
                        },
                }, // hasMilestone("e", 61)
                62: {
                        requirementDescription(){
                                return "1e5302 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e5302")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Multiply D 33 base by 10 but divide base Duck gain by 1e31."
                        },
                }, // hasMilestone("e", 62)
                63: {
                        requirementDescription(){
                                return "1e5361 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e5361")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 23 gives free E 11 levels but Eagle milestone 6 does not affect Eagle gain exponent and divide Eagle gain by 1,000,000. At 1e5422 / 1e5624 Eagles, gain double base Eagle gain, but divide Eagle gain by 3e35 / 3e36."
                        },
                }, // hasMilestone("e", 63)
                64: {
                        requirementDescription(){
                                return "1e6043 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e6043")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Multiply E 11 base cost by 100 and E 13 base cost by 1e20 and increase base Eagle gain by 24%."
                        },
                }, // hasMilestone("e", 64)
                65: {
                        requirementDescription(){
                                return "1e6428 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e6428")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 31 gives free E 21 levels. At 1e6503, E 31 levels halve all E buyable base costs. At 1e6563 Eagles increase base Eagle gain by 1%."
                        },
                }, // hasMilestone("e", 65)
                66: {
                        requirementDescription(){
                                return "1e6723 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e6723")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Increase E 22 base cost by 1e7 and decrease E 31 base cost by 1e137. At 1e6829, 1e6906, 1e7067, 1e7267, and 1e7765 Eagles increase base Eagle gain by 2%."
                        },
                }, // hasMilestone("e", 66)
                67: {
                        requirementDescription(){
                                return "1e7823 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e7823")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: D 32 gives free D 23 levels but divide base Duck gain by 1e210."
                        },
                }, // hasMilestone("e", 67)
                68: {
                        requirementDescription(){
                                return "1e8024 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e8024")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "Increase the multipler per Eagle milestone past 50 by 3%."
                                }
                                return "Reward: Increase the multiplier per Eagle milestone past 50 by 1% but divide Eagle gain by 1e8. At 1e8223 Eagles, reapply this but divide Eagle gain by 1e5."
                        },
                }, // hasMilestone("e", 68)
                69: {
                        requirementDescription(){
                                return "1e8142 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e8142")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "Increase the multipler per Eagle milestone past 50 by 3%."
                                }
                                return "Reward: Increase the multiplier per Eagle milestone past 50 by 1% but divide Eagle gain by 3e7. At 1e8261 Eagles, reapply this but divide Eagle gain by 5e4."
                        },
                }, // hasMilestone("e", 69)
                70: {
                        requirementDescription(){
                                return "1e8181 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e8181")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "Increase the multipler per Eagle milestone past 50 by 3%."
                                }
                                return "Reward: Increase the multiplier per Eagle milestone past 50 by 1% but divide Eagle gain by 3e7. At 1e8300 Eagles, reapply this but divide Eagle gain by 1e5."
                        },
                }, // hasMilestone("e", 70)
                71: {
                        requirementDescription(){
                                return "1e8357 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e8357")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (hasMilestone("f", 5) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 5."
                                        return "E 23 gives free E 21 levels instead of E 11 levels but divide Eagle gain by 1e40. Increase base Eagle gain by 6%."
                                }
                                return "Reward: E 23 gives free E 21 levels instead of E 11 levels but divide Eagle gain by 1e40. At 1e8401, 1e8420, 1e8461, and 1e8500 Eagles, increase base Eagle gain by 1.5%."
                        },
                }, // hasMilestone("e", 71)
                72: {
                        requirementDescription(){
                                return "1e8441 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e8441")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 31 levels past 53 increase E 22 base by .1%. At 1e8620 Eagles, increase the multiplier per Eagle milestone past 50 by 1% but divide Eagle gain by 1e16."
                        },
                }, // hasMilestone("e", 72)
                73: {
                        requirementDescription(){
                                return "1e8662 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e8662")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Gain 10x base Eagles but 1e176 less Eagles. At 1e9496 Eagles, increase the multiplier per Eagle milestone past 50 by 1% but divide Eagle gain by 1e18."
                        },
                }, // hasMilestone("e", 73)
                74: {
                        requirementDescription(){
                                return "1e9577 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e9577")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Gain 10x base Eagles but 1e190 less Eagles. At 1e9658, 1e9855 and 1e9895 Eagles, increase the multiplier per Eagle milestone past 50 by 1% but divide Eagle gain by 1e19."
                        },
                }, // hasMilestone("e", 74)
                75: {
                        requirementDescription(){
                                return "1e9818 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e9818")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Reduce base Duck gain by 1e409 and D 12 gives free D 11 levels instead of D 22. At 1e9935 and 1e9974 Eagles, increase the multiplier per Eagle milestone past 50 by 1% but divide Eagle gain by 1e20."
                        },
                }, // hasMilestone("e", 75)
                76: {
                        requirementDescription(){
                                return "1e10,018 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e10018")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 31 levels past 97 increase E 21 base by .1%. At 1e10,095 Eagles, decrease the E 31 linear base to 7.5e39. At 1e10,117, 1e10,155, 1e10,157, 1e10,277, 1e10,593, 1e11,161, and 1e11,197 Eagles, increase base Eagle gain by 1%."
                        },
                }, // hasMilestone("e", 76)
                77: {
                        requirementDescription(){
                                return "1e10,250 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e10250")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Decrease the E 31 linear base to 7e39. At 1e10,317 Eagles, each E 31 past 100 decreases E 22 and E 23 linear base by .2%, and at 1e10,354 Eagles they also double base Duck gain."
                        },
                }, // hasMilestone("e", 77)
                78: {
                        requirementDescription(){
                                return "1e11,235 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e11235")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 31 levels decrease its linear base by .1%. At 1e11,260 Eagles, double E 23 linear base cost but decrease E 31 linear base by 1e300."
                        },
                }, // hasMilestone("e", 78)
                79: {
                        requirementDescription(){
                                return "1e11,474 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e11474")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Increase base Eagle gain by 20% and increase the E 23 base cost by 1e100. At 1e11,607 and 1e11,645 Eagles, increase multiplier per Eagle milestone past 50 by 1% but decrease base Eagle gain by 24%. At 5 E 32 levels, the E 32's multiply its linear cost base by 100, increased to 4321 at 7."
                        },
                }, // hasMilestone("e", 79)
                80: {
                        requirementDescription(){
                                return "1e17,750 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e17750")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.unlocked) return "Reward: Milestones multiply Emerald gain " + makePurple(" per 1 + Finch milestones") + "."
                                return "Reward: Milestones multiply Emerald gain."
                        },
                }, // hasMilestone("e", 80)
                81: {
                        requirementDescription(){
                                return "1e41,320 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e41320")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.challenges[22] >= 1) return "Disabled by Trial by Combat."
                                return "Reward: Milestones multiply Emerald gain per Tier past 30."
                        },
                }, // hasMilestone("e", 81)
                82: {
                        requirementDescription(){
                                return "1e43,176 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e43176")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.challenges[22] >= 1) return "Disabled by Trial by Combat."
                                return "Reward: Milestones^3 multiply Emerald gain per Tier past 33."
                        },
                }, // hasMilestone("e", 82)
                83: {
                        requirementDescription(){
                                return "1e44,180 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e44180")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.challenges[22] >= 1) return "Disabled by Trial by Combat."
                                if (hasUpgrade("d", 52)) {
                                        if (player.shiftAlias) return "Improved by D<sup>2</sup>u--s."
                                        return "Reward: Milestones^2 multiply Emerald gain per Tier."
                                }
                                return "Reward: Milestones^2 multiply Emerald gain per Tier past 33."
                        },
                }, // hasMilestone("e", 83)
                84: {
                        requirementDescription(){
                                return "1e48,080 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e48080")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.challenges[22] >= 2) return "Disabled by Trial by Combat."
                                return "Reward: Milestones^3 multiply Emerald gain per Tier past 38."
                        },
                }, // hasMilestone("e", 84)
                85: {
                        requirementDescription(){
                                return "1e55,500 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e55500")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Tired Tiers gives free Miner levels."
                        },
                }, // hasMilestone("e", 85)
                86: {
                        requirementDescription(){
                                return "1e56,585 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e56585")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Tired Tiers gives free Sifter levels."
                        },
                }, // hasMilestone("e", 86)
                87: {
                        requirementDescription(){
                                return "1e64,646 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e64646")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                if (player.f.challenges[22] >= 2) return "Disabled by Trial by Combat."
                                return "Reward: Milestones^4 multiply Emerald gain per Tier past 56."
                        },
                }, // hasMilestone("e", 87)
                88: {
                        requirementDescription(){
                                return "1e67,865 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e67865")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Halve Faster Sifter cost base and Tired Tiers linear base per Tier past 57."
                        },
                }, // hasMilestone("e", 88)
                89: {
                        requirementDescription(){
                                return "1e73,340 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e73340")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each Tier past 50 divides E 33's linear base by 10."
                        },
                }, // hasMilestone("e", 89)
                90: {
                        requirementDescription(){
                                return "1e102,140 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e102140")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: E 33 levels and Tiers subtract .001 from the Tired Tiers quadratic cost base (max 1000/700)."
                        },
                }, // hasMilestone("e", 90)
                91: {
                        requirementDescription(){
                                return "1e109,145 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e109145")
                        },
                        unlocked(){
                                return true
                        },
                        effect(){
                                let p = .2
                                let t = new Decimal(1).plus(player.T.points.sub(94).max(0).min(9))

                                if (player.T.points.gte(95)) p += .05
                                if (player.T.points.gte(98)) p += .05

                                return t.times(p)
                        },
                        effectDescription(){
                                let ret = "Reward: Subtract .2 effective Tier, reapply this at Tiers 95 through 103. At Tier 95 and 98 increase the per application effect by .05 ."
                                return ret + br + "Currently: " + format(tmp.e.milestones[91].effect)
                        },
                }, // hasMilestone("e", 91)
                92: {
                        requirementDescription(){
                                return "1e158,100 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e158100")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Milestones^(Milestones<sup>2/3</sup>) multiply Emerald gain per Tier past 109."
                        },
                }, // hasMilestone("e", 92)
                93: {
                        requirementDescription(){
                                return "1e183,130 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e183130")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Add (Tiers - 120) * .001 to the Tired Tiers base (max +.05) add you only lose 20 of each Emerald buyable on Tier."
                        },
                }, // hasMilestone("e", 93)
                94: {
                        requirementDescription(){
                                return "1e740,000 Eagles"
                        },
                        done(){
                                return player.e.points.gte("1e740e3")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove all Eagle buyables' base costs."
                        },
                }, // hasMilestone("e", 94)
                95: {
                        requirementDescription(){
                                return "2e2,222,222 Eagles"
                        },
                        done(){
                                return player.e.points.gte("2e2222222")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Above 222 Tiers you always have exactly one second of Emerald production (disabled in Finch challenges). Permanently cap Filter 'per' amount to 123 outside of challenges."
                        },
                }, // hasMilestone("e", 95)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("e") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Eagles is " + format(player.e.best) : "You have done " + formatWhole(player.e.times) + " Eagle resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("e")) {
                                                        if (player.shiftAlias) return "Eagle gain formula is " + getGeneralizedPrestigeButtonText("e")
                                                        return "You are gaining " + format(tmp.e.getResetGain) + " Eagles per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.e.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("e")) return "You are gaining " + format(tmp.e.getResetGain) + " Eagles per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("e", 22) || player.f.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.e.times) + " Eagle resets"
                                        }
                                ],
                                "milestones"
                        ],
                        unlocked(){
                                return player.e.times > 0 || player.f.unlocked
                        },
                },
        },
        onPrestige(gain){
                player.e.times += player.f.best.gt(0) ? 3 : 1
        },
        doReset(layer){
                let data = player.e
                if (layer == "e") data.time = 0
                if (!getsReset("e", layer)) return
                
                data.times = hasMilestone("f", 2) ? Math.min(data.times, player.f.times) : 0

                if (!false/*player.i.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (hasMilestone("f", 4)) keptUpgrades += player.f.times
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!false/*player.h.unlocked*/) { //milestones
                        let keptMilestones = 0
                        if (hasMilestone("f", 3)) keptMilestones += player.f.times
                        if (hasMilestone("f", 8)) keptMilestones += player.f.times
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("f", {
        name: "Finch", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 5, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
        }},
        color: "#D16FA9",
        branches: ["e"],
        requires: new Decimal("1e293000"), // Can be a function that takes requirement increases into account
        resource: "Finches", // Name of prestige currency
        baseResource: "Eagles", // Name of resource prestige is based on
        baseAmount() {return player.e.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let ret = getGeneralizedPrestigeGain("f")

                return ret
        },
        getBaseDiv(){
                return new Decimal("1e93000")
        },
        getGainExp(){
                let ret = new Decimal(2)

                if (hasUpgrade("f", 12))        ret = ret.plus(Math.max(0, player.f.challenges[12]-10) * .2)
                                                ret = ret.plus(CURRENT_BUYABLE_EFFECTS["f11"])

                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.0001) // 10^-4

                if (hasMilestone("E", 7)) {
                        ret = ret.times(Decimal.pow(1.01, player.T.points.min(777)))
                        ret = ret.times(Decimal.pow(1.01, player.T.points.sub(777).max(0).div(2)))
                }
                let exp = new Decimal(hasChallenge("f", 22) ? 60 : layerChallengeCompletions("f"))
                exp = exp.plus(tmp.T.buyables[22].effect)
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["f13"].pow(exp))
                if (hasMilestone("E", 10)) {
                        if (player.f.points.gte("4e44444"))     ret = ret.times(.98)
                        if (player.f.points.gte("1e48000"))     ret = ret.times(.955)
                }
                
                return ret
        },
        getGainMultPost(){
                let ret = getGeneralizedInitialPostMult("f").div(400)

                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["f12"])

                if (hasMilestone("f", 7))       ret = ret.times(Decimal.pow(1.05, player.T.points.sub(tmp.f.milestones[7].start).max(0)))
                if (hasUpgrade("e", 31))        ret = ret.times(Decimal.pow(1.1, player.e.upgrades.length).pow(layerChallengeCompletions("f")))
                if (hasUpgrade("f", 22))        ret = ret.div(1e84)

                return ret
        },
        effect(){
                if (!isPrestigeEffectActive("f") || player.f.points.lt(1)) return decimalOne

                let amt = player.f.points

                let exp1 = amt.max(10).log10()

                let exp = exp1.times(exp1.pow(2).min(400)).min(7e4)
                if (player.f.challenges[22] == 0) exp = exp.times(CURRENT_BUYABLE_EFFECTS["f13"])

                let ret = amt.plus(1).pow(exp)

                return ret
        },
        effectDescription(){
                return getGeneralizedEffectDisplay("f")
        },
        getNextAt(){
                return getGeneralizedNextAt("f")
        },
        update(diff){
                let data = player.f

                if (tmp.f.getResetGain.gt(0)) data.unlocked = true

                data.best = data.best.max(data.points)
                doPassiveGain("f", diff)
                if (hasMilestone("f", 11)) {
                        if (player.f.points.div(tmp.f.getResetGain.max(1)).lte(20)) {
                                player.f.points = player.f.points.max(tmp.f.getResetGain.max(1).times(20))
                        }
                }
                
                if (false) {
                        handleGeneralizedBuyableAutobuy(diff, "f")
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        layerShown(){return player.T.best.gte(145) || player.f.unlocked},
        prestigeButtonText(){
                if (isPassiveGainActive("f")) return ""
                return getGeneralizedPrestigeButtonText("f")
        },
        canReset(){
                return player.f.time >= 2 && !isPassiveGainActive("f") && tmp.f.getResetGain.gt(0)
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>F-nch"
                        },
                        description(){
                                let a = "Finch challenges reduce Miner linear cost base by .02"
                                return a
                        },
                        cost: new Decimal(1e13),
                        unlocked(){
                                return layerChallengeCompletions("f") >= 11 //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Fi-ch"
                        },
                        description(){
                                let a = "Passive Gain completions past 10 divide Sieve base cost by Finches and add .2 to the Finch gain exponent"
                                return a
                        },
                        cost: new Decimal(2.7e27),
                        unlocked(){
                                return layerChallengeCompletions("f") >= 36 //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>F--ch"
                        },
                        description(){
                                let a = "Above 456 Tiers Miner gives free Faster Sifter levels but Miner base is 1"
                                return a
                        },
                        cost: new Decimal(1e243),
                        unlocked(){
                                return layerChallengeCompletions("f") >= 40 //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Fin-h"
                        },
                        description(){
                                if (player.shiftAlias) return "The F 12 reduction is every third after 1500"
                                let a = "Zero miners and change their formula. Add .4 to its base. Tenth F 12 base cost per F 13"
                                return a
                        },
                        onPurchase(){
                                player.E.buyables[21] = decimalZero
                        },
                        cost: new Decimal("1e8081"),
                        unlocked(){
                                return layerChallengeCompletions("f") >= 60 //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>F-n-h"
                        },
                        description(){
                                let a = "Add .293 to Faster Sifter base and .0001 to the Sieve base per Tier - 1500"
                                return a
                        },
                        cost: new Decimal("1e13992"),
                        unlocked(){
                                return hasUpgrade("f", 14) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Fi--h"
                        },
                        description(){
                                let a = "Multiply quick/fast effect by 10/5, but disable Eagle milestone 92"
                                return a
                        },
                        cost: new Decimal("1e23141"),
                        unlocked(){
                                return hasUpgrade("f", 15) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>F---h"
                        },
                        description(){
                                let a = "Tiers past 950 subtract from Rank I addition and divide Finch gain by 1e84"
                                return a
                        },
                        cost: new Decimal("1e41951"),
                        unlocked(){
                                return hasUpgrade("f", 21) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>Finc-"
                        },
                        description(){
                                let a = "E 23 gives free E 22 instead of E 12 levels but increase F 11 / Sieve linear cost base by .119 / 11"
                                return a
                        },
                        onPurchase(){
                                player.E.buyables[31] = decimalZero
                        },
                        cost: new Decimal("1e50886"),
                        unlocked(){
                                return hasUpgrade("f", 22) //|| player.g.unlocked
                        }, 
                }, // hasUpgrade("f", 23)
        },
        buyables: getLayerGeneralizedBuyableData("f", [
                        function(){
                                return player.f.challenges[12] >= 13 //|| player.g.unlocked
                        },
                        function(){
                                return player.f.challenges[12] >= 19 //|| player.g.unlocked
                        },
                        function(){
                                return player.f.challenges[12] >= 23 //|| player.g.unlocked
                        },
                ]),
        milestones: {
                1: {
                        requirementDescription(){
                                return "1 Finch reset"
                        },
                        done(){
                                return player.f.times >= 1
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Multiply previous middle column buyables' bases by 1.01 and double and square Duck bulk amount."
                        },
                }, // hasMilestone("f", 1)
                2: {
                        requirementDescription(){
                                return "2 Finch resets"
                        },
                        done(){
                                return player.f.times >= 2
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep an Eagle reset, square Eagle buyable bulk amount, and per Eagle milestone or E 33 level reduce the Duck and first 8 Eagle buyable linear cost bases by 1%."
                        },
                }, // hasMilestone("f", 2)
                3: {
                        requirementDescription(){
                                return "4 Finches"
                        },
                        done(){
                                return player.f.points.gte(4)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per reset keep an Eagle milestone and double Emerald and Eagle autobuyers' speed and bulk amount. Buy all Emerald buyables at once."
                        },
                }, // hasMilestone("f", 3)
                4: {
                        requirementDescription(){
                                return "8 Finches"
                        },
                        done(){
                                return player.f.points.gte(8)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Autobuy Tiers, gain 1e10x Duck, and Filter base cost is 1. Per reset keep an Emerald and Ealge upgrade and divide E 33 base cost by 10^Finches."
                        },
                }, // hasMilestone("f", 4)
                5: {
                        requirementDescription(){
                                return "16 Finches"
                        },
                        done(){
                                return player.f.points.gte(16)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep Emerald milestones on Tier reset and Finch resets + 1 multiply Emerald and Eagle bulk amount and keep their autobuyers. Improve many Eagle milestones."
                        },
                }, // hasMilestone("f", 5)
                6: {
                        requirementDescription(){
                                return "32 Finches"
                        },
                        done(){
                                return player.f.points.gte(32)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Eagle Milestone 91 and Emerald Milestone no longer affect effective Tiers. Multiply Tired Tier base by 1.5/1.01 (~1.49)."
                        },
                }, // hasMilestone("f", 6)
                7: {
                        requirementDescription(){
                                return "E 33 base cost below 64"
                        },
                        done(){
                                return getBuyableBases("e", 33)[0].lte(64)
                        },
                        unlocked(){
                                return true
                        },
                        effectPer(){
                                let e = getBuyableAmount("e", 33)
                                if (e.gte(3025)) e = e.times(3025**3).root(4).min(1e5)
                                return Decimal.pow(1.05, e)
                        },
                        start(){
                                let r = 170
                                if (hasUpgrade("e", 32)) r -= player.f.challenges[11]
                                if (hasUpgrade("d", 52)) r -= player.f.challenges[12]
                                return r
                        },
                        effectDescription(){
                                if (hasUpgrade("e", 32)) {
                                        if (player.shiftAlias) return "Improved by Eag--: starts one Tier earlier per Active Tiers completion."
                                        return "Reward: Tiers past " + tmp.f.milestones[7].start + " increase Finch gain by 5% and Emerald and Eagle gain by 5% per E 33 level (softcap at 3000).<br>Currently: x" + format(tmp.f.milestones[7].effectPer) + " per Tier."
                                }
                                return "Reward: Tiers past 170 increase Finch gain by 5% and Emerald and Eagle gain by 5% per E 33 level (softcap at 3000).<br>Currently: x" + format(tmp.f.milestones[7].effectPer) + " per Tier."
                        },
                }, // hasMilestone("f", 7)
                8: {
                        requirementDescription(){
                                return "128 Finches"
                        },
                        done(){
                                return player.f.points.gte(128)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Keep a Tier upgrade, Tier milestone, and Eagle milestone per reset. Double Duck and Eagle bulk amount and speed. Improve more milestones."
                        },
                }, // hasMilestone("f", 8)
                9: {
                        requirementDescription(){
                                return "1024 Finches"
                        },
                        done(){
                                return player.f.points.gte(1024)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Remove the ability to Finch prestige, gain 100% of your Finch gained on reset per second, and gain one Finch reset per second."
                        },
                }, // hasMilestone("f", 9)
                10: {
                        requirementDescription(){
                                return "1.80e308 Finches"
                        },
                        done(){
                                return player.f.points.gte(Decimal.pow(2, 1024))
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Per Tier past 500 add .001 to Miner's base and make it apply per Finch challenge but increase F 11 linear cost base by .1 ."
                        },
                }, // hasMilestone("f", 10)
                11: {
                        requirementDescription(){
                                return "1e512 Finches"
                        },
                        done(){
                                return player.f.points.gte("1e512")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: You always have at least 20 seconds of Finch production and subtract 1 from the Passive Gain goal."
                        },
                }, // hasMilestone("f", 11)
                12: {
                        requirementDescription(){
                                return "1e5530 Finches"
                        },
                        done(){
                                return player.f.points.gte("1e5530")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Subtract .1 from the Sieve base, E 32 gives free E 31 levels, and Sieve gives free Miner levels."
                        },
                }, // hasMilestone("f", 12)
                13: {
                        requirementDescription(){
                                return "1e9869 Finches"
                        },
                        done(){
                                return player.f.points.gte("1e9869")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Better Everything levels tenth F 11's base cost and its effect is multiplied by Finch upgrades."
                        },
                }, // hasMilestone("f", 13)
                14: {
                        requirementDescription(){
                                return "1e33,972 Finches"
                        },
                        done(){
                                return player.f.points.gte("1e33972")
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Subtract 1 from Sieve's linear cost base and F 13 always divides F 12 base cost."
                        },
                }, // hasMilestone("f", 14)
        },
        challenges: {
                11: {
                        name: "Active Tiers",
                        goal(){
                                let id = player.f.challenges[11]
                                let x = [
                                        200, 200, 200, 200, 200, 
                                        209, 200, 211, 207, 201, 
                                        203, 200, 203, 200, 202, 
                                        200, 200, 202, 200, 203, 
                                        202, 201, 200, 202, 201, 
                                        ]
                                return new Decimal(x[id])
                        },
                        canComplete: () => player.T.points.gte(tmp.f.challenges[11].goal),
                        fullDisplay(){
                                let a = "Add " + (player.f.challenges[11] + 1) + " effective Tiers" + br 
                                if (hasMilestone("T", 15)) a = "Increase effective Tiers by " + ((player.f.challenges[11] + 1)/2) + "%<br>"
                                a += "Goal: " + formatWhole(tmp.f.challenges[11].goal) + " Tiers" + br2
                                a += "Reward: Add " + format(tmp.f.challenges[11].rewardEffect, 3) + br
                                a += "to Tired Tier's base."+br
                                return a + br2 + "Completions: " + player.f.challenges[11] + "/25"
                        },
                        rewardEffect(){
                                return new Decimal(player.f.challenges[11] / 200)
                        },
                        onEnter(){
                                player.T.milestones = filter(player.T.milestones, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
                                player.T.upgrades = filter(player.T.upgrades, [11,12,13,14,15,21,22,25])
                                player.E.milestones = filter(player.E.milestones, [1,2,3,4,5,6])
                                player.E.upgrades = filter(player.E.upgrades, [11,12,13,14,15,21])
                        },
                        unlocked(){
                                return true
                        },
                        countsAs: [],
                        completionLimit: 25,
                }, // inChallenge("f", 11)
                12: { // 17-7 to 17-8, 23-9 to 23-10
                        name: "Passive Gain",
                        goal(){
                                let id = player.f.challenges[12]
                                let x = [
                                        225, 255, 251, 257, 271, 
                                        271, 272, 277, 278, 284, 
                                        285, 285, 286, 294, 307, 
                                        373, 408, 410, 414, 415, 
                                        414, 411, 416, 420, 417, 
                                        1
                                        ]
                                let ret = new Decimal(x[id])
                                if (hasMilestone("f", 11)) ret = ret.sub(1)
                                return ret
                        },
                        canComplete: () => player.T.points.gte(tmp.f.challenges[12].goal),
                        fullDisplay(){
                                let a = "Root Emerald gain by " + format(player.f.challenges[12]/100 + 1.01) + br 
                                a += "Goal: " + formatWhole(tmp.f.challenges[12].goal) + " Tiers" + br2
                                a += "Reward: Multiply base Eagle gain "
                                if (player.f.challenges[12] >= 22) a += "and Duck buyable limit "
                                a += "by " + formatWhole(tmp.f.challenges[12].rewardEffect, 3)
                                a += " and subtract " + format(player.f.challenges[12] * .36) + " from the Lazy Tiers linear base"
                                return a + br2 + "Completions: " + player.f.challenges[12] + "/25"
                        },
                        rewardEffect(){
                                return Decimal.pow(10, player.f.challenges[12])
                        },
                        onEnter(){
                                player.T.milestones = filter(player.T.milestones, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
                                player.T.upgrades = filter(player.T.upgrades, [11,12,13,14,15,21,22,25])
                                player.E.milestones = filter(player.E.milestones, [1,2,3,4,5,6])
                                player.E.upgrades = filter(player.E.upgrades, [11,12,13,14,15,21])
                        },
                        unlocked(){
                                return player.f.challenges[11] >= 1
                        },
                        countsAs: [],
                        completionLimit: 25,
                }, // inChallenge("f", 12)
                21: {
                        name: "Only Finch",
                        goal(){
                                let id = player.f.challenges[21]
                                let x = [
                                        321, 350, 397, 419, 449, 
                                        484, 517, 551, 567, 575, 
                                        //999, 285, 286, 555, 400, 
                                        ]
                                return new Decimal(x[id])
                        },
                        canComplete: () => player.T.points.gte(tmp.f.challenges[21].goal),
                        fullDisplay(){
                                let a = "Eagle gain is Finch effect"
                                if (player.f.challenges[21] >= 4) a += "<sup>3/" + player.f.challenges[21] + "</sup>"
                                a += br + "Goal: " + formatWhole(tmp.f.challenges[21].goal) + " Tiers" + br2
                                a += "Reward: Tiers add " + format(player.f.challenges[21]/10000,4) + " to the<br>Sieve base"
                                a += " and keep all but " + formatWhole(100 - 2 * player.f.challenges[21]) + " Tiers (outside of challenges)"
                                return a + br2 + "Completions: " + player.f.challenges[21] + "/10"
                        },
                        onEnter(){
                                player.T.milestones = filter(player.T.milestones, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
                                player.T.upgrades = filter(player.T.upgrades, [11,12,13,14,15,21,22,25])
                                player.E.milestones = filter(player.E.milestones, [1,2,3,4,5,6])
                                player.E.upgrades = filter(player.E.upgrades, [11,12,13,14,15,21])
                        },
                        unlocked(){
                                return player.f.challenges[12] >= 13
                        },
                        countsAs: [],
                        completionLimit: 10,
                }, // inChallenge("f", 21)
                22: {
                        name: "Trial by Combat",
                        goal(){
                                let id = player.f.challenges[22]
                                let x = [
                                        318, 313, 999, 419, 449, 
                                        484, 517, 551, 567, 575, 
                                        //999, 285, 286, 555, 400, 
                                        ]
                                return new Decimal(x[id])
                        },
                        canComplete: () => player.T.points.gte(tmp.f.challenges[22].goal),
                        fullDisplay(){
                                let a = "All previous challenges"
                                a += br + "Goal: " + formatWhole(tmp.f.challenges[22].goal) + " Tiers" + br2
                                a += "Reward: F 13's effect is nerfed and disable Eagle Milestones 81, 82, and 83."
                                if (player.f.challenges[22] >= 2) a = a.replace("and 83", "83, 84, and 87")
                                return a + br2 + "Completions: " + player.f.challenges[22] + "/2"
                        },
                        onEnter(){
                                player.T.milestones = filter(player.T.milestones, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
                                player.T.upgrades = filter(player.T.upgrades, [11,12,13,14,15,21,22,25])
                                player.E.milestones = filter(player.E.milestones, [1,2,3,4,5,6])
                                player.E.upgrades = filter(player.E.upgrades, [11,12,13,14,15,21])
                        },
                        unlocked(){
                                return hasUpgrade("T", 24) || player.T.best.gte(835)
                        },
                        countsAs: [11,12,21],
                        completionLimit: 2,
                }, // inChallenge("f", 22)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return isPassiveGainActive("f") ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                return shiftDown ? "Your best Finches is " + format(player.f.best) : "You have done " + formatWhole(player.f.times) + " Finch resets"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("f")) {
                                                        if (player.shiftAlias) return "Finch gain formula is " + getGeneralizedPrestigeButtonText("f")
                                                        return "You are gaining " + format(tmp.f.getResetGain) + " Finches per second"
                                                }
                                                return "There is a two second cooldown for prestiging (" + format(Math.max(0, 2-player.f.time)) + ")" 
                                        },
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("f")) return "You are gaining " + format(tmp.f.getResetGain) + " Finches per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return player.f.challenges[12] >= 13 //|| player.g.unlocked
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You have done " + formatWhole(player.f.times) + " Finch resets"
                                        }
                                ],
                                "milestones"
                        ],
                        unlocked(){
                                return player.f.times > 0 //|| player.g.unlocked
                        },
                },
                "Challenges": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                if (isPassiveGainActive("f")) return "You are gaining " + format(tmp.f.getResetGain) + " Finches per second"
                                                return ""
                                        },
                                ],
                                "challenges"
                        ],
                        unlocked(){
                                return player.T.best.gte(218) || inChallenge("f", 11) || player.f.challenges[11] >= 1 //|| player.g.unlocked 
                        },
                },
                "Info": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                let a = "Finch resests all prior resources including Tiers and Emeralds.<br><br>The Finch multiplier affects Emerald gain up to 1e100x.<br>Check the Capybara info tab for updated boosts."
                                                if (layerChallengeCompletions("f") < 5) return a
                                                return a + br2 + "If above 5 completions of a challenge,<br>max out Emerald gain at 10 seconds of production."
                                        }
                                ],
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        onPrestige(gain){
                player.f.times += /*player.g.best.gt(0)*/ false ? 3 : 1
        },
        doReset(layer){
                let data = player.f
                if (layer == "f") data.time = 0
                if (!getsReset("f", layer)) return
                
                data.times = 0

                if (!false/*player.j.unlocked*/) { //upgrades
                        let keptUpgrades = 0
                        if (false) keptUpgrades += 0
                        if (!false) {
                                data.upgrades = data.upgrades.slice(0, keptUpgrades)
                        }
                }

                if (!false/*player.i.unlocked*/) { //milestones
                        let keptMilestones = 0
                        if (false) keptMilestones += 0
                        if (!false) {
                                data.milestones = data.milestones.slice(0, keptMilestones)
                        }
                }

                //resources
                data.points = decimalZero
                data.total = decimalZero
                data.best = decimalZero

                //buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = decimalZero
                }
        },
})

addLayer("ach", {
        name: "Achievements",
        symbol: "⭑", 
        position: 1,
        startData(){ return {
                unlocked: true,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                hiddenRows: 0,
                clickedYeet: 0,
                completedRows: 0,
        }},
        color: "#FFC746",
        branches: [],
        requires: decimalZero,
        resource: "Achievements",
        baseResource: "points",
        baseAmount(){return decimalZero},
        type: "none",
        update(diff){
                let data = player.ach
                data.points = new Decimal(data.achievements.length).max(data.points)
                data.best = data.best.max(data.points)
                if (hasCompletedFirstNRows(player.ach.completedRows + 1)){
                        player.ach.completedRows ++
                }
        },
        row: "side",
        hotkeys: [
                {
                        key: "THIS SHOULD NOT BE POSSIBLE",
                        description: makeBlue("<b>Generally applicable</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                },
                {key: "Control+C", description: "Control+C: Go to changelog", onPress(){
                                showTab("changelog-tab")
                        }
                },
                {key: ",", description: ",: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: ".", description: ".: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "ArrowLeft", description: "Left Arrow: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                if (!player.arrowHotkeys) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: "ArrowRight", description: "Right Arrow: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                if (!player.arrowHotkeys) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "shift+<", description: "Shift+,: Move all the way to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[0]
                        }
                },
                {key: "shift+>", description: "Shift+.: Move all the way to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[k.length-1]
                        }
                },
                {key: "Control+S", description: "Control+S: Save", 
                        onPress(){
                                save()
                        }
                },
                {key: "shift+Control+S", description: "Shift+Control+S: Save", 
                        onPress(){
                                save()
                        }
                },
                {key: "shift+Control+E", description: "Shift+Control+E: Force endgame",
                        onPress(){ // forces the endgame screen to pop up 
                                forceEndgame = true
                                player.keepGoing = false
                        }
                },
                {key: " ", description: "Space: Toggle Pause", 
                        onPress(){
                                if (player.spaceBarPauses) player.paused = !player.paused
                        }
                },
                {
                        key: "THIS SHOULD NOT BE POSSIBLE2",
                        description: br + makeBlue("<b>Jump to locations</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                },
                {key: "shift+!", description: "Shift+1: Go to achievements", 
                        onPress(){
                                player.tab = "ach"
                        }
                },
                {key: "shift+A", description: "Shift+A: Go to Alligator", 
                        onPress(){
                                if (player.a.unlocked) player.tab = "a"
                        }
                },
                {key: "shift+B", description: "Shift+B: Go to Beaver", 
                        onPress(){
                                if (player.b.unlocked) player.tab = "b"
                        },
                        unlocked(){
                                return player.b.unlocked
                        }
                },
                {key: "shift+C", description: "Shift+C: Go to Capybara", 
                        onPress(){
                                if (player.c.unlocked) player.tab = "c"
                        },
                        unlocked(){
                                return player.c.unlocked
                        }
                },
                {key: "shift+D", description: "Shift+D: Go to Duck", 
                        onPress(){
                                if (player.d.unlocked) player.tab = "d"
                        },
                        unlocked(){
                                return player.d.unlocked
                        }
                },
                {key: "shift+E", description: "Shift+E: Go to Eagle", 
                        onPress(){
                                if (player.e.unlocked) player.tab = "e"
                        },
                        unlocked(){
                                return player.e.unlocked
                        }
                },
                {key: "shift+F", description: "Shift+F: Go to Finch", 
                        onPress(){
                                if (player.f.unlocked) player.tab = "f"
                        },
                        unlocked(){
                                return player.f.unlocked
                        }
                },
                {
                        key: "THIS SHOULD NOT BE POSSIBLE3",
                        description: br + makeBlue("<b>Prestige</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                        unlocked(){
                                return true
                        },
                },
                {key: "a", description: "A: Go to Alligators",
                        onPress(){
                                if (canReset("a")) doReset("a")
                        }
                },
                {key: "b", description: "B: Reset for Beavers",
                        onPress(){
                                if (canReset("b")) doReset("b")
                        },
                        unlocked(){
                                return player.b.unlocked
                        }
                },
                {key: "c", description: "C: Reset for Capybaras",
                        onPress(){
                                if (canReset("c")) doReset("c")
                        },
                        unlocked(){
                                return player.c.unlocked
                        }
                },
                {key: "d", description: "D: Reset for Ducks",
                        onPress(){
                                if (canReset("d")) doReset("d")
                        },
                        unlocked(){
                                return player.d.unlocked
                        }
                },
                {key: "e", description: "E: Reset for Eagles",
                        onPress(){
                                if (canReset("e")) doReset("e")
                        },
                        unlocked(){
                                return player.e.unlocked
                        }
                },
                {key: "f", description: "F: Reset for Finches",
                        onPress(){
                                if (canReset("f")) doReset("f")
                        },
                        unlocked(){
                                return player.f.unlocked
                        }
                },
                {
                        key: "THIS SHOULD NOT BE POSSIBLE4",
                        description: br + makeBlue("<b>Other</b>:"),
                        onPress(){
                                console.log("oops something went really badly wrong")
                        },
                        unlocked(){
                                return true
                        },
                },
                {key: "Control+T", description: "Control+T: Reset for Tier",
                        onPress(){
                                if (canReset("T")) doReset("T")
                        },
                        unlocked(){
                                return player.T.unlocked
                        }
                },
        ],
        layerShown(){return true},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        achievements: getFirstNAchData(Object.keys(PROGRESSION_MILESTONES).length),
        clickables: {
                rows: 1,
                cols: 3,
                11: {
                        title(){
                                return "<h3 style='color: #0033FF'>Hide the top row</h3>"
                        },
                        display(){
                                return "Shift: Hides top layers until an unfinished layer"
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                if (player.shiftAlias) return true
                                return player.ach.hiddenRows < Object.keys(PROGRESSION_MILESTONES).length/7
                        },
                        onClick(){
                                if (!this.canClick()) return
                                if (!player.shiftAlias) {
                                        player.ach.hiddenRows ++
                                        return
                                }
                                player.ach.hiddenRows = 0
                                let b = 0
                                while (hasCompletedFirstNRows(player.ach.hiddenRows + 1)) {
                                        b ++ 
                                        player.ach.hiddenRows ++
                                        if (b > 1000) {
                                                console.log('uh oh')
                                                return
                                        }
                                }
                        },
                },
                12: {
                        title(){
                                return "<h3 style='color: #0033FF'>Show a row</h3>"
                        },
                        display(){
                                return "Shift: Show all rows"
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return player.ach.hiddenRows > 0
                        },
                        onClick(){
                                if (!this.canClick()) return
                                if (player.shiftAlias) player.ach.hiddenRows = 0
                                else player.ach.hiddenRows --
                        },
                },
                13: {
                        title(){
                                return "<h3 style='color: #0033FF'>Click</h3>"
                        },
                        display(){
                                return formatWhole(player.ach.clickedYeet) + (player.ach.clickedYeet == 69 ? " nice" : "")
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.ach.clickedYeet ++ 
                        },
                },
        },
        tabFormat: {
                "Achievements": {
                        content: [
                                "main-display-goals",
                                "clickables",
                                ["display-text",function(){
                                        return "You have completed the first " + formatWhole(player.ach.completedRows) + " rows"
                                }],
                                "achievements",
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){
                
        },
})

addLayer("E", {
        name: "Emerald", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "Em", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 3, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalZero,
                best: decimalZero,
                total: decimalZero,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                tier: decimalOne,
        }},
        color: "#3CED20",
        branches: [],
        requires: new Decimal("1e13500"), // Can be a function that takes requirement increases into account
        resource(){
                return "Emerald " + romanize(player.E.tier)
        }, // Name of prestige currency
        tooltip(){
                if (player.T.points.gte(500) && !player.shiftAlias) return format(player.E.points) + " / " + format(tmp.T.nextAtDisp)
                return format(player.E.points) + " / " + format(tmp.T.nextAtDisp) + " " + tmp.E.resource
        },
        baseResource: "Eagles", // Name of resource prestige is based on
        baseAmount() {return player.e.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        resetsNothing: true,
        getResetGain() {
                if (player.e.best.lt("1e13500")) return decimalZero

                let ret = tmp.E.getGainMultPre.pow(tmp.E.getGainExp).times(tmp.E.getGainMultPost)

                if (inChallenge("f", 12)) ret = ret.root(player.f.challenges[12]/100 + 1.01)

                return ret
        },
        getNextAt(){
                return decimalOne
        },
        getGainExp(){
                let div = new Decimal(1)
                let tier = player.T.points //player.E.tier

                if (inChallenge("f", 11)) {
                        if (hasMilestone("T", 15)) tier = tier.times(1.005 + player.f.challenges[11]/200)
                        else tier = tier.plus(1 + player.f.challenges[11])
                }

                tier = tier.sub(CURRENT_BUYABLE_EFFECTS["E13"])
                tier = tier.sub(CURRENT_BUYABLE_EFFECTS["E22"])
                tier = tier.sub(tmp.T.buyables[21].effect)
                if (!hasMilestone("f", 6)) {
                        if (hasMilestone("E", 3))       tier = tier.sub(.5)
                        if (hasMilestone("e", 91))      tier = tier.sub(tmp.e.milestones[91].effect)
                }

                tier = tier.max(0)

                if (!hasMilestone("T", 6) || tier.lte(16)) {
                        div = div.plus(tier.div(10).pow(2))
                }
                else    div = div.plus(tier.pow(1.5).div(25))

                return div.pow(-1)
        },
        getGainWeights(layer){
               return {
                        "a": .001,
                        "b": .002,
                        "c": .005,
                        "d": .01,
                        "e": .02,
                        "f": 1,
                }[layer]
        },
        getInitialGain(){
                let ret = decimalOne
                let layersCurrent = ["a", "b", "c", "d", "e",]
                let calcLayerWeight = function(amt){
                        return amt.max(0).plus(10).log10().pow(.1).min(Decimal.pow(2, 1024))
                }
                for (j in layersCurrent){
                        i = layersCurrent[j]
                        ret = ret.times(calcLayerWeight(player[i].points).pow(layers.E.getGainWeights(i)))
                }
                return ret
        },
        getGainMultPre(){
                let ret = new Decimal(.1)

                ret = ret.times(tmp.E.getInitialGain)
                ret = ret.times(tmp.f.effect.min(1e100))

                ret = ret.times(CURRENT_BUYABLE_EFFECTS["E11"])
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["E21"].pow(hasMilestone("f", 10) ? layerChallengeCompletions("f") : 1))
                let exp = player.E.milestones.length + player.T.milestones.length + player.e.milestones.length + player.f.milestones.length
                if (exp > 123) {
                        if (!player.f.activeChallenge) exp = 123
                        else if (player.f.activeChallenge == 21) exp = 123
                        else if (canCompleteChallenge("f", player.f.activeChallenge)) exp = 123
                }
                ret = ret.times(CURRENT_BUYABLE_EFFECTS["E23"].pow(exp))
                
                if (hasMilestone("T", 2)) ret = ret.times(Decimal.pow(3, player.T.milestones.length))
                if (hasMilestone("T", 3)) ret = ret.times(Decimal.pow(4, getBuyableAmount("e", 32).sub(player.T.points.gte(25) ? 0 : 21).max(0).min(1500)))
                if (hasMilestone("T", 4) && !hasUpgrade("E", 21)) {
                        ret = ret.times(Decimal.pow(6, player.E.points.max(1e15).log10().floor().sub(player.T.points.gte(24) ? 0 : 15)))
                }
                if (hasMilestone("T", 9)) {
                        let exp = player.T.milestones.length
                        if (player.T.points.gte(28)) exp *= player.T.upgrades.length ** .7
                        ret = ret.times(Decimal.pow(player.T.points.max(1), exp))
                }
                if (hasMilestone("T", 10) && player.T.points.gte(29) && player.E.points.gte(player.T.points.gte(30) || player.f.unlocked ? 0 : 1e57)) {
                        if (player.f.unlocked)  ret = ret.times(getBuyableAmount("e", 12).plus(getBuyableAmount("e", 11)).max(1))
                        else                    ret = ret.times(getBuyableAmount("e", 11).max(1))
                }
                if (hasMilestone("T", 14)) {
                        ret = ret.times(Decimal.pow(1e95, player.T.points.min(104)))
                        if (player.T.points.eq(105)) ret = ret.times(1e15)
                        if (player.T.points.eq(106)) ret = ret.times(1e30)
                }

                if (hasUpgrade("T", 23))        ret = ret.div(Decimal.pow(2, layerChallengeCompletions("f")**2).pow(player.T.points.min(580)))

                if (hasMilestone("E", 1))       ret = ret.div(Decimal.pow(player.T.points.gte(12) ? 5 : 2, player.T.points.min(player.T.points.gte(13) ? 0 : 7)))

                if (hasUpgrade("E", 13))        ret = ret.times(Decimal.pow(7, player.E.upgrades.length - 2).max(1))
                if (hasUpgrade("E", 15))        ret = ret.div(hasUpgrade("E", 12) ? 1e10 : 1e40)

                if (hasMilestone("e", 80))      ret = ret.times(Decimal.pow(player.e.milestones.length, 1 + player.f.milestones.length))
                if (hasMilestone("e", 81) && player.f.challenges[22] < 1)      ret = ret.div(Decimal.pow(player.e.milestones.length, player.T.points.min(30)))
                if (hasMilestone("e", 82) && player.f.challenges[22] < 1)      ret = ret.div(Decimal.pow(player.e.milestones.length, player.T.points.min(33).times(3)))
                if (hasMilestone("e", 83) && !hasUpgrade("d", 52) && player.f.challenges[22] < 1) {
                        ret = ret.div(Decimal.pow(player.e.milestones.length, player.T.points.min(33).times(2)))
                }
                if (hasMilestone("e", 84) && player.f.challenges[22] < 2)      ret = ret.div(Decimal.pow(player.e.milestones.length, player.T.points.min(38).times(3)))
                if (hasMilestone("e", 87) && player.f.challenges[22] < 2)      ret = ret.div(Decimal.pow(player.e.milestones.length, player.T.points.min(56).times(4)))
                if (hasMilestone("e", 92) && !hasUpgrade("f", 21))             ret = ret.div(Decimal.pow(player.e.milestones.length, player.T.points.min(109).times(player.e.milestones.length ** (2/3))))

                if (hasMilestone("f", 7))       ret = ret.div(tmp.f.milestones[7].effectPer.pow(player.T.points.min(tmp.f.milestones[7].start)))

                if (hasUpgrade("e", 32))        ret = ret.times(player.f.points.max(1).min(1e250).pow(player.e.upgrades.length))
                if (hasUpgrade("e", 33))        ret = ret.div(Decimal.pow(2, layerChallengeCompletions("f")).pow(player.T.points.min(350)).pow(player.e.upgrades.length))

                if (hasUpgrade("d", 54))        ret = ret.div(tmp.d.upgrades[54].effect.pow(player.T.points.min(639)))

                ret = ret.times(tmp.E.getPerTierMultiplier.pow(player.T.points))

                return ret
        },
        getPerTierMultiplier(){
                let ret = decimalOne

                if (hasMilestone("T", 1))       ret = ret.times(2)
                if (hasMilestone("E", 1))       ret = ret.times(player.T.points.gte(12) ? 5 : 2)
                if (hasMilestone("T", 14))      ret = ret.div(1e95)
                if (hasMilestone("e", 81) && player.f.challenges[22] < 1)      ret = ret.times(player.e.milestones.length)
                if (hasMilestone("e", 82) && player.f.challenges[22] < 1)      ret = ret.times(player.e.milestones.length ** 3)
                if (hasMilestone("e", 83) && player.f.challenges[22] < 1)      ret = ret.times(player.e.milestones.length ** 2)
                if (hasMilestone("e", 84) && player.f.challenges[22] < 2)      ret = ret.times(player.e.milestones.length ** 3)
                if (hasMilestone("e", 87) && player.f.challenges[22] < 2)      ret = ret.times(player.e.milestones.length ** 4)
                if (hasMilestone("e", 92) && !hasUpgrade("f", 21))             ret = ret.times(Decimal.pow(player.e.milestones.length, player.e.milestones.length ** (2/3)))
                if (hasMilestone("f", 7))       ret = ret.times(tmp.f.milestones[7].effectPer)
                                                ret = ret.times(CURRENT_BUYABLE_EFFECTS["E31"])
                if (hasUpgrade("d", 54))        ret = ret.times(tmp.d.upgrades[54].effect)
                if (hasUpgrade("T", 23))        ret = ret.times(Decimal.pow(2, layerChallengeCompletions("f")**2))
                if (hasUpgrade("e", 33))        ret = ret.times(Decimal.pow(2, layerChallengeCompletions("f")).pow(player.e.upgrades.length))

                return ret
        },
        getGainMultPost(){
                let ret = decimalOne

                if (hasMilestone("T", 13) && player.E.points.gte(1e147)) ret = ret.times(tmp.E.getInitialGain)

                return ret
        },
        update(diff){
                let data = player.E

                if (player.e.best.gt("1e13500")) data.unlocked = true
                if (!data.unlocked) return
                
                if (hasMilestone("e", 95) && !player.f.activeChallenge && player.T.points.gte(222) && !(hasUpgrade("T", 23) && player.f.challenges[21] >= 10)) {
                        data.points = tmp.E.getResetGain
                } else if (player.f.activeChallenge && player.f.challenges[player.f.activeChallenge] >= 5) {
                        data.points = data.points.div(tmp.E.getResetGain).plus(diff).min(10).times(tmp.E.getResetGain)
                } else {
                        data.points = data.points.plus(tmp.E.getResetGain.times(diff))
                }
                if (data.points.gte(tmp.T.nextAtDisp)) {
                        data.points = tmp.T.nextAtDisp
                        if (hasMilestone("f", 4)) doReset("T")
                }

                if (player.f.challenges[21] > 0 && !player.f.activeChallenge) {
                        if (player.T.time > 1) {
                                player.T.points = player.T.points.max(player.T.best.sub(100 - 2 * player.f.challenges[21]))
                        }
                }

                data.best = data.best.max(data.points)
                data.time += diff
        },
        layerShown(){return player.E.unlocked || player.e.best.gte("1e13500")},
        canReset(){
                return false
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>I Emerald"
                        },
                        description(){
                                let a = "Each upgrade unlocks a buyable and increases base Eagle gain by 1%"
                                return a
                        },
                        cost: new Decimal(10),
                        unlocked(){
                                return true
                        }, 
                }, // hasUpgrade("E", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>II Emerald"
                        },
                        description(){
                                let a = "Buy each Eagle buyable once per trigger, and increase its speed by sqrt(Tier)/2"
                                return a
                        },
                        cost: new Decimal(1e7),
                        unlocked(){
                                return player.E.tier.gte(5) || hasUpgrade("E", 12)
                        }, 
                }, // hasUpgrade("E", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>III Emerald"
                        },
                        description(){
                                let a = "This and future upgrades Septuple Emerald gain and D 11 base"
                                return a
                        },
                        cost: new Decimal(1e11),
                        unlocked(){
                                return player.E.tier.gte(11) || hasUpgrade("E", 13)
                        }, 
                }, // hasUpgrade("E", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>IV Emerald"
                        },
                        description(){
                                let a = "E 32 gives free E 22 levels"
                                return a
                        },
                        cost: new Decimal(1e17),
                        unlocked(){
                                return player.E.tier.gte(17) || hasUpgrade("E", 14)
                        }, 
                }, // hasUpgrade("E", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>V Emerald"
                        },
                        description(){
                                let a = "Faster Sifter gives free Sifter levels but divide Emerald gain by 1e40"
                                if (hasUpgrade("E", 12)) a = a.replace("40", "10")
                                return a
                        },
                        cost(){
                                return new Decimal(1e77).div(Decimal.pow(100, player.T.points.sub(37).max(0))).max(1e18)
                        },
                        unlocked(){
                                return player.E.tier.gte(37) || hasUpgrade("E", 15)
                        }, 
                }, // hasUpgrade("E", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>VI Emerald"
                        },
                        description(){
                                let a = "Tier Milestone 4 no longer affects Emeralds"
                                return a
                        },
                        cost(){
                                return new Decimal(1e185).div(Decimal.pow(1e5, player.T.points.sub(100).max(0))).max(1e19)
                        },
                        unlocked(){
                                return player.E.tier.gte(80) || hasUpgrade("E", 21)
                        }, 
                }, // hasUpgrade("E", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>VII Emerald"
                        },
                        description(){
                                let a = "Tiers multiply base Eagle gain"
                                return a
                        },
                        cost(){
                                return new Decimal("1e623")
                        },
                        unlocked(){
                                return player.T.best.gte(254) || hasUpgrade("E", 22)
                        }, 
                }, // hasUpgrade("E", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>VIII Emerald"
                        },
                        description(){
                                let a = "Each tenth F 13 subtracts .001 from the F 11 linear cost base"
                                return a
                        },
                        cost(){
                                return new Decimal("1e2004")
                        },
                        unlocked(){
                                return player.T.best.gte(700) || hasUpgrade("E", 23)
                        }, 
                }, // hasUpgrade("E", 23)
        },
        milestones: {
                1: {
                        requirementDescription(){
                                return formatWhole(tmp.E.milestones[1].goal) + " Emeralds"
                        },
                        goal(){
                                let ret = new Decimal(1.28e13).div(Decimal.pow(2, player.T.points))
                                if (ret.lt(1)) return new Decimal(0)
                                return ret.ceil()
                        },
                        done(){
                                return player.E.points.gte(tmp.E.milestones[1].goal) && player.T.points.gte(7)
                        },
                        unlocked(){
                                return player.T.points.gte(7)
                        },
                        effectDescription(){
                                if (player.T.points.gte(44)) return "Reward: Each Tier quintuples Emerald gain, divide Sifter base cost by 3, and each Tier reduces Sifter's linear cost base by .01 ."
                                if (player.T.points.gte(13)) return "Reward: Each Tier halves the goal of the milestone " + makePurple("and quintuples Emerald gain") + ". Divide Sifter base cost by 3. At 10,000 times this milestone's goal (" + format(tmp.E.milestones[1].goal.times(1e4)) + ") each Tier reduces Sifter's linear cost base by .01 ."
                                if (player.T.points.gte(12)) return "Reward: Each Tier halves the goal of the milestone " + makePurple("and quintuples Emerald gain (only those after unlock until Tier 13)") + ". Divide Sifter base cost by 3. At 10,000 times this milestone's goal (" + format(tmp.E.milestones[1].goal.times(1e4)) + ") each Tier reduces Sifter's linear cost base by .01 ."
                                if (player.T.points.gte(8))  return "Reward: Each Tier halves the goal of the milestone " + makePurple("and doubles (quintuple at Tier 12) Emerald gain (only those after unlock until Tier 13)") + ". Divide Sifter base cost by 3. At 10,000 times this milestone's goal (" + format(tmp.E.milestones[1].goal.times(1e4)) + ") each Tier reduces Sifter's linear cost base by .01 ."
                                return "Reward: Each Tier halves the goal of the milestone. Divide Sifter base cost by 3. At 10,000 times this milestone's goal (" + format(tmp.E.milestones[1].goal.times(1e4)) + ") each Tier reduces Sifter's linear cost base by .01 ."
                        },
                }, // hasMilestone("E", 1)
                2: {
                        requirementDescription(){
                                return formatWhole(tmp.E.milestones[2].goal) + " Emeralds"
                        },
                        goal(){
                                let ret = new Decimal(1e22).div(Decimal.pow(3, player.T.points.sub(15)))
                                if (ret.lt(1)) return new Decimal(0)
                                return ret.ceil()
                        },
                        done(){
                                return player.E.points.gte(tmp.E.milestones[2].goal) && player.T.points.gte(15)
                        },
                        unlocked(){
                                return player.T.points.gte(15)
                        },
                        effectDescription(){
                                return "Reward: Each Tier thirds the goal of the milestone, halves the Lazy Tiers base, and adds 1 to the Eagle gain exponent."
                        },
                }, // hasMilestone("E", 2)
                3: {
                        requirementDescription(){
                                return formatWhole(tmp.E.milestones[3].goal) + " Emeralds"
                        },
                        goal(){
                                let ret = new Decimal(1e63).div(Decimal.pow(10, player.T.points))
                                if (ret.lt(1)) return new Decimal(0)
                                return ret.ceil()
                        },
                        done(){
                                return player.E.points.gte(tmp.E.milestones[3].goal) && player.T.points.gte(23)
                        },
                        unlocked(){
                                return player.T.points.gte(23)
                        },
                        effectDescription(){
                                if (player.T.points.gte(26)) return "Reward: Subtract .5 effective Tiers and each Tier tenths the goal of the milestone and E 33 base. " + makePurple("At 1e8 times the goal of this milestone (" + format(tmp.E.milestones[3].goal.times(1e8)) + ") Lazy Tiers give free Faster Sifter levels.")
                                return "Reward: Subtract .5 effective Tiers and each Tier tenths the goal of the milestone and E 33 base."
                        },
                }, // hasMilestone("E", 3)
                4: {
                        requirementDescription(){
                                return formatWhole(tmp.E.milestones[4].goal) + " Emeralds"
                        },
                        goal(){
                                let ret = new Decimal(1e178).div(Decimal.pow(10, player.T.points.times(2.5).sub(22.5)))
                                if (ret.lt(1)) return new Decimal(0)
                                return ret.ceil()
                        },
                        done(){
                                return player.E.points.gte(tmp.E.milestones[4].goal) && player.T.points.gte(45)
                        },
                        unlocked(){
                                return player.T.points.gte(45)
                        },
                        effectDescription(){
                                if (player.shiftAlias) return "Tiers reduced goal by 10<sup>2.5</sup> (~316)."
                                if (player.T.points.gte(50)) return "Reward: Each E 33 subtracts .005 from the Miner linear cost base (max 200 times). " + makePurple("At 1e25 times the goal of this milestone (" + format(tmp.E.milestones[4].goal.times(1e25)) + ") each milestone adds .01 to Lazy Tiers' base.")
                                return "Reward: Each E 33 subtracts .005 from the Miner linear cost base (max 200 times)."
                        },
                }, // hasMilestone("E", 4)
                5: {
                        requirementDescription(){
                                return formatWhole(tmp.E.milestones[5].goal) + " Emeralds"
                        },
                        goal(){
                                let ret = new Decimal(1e127).div(Decimal.pow(1000, player.T.points.sub(64)))
                                if (ret.lt(1)) return new Decimal(0)
                                return ret.ceil()
                        },
                        done(){
                                return player.E.points.gte(tmp.E.milestones[5].goal) && player.T.points.gte(64)
                        },
                        unlocked(){
                                return player.T.points.gte(60)
                        },
                        effectDescription(){
                                if (player.shiftAlias) return "Tiers reduced goal by 1000x"
                                return "Reward: E 32 gives free E 23 levels but divide Eagle gain by 1e600. At 2e132 Emeralds Tiers past 65 add to Miner's base (max 27 times)."
                        },
                }, // hasMilestone("E", 5)
                6: {
                        requirementDescription(){
                                return formatWhole(tmp.E.milestones[6].goal) + " Emeralds"
                        },
                        goal(){
                                let ret = new Decimal(1e217).div(Decimal.pow(1e20, player.T.points.sub(130).max(0))).div(player.T.points.sub(109).max(0).pow10())
                                if (ret.lt(1)) return new Decimal(0)
                                return ret.ceil()
                        },
                        done(){
                                return player.E.points.gte(tmp.E.milestones[6].goal) && player.T.points.gte(109)
                        },
                        unlocked(){
                                return player.T.points.gte(109)
                        },
                        effectDescription(){
                                if (player.shiftAlias) return "Goal is reduced by 10 per Tier past 109 and by 1e20 per Tier past 130."
                                return "Reward: Tiers after 100 subtract .01 from the Filter base (halve after 150) and add .0002 to E 32's base but increase Filter's quadratic base."
                        },
                }, // hasMilestone("E", 6)
                7: {
                        requirementDescription(){
                                return "4e863 Emeralds"
                        },
                        done(){
                                return player.E.points.gte("4e863")
                        },
                        unlocked(){
                                return player.T.points.gte(340)
                        },
                        effectDescription(){
                                return "Reward: Tiers increase base Finch gain by 1% (halved after 777) and subtract from Sieve linear base (max 940)."
                        },
                }, // hasMilestone("E", 7)
                8: {
                        requirementDescription(){
                                return "3e1590 Emeralds"
                        },
                        done(){
                                return player.E.points.gte("3e1590")
                        },
                        unlocked(){
                                return player.T.points.gte(555)
                        },
                        effectDescription(){
                                return "Reward: Tiers multiply Duck bulk amount and F 11 levels subtract .0001 to the F 12 base and subtract 1 from the linear cost base."
                        },
                }, // hasMilestone("E", 8)
                9: {
                        requirementDescription(){
                                return "1e2685 Emeralds"
                        },
                        done(){
                                return player.E.points.gte("1e2685")
                        },
                        unlocked(){
                                return hasMilestone("E", 8)
                        },
                        onComplete(){
                                player.E.buyables[31] = decimalZero
                        },
                        effectDescription(){
                                return "Reward: Better Everything levels decrease its linear cost base by 1.13x but add 10 to Sieve's linear cost base."
                        },
                }, // hasMilestone("E", 9)
                10: {
                        requirementDescription(){
                                return "1e2951 Emeralds"
                        },
                        done(){
                                return player.E.points.gte("1e2951")
                        },
                        unlocked(){
                                return hasMilestone("E", 9)
                        },
                        effectDescription(){
                                return "Reward: Increase F 12 base cost by 1e350 and unlock Rank II. At 4e44,444 and 1e48,000 Finches, decrease base Finch gain by 2% and 4.5%."
                        },
                }, // hasMilestone("E", 10)
                11: {
                        requirementDescription(){
                                return "1e3015 Emeralds"
                        },
                        done(){
                                return player.E.points.gte("1e3015")
                        },
                        unlocked(){
                                return hasMilestone("E", 10)
                        },
                        effectDescription(){
                                return "Reward: Tiers past 1000 subtract .1 from the Sieve linear cost base but F 13 linear cost base is 15e20."
                        },
                }, // hasMilestone("E", 11)
        },
        buyables: getLayerGeneralizedBuyableData("E", [
                        function(){
                                return hasUpgrade("E", 11) || player.E.tier.gte(2)
                        },
                        function(){
                                return hasUpgrade("E", 12) || player.E.tier.gte(6)
                        },
                        function(){
                                return hasUpgrade("E", 13) || player.E.tier.gte(12)
                        },
                        function(){
                                return hasUpgrade("E", 14) || player.E.tier.gte(18)
                        },
                        function(){
                                return hasUpgrade("E", 15) || player.E.tier.gte(38)
                        },
                        function(){
                                return hasUpgrade("E", 21) || player.E.tier.gte(100)
                        },
                        function(){
                                return hasUpgrade("E", 22)
                        },
                        function(){
                                return hasUpgrade("E", 23)
                        },
                ]),
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                return "You are on tier " + formatWhole(player.E.tier) + ". This roots Emerald " + romanize(player.E.tier) + " gain by " + format(tmp.E.getGainExp.pow(-1))
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.shiftAlias) return "Pre-reduction Emeralds gain: " + format(tmp.E.getGainMultPre)
                                                return "You are gaining " + format(tmp.E.getResetGain) + " Emerald " + romanize(player.E.tier) + " per second."
                                        }
                                ],
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                return "You are on tier " + formatWhole(player.E.tier) + ". This roots Emerald " + romanize(player.E.tier) + " gain by " + format(tmp.E.getGainExp.pow(-1))
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.shiftAlias) return "Pre-reduction Emeralds gain: " + format(tmp.E.getGainMultPre)
                                                return "You are gaining " + format(tmp.E.getResetGain) + " Emerald " + romanize(player.E.tier) + " per second."
                                        }
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("E", 11) || player.T.best.gte(2)
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "You are on tier " + formatWhole(player.E.tier) + ". This roots Emerald " + romanize(player.E.tier) + " gain by " + format(tmp.E.getGainExp.pow(-1))
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.shiftAlias) return "Pre-reduction Emeralds gain: " + format(tmp.E.getGainMultPre)
                                                return "You are gaining " + format(tmp.E.getResetGain) + " Emerald " + romanize(player.E.tier) + " per second."
                                        }
                                ],
                                "milestones"],
                        unlocked(){
                                return player.T.points.gte(7)
                        },
                },
                "Info": {
                        content: [
                                "main-display",
                                ["display-text",
                                        function() {
                                                return "Base Emerald gain is affected by currencies:<br> log10(Amount+10)<sup>.1</sup> (capped at 1.80e308)"+br2
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                let init = "This is raised to the power of weights"
                                                let a = "Current weights: <br> a: .001<br> b: .002 <br> c: .005 <br> d: .010 <br> e: .020 "
                                                if (player.f.unlocked) a += "<br> f:1.000"
                                                return init + br + a + br2 + "Current effect: " + format(tmp.E.getInitialGain)
                                        }
                                ],
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){
                let data = player.E 

                data.points = decimalZero
                data.best = decimalZero
                let toSub = hasMilestone("e", 93) ? 20 : 50
                if (hasMilestone("T", 12)) toSub = Math.max(Math.min(toSub, 85-player.f.times),0)
                let onlySubtract = hasMilestone("T", 12) && !getsReset("e", layer)
                for (i in data.buyables) {
                        data.buyables[i] = onlySubtract ? data.buyables[i].sub(toSub).max(0) : decimalZero
                }
                if (player.T.points.lt(100) && !hasMilestone("f", 4)) data.buyables[23] = decimalZero

                let keepupgrades = hasMilestone("T", 12) ? [11,12,13,14,15] : []
                if (player.T.points.gte(100)) keepupgrades.push(21)
                if (hasMilestone("f", 4)) keepupgrades = keepupgrades.concat(data.upgrades.slice(0, player.f.times))
                data.upgrades = filter(data.upgrades, keepupgrades)

                if (!hasMilestone("f", 5)) {
                        let keep = []
                        for (j in data.milestones){
                                i = data.milestones[j]
                                if (tmp.E.milestones[i].goal.lt(1) && layer == "T") {
                                        keep.push(i)
                                }
                        }
                        data.milestones = filter(data.milestones, keep)
                }

                tmp.E.getResetGain = decimalZero
                tmp.E.getGainMultPre = decimalOne
                CURRENT_BUYABLE_EFFECTS["E11"] = decimalOne

                data.tier = player.T.points
                data.time = 0
        }
})

addLayer("T", {
        name: "Tier", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "Ti", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        row: 4, // Row the layer is in on the tree (0 is the first row)
        startData() { return {
                unlocked: false,
		points: decimalOne,
                best: decimalOne,
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                tier: decimalOne,
                ranks: decimalZero,
                totalranks: decimalZero,
        }},
        color: "#333333",
        branches: ["E"],
        requires: new Decimal("1e6"), // Can be a function that takes requirement increases into account
        resource: "Tiers", // Name of prestige currency
        baseResource: "Emeralds", // Name of resource prestige is based on
        baseAmount() {return player.E.points.floor()}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        base(){
                let ret = new Decimal(100).max(player.T.points)

                return ret
        },
        gainMult(){
                return new Decimal(hasUpgrade("T", 14) ? .000001 : .01) // 10^-6
        },
        exponent(){
                let ret = new Decimal(1000)//.max(player.T.points)

                return ret.div(1000)
        },
        prestigeButtonText(){
                if (player.shiftAlias) {
                        let init = hasUpgrade("T", 14) ? "" : "10,000 * "
                        //if (player.T.points.gte(1001)) return init + "Tiers<sup>Tiers^(Tiers/1000)</sup>"
                        if (player.T.points.gte(101)) return init + "Tiers<sup>Tiers</sup>"
                        return init + "100<sup>Tiers</sup>"
                }
                return "Reset for a Tier<br>Req: " + format(player.E.points) + "/" + format(tmp.T.nextAtDisp)
        },
        update(diff){
                let data = player.T

                if (player.E.best.gt("1e6")) data.unlocked = true
                if (!data.unlocked) return

                player.E.tier = data.points

                if (data.points.eq(0)) data.points = decimalOne
                data.best = data.best.max(data.points)

                if (hasMilestone("f", 5)) {
                        handleGeneralizedBuyableAutobuy(diff, "E")
                } else if (hasUpgrade("T", 11) && (player.T.points.lt(player.T.best) || player.f.unlocked)) {
                        handleGeneralizedBuyableAutobuy(diff, "E")
                }
                
                data.time += diff
        },
        layerShown(){return player.E.best.gte(1e5) || player.T.unlocked},
        //canReset(){
        //        return player.E.points.gte(tmp.T.getNextAt)
        //},
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>I Tier"
                        },
                        description(){
                                if (player.shiftAlias && player.f.unlocked) return "Restriction is removed upon finch unlock!" + (hasMilestone("f", 3) ? " Cost is reduced to one from Finch Milestone 3." : "")
                                let a = "Autobuy Emerald buyables if you have less Tiers than your best, Emerald buyables are free, and add .02 to the Faster Sifter base"
                                if (player.f.unlocked) a = a.replace(" if you have less Tiers than your best", "")
                                return a
                        },
                        cost:() => new Decimal(hasMilestone("f", 3) ? 1 : 16),
                        unlocked(){
                                if (hasUpgrade("T", 11) || player.T.points.gte(17)) return true 
                                return player.T.points.gte(16) && player.E.points.gte(1e20)
                        }, 
                }, // hasUpgrade("T", 11)
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>II Tier"
                        },
                        description(){
                                if (player.shiftAlias && player.f.unlocked) return "Cost is reduced to one upon finch unlock!"
                                let a = "E 31 levels subtract from Lazy Tiers linear cost base (max 990), the Emerald buyable bulks and increases speed by [upgrades]"
                                return a
                        },
                        cost:() => new Decimal(player.f.unlocked ? 1 : 28),
                        unlocked(){
                                if (hasUpgrade("T", 12) || player.T.points.gte(29)) return true 
                                return player.T.points.gte(28) && player.E.points.gte(player.f.unlocked ? 1e41 : 1e50)
                        }, 
                }, // hasUpgrade("T", 12)
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>III Tier"
                        },
                        description(){
                                let a = "All future upgrades cost 1 Tier. Per Tier past 31 add .0001 to the E 11 base."
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                if (hasUpgrade("T", 13) || player.T.points.gte(33)) return true 
                                return player.T.points.gte(32) && player.E.points.gte(1e62)
                        }, 
                }, // hasUpgrade("T", 13)
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>IV Tier"
                        },
                        description(){
                                let a = "E 31 gives free E 22 levels and divide Tier goal by 10,000 but divide Ealge gain by 1e3500"
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                if (hasUpgrade("T", 14) || player.T.points.gte(53)) return true 
                                return player.T.points.gte(52) && player.E.points.gte(1e103)
                        }, 
                }, // hasUpgrade("T", 14)
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>V Tier"
                        },
                        description(){
                                let a = "Tiers 60 to 79 add .005 to the Tired Tiers base"
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                if (hasUpgrade("T", 15) || player.T.points.gte(62)) return true 
                                return player.T.points.gte(61) && player.E.points.gte(1e119)
                        }, 
                }, // hasUpgrade("T", 15)
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>VI Tier"
                        },
                        description(){
                                let a = "Tiers past 100 divide Filter base cost by 1e15 (increased to 1e18 at 1e206 Emeralds)"
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                if (hasUpgrade("T", 21) || player.T.points.gte(102)) return true 
                                return player.T.points.gte(101) && player.E.points.gte(5e198)
                        }, 
                }, // hasUpgrade("T", 21)
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>VII Tier"
                        },
                        description(){
                                let a = "Tiers past 112 subtract .002 from Lazy Tier's quadratic base (max 30 times)"
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                if (hasUpgrade("T", 22) || player.T.points.gte(115)) return true 
                                return player.T.points.gte(114) && player.E.points.gte(1e232)
                        }, 
                }, // hasUpgrade("T", 22)
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>VIII Tier"
                        },
                        description(){
                                let a = "Tiers past 580 double Emerald gain per Finch Challenges<sup>2</sup> and at 10 Only Finch completions uncap Emerald gain"
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                if (hasUpgrade("T", 23) || player.T.points.gte(582)) return true 
                                return player.T.points.gte(581) && player.E.points.gte("8e1604")
                        }, 
                }, // hasUpgrade("T", 23)
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>IX Tier"
                        },
                        description(){
                                let a = "Better Everything gives free Lazy Tier levels but Lazy Tier does not give free levels and subtract .03 from its base"
                                return a
                        },
                        cost: new Decimal(1),
                        unlocked(){
                                if (hasUpgrade("T", 24) || player.T.points.gte(833)) return true 
                                return player.T.points.gte(833) && player.E.points.gte("2e2431")
                        }, 
                }, // hasUpgrade("T", 24)
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor() + "'>X Tier"
                        },
                        description(){
                                let a = "Unlock a buyable and increase F 12 base cost by 1e850"
                                return a
                        },
                        cost: new Decimal(927),
                        unlocked(){
                                return hasUpgrade("T", 24) || hasUpgrade("T", 25)
                        }, 
                }, // hasUpgrade("T", 25)
        },
        milestones: {
                1: {
                        requirementDescription(){
                                return "Tier 2"
                        },
                        done(){
                                return player.T.points.gte(2)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "Reward: Each Tier doubles Emerald gain and increases base Eagle gain by 2%. Autobuy a Eagle buyable once per second."
                        },
                }, // hasMilestone("T", 1)
                2: {
                        requirementDescription(){
                                return "100,000,000 Emerald VI"
                        },
                        done(){
                                return player.T.points.gte(7) || (player.T.points.gte(6) && player.E.points.gte(1e8) && player.E.points.neq(1e14))
                        },
                        unlocked(){
                                return player.T.points.gte(6) || player.f.unlocked
                        },
                        effectDescription(){
                                return "Reward: Each milestone triples Emerald gain and increases base Eagle gain by 2%. Bulk [milestone] many Eagle buyables at once."
                        },
                }, // hasMilestone("T", 2)
                3: {
                        requirementDescription(){
                                return "100,000,000 Emerald VIII"
                        },
                        done(){
                                return player.T.points.gte(9) || (player.T.points.gte(8) && player.E.points.gte(1e8) && player.E.points.neq(1e18))
                        },
                        unlocked(){
                                return player.T.points.gte(8) || player.f.unlocked
                        },
                        effectDescription(){
                                if (player.T.points.gte(25)) return "Reward: Each E 32 quadruples Emerald gain (max 1500). Best Emeralds multiplies Eagle gain per milestone."
                                return "Reward: Each E 32 after 21 (removed at 25 Tiers) quadruples Emerald gain. Best Emeralds multiplies Eagle gain per milestone."
                        },
                }, // hasMilestone("T", 3)
                4: {
                        requirementDescription(){
                                return "1e13 Emerald X"
                        },
                        done(){
                                return player.T.points.gte(11) || (player.T.points.gte(10) && player.E.points.gte(1e13) && player.E.points.neq(1e22))
                        },
                        unlocked(){
                                return player.T.points.gte(10) || player.f.unlocked
                        },
                        effectDescription(){
                                if (player.T.points.gte(24)) return "Reward: Each OoM of Emeralds sextuples Emerald gain. Tenth Faster Sifter base cost but E 32 base cost is 1e139x larger."
                                return "Reward: Each OoM of Emeralds after 1e15 (removed at 24 Tiers) sextuples Emerald gain. Tenth Faster Sifter base cost but E 32 base cost is 1e139x larger."
                        },
                }, // hasMilestone("T", 4)
                5: {
                        requirementDescription(){
                                return "1e26 Emerald XIV"
                        },
                        done(){
                                return player.T.points.gte(15) || (player.T.points.gte(14) && player.E.points.gte(1e26) && player.E.points.neq(1e30))
                        },
                        unlocked(){
                                return player.T.points.gte(14) || player.f.unlocked
                        },
                        effectDescription(){
                                return "Reward: Lazy Tiers gives free Sifter levels."
                        },
                }, // hasMilestone("T", 5)
                6: {
                        requirementDescription(){
                                return "1e27 Emerald XVIII"
                        },
                        done(){
                                return player.T.points.gte(19) || (player.T.points.gte(18) && player.E.points.gte(1e27) && player.E.points.neq(1e38))
                        },
                        unlocked(){
                                return player.T.points.gte(18) || player.f.unlocked
                        },
                        effectDescription(){
                                return "Reward: Reduce Tier's Emerald reducing effect (above 16 Tiers)."
                        },
                }, // hasMilestone("T", 6)
                7: {
                        requirementDescription(){
                                return "1e30 Emerald XIX"
                        },
                        done(){
                                return player.T.points.gte(20) || (player.T.points.gte(19) && player.E.points.gte(1e30) && player.E.points.neq(1e40))
                        },
                        unlocked(){
                                return player.T.points.gte(19) || player.f.unlocked
                        },
                        effectDescription(){
                                return "Reward: Tiers subtract from Faster Sifter linear cost base (max 92 times) and quarter E 32 linear cost base."
                        },
                }, // hasMilestone("T", 7)
                8: {
                        requirementDescription(){
                                return "1e23 Emerald XXI"
                        },
                        done(){
                                return player.T.points.gte(22) || (player.T.points.gte(21) && player.E.points.gte(1e23) && player.E.points.neq(1e44))
                        },
                        unlocked(){
                                return player.T.points.gte(21) || player.f.unlocked
                        },
                        effectDescription(){
                                if (hasMilestone("f", 8) && !player.controlAlias) {
                                        if (player.shiftAlias) return "Improved by Finch Milestone 8."
                                        return "Reward: Emerald buyables no longer give free normal buyables and E 21 gives free E 11 levels and multiply Eagle and base Duck gain by 1e5000."
                                }
                                return "Reward: Emerald buyables no longer give free normal buyables and E 21 gives free E 11 levels and divide Eagle gain by 1e2650."
                        },
                }, // hasMilestone("T", 8)
                9: {
                        requirementDescription(){
                                return "1e39 Emerald XXVII"
                        },
                        done(){
                                return player.T.points.gte(28) || (player.T.points.gte(27) && player.E.points.gte(1e39) && player.E.points.neq(1e56))
                        },
                        unlocked(){
                                return player.T.points.gte(27) || player.f.unlocked
                        },
                        effectDescription(){
                                if (player.T.points.gte(28)) return "Reward: Per milestone multiply Emerald gain by Tiers" + makePurple("*Upgrades<sup>.7</sup>") + "."
                                return "Reward: Per milestone multiply Emerald gain by Tiers."
                        },
                }, // hasMilestone("T", 9)
                10: {
                        requirementDescription(){
                                return "1e50 Emerald XXIX"
                        },
                        done(){
                                return player.T.points.gte(30) || (player.T.points.gte(29) && player.E.points.gte(1e50) && player.E.points.neq(1e60))
                        },
                        unlocked(){
                                return player.T.points.gte(29) || player.f.unlocked
                        },
                        effectDescription(){
                                if (player.f.unlocked) return "Reward: Each Tier subtracts .01 from Lazy Tiers quadratic cost base (max 84) and E 11 " + makePurple(" and E 12") + " give free D 33 levels and multiplies Emerald gain."
                                return "Reward: Each Tier subtracts .01 from Lazy Tiers quadratic cost base (max 84) and at 1e57 Emerald XXIX E 11 gives free D 33 levels and multiplies Emerald gain."
                        },
                }, // hasMilestone("T", 10)
                11: {
                        requirementDescription(){
                                return "30 Tiers"
                        },
                        done(){
                                return player.T.points.gte(30)
                        },
                        unlocked(){
                                return player.T.points.gte(29) || player.f.unlocked
                        },
                        effectDescription(){
                                return "Reward: Each Tier past 29 adds 1 to the Miner effect base."
                        },
                }, // hasMilestone("T", 11)
                12: {
                        requirementDescription(){
                                if (player.f.times > 33) return "Free!"
                                return player.f.unlocked ? (Math.max(2, 35-player.f.times) + " Tiers") : "54 Tiers"
                        },
                        done(){
                                return player.T.points.gte(player.f.unlocked ? (35-player.f.times) : 54)
                        },
                        unlocked(){
                                return hasMilestone("T", 11) || player.f.unlocked
                        },
                        effectDescription(){
                                if (player.shiftAlias && player.f.unlocked) {
                                        if (player.f.times > 33) return "Note: Keep one more buyable per Finch reset."
                                        return "Note: 1 Tier cheaper per Finch reset."
                                }
                                if (player.f.unlocked && player.f.times > 84) {
                                        return "Reward: Keep all Emerald buyables and the first five Emerald upgrades. Miner base cost is decreased by 1000 per Tier past 53."
                                }
                                if (player.f.unlocked && player.f.times > 33) {
                                        return "Reward: Keep all but " + Math.max(85 - player.f.times, 0) + " Emerald buyables and the first five Emerald upgrades. Miner base cost is decreased by 1000 per Tier past 53."
                                }
                                return "Reward: Keep all but 50 Emerald buyables and the first five Emerald upgrades. Miner base cost is decreased by 1000 per Tier past 53."
                        },
                }, // hasMilestone("T", 12)
                13: {
                        requirementDescription(){
                                return "5e144 Emeralds"
                        },
                        done(){
                                return player.E.points.gte(5e144)
                        },
                        unlocked(){
                                return hasMilestone("T", 12) || player.f.unlocked
                        },
                        effectDescription(){
                                return "Reward: Per Tier double Beaver and Capybara maximum buyables and bulk amount. At 1e147 Emeralds base Emerald gain also multiplies post-reduction Emerald gain."
                        },
                }, // hasMilestone("T", 13)
                14: {
                        requirementDescription(){
                                return "1e200 Emeralds CIV"
                        },
                        done(){
                                return player.E.points.gte(1e200) && player.T.points.gte(104) && player.E.points.max(1).log(103).sub(103).abs().gt(.0000000001)
                        },
                        unlocked(){
                                return hasMilestone("T", 13) || player.f.unlocked
                        },
                        effectDescription(){
                                return "Reward: Tiers past 104 add .01 to Filter base but divide Emerald gain by 1e80 (increased to 1e95 at Tier 107) and E 33 base is exponentiated by sqrt(Tier)."
                        },
                }, // hasMilestone("T", 14)
                15: {
                        requirementDescription(){
                                return "8e676 Emeralds"
                        },
                        done(){
                                return player.E.points.gte("8e676")
                        },
                        unlocked(){
                                return hasMilestone("T", 14)
                        },
                        onComplete(){
                                player.E.buyables[31] = decimalZero
                        },
                        effectDescription(){
                                return "Reward: Sieve gives free Filter levels but cube its linear cost base. Slightly weaken the Active Tiers nerf formula."
                        },
                }, // hasMilestone("T", 15)
                16: {
                        requirementDescription(){
                                return "561 Tiers"
                        },
                        done(){
                                return player.T.points.gte("561")
                        },
                        unlocked(){
                                return hasMilestone("T", 15)
                        },
                        effectDescription(){
                                return "Reward: Tired Tiers does not give free levels and E 13 gives free E 12 levels."
                        },
                }, // hasMilestone("T", 16)
                17: {
                        requirementDescription(){
                                return "786 Tiers"
                        },
                        done(){
                                return player.T.points.gte("786")
                        },
                        unlocked(){
                                return hasMilestone("T", 16)
                        },
                        effectDescription(){
                                return "Reward: Tiers subtract .0001 from the Better Everything quadratic cost base and ones past 785 divide base cost by 1e15."
                        },
                }, // hasMilestone("T", 17)
        },
        buyables: {
                rows: 3,
                columns: 3,
                /*title: title, 
                display: display, 
                effect: effect,
                canAfford: canAfford,
                total: total,
                extra: extra,
                buy: buy,
                buyMax: buyMax,
                unlocked: unlockedTF,*/
                costFormula(t){
                        return Decimal.pow(2, t).round()
                },
                costDisplayFormula(){
                        return "2^x"
                },
                11: {
                        title: "Quick",
                        display(){
                                if (!player.shiftAlias) {
                                        let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay("T", 11) + "</b><br>"
                                        let eff = "<b><h2>Effect</h2>: " + format(tmp.T.buyables[11].effect.times(1000), 4) + "/1000 to all Emerald buyables bases</b>" + br
                                        let cost = "<b><h2>Cost</h2>: " + formatWhole(tmp.T.buyables[11].cost) + " ranks</b><br>"
        
                                        return br + amt + eff + cost + "Shift to see details"
                                }
                                let effForm = "<b><h2>Effect formula</h2>:<br>" + format(tmp.T.buyables[11].base.times(1000), 4) + "*x/1000</b>" + br
                                let costForm = "<b><h2>Cost formula</h2>:<br>" + tmp.T.buyables.costDisplayFormula() + "</b>" + br
                                return br + effForm + costForm
                        },
                        base(){
                                let ret = new Decimal(10**-5)
                                if (hasUpgrade("f", 21)) ret = ret.times(10)
                                return ret
                        },
                        effect(){
                                return tmp.T.buyables[11].base.times(player.T.buyables[11])
                        },
                        canAfford(){
                                return player.T.ranks.gte(tmp.T.buyables[11].cost)
                        },
                        cost(){
                                return layers.T.buyables.costFormula(player.T.buyables[11])
                        },
                        buy(){
                                if (!layers.T.buyables[11].canAfford()) return 
                                player.T.ranks = player.T.ranks.sub(tmp.T.buyables[11].cost)
                                player.T.buyables[11] = player.T.buyables[11].plus(1)
                        },
                        unlocked(){
                                return true
                        },
                },
                12: {
                        title: "Fast",
                        display(){
                                if (!player.shiftAlias) {
                                        let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay("T", 12) + "</b><br>"
                                        let eff = "<b><h2>Effect</h2>: " + format(tmp.T.buyables[12].effect.times(1000), 4) + "/1000 to F 11 base</b>" + br
                                        let cost = "<b><h2>Cost</h2>: " + formatWhole(tmp.T.buyables[12].cost) + " ranks</b><br>"
        
                                        return br + amt + eff + cost + "Shift to see details"
                                }
                                let effForm = "<b><h2>Effect formula</h2>:<br>" + format(tmp.T.buyables[12].base.times(1000), 4) + "*x/1000</b>" + br
                                let costForm = "<b><h2>Cost formula</h2>:<br>" + tmp.T.buyables.costDisplayFormula() + "</b>" + br
                                return br + effForm + costForm
                        },
                        base(){
                                let ret = new Decimal(.00002)
                                if (hasUpgrade("f", 21)) ret = ret.times(5)
                                return ret
                        },
                        effect(){
                                return tmp.T.buyables[12].base.times(player.T.buyables[12])
                        },
                        canAfford(){
                                return player.T.ranks.gte(tmp.T.buyables[12].cost)
                        },
                        cost(){
                                return layers.T.buyables.costFormula(player.T.buyables[12])
                        },
                        buy(){
                                if (!layers.T.buyables[12].canAfford()) return 
                                player.T.ranks = player.T.ranks.sub(tmp.T.buyables[12].cost)
                                player.T.buyables[12] = player.T.buyables[12].plus(1)
                        },
                        unlocked(){
                                return true
                        },
                },
                21: {
                        title: "Speedy",
                        display(){
                                if (!player.shiftAlias) {
                                        let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay("T", 21) + "</b><br>"
                                        let eff = "<b><h2>Effect</h2>: -" + format(tmp.T.buyables[21].effect, 4) + " effective Tiers</b>" + br
                                        let cost = "<b><h2>Cost</h2>: " + formatWhole(tmp.T.buyables[21].cost) + " ranks</b><br>"
        
                                        return br + amt + eff + cost + "Shift to see details"
                                }
                                let effForm = "<b><h2>Effect formula</h2>:<br>" + format(tmp.T.buyables[21].base, 4) + "*x</b>" + br
                                let costForm = "<b><h2>Cost formula</h2>:<br>" + tmp.T.buyables.costDisplayFormula() + "</b>" + br
                                return br + effForm + costForm
                        },
                        base(){
                                let ret = new Decimal(.5)
                                return ret
                        },
                        effect(){
                                return tmp.T.buyables[21].base.times(player.T.buyables[21])
                        },
                        canAfford(){
                                return player.T.ranks.gte(tmp.T.buyables[21].cost)
                        },
                        cost(){
                                return layers.T.buyables.costFormula(player.T.buyables[21])
                        },
                        buy(){
                                if (!layers.T.buyables[21].canAfford()) return 
                                player.T.ranks = player.T.ranks.sub(tmp.T.buyables[21].cost)
                                player.T.buyables[21] = player.T.buyables[21].plus(1)
                        },
                        unlocked(){
                                return player.T.points.gte(917)
                        },
                },
                22: {
                        title: "Agile",
                        display(){
                                if (!player.shiftAlias) {
                                        let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay("T", 22) + "</b><br>"
                                        let eff = "<b><h2>Effect</h2>: " + format(tmp.T.buyables[22].effect, 4) + " F 13 application times</b>" + br
                                        let cost = "<b><h2>Cost</h2>: " + formatWhole(tmp.T.buyables[22].cost) + " ranks</b><br>"
        
                                        return br + amt + eff + cost + "Shift to see details"
                                }
                                let effForm = "<b><h2>Effect formula</h2>:<br>" + format(tmp.T.buyables[22].base, 4) + "*x</b>" + br
                                let costForm = "<b><h2>Cost formula</h2>:<br>" + tmp.T.buyables.costDisplayFormula() + "</b>" + br
                                return br + effForm + costForm
                        },
                        base(){
                                let ret = new Decimal(.5)
                                return ret
                        },
                        effect(){
                                return tmp.T.buyables[22].base.times(player.T.buyables[22])
                        },
                        canAfford(){
                                return player.T.ranks.gte(tmp.T.buyables[22].cost)
                        },
                        cost(){
                                return layers.T.buyables.costFormula(player.T.buyables[22])
                        },
                        buy(){
                                if (!layers.T.buyables[22].canAfford()) return 
                                player.T.ranks = player.T.ranks.sub(tmp.T.buyables[22].cost)
                                player.T.buyables[22] = player.T.buyables[22].plus(1)
                        },
                        unlocked(){
                                return hasUpgrade("T", 25)
                        },
                },

                71: {
                        title: "Reset",
                        display(){
                                return br + "Reset all buyables"
                        },
                        buy(){
                                player.T.ranks = player.T.totalranks 
                                player.T.buyables[11] = decimalZero
                                player.T.buyables[12] = decimalZero
                                player.T.buyables[21] = decimalZero
                                player.T.buyables[22] = decimalZero
                        },
                        canAfford(){
                                return true 
                        },
                        unlocked(){
                                return true
                        },
                        style(){
                                return {height: '80px', width: '80px', 'border-radius': "20%"}
                        }
                },

                41: {
                        title: "Rank I",
                        display(){
                                if (!player.shiftAlias) {
                                        let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay("T", 41) + "</b><br>"
                                        let cost = "<b><h2>Requires</h2>: " + formatWhole(tmp.T.buyables[41].requires) + " Tiers</b><br>"
        
                                        return br + amt + cost + "Shift to see details"
                                }
                                let costForm = "<b><h2>Cost formula</h2>:<br> x^2+x+899</b>" + br
                                if (hasUpgrade("f", 22)) costForm = costForm.replace("899", formatWhole(player.T.points.sub(950).max(0).times(-1).plus(899).max(0)))
                                return br + costForm
                        },
                        canAfford(){
                                return player.T.points.gte(tmp.T.buyables[41].requires)
                        },
                        requires(){
                                let l = player.T.buyables[41]
                                let add = hasUpgrade("f", 22) ? player.T.points.sub(950).max(0).times(-1).plus(899).max(0) : 899
                                return l.plus(1).times(l).plus(add)
                        },
                        buy(){
                                if (!layers.T.buyables[41].canAfford()) return 
                                player.T.buyables[41] = player.T.buyables[41].plus(1)
                                player.T.ranks = player.T.ranks.plus(1)
                                player.T.totalranks = player.T.totalranks.plus(1)
                        },
                        unlocked(){
                                return true
                        },
                },
                42: {
                        title: "Rank II",
                        display(){
                                if (!player.shiftAlias) {
                                        let amt = "<b><h2>Amount</h2>: " + getBuyableAmountDisplay("T", 42) + "</b><br>"
                                        let cost = "<b><h2>Requires</h2>: " + formatWhole(tmp.T.buyables[42].requires) + " Better Everything</b><br>"
        
                                        return br + amt + cost + "Shift to see details"
                                }
                                let costForm = "<b><h2>Cost formula</h2>:<br> x<sup>3</sup> + 25x</b>" + br
                                return br + costForm
                        },
                        canAfford(){
                                return player.E.buyables[32].gte(tmp.T.buyables[42].requires)
                        },
                        requires(){
                                let l = player.T.buyables[42]
                                return l.times(l).plus(25).times(l)
                        },
                        buy(){
                                if (!layers.T.buyables[42].canAfford()) return 
                                player.T.buyables[42] = player.T.buyables[42].plus(1)
                                player.T.ranks = player.T.ranks.plus(1)
                                player.T.totalranks = player.T.totalranks.plus(1)
                        },
                        unlocked(){
                                return true
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                return "You are on Emerald tier " + formatWhole(player.E.tier) + "."
                                        }
                                ],
                                "prestige-button",
                                "blank", 
                                "upgrades"],
                        unlocked(){
                                return true
                        },
                },
                "Milestones": {
                        content: [
                                "main-display",
                                "milestones"
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Buyables": {
                        content: [
                                "main-display",
                                ["rank-display", "ranks"],
                                ["buyables", [1,2,3,7]]
                        ],
                        unlocked(){
                                return player.f.challenges[22] >= 2
                        },
                },
                "Ranks": {
                        content: [
                                "main-display",
                                ["rank-display", "ranks"],
                                ["buyables", [4,5,6]]
                        ],
                        unlocked(){
                                return player.f.challenges[22] >= 2
                        },
                },
        },
        doReset(layer){
                if (!getsReset("e", layer)) return 
                let data = player.T

                data.points = decimalZero
                if (layer != "f" || !hasMilestone("f", 9)) data.best = decimalZero

                data.upgrades = data.upgrades.slice(0, hasMilestone("f", 8) ? player.f.times : 0)
                
                data.milestones = data.milestones.slice(0, hasMilestone("f", 8) ? player.f.times : 0)
        },
})

