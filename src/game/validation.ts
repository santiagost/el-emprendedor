import type { GameEvent } from "../types/game"
import { TAGS } from "../data/tags";
import type { Phase } from "./phases";

export const validateEventIds = (events: GameEvent[]): string[] => {

    const errores: string[] = [];

    events.forEach((ev) => {
        if (!ev.id.startsWith(`f${ev.phaseId}_`)) {
            errores.push(
                `El evento "${ev.id}" está mal nombrado. Debería comenzar con "f${ev.phaseId}_".`
            )
        }
    })

    const ids_duplicados = new Map<string, number>();
    events.forEach((ev) => {
        const id = ev.id;
        if (ids_duplicados.has(id)) {
            ids_duplicados.set(id, ids_duplicados.get(id)! + 1);
        } else {
            ids_duplicados.set(id, 1);
        }
    })

    ids_duplicados.forEach((cantidad, id) => {
        if (cantidad > 1) {
            errores.push(
                `El ID "${id}" está duplicado (${cantidad} apariciones).`
            );
        }
    });

    return errores;
};

export const validateOptionsAndPills = (events: GameEvent[]): string[] => {
    const errores: string[] = [];

    events.forEach((ev) => {
        if (ev.options.length > 3) {
            errores.push(
                `El evento ${ev.id} tiene mas de 3 opciones`)
        } else if (ev.options.length < 2) {
            errores.push(
                `El evento ${ev.id} tiene menos de 2 opciones`)
        }
        ev.options.forEach((op, index) => {
            if (!op.learningPill) {
                errores.push(
                    `La opción ${index + 1} del evento ${ev.id} no tiene píldora de aprendizaje`
                );
            }
        });
    })
    return errores;
}

export const validateTagsIntegrity = (events: GameEvent[]): string[] => {
    const errores: string[] = [];


    events.forEach((ev) => {
        ev.requiredTags?.forEach((tag) => {
            if (!(tag in TAGS)) {
                errores.push(
                    `El evento ${ev.id} tiene un requiredTag inválido: "${tag}"`
                );
            }
        });

        ev.forbiddenTags?.forEach((tag) => {
            if (!(tag in TAGS)) {
                errores.push(
                    `El evento ${ev.id} tiene un forbiddenTag inválido: "${tag}"`
                );
            }
        });
        ev.when?.tags?.forEach((tag) => {
            if (!(tag in TAGS)) {
                errores.push(
                    `El evento ${ev.id} tiene un tag inválido: "${tag}"`
                );
            }
        })

        ev.when?.forbiddenTags?.forEach((tag) => {
            if (!(tag in TAGS)) {
                errores.push(
                    `El evento ${ev.id} tiene un forbiddenTag de EventCondition inválido: "${tag}"`
                );
            }
        })

        ev.options.forEach((op) => {
            op.addTags?.forEach((tag) => {
                if (!(tag in TAGS)) {
                    errores.push(
                        `El evento ${ev.id} tiene un tag inválido: "${tag}"`
                    );
                }
            })
            op.removeTags?.forEach((tag) => {
                if (!(tag in TAGS)) {
                    errores.push(
                        `El evento ${ev.id} tiene un tag que se remueve inválido: "${tag}"`
                    );
                }
            })
        })
    });

    return errores;
}


export const validatePhasePacing = (events: GameEvent[], phases: readonly Phase[]): string[] => {
    const errores: string[] = [];

    phases.forEach((phase) => {
        // Cantidad de turnos que abarca la fase actual
        const turnsInPhase = phase.toTurn - phase.fromTurn + 1;

        // Eventos base: pertenecen a la fase y no tienen requerimientos previos de tags
        const baseEvents = events.filter((ev) => {
            if (ev.phaseId !== phase.id) return false;
            const hasRequired =
                (ev.requiredTags && ev.requiredTags.length > 0) ||
                (ev.when?.tags && ev.when.tags.length > 0);
            return !hasRequired;
        });

        if (baseEvents.length < turnsInPhase) {
            errores.push(
                `Fase ${phase.id} ("${phase.label}"): tiene ${baseEvents.length} eventos base pero dura ${turnsInPhase} turnos. Requiere al menos ${turnsInPhase} para garantizar que no haya softlocks.`
            );
        }
    });

    return errores;
}

export const validateScheduledEvents = (events: GameEvent[]): string[] => {
  const errores: string[] = [];
  const existingIds = new Set(events.map((e) => e.id));

  events.forEach((ev) => {
    ev.options.forEach((op, opIndex) => {
      if (op.scheduledEvent) {
        const { eventId, delayTurns } = op.scheduledEvent;

        if (!existingIds.has(eventId)) {
          errores.push(
            `El evento "${ev.id}" (opción ${opIndex + 1}) programa un evento inexistente: "${eventId}".`
          );
        }

        if (delayTurns < 1) {
          errores.push(
            `El evento "${ev.id}" (opción ${opIndex + 1}) tiene un delayTurns inválido (${delayTurns}). Debe ser >= 1.`
          );
        }
      }
    });
  });

  return errores;
};

export const detectOrphanTags = (events: GameEvent[], tags: Record<string, unknown> = TAGS): string[] => {
  const warnings: string[] = [];
  const used = new Set<string>();

  const collect = (tagList: readonly string[] | undefined) => {
    tagList?.forEach((tag) => used.add(tag));
  };

  events.forEach((ev) => {
    collect(ev.requiredTags);
    collect(ev.forbiddenTags);
    collect(ev.when?.tags);
    collect(ev.when?.forbiddenTags);
    ev.options.forEach((op) => {
      collect(op.addTags);
      collect(op.removeTags);
    });
  });

  Object.keys(tags).forEach((tag) => {
    if (!used.has(tag)) {
      warnings.push(`Tag huérfano: "${tag}" está registrado en TAGS pero ningún evento lo usa.`);
    }
  });

  return warnings;
};

export const detectDuplicateImpacts = (events: GameEvent[]): string[] => {
  const warnings: string[] = [];
  const seen = new Map<string, string[]>();

  events.forEach((ev) => {
    ev.options.forEach((op, opIndex) => {
      const signature = [
        op.effects.capital ?? 0,
        op.effects.bienestar ?? 0,
        op.effects.reputacion ?? 0,
      ].join('|');
      const label = `"${ev.id}" (opción ${opIndex + 1})`;
      seen.set(signature, [...(seen.get(signature) ?? []), label]);
    });
  });

  seen.forEach((labels, signature) => {
    if (labels.length > 1) {
      warnings.push(
        `Impacto repetido [${signature.split('|').join(', ')}] en ${labels.length} opciones: ${labels.join(', ')}.`
      );
    }
  });

  return warnings;
};