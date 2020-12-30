// Name of your WildShape Effect (it's recommended to have a different effect name for each new WildShape macro)
let wildShapeEffectName = "WildShape Effect"

// ID of your Original Form Actor
let actorOriginalFormId = "p7IwDtKTmpWP52Pu"

// ID of your New Form Actor
let actorNewFormId = "6tag3KViMYOHciFe"

/////////////////////////////////////////////////////////////

// Get the Original Form Actor
let actorOriginalForm = game.actors.get(actorOriginalFormId)
// Get the Original Form Actor Name
let actorOriginalFormName = actorOriginalForm.data.name
// Image's Token associated with the original actor form
let actorOriginalFormImagePath = actorOriginalForm.data.token.img

// Get the New Form Actor
let actorNewForm = game.actors.get(actorNewFormId)
// Get the New Form Actor Name
let actorNewFormName = actorNewForm.data.name
// Image's Token associated with the new actor form
let actorNewFormImagePath = actorNewForm.data.token.img

// Get the New Shape Actor Name
let actorNewShapeName = actorOriginalForm.data.name + ' (' + actorNewForm.data.name + ')'

// Get the New Shape Actor

// Declare the target
let target = canvas.tokens.controlled[0]

// Declare the delay variable to adjust with animation
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// Declare the polymorph function
let actorPolymorphism = async function () {
    // For actorNewForm, the ratio's Token scale should be the same of the original form
    actor.transformInto(actorNewForm, {
        keepMental: true,
        mergeSaves: true,
        mergeSkills: true,
        keepBio: true,
        keepClass: true,
    })
}

// Declare the WildShape Effect
let applyWildShapeEffect = {
    label: wildShapeEffectName,
    icon: "systems/dnd5e/icons/skills/green_13.jpg",
    changes: [{
        "key": "macro.execute",
        "mode": 1,
        "value": `"WildShape Effect Macro"` + `"${actorOriginalFormId}"` + `"${actorOriginalFormImagePath}"` + `"${actorNewFormId}"` + `"${actorNewShapeName}"`,
        "priority": "20"
    }],
    duration: {
        "seconds": 7200,
    }
}

// Declare the Transfer DAE Effects function
let transferDAEEffects =  async function () {
    if (!actor.data.flags.dnd5e?.isPolymorphed) {
        let actorNewShape = game.actors.getName(actorNewShapeName)
        let actorOriginalFormEffectsData = actorOriginalForm.effects.map(ef => ef.data)
        await actorNewShape.createEmbeddedEntity("ActiveEffect", actorOriginalFormEffectsData)
    } else if (actor.data.flags.dnd5e?.isPolymorphed) {
        let actorNewShape = game.actors.getName(actorNewShapeName)
        let actorNewShapeEffectsData = actorNewShape.effects.map(ef => ef.data)
        await actorOriginalForm.createEmbeddedEntity("ActiveEffect", actorNewShapeEffectsData)
    }
}

// Declare the Remove DAE Effects function
let removeDAEEffects = async function () {
    try {
        let mapOriginalActorEffects = actorOriginalForm.effects.map(i => i.data.label)
        for (let effect in mapOriginalActorEffects) {
            let actorOriginalFormEffects = actorOriginalForm.effects.find(i => i.data.label === mapOriginalActorEffects[effect])
            actorOriginalFormEffects.delete()
        }
    }
    catch (error) {
        console.log('No more effects to remove')
    }

}

// If not already polymorphed, launch startAnimation function
if (!actor.data.flags.dnd5e?.isPolymorphed) {
    token.TMFXhasFilterId("polymorphToNewForm")
    let paramsStart = [{
        filterType: "polymorph",
        filterId: "polymorphToNewForm",
        type: 6,
        padding: 70,
        magnify: 1,
        imagePath: actorNewFormImagePath,
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
        },
        autoDisable: false,
        autoDestroy: false
    }]
    async function startAnimation() {
        TokenMagic.addUpdateFilters(target, paramsStart)
        await delay(1100)
        actorPolymorphism()
        await delay(1000)
        token.TMFXdeleteFilters("polymorphToNewForm")
        await delay(100)
        let actorNewShape = game.actors.getName(actorNewShapeName, actorOriginalFormId)
        actorNewShape.createEmbeddedEntity("ActiveEffect", applyWildShapeEffect)
        await delay(300)
        transferDAEEffects()
        await delay(400)
        console.log("Delete All Original Actor Effects")
        removeDAEEffects().catch(err => console.error(err))
    }
    startAnimation()
    target.update({
        "width": actorNewForm.data.token.width,
        "height": actorNewForm.data.token.height
    })
    // If actor is polymorphed, launch backAnimation function
} else if (actor.data.flags.dnd5e?.isPolymorphed) {
    token.TMFXhasFilterId("polymorphToOriginalForm")
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
    async function backAnimation() {
        token.TMFXaddUpdateFilters(paramsBack)
        await delay(1100)
        transferDAEEffects()
        await delay(100)
        actor.revertOriginalForm()
        await delay(100)
        token.TMFXdeleteFilters("polymorphToOriginalForm")
        await delay(100)
        console.log("Delete WildShape Effect")
        game.actors.getName("Aoth").effects.find(i => i.data.label === "WildShape Effect").delete()
    }
    backAnimation()
    target.update({
        "width": actorNewForm.data.token.width,
        "height": actorNewForm.data.token.height
    })
}