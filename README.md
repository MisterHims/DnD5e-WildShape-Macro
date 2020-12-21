# WildShape

![Foundry Badge](https://img.shields.io/badge/Foundry-0.7.6-informational)

* **Author**: MisterHims
* **Special thanks to**: tposney, Ikabodo, Archer, Crymic, Kandashi and many others :)
* **Version**: 0.1.2 Alpha
* **Foundry VTT Compatibility**: 0.7.6+
* **System Compatibility**: DnD5e
* **Module(s) Requirement(s)**: [The Furnace](https://github.com/kakaroto/fvtt-module-furnace), [DAE](https://gitlab.com/tposney/dae), [Token Magic FX](https://github.com/Feu-Secret/Tokenmagic), [Midi-QOL](https://gitlab.com/tposney/midi-qol)
* **Macro(s) Requirement(s)**: [Transfer DAE Effects](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/%5BWildShape%5D%20Transfer%20DAE%20Effects.js), [Remove WildShape Effect](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/Remove%20WildShape%20Effect.js), [WildShape Effect Macro](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/Remove%20WildShape%20Effect.js)
* **Langage(s)**: *[EN] (current)*, [[FR]](https://github.com/MisterHims/DnD5e-WildShape/blob/main/README-FR.md)

## Description

WildShape is a macro allowing to polymorph his token with the animations available from Token Magic FX. The actor's capabilities will thus be replaced by those of the desired shape and he will then see his token replaced.

The various DAE effects and Token Magic FX animations already present on your character will be preserved.

If the WildShape effect is removed, the new shape back to the original shape.

![WildShape-Demonstration-01](https://github.com/MisterHims/DnD5e-WildShape/blob/main/images/dem_01.gif)

## Informations

* By default, you will transfer the following capabilities from your original form to your new form:
  * Mental abilities scores (Wisdom, Intelligence, Charisma)

  * Masteries of saving throws

  * Skills

  * Biography

  * Class features

You can yourself choose which capabilities to remove or add from the macro. More information on this at the bottom.

## Installation

The purpose of this macro is to become a module thereafter and the installation of this one will not be so "complicated" any more.

*Note* :

* Foundry VTT polymorph requires players to have rights to create new actors and tokens. You will need to allow them to "Create new characters" and "Create new tokens" from the Options configuration.

* You must also give the players the ownership rights to the actor of the desired shape.

**IMPORTANT** | Follow the steps below exactly, then you will be free to configure the macro to your needs after installation.

1. First, you need to import into Foundry VTT the three required external macros, save them with their respective names. Repeat the operation with the main "WildShape" Macro", you will make the necessary modifications thereafter.

    **[WildShape Effect Macro](<https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/Remove%20WildShape%20Effect.js>)**

    ```javascript
    let getOriginalActorForm = game.actors.getName(args[2]);
    let actorOriginalFormImagePath = args[3];
    let removeWildShapeEffect = game.macros.getName("Remove WildShape Effect");
    if (actor.data.flags.dnd5e?.isPolymorphed && args[0] === "off") {
        removeWildShapeEffect.execute(args[2], args[1]);
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
        setTimeout(function () { actor.revertOriginalForm(); }, 1500);
        // Set the token size of the original form
        // target.update({"width": 1, "height": 1,});
    }
    ```

    **[Transfer DAE Effects](<https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/%5BWildShape%5D%20Transfer%20DAE%20Effects.js>)**

    ```javascript
    if (actor.data.flags.dnd5e?.isPolymorphed) {
        let originalActor = game.actors.get(actor.data.flags.dnd5e.originalActor);
        let effectsData = originalActor.effects.map(ef => ef.data);
        actor.createEmbeddedEntity("ActiveEffect", effectsData)
    }
    ```

    **[Remove WildShape Effect](<https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/Remove%20WildShape%20Effect.js>)**

    ```javascript
    setTimeout(function () {
        let WildShapeEffect = game.actors.getName(args[0]);
        let removeWildShapeEffect = WildShapeEffect.effects.find(i => i.data.label === args[1]);
        removeWildShapeEffect.delete();
    }, 3500);
    ```

2. Subsequently, you can check in the Midi-QOL configurations if the checkbox "Auto apply item effects to target" and "Add macro to call on use" has been checked.

3. Get the Wild Shape 'item' from the SRD Compendium "Class Features" and import it to your item list.

4. Access the details tab of that item and in the "Feature Attack" section, select the "Utility" or "Other" Action Type to display the "On use macro" field. Then add "WildShape Macro" without the quotes in this field.

5. Then let's take the "WildShape Macro" previously added to Foundry VTT, also accessible from the collection [WildShape.js](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js):

   ```javascript
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
        setTimeout(function () { actor.createEmbeddedEntity("ActiveEffect", applyWildShapeEffect); }, 1600);
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
        setTimeout(function () { transferDAEEffects.execute(); }, 2000);

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
   ```

6. Change the ID in line 5 to the ID of the main actor.

7. Replace the ID in line 10 with the ID of the actor whose shape you want to adopt.

    *A simple trick to finding out a character ID is to open an article from the Journal tab, switch it to edit mode, then drag and drop actors from the Characters tab inside.*

After making these changes, you should be able to get the macro to work. If not, you will find more information at the bottom of the page.

## How to add another WildShape

*Creating a new "WildShape" can be a bit boring but it will be greatly improved in the next release.*

### On the same actor

1. You need to duplicate the "WildShape Macro" and rename that copy as you wish (like "Arthur WildShape to Tiger").

2. Then re-edit that macro by changing:

    * the name of the new effect that you will create later (in step 4):

        ```javascript

            // Name of your WildShape Effect
            let wildShapeEffectName = "WildShape Effect";

        ```

        *[Line 5](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L5)*

    * the new actor ID you want to be polymorph:

        ```javascript

        // Get Actor ID from the new form
        let actorNewFormId = game.actors.get("6tag3KViMYOHciFe");

        ```

        *[Line 15](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L15)*

3. Create or duplicate an existing Wild Shape item and give it a name (like "WildShape to Tiger").

4. Change the active effect of this new item by giving it the name you already assigned in step 2.

5. Then change the name of the new macro created in step 1 in the macro.execute of this effect.

Don't forget to add this new "WildShape" item to the actor of your original shape and new shape.

### To a different actor

Repeat the operation above, this time adding the new actor ID of the original form:

```javascript

// Get Actor ID from the original form
let actorOriginalFormId = game.actors.get("JmJGW3LivaKbKZYm");

```

*[Line 10](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L10)*

## Tips

### Configure your Wild Shape item

You are free to configure your Wild Shape 'item' as yours needs, you can add for exemple the resource consumption for the original form (Attribute: resources.primary.values).

### Homogenize animation

For a better animation, make the ratio size of your original token be the same as the new token form (0.5 and 0.5, 0.8 and 0.8, 1 and 1, ...).

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

   *[Line 40 to 44](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L42)*

```javascript

    filterType: "polymorph",
    filterId: "polymorphToOriginalForm",
    type: 6,
    padding: 70,
    magnify: 1,

```

   *[Line 85 to 89](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L87)*

### Customize the size of the start and end shape

By default, the size of the start and end shape is set to 1x1 square. You can change this size by changing the ```width``` and ```height``` values displayed in two places on the macro.

The first is the size of the original shape:

```javascript

    // Choose the token size of the new form
    // target.update({ "width": 1, "height": 1, });

```

   *[Line 73](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L73)*

The second is the end shape:

```javascript

    // Adjusts them back the original size.
    // target.update({"width": 1, "height": 1,});

```

   *[Line 109](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L109)*

Don't forget to uncomment these lines by deleting the two slashes in front.

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

Q: I experience a slight lag when animating my character, sometimes I also see a 1 second frame with my old shape appearing during the transition. I don't know how to solve this issue, what to do?

A: Depending on the configuration and optimization of the effects performed by your browser, you may need to make some adjustments on the macro when you encounter the following lines:

```javascript

    setTimeout(function () { token.TMFXdeleteFilters("polymorphToNewForm") }, 1800);

```

   *[Line 63](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L63)*

```javascript

    setTimeout(function () { token.TMFXdeleteFilters("polymorphToOriginalForm") }, 1800);

```

   *[Line 105](https://github.com/MisterHims/DnD5e-WildShape/blob/main/macros/WildShape.js#L105)*

You will then have to play on the value (1800 in this precise case) and reduce or increase this number. This code is used to stop the animation loop, so it is necessary to keep it but you are free to change its value.

## Upcoming improvements

I plan to improve this macro to make it a module. This will allow a much easier installation and will also allow you to quickly create and configure different polymorphs (choice of skills to keep, the name of the macro, the name of the effect, the size of the characters, the animation type, etc.)
