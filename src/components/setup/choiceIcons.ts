import type { LucideIcon } from 'lucide-react';
import { Briefcase, Cpu, Factory, Handshake, Landmark, Laptop, Megaphone, PiggyBank, Store, Wallet } from 'lucide-react';

/** Ícono de cada perfil, esquema de financiamiento (C4) y rubro; también el "punto de partida" de la vitrina. */
export const CHOICE_ICONS: Record<string, LucideIcon> = {
  a1_tecnico: Cpu,
  a2_comercial: Megaphone,
  a3_inversionista: PiggyBank,
  f1_bootstrap: Wallet,
  f2_prestamo_bancario: Landmark,
  f3_socio_angel: Handshake,
  r1_tecnologia: Laptop,
  r2_comercio: Store,
  r3_servicios: Briefcase,
  r4_produccion: Factory,
};
