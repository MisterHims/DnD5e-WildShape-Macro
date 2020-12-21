if (actor.data.flags.dnd5e?.isPolymorphed) {
    let originalActor = game.actors.get(actor.data.flags.dnd5e.originalActor);
    let effectsData = originalActor.effects.map(ef => ef.data);
    actor.createEmbeddedEntity("ActiveEffect", effectsData)
}