// Name of the folder in which the beasts are located
let beastsFolder = "Beasts"

// Name of your WildShape Effect
let wildShapeEffectName = "WildShape Effect"

/////////////////////////////////////////////////////

// Declare the target
let target = canvas.tokens.controlled[0]

// Get the ID of your the actual target (current Actor Form)
let currentFormActorId = target.actor.data._id

// Declare my WildShape transformation function
let wildShapeTransform = async function (actorOriginalForm, actorNewFormId) {

    // Image's Token associated with the original actor form
    let actorOriginalFormImagePath = actorOriginalForm.data.token.img

    // Get the New Form Actor
    let actorNewForm = game.actors.get(actorNewFormId)
    // Set the token rotation to default value
    actorNewForm._data.token.rotation = 0
    // Image's Token associated with the new actor form
    let actorNewFormImagePath = actorNewForm.data.token.img

    // Get the New Shape Actor Name
    let actorNewShapeName = actorOriginalForm.data.name + ' (' + actorNewForm.data.name + ')'

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
            "value": `"WildShape Effect Macro"` + `"${currentFormActorId}"` + `"${actorOriginalFormImagePath}"` + `"${actorNewFormId}"` + `"${actorNewShapeName}"`,
            "priority": "20"
        }],
        duration: {
            "seconds": 7200,
        }
    }
    // Declare the delay variable to adjust with animation
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    // If not already polymorphed, launch startAnimation function
    if (!actor.data.flags.dnd5e?.isPolymorphed) {
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

        target.update({
            "width": actorNewForm.data.token.width,
            "height": actorNewForm.data.token.height
        })
        async function startAnimation() {
            await Hooks.once("createActiveEffect", async function () {
                await token.TMFXdeleteFilters("polymorphToNewForm")
            });
            await token.TMFXhasFilterId("polymorphToNewForm")
            await TokenMagic.addUpdateFilters(target, paramsStart)
            await delay(1100)
            await actorPolymorphism()
            await Hooks.once("sightRefresh", async function () {
                let actorNewShape = game.actors.getName(actorNewShapeName)
                await actorNewShape.createEmbeddedEntity("ActiveEffect", applyWildShapeEffect)
            });
        }
        startAnimation()
        // If actor is polymorphed, launch backAnimation function
    } else {
        // Image's Token associated with the original actor form
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
            await token.TMFXdeleteFilters("polymorphToOriginalForm")
            await token.TMFXhasFilterId("polymorphToOriginalForm")
            await token.TMFXaddUpdateFilters(paramsBack)
            await delay(1100)
            await actor.revertOriginalForm()
            await token.TMFXdeleteFilters("polymorphToOriginalForm")
        }
        backAnimation()
    }
}

// If not already polymorphed, display the dialog box
if (!actor.data.flags.dnd5e?.isPolymorphed) {
    let actorOriginalForm = game.actors.get(currentFormActorId)
    let selectBeasts = '<form><div class="form-group"><label>Choose the beast: </label><select id="wildShapeBeasts">';
    game.folders.getName(beastsFolder).content.forEach(function (beast) {
        let optBeast = '<option value="' + beast.data._id + '">' + beast.data.name + '</option>';
        selectBeasts += optBeast;
    });
    selectBeasts += '</select></div></form>'
    new Dialog({
        title: "DnD5e-WildShape",
        content: selectBeasts,
        buttons: {
            yes: {
                icon: '<i class="fas fa-paw"></i>',
                label: "Roar!",
                callback: () => {
                    // Get the New Form Actor ID
                    let actorNewFormId = $('#wildShapeBeasts').find(":selected").val();
                    wildShapeTransform(actorOriginalForm, actorNewFormId);
                }
            }
        }
    }).render(true);
    // Else, launch the WildShape transformation function
} else {
    let actorOriginalId = game.actors.get(currentFormActorId)._data.flags.dnd5e.originalActor
    let actorOriginalForm = game.actors.get(actorOriginalId)
    let actorNewFormId = _token.actor.data._id
    wildShapeTransform(actorOriginalForm, actorNewFormId);
}