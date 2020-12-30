# WildShape

![Foundry Badge](https://img.shields.io/badge/Foundry-0.7.6-informational)

* **Author**: MisterHims
* **Special thanks to**: tposney, Ikabodo, Archer, Crymic, Kandashi and many others :)
* **Version**: 0.1.3 Alpha
* **Foundry VTT Compatibility**: 0.7.6+
* **System Compatibility**: DnD5e
* **Module(s) Requirement(s)**: [The Furnace](https://github.com/kakaroto/fvtt-module-furnace), [DAE](https://gitlab.com/tposney/dae), [Token Magic FX](https://github.com/Feu-Secret/Tokenmagic), [Midi-QOL](https://gitlab.com/tposney/midi-qol)
* **Macro(s) Requirement(s)**: [WildShape Effect Macro](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Effect%20Macro.js)
* **Langage(s)**: *[EN] (current)*, [[FR]](https://github.com/MisterHims/DnD5e-WildShape/blob/main/README-FR.md)

## Description

WildShape is a macro allowing to polymorph his token with the animations available from Token Magic FX. The actor's capabilities will thus be replaced by those of the desired shape and he will then see his token replaced.

The various DAE effects and Token Magic FX animations already present on your character will be preserved.

If the WildShape effect is removed, the new shape back to the original shape.

![WildShape-Demonstration-0.1.2-alpha](https://github.com/MisterHims/DnD5e-WildShape/blob/0.1.2-alpha/images/dem-0-1-2-alpha.gif)

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

    **[WildShape Effect Macro](<https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Effect%20Macro.js>)**

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
        }
        backAnimation()
        target.update({
            "width": actorNewForm.data.token.width,
            "height": actorNewForm.data.token.height
        })
    }
    ```

    **[WildShape Macro](<https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js>)**

   ```javascript
    // Name of your WildShape Effect
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
            let actorNewShape = game.actors.getName(actorNewShapeName, actorOriginalFormId)
            actorNewShape.createEmbeddedEntity("ActiveEffect", applyWildShapeEffect)
            transferDAEEffects()
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
   ```

2. Subsequently, you can check in the Midi-QOL configurations if the checkbox "Auto apply item effects to target" and "Add macro to call on use" has been checked.

3. Get the Wild Shape 'item' from the SRD Compendium "Class Features" and import it to your item list.

4. Access the details tab of that item and in the "Feature Attack" section, select the "Utility" or "Other" Action Type to display the "On use macro" field. Then add "WildShape Macro" without the quotes in this field.

5. Then let's take the "WildShape Macro" previously added to Foundry VTT, also accessible from the collection [WildShape Macro](<https://github.com/MisterHims/DnD5e-WildShape/blob/0.1.2-alpha/macros/WildShape.js>).

6. Change the ID in line 5 to the ID of the main actor:

    ```javascript
    // ID of your Original Form Actor
    let actorOriginalFormId = "p7IwDtKTmpWP52Pu"
    ```

    *[Line 5](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L5)*

7. Replace the ID in line 180 with the ID of the actor whose shape you want to adopt:

    ```javascript
    // ID of your New Form Actor
    let actorNewFormId = "6tag3KViMYOHciFe"
    ```

    *[Line 8](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L8)*

    *A simple trick to finding out a character ID is to open an article from the Journal tab, switch it to edit mode, then drag and drop actors from the Characters tab.*

After making these changes, you should be able to get the macro to work. If not, you will find more information at the bottom of the page.

8. You are also free to change the name of the effect when it appears on the new shape:

    ```javascript
    // Name of your WildShape Effect
    let wildShapeEffectName = "WildShape Effect"
    ```

    *[Line 2](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L2)*

## How to add another WildShape

1. You need to duplicate the "WildShape Macro" and rename that copy as you wish (like "Arthur WildShape to Tiger").

2. Then re-edit that macro by changing:

    * the new actor ID (or not if it's the same actor):

        ```javascript
        // ID of your Original Form Actor
        let actorOriginalFormId = "n9fMPL4lmbGX8K6p"
        ```

        *[Line 5](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L5)*

    * the new actor ID you want to be polymorph:

        ```javascript
        // ID of your New Form Actor
        let actorNewFormId = "hbhb7dTZs8zop6XC"
        ```

        *[Line 8](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L8)*

3. Then create a new Wild Shape 'item' and add the new macro name in the 'on use macro' field. For example: "Arthur WildShape to Tiger" without the quotes.

4. Add this new "WildShape" item to the actor of your original shape and new shape.

## Tips

### Configure your Wild Shape item

You are free to configure your Wild Shape 'item' as yours needs, you can add for exemple the resource consumption for the original form (Attribute: resources.primary.values).

### Homogenize animation

For better animation quality, make the ratio size of your original token be the same as the new token form (0.5 and 0.5, 0.8 and 0.8, 1 and 1, ...).

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

   *[Line 94 to 98](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L96)*

```javascript
    filterType: "polymorph",
    filterId: "polymorphToOriginalForm",
    type: 6,
    padding: 70,
    magnify: 1,
```

   *[Line 136 to 140](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L138)*

### Customize the size of the start and end shape

**IMPORTANT** | You are strongly advised not to make this modification if you do not have a good experience of javascript.

By default, the size of the start and end shape is automatically calculated. But if needed, you can change this size by modifying the ```width``` and ```height``` values displayed in two places on the macro.

The first is the size of the original shape:

```javascript
    target.update({
        "width": actorNewForm.data.token.width,
        "height": actorNewForm.data.token.height
```

   *[Line 128 to 129](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L127)*

The second is the end shape:

```javascript
    target.update({
        "width": actorOriginalForm.data.token.width,
        "height": actorOriginalForm.data.token.height
```

   *[Line 169 to 170](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape%20Macro.js#L168)*

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
