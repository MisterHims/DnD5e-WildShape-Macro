# WildShape

![Foundry Badge](https://img.shields.io/badge/Foundry-0.7.9-informational)

* **Author**: MisterHims
* **Special thanks to**: winterwulf, Jaweaver and many others :)
* **Version**: 0.1.4 Alpha
* **Foundry VTT Compatibility**: 0.7.9
* **System Compatibility**: DnD5e
* **Module(s) Requirement(s)**: [The Furnace](https://github.com/kakaroto/fvtt-module-furnace), [DAE](https://gitlab.com/tposney/dae), [Token Magic FX](https://github.com/Feu-Secret/Tokenmagic), [Midi-QOL](https://gitlab.com/tposney/midi-qol)
* **Macro(s) Requirement(s)**: [WildShape Effect Macro](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Effect%20Macro.js)
* **Langage(s)**: *[EN] (current)* <!-- , [[FR]](https://github.com/MisterHims/DnD5e-WildShape/blob/main/README-FR.md)-->

## Description

WildShape is a macro allowing to polymorph his token with the animations available from Token Magic FX. The actor's capabilities will thus be replaced by those of the desired shape and he will then see his token replaced.

The various DAE effects and Token Magic FX animations already present on your character will be preserved.

If the WildShape effect is removed, the new shape back to the original shape.

![WildShape-Demonstration-0.1.4-alpha](https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/0.1.4-alpha/images/dem-0-1-4-alpha.gif)

## Informations

* By default, you will transfer the following capabilities from your original form to your new form:
  * Mental abilities scores (Wisdom, Intelligence, Charisma)

  * Masteries of saving throws

  * Skills

  * Biography

  * Class features

You can yourself choose which capabilities to remove or add from the macro. More information at the bottom.

## Installation

Note:

* Foundry VTT polymorph requires players to have rights to create new actors and tokens. You will need to allow them to "Create new characters" and "Create new tokens" from the Options configuration.

* You must also give the players the ownership rights to the actor of the desired shape.

1. First, you need to import into Foundry VTT the "WildShape Effect Macro", save the macro with the name of "WildShape Effect Macro". Repeat the operation with the main "WildShape Macro", you will make the necessary modifications thereafter.

    **[WildShape Effect Macro](<https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Effect%20Macro.js>)**

    ```javascript
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
            token.TMFXhasFilterId("polymorphToOriginalForm")
            token.TMFXaddUpdateFilters(paramsBack)
            await delay(1100)
            transferDAEEffects()
            await delay(100)
            actor.revertOriginalForm()
            await delay(100)
            token.TMFXdeleteFilters("polymorphToOriginalForm")
        }
        backAnimation()
    }
    ```

    **[WildShape Macro](<https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Macro.js>)**

   ```javascript
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

        let transferDAEEffects = async function (actorOriginalForm) {
            if (!actor.data.flags.dnd5e?.isPolymorphed) {
                let actorNewShape = game.actors.get(actorNewFormId)
                let actorOriginalFormEffectsData = actorOriginalForm.effects.map(ef => ef.data)
                await actorNewShape.createEmbeddedEntity("ActiveEffect", actorOriginalFormEffectsData)
            } else {
                let actorNewShape = game.actors.get(actorNewFormId)
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
                console.log('DnD5e-WildShape | Tried to remove an effect but no more effects to remove')
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
                await token.TMFXhasFilterId("polymorphToNewForm")
                await TokenMagic.addUpdateFilters(target, paramsStart)
                await delay(1100)
                await actorPolymorphism()
                await delay(500)
                await token.TMFXdeleteFilters("polymorphToNewForm")
                let actorNewShape = game.actors.getName(actorNewShapeName)
                await actorNewShape.createEmbeddedEntity("ActiveEffect", applyWildShapeEffect)
                await removeDAEEffects().catch(err => console.error(err))
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
                token.TMFXhasFilterId("polymorphToOriginalForm")
                token.TMFXaddUpdateFilters(paramsBack)
                await delay(1100)
                await transferDAEEffects(actorOriginalForm)
                await actor.revertOriginalForm()
                await token.TMFXdeleteFilters("polymorphToOriginalForm")
                actorOriginalForm.effects.find(i => i.data.label === wildShapeEffectName).delete()
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
                    icon: '<i class="fas fa-check"></i>',
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
   ```

2. Subsequently, you can check in the Midi-QOL configurations if the checkbox "Auto apply item effects to target" and "Add macro to call on use" has been checked.

3. Get the Wild Shape 'item' from the SRD Compendium "Class Features" and import it to your item list.

4. Access the details tab of that item and in the "Feature Attack" section, select the "Utility" or "Other" Action Type to display the "On use macro" field. Then add "WildShape Macro" without the quotes in this field.

5. Now add the Wild Shape 'item' to the original character's sheet and to the shapes you want to adopt (in the "Beasts" folder). You can also drag and drop this item onto your quick access bar.

6. Then let's take the "WildShape Macro" previously added to Foundry VTT, also accessible from the collection [WildShape Macro](<https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/0.1.4-alpha/macros/WildShape.js>).

7. (Optional) Choose the name of the folder in which yours beasts are located:

    ```javascript
    // Name of the folder in which the beasts are located
    let beastsFolder = "Beasts"
    ```

    *[Line 2](https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Macro.js#L2)*

8. (Optional) Choose the name of the WildShape effect when it appears on the new shape:

    ```javascript
    // Name of your WildShape Effect
    let wildShapeEffectName = "WildShape Effect"
    ```

    *[Line 5](https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Macro.js#L5)*

## Tips

### Configure your Wild Shape item

You are free to configure your Wild Shape 'item' as yours needs, you can add for exemple the resource consumption for the original form (Attribute: resources.primary.values).

### Homogenize animation

For better animation quality, make the ratio size of your original token be the same as the new token form (0.5 and 0.5, 0.8 and 0.8, 1 and 1, ...). This could be automated later in a future version.

## Configuration

### Customize animation

You can choose different animations from Magic Token FX. There are 9 different types of animations (the one installed by default is number 6):

1. Simple transition

2. Dreamy

3. Twist

4. Water drop

5. TV Noise

6. Morphing

7. Take off/Put on you disguise!

8. Wind

9. Hologram

Then you need to replace the type number 6 by the animation number you want to use. Can be found in two places in the WildShape macro:

```javascript
    filterType: "polymorph",
    filterId: "polymorphToNewForm",
    type: 6,
    padding: 70,
    magnify: 1,
```

   *[Line 91 to 95](https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Macro.js#L92)*

```javascript
    filterType: "polymorph",
    filterId: "polymorphToOriginalForm",
    type: 6,
    padding: 70,
    magnify: 1,
```

   *[Line 135 to 139](https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Macro.js#L136)*

### Customize the size of the start and end shape

**IMPORTANT** | You are strongly advised not to make this modification if you do not have a good experience of javascript.

By default, the size of the start and end shape is automatically calculated. But if needed, you can change this size by modifying the ```width``` and ```height``` values displayed in two places on the macro.

The first is the size of the original shape:

```javascript
    target.update({
        "width": actorNewForm.data.token.width,
        "height": actorNewForm.data.token.height
```

   *[Line 128 to 129](https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Macro.js#L127)*

The second is the end shape:

```javascript
    target.update({
        "width": actorOriginalForm.data.token.width,
        "height": actorOriginalForm.data.token.height
```

   *[Line 167 to 168](https://github.com/MisterHims/DnD5e-WildShape-Macro/blob/main/macros/WildShape%20Macro.js#L166)*

You will also have to repeat this operation in the new "WildShape Effect Macro" (with another name and also change on line 54).

### Customize the skills to retain during the polymorph

You can remove and / or add different abilities that will be transferred to your new form during the polymorph:

* ```keepPhysical: true``` : Keep Physical Abilities scores (Str, Dex, Con)
* ```keepMental: true``` : Keep Mental Abilities scores (Wis, Int, Cha)
* ```keepSaves: true``` : Keep Saving throw Proficiency of the Character
* ```keepSkills: true``` : Keep Skill Proficiency of the Character
* ```mergeSaves: true``` : Merge Saving throw Proficiencies (take both) this will keep proficiencies of the character intact and also grant any extra proficiencies from the dragged on actor
* ```mergeSkills: true``` : Merge Skill Proficiency (take both) this will keep proficiencies of the character intact and also grant any extra proficiencies from the dragged on actor
* ```keepClass: true``` : Keep Proficiency bonus (leaves Class items in sheet) this will leave any Class "item" of the original actor in order to keep the original level and therefore Proficiency bonus
* ```keepFeats: true``` : Keep Features
* ```keepSpells: true``` : Keep Spells
* ```keepItems: true``` : Keep Equipment
* ```keepBio: true``` : Keep Biography
* ```keepVision: true``` : Keep Vision (Character and Token) if you want to preserve the exact way a token has vision on the map, this will do that. It will also not change the characters senses in the character sheet

## Frequently Asked Questions

Q: I don't understand, I did all the steps one by one after installing the required modules and it still doesn't work, why?

A: It's necessary to have previously correctly configured these different modules for the correct functioning of the macro. It's also required to have checked the box "Auto apply item to targets" in the configuration of Midi-QOL module.

***

Q: I experience a slight lag when animating my character for the first time, why?

A: During the first animation, the image of the new token is loaded in your browser and may therefore take a little while before appearing. Unfortunately, there is nothing we can do at the moment.

***

Q: When the transfer effects takes place, the associated macro executions are launched. How to deactivate them?

A: There is currently no long term solution, although this issue is known and is being resolved. When the executed macros concern dialog box choices, simply close the window.

## Upcoming improvements

I plan to improve this macro to make it a module. This will allow a much easier installation and will also allow you to quickly create and configure different polymorphs (choice of skills to keep, the name of the macro, the name of the effect, the size of the characters, the animation type, etc.)