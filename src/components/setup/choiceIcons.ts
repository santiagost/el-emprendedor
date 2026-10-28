import type { LucideIcon } from 'lucide-react';
import { Cpu, Handshake, Landmark, Megaphone, PiggyBank, Wallet } from 'lucide-react';

/** Ícono de cada perfil y esquema de financiamiento (C4); también el "punto de partida" de la vitrina. */
export const CHOICE_ICONS: Record<string, LucideIcon> = {
  a1_tecnico: Cpu,
  a2_comercial: Megaphone,
  a3_inversionista: PiggyBank,
  f1_bootstrap: Wallet,
  f2_prestamo_bancario: Landmark,
  f3_socio_angel: Handshake,
};
