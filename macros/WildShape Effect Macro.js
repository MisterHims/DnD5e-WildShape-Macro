let target = canvas.tokens.controlled[0]
let actorOriginalFormId = args[1]
let actorOriginalForm = game.actors.get(actorOriginalFormId)
let actorOriginalFormName = actorOriginalForm.data.name
let actorOriginalFormImagePath = args[2]
let actorNewForm = game.actors.get(args[3])
let actorNewShapeName = args[4]
let transferDAEEffects = async function () {
    if (actor.data.flags.dnd5e?.isPolymorphed) {
        let actorNewShape = game.actors.getName(actorNewShapeName)
        let actorNewShapeEffectsData = actorNewShape.effects.map(ef => ef.data)
        await actorOriginalForm.createEmbeddedEntity("ActiveEffect", actorNewShapeEffectsData)
    }
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
if (actor.data.flags.dnd5e?.isPolymorphed && args[0] === "off") {
    actorOriginalFormImagePath = actorOriginalForm.data.token.img
    let paramsBack =
        [{
            filterType: "polymorph",
            filterId: "polymorphToOriginalForm",
            type: 6,
            padding: 70,
            magnify: 1,
            imagePath: actorOriginalFormImagePath,
            animated:
            {
                progress:
                {
                    active: true,
                    animType: "halfCosOscillation",
                    val1: 0,
                    val2: 100,
                    loops: 1,
                    loopDuration: 1000
                }
            }
        }]
    target.update({
        "width": actorOriginalForm.data.token.width,
        "height": actorOriginalForm.data.token.height
    })
    async function backAnimation() {
        await Hooks.once("sightRefresh", async function () {
            await token.TMFXdeleteFilters("polymorphToOriginalForm")
        });
        await token.TMFXhasFilterId("polymorphToOriginalForm")
        await token.TMFXaddUpdateFilters(paramsBack)
        await delay(1100)
        await actor.revertOriginalForm()
    }
    backAnimation()
}