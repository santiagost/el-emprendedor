import type { Objetivo } from '../types/game';

/**
 * Objetivos de la partida. El jugador elige uno al empezar y el informe final dice si lo cumplió.
 * No cambian el motor ni los eventos. Los mínimos salen de simular partidas (ver docs): hay que recalibrarlos cuando cambie el contenido.
 */
export const OBJETIVOS: Objetivo[] = [
    {
        id: 'o1_caja',
        titulo: 'Hacer caja',
        descripcion:
            'Tu prioridad es el dinero. Terminá la partida con el mayor capital posible (70 o más), dejando de lado aspectos como la salud de tu equipo o cómo te vean tus clientes.',
        criterio: { tipo: 'metrica', metrica: 'capital', minimo: 70 },
    },
    {
        id: 'o2_marca',
        titulo: 'Marca reconocida',
        descripcion:
            'Querés que todos confíen en tu nombre. Terminá la partida con la mayor reputación posible (90 o más), sin que te preocupe tanto la caja ni el cansancio de tu equipo.',
        criterio: { tipo: 'metrica', metrica: 'reputacion', minimo: 90 },
    },
    {
        id: 'o3_sana',
        titulo: 'Empresa sana',
        descripcion:
            'Buscás una empresa equilibrada. Terminá la partida con el capital, la reputación y el bienestar de tu equipo en 70 o más, sin descuidar ninguno.',
        criterio: { tipo: 'todas', minimo: 70 },
    },
    {
        id: 'o4_salida',
        titulo: 'Llegar a la salida',
        descripcion:
            'Tu meta es cerrar con una salida. Terminá la partida vendiendo tu empresa, expandiéndote a otros países o dejándola como un negocio sostenible que funciona sin vos todo el día.',
        criterio: { tipo: 'salida' },
    },
    {
        id: 'o5_modelo',
        titulo: 'Empresa modelo',
        descripcion:
            'El desafío más difícil: una empresa sin puntos débiles. Terminá la partida con el capital, la reputación y el bienestar de tu equipo en 90 o más.',
        criterio: { tipo: 'todas', minimo: 90 },
    },
];
