import type { Rubro } from '../types/game';

/** Rubros de la empresa. Solo ordenan qué situaciones aparecen (when.rubro); no cambian métricas ni etiquetas. */
export const RUBROS: Rubro[] = [
    {
        id: 'r1_tecnologia',
        titulo: 'Tecnología',
        descripcion: 'Software, aplicaciones o plataformas digitales. Tu producto vive en la nube y puede crecer muy rápido.',
    },
    {
        id: 'r2_comercio',
        titulo: 'Comercio',
        descripcion: 'Vendés productos: una tienda, distribución o importación. Todo pasa por el stock, los proveedores y el margen.',
    },
    {
        id: 'r3_servicios',
        titulo: 'Servicios',
        descripcion: 'Vendés tu tiempo y tu saber hacer: consultoría, diseño, salud o educación. Tu equipo es tu producto.',
    },
    {
        id: 'r4_produccion',
        titulo: 'Producción',
        descripcion: 'Fabricás algo: alimentos, indumentaria o piezas. Máquinas, insumos y la calidad de cada lote.',
    },
];
