// Name of your WildShape Effect
let wildShapeEffectName = "WildShape Effect";

// ID of your original form
let actorOriginalFormId = game.actors.get("n9fMPL4lmbGX8K6p");
// Get Image's Token associated with the original actor form
let actorOriginalFormImagePath = actorOriginalFormId.data.token.img;

// ID of your new form
let actorNewFormId = game.actors.get("hbhb7dTZs8zop6XC");
// Get Image's Token associated with the new actor form
let actorNewFormImagePath = actorNewFormId.data.token.img;

let actorOriginalFormName = actorOriginalFormId.data.name

// Get the Actor name from the original form
let getOriginalActorForm = game.actors.getName(actorOriginalFormName);
// Get Actor ID from the original form

let target = canvas.tokens.controlled[0];

// Declare the polymorph function
let actorPolymorphism = async function () {
    // For actorNewFormID, the ratio's Token scale should be the same of the original form
    actor.transformInto(actorNewFormId, {
        keepMental: true,
        mergeSaves: true,
        mergeSkills: true,
        keepBio: true,
        keepClass: true,
    });
}

// Declare the WildShape Effect
let applyWildShapeEffect = {
    label: wildShapeEffectName,
    icon: "systems/dnd5e/icons/skills/green_13.jpg",
    changes: [{
        "key": "macro.execute",
        "mode": 1,
        "value": `"WildShape Effect Macro"` + `"${wildShapeEffectName}"` + `"${actorOriginalFormName}"` + `"${actorOriginalFormImagePath}"`,
        "priority": "20"
    }],
    duration: {
        "seconds": 7200,
    }
}

// If actor is not already polymorphed, apply the WildShape effect, launch animation and the polymorph then transfer all effects
if (!actor.data.flags.dnd5e?.isPolymorphed) {
    actor.createEmbeddedEntity("ActiveEffect", applyWildShapeEffect);
    token.TMFXhasFilterId("polymorphToNewForm");
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
    }];
    TokenMagic.addUpdateFilters(target, paramsStart);
    setTimeout(function () { token.TMFXdeleteFilters("polymorphToNewForm") }, 1800);

    // Polymorph into the new form with delay for the start animation
    setTimeout(function () { actorPolymorphism(); }, 1500);

    // Transfer all effects from original actor to new actor
    let transferDAEEffects = game.macros.getName("Transfer DAE Effects");

    // With delay for the animation time
    setTimeout(function () { transferDAEEffects.execute(); }, 3000);

    // Set the token size of the new form
    // target.update({ "width": 1, "height": 1, });

// If actor is polymorphed, remove the WildShape effect, launch animation and revert to original form
} else if (actor.data.flags.dnd5e?.isPolymorphed) {
    let removeWildShapeEffect = game.macros.getName("Remove WildShape Effect");
    removeWildShapeEffect.execute(actorOriginalFormName, wildShapeEffectName);
    token.TMFXhasFilterId("polymorphToOriginalForm");
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
        }];
    token.TMFXaddUpdateFilters(paramsBack);
    setTimeout(function () { token.TMFXdeleteFilters("polymorphToOriginalForm") }, 1800);
    // Revert to original form with delay for the return animation
    setTimeout(function () { actor.revertOriginalForm(); }, 1500);
    // Set the token size of the original form
    // target.update({"width": 1, "height": 1,});
}
