/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LOGISTICS HUB NETWORK - ZERO STOCK INFRASTRUCTURE
 * ═══════════════════════════════════════════════════════════════════════════════
 * Banco de dados de endereços dos hubs regionais de fornecedores.
 * Usado para gerar etiquetas de devolução direta (Dropshipping Reverso).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export const SUPPLIER_HUBS: Record<string, any> = {
    'SP': {
        name: 'Hub Central São Paulo',
        address: 'Av. Paulista, 1000 - Centro Logístico A',
        city: 'São Paulo',
        state: 'SP',
        zip: '01310-100'
    },
    'SC': {
        name: 'Hub Importados Sul',
        address: 'Rodovia BR-101, Km 200 - Galpão Tech',
        city: 'Itajaí',
        state: 'SC',
        zip: '88301-000'
    },
    'MG': {
        name: 'Centro de Distribuição Sudeste',
        address: 'Anel Rodoviário, 500 - Módulo B',
        city: 'Belo Horizonte',
        state: 'MG',
        zip: '30100-000'
    },
    'PR': {
        name: 'Hub Conexão Paraná',
        address: 'Av. das Torres, 3000',
        city: 'Curitiba',
        state: 'PR',
        zip: '80000-000'
    },
    'AM': {
        name: 'Zona Franca Tech Hub',
        address: 'Av. Autaz Mirim, 200 - Distrito Industrial',
        city: 'Manaus',
        state: 'AM',
        zip: '69000-000'
    },
    'RJ': {
        name: 'Hub Rio Expresso',
        address: 'Via Dutra, Km 180',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zip: '21000-000'
    },
    'Global': {
        name: 'International Returns Center',
        address: 'Port of Santos - Gate 4',
        city: 'Santos',
        state: 'SP',
        zip: '11000-000'
    }
};

export function getReturnAddress(locationCode: string) {
    return SUPPLIER_HUBS[locationCode] || SUPPLIER_HUBS['Global'];
}
