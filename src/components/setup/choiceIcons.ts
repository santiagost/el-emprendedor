import type { LucideIcon } from 'lucide-react';
import { Award, Banknote, Briefcase, Cpu, Factory, Handshake, HeartPulse, Landmark, Laptop, Megaphone, PiggyBank, Rocket, Store, Trophy, Wallet } from 'lucide-react';

/** Ícono de cada perfil, esquema de financiamiento (C4), rubro y objetivo; también el "punto de partida" de la vitrina. */
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
  o1_caja: Banknote,
  o2_marca: Award,
  o3_sana: HeartPulse,
  o4_salida: Rocket,
  o5_modelo: Trophy,
};
