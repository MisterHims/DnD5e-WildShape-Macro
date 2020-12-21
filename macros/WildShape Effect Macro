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