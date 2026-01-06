/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GLOBAL PRODUCT CATALOG v1.0
 * ═══════════════════════════════════════════════════════════════════════════════
 * Banco de dados estático otimizado para Zero Latency e Zero Cost.
 * Compartilhado entre Sourcing API e Checkout Validator.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface GlobalProduct {
    keywords: string[];
    name: string;
    description: string;
    price: number;
    original_price: number;
    category: string;
    supplier: string;
}

export const GLOBAL_PRODUCT_CATALOG: GlobalProduct[] = [
    // FOTOGRAFIA & CÂMERAS
    { keywords: ['camera', 'maquina', 'fotografica', 'foto', 'fotografia', 'dslr'], name: 'Câmera DSLR Profissional 4K', description: 'Sensor 24.2MP, WiFi, Gravação 4K, Lente 18-55mm inclusa. Ideal para fotógrafos iniciantes e intermediários.', price: 1899.90, original_price: 3499.90, category: 'Fotografia', supplier: 'PhotoPro Global' },
    { keywords: ['camera', 'maquina', 'fotografica', 'mirrorless'], name: 'Câmera Mirrorless Full Frame', description: 'Sensor 30.3MP, Estabilização 5 eixos, 4K 60fps. A escolha dos profissionais.', price: 2499.90, original_price: 4999.90, category: 'Fotografia', supplier: 'MirrorTech' },
    { keywords: ['camera', 'compacta', 'digital', 'fotografica'], name: 'Câmera Digital Compacta 20MP', description: 'Zoom 30x, WiFi, NFC, Tela Touch 3". Perfeita para viagens e dia a dia.', price: 449.90, original_price: 899.90, category: 'Fotografia', supplier: 'CompactCam' },
    { keywords: ['camera', 'polaroid', 'instantanea', 'instax'], name: 'Câmera Instantânea Retrô', description: 'Fotos impressas na hora, 10 filmes inclusos, Design vintage premium.', price: 189.90, original_price: 349.90, category: 'Fotografia', supplier: 'InstaCam' },
    { keywords: ['camera', 'vlog', 'youtuber', 'streaming'], name: 'Câmera Vlog 4K Touch Screen', description: 'Microfone embutido, Flip Screen, Estabilização digital. Para criadores de conteúdo.', price: 699.90, original_price: 1299.90, category: 'Vídeo', supplier: 'VlogTech' },
    { keywords: ['webcam', 'camera', 'streaming', 'reuniao'], name: 'Webcam Full HD 1080p USB', description: 'Microfone integrado, Foco automático, Compatível com Zoom/Meet/Teams.', price: 89.90, original_price: 179.90, category: 'Informática', supplier: 'StreamGear' },

    // DRONES
    { keywords: ['drone', 'dji', 'aereo', 'voar'], name: 'Drone 4K GPS Dobrável Pro', description: 'Câmera 4K, GPS Return Home, 30min voo, Alcance 2km. Pronto para voar.', price: 599.90, original_price: 1199.90, category: 'Drones', supplier: 'SkyTech' },
    { keywords: ['drone', 'mini', 'barato', 'iniciante'], name: 'Mini Drone HD Iniciante', description: 'Câmera 720p, Controle fácil, Modo Headless, Perfeito para aprender.', price: 149.90, original_price: 299.90, category: 'Drones', supplier: 'MiniAir' },
    { keywords: ['drone', 'fpv', 'racing', 'corrida'], name: 'Drone FPV Racing 150km/h', description: 'Para pilotos experientes, Óculos FPV inclusos, Bateria extra.', price: 899.90, original_price: 1799.90, category: 'Drones', supplier: 'RacerDrone' },

    // CELULARES
    { keywords: ['celular', 'smartphone', 'telefone', 'iphone', 'android'], name: 'Smartphone 5G 256GB', description: 'Tela 6.7" AMOLED, Câmera 108MP, Bateria 5000mAh. Última geração.', price: 1299.90, original_price: 2499.90, category: 'Smartphones', supplier: 'MobileTech' },
    { keywords: ['celular', 'gamer', 'gaming', 'jogos'], name: 'Smartphone Gamer 512GB', description: 'Snapdragon 8 Gen 2, 16GB RAM, Tela 144Hz, Cooler integrado.', price: 1899.90, original_price: 3499.90, category: 'Gaming', supplier: 'GamePhone' },
    { keywords: ['celular', 'barato', 'basico', 'simples'], name: 'Smartphone Básico 64GB', description: 'Dual SIM, Bateria 4000mAh, Android 13. Custo-benefício imbatível.', price: 399.90, original_price: 699.90, category: 'Smartphones', supplier: 'BudgetPhone' },

    // NOTEBOOKS
    { keywords: ['notebook', 'laptop', 'computador', 'portatil'], name: 'Notebook Ultra Slim i5 256GB', description: 'Tela 14" Full HD, 8GB RAM, SSD 256GB, Windows 11. Leve e potente.', price: 2199.90, original_price: 3999.90, category: 'Informática', supplier: 'LaptopPro' },
    { keywords: ['notebook', 'gamer', 'gaming', 'rtx'], name: 'Notebook Gamer RTX 4060', description: 'i7 13ª Geração, 16GB RAM, SSD 1TB, Tela 144Hz. Jogue no máximo.', price: 4999.90, original_price: 8999.90, category: 'Gaming', supplier: 'GameLaptop' },
    { keywords: ['notebook', 'estudo', 'trabalho', 'barato'], name: 'Notebook Estudante Celeron', description: 'Tela 15.6", 4GB RAM, 128GB eMMC. Ideal para estudos e tarefas básicas.', price: 999.90, original_price: 1699.90, category: 'Informática', supplier: 'EduTech' },

    // FONES
    { keywords: ['fone', 'bluetooth', 'wireless', 'sem fio', 'earbuds', 'tws'], name: 'Fone TWS Pro Cancelamento Ruído', description: 'ANC ativo, 32h bateria, Resistente água IPX5. Som premium.', price: 149.90, original_price: 299.90, category: 'Áudio', supplier: 'SoundMaster' },
    { keywords: ['fone', 'headphone', 'over', 'dj'], name: 'Headphone Over-Ear Bluetooth', description: 'Drivers 50mm, 60h bateria, Dobrável, Microfone removível.', price: 199.90, original_price: 399.90, category: 'Áudio', supplier: 'AudioPro' },
    { keywords: ['fone', 'gamer', 'gaming', 'headset'], name: 'Headset Gamer RGB 7.1', description: 'Som surround, Microfone retrátil, LED RGB, Almofadas memory foam.', price: 129.90, original_price: 249.90, category: 'Gaming', supplier: 'GamerAudio' },

    // RELÓGIOS
    { keywords: ['relogio', 'smartwatch', 'smart', 'inteligente', 'watch'], name: 'Smartwatch Pro Health GPS', description: 'Monitor cardíaco, SpO2, GPS, 100+ esportes, 14 dias bateria.', price: 249.90, original_price: 499.90, category: 'Wearables', supplier: 'WatchTech' },
    { keywords: ['relogio', 'fitness', 'corrida', 'esporte'], name: 'Smartband Fitness Tracker', description: 'Passos, Sono, Calorias, Notificações, À prova d\'água 50m.', price: 89.90, original_price: 179.90, category: 'Wearables', supplier: 'FitPro' },
    { keywords: ['relogio', 'classico', 'analogico', 'luxo'], name: 'Relógio Analógico Premium', description: 'Aço inoxidável, Vidro safira, Resistente água 100m. Elegância atemporal.', price: 349.90, original_price: 699.90, category: 'Acessórios', supplier: 'LuxWatch' },

    // CASA INTELIGENTE
    { keywords: ['lampada', 'smart', 'rgb', 'wifi', 'inteligente'], name: 'Lâmpada Smart RGB WiFi', description: '16 milhões cores, Alexa/Google, Agendamento, Economia 80%.', price: 39.90, original_price: 79.90, category: 'Casa Inteligente', supplier: 'SmartHome' },
    { keywords: ['lampada', 'kit', 'led'], name: 'Kit 5 Lâmpadas LED Smart', description: 'Controle por app, Cenas personalizadas, Instalação fácil.', price: 149.90, original_price: 299.90, category: 'Casa Inteligente', supplier: 'LightTech' },
    { keywords: ['alexa', 'echo', 'assistente', 'caixa', 'som'], name: 'Caixa de Som Smart Alexa', description: 'Assistente de voz, Controla casa inteligente, Som 360°.', price: 299.90, original_price: 599.90, category: 'Casa Inteligente', supplier: 'SmartAudio' },
    { keywords: ['tomada', 'smart', 'wifi', 'inteligente'], name: 'Tomada Smart WiFi 10A', description: 'Controle remoto, Timer, Consumo de energia, Voz.', price: 49.90, original_price: 99.90, category: 'Casa Inteligente', supplier: 'SmartPlug' },

    // ACESSÓRIOS
    { keywords: ['mochila', 'bolsa', 'anti', 'furto', 'notebook'], name: 'Mochila Anti-Furto USB', description: 'Porta USB, Impermeável, Cabe notebook 17", Zíper oculto.', price: 99.90, original_price: 199.90, category: 'Acessórios', supplier: 'SafeBag' },
    { keywords: ['carregador', 'portatil', 'powerbank', 'bateria'], name: 'Powerbank 20000mAh Fast', description: 'Carrega 3 dispositivos, USB-C PD 65W, LED indicador.', price: 119.90, original_price: 239.90, category: 'Acessórios', supplier: 'PowerTech' },
    { keywords: ['suporte', 'celular', 'carro', 'veiculo'], name: 'Suporte Celular Carro Magnético', description: 'Imã forte, Rotação 360°, Instalação ventilação.', price: 29.90, original_price: 59.90, category: 'Acessórios', supplier: 'CarTech' },
    { keywords: ['cabo', 'usb', 'type', 'carregador', 'rapido'], name: 'Cabo USB-C Nylon 2m Fast', description: 'Carregamento 100W, Transferência 10Gbps, Durável.', price: 39.90, original_price: 79.90, category: 'Acessórios', supplier: 'CablePro' },

    // GAMES
    { keywords: ['controle', 'joystick', 'gamepad', 'ps5', 'xbox'], name: 'Controle Sem Fio Pro Gaming', description: 'Vibração dual, Giroscópio, 20h bateria, PC/Console/Mobile.', price: 149.90, original_price: 299.90, category: 'Gaming', supplier: 'GameControl' },
    { keywords: ['teclado', 'mecanico', 'gamer', 'rgb'], name: 'Teclado Mecânico RGB Gamer', description: 'Switches Blue, Macro, N-Key Rollover, Descanso de pulso.', price: 199.90, original_price: 399.90, category: 'Gaming', supplier: 'KeyMaster' },
    { keywords: ['mouse', 'gamer', 'rgb', 'dpi'], name: 'Mouse Gamer 16000 DPI RGB', description: 'Sensor óptico, 7 botões programáveis, Peso ajustável.', price: 89.90, original_price: 179.90, category: 'Gaming', supplier: 'MousePro' },
    { keywords: ['cadeira', 'gamer', 'escritorio'], name: 'Cadeira Gamer Ergonômica', description: 'Reclinável 180°, Apoio lombar, Almofada cervical, Até 150kg.', price: 699.90, original_price: 1399.90, category: 'Gaming', supplier: 'SitPro' },

    // BELEZA & SAÚDE
    { keywords: ['massageador', 'pescoco', 'relaxamento'], name: 'Massageador Cervical Elétrico', description: 'Calor infravermelho, 15 intensidades, Recarregável.', price: 79.90, original_price: 159.90, category: 'Saúde', supplier: 'RelaxTech' },
    { keywords: ['escova', 'dente', 'eletrica', 'dental'], name: 'Escova Dental Elétrica Sonic', description: '5 modos, Timer 2min, 30 dias bateria, 2 refis inclusos.', price: 89.90, original_price: 179.90, category: 'Saúde', supplier: 'OralPro' },
    { keywords: ['balanca', 'digital', 'peso', 'bioimpedancia'], name: 'Balança Digital Bioimpedância', description: 'Peso, Gordura, Músculo, Água, App conectado.', price: 99.90, original_price: 199.90, category: 'Saúde', supplier: 'HealthScale' },

    // FERRAMENTAS
    { keywords: ['furadeira', 'parafusadeira', 'bateria'], name: 'Parafusadeira Sem Fio 21V', description: '2 baterias, Maleta, 45 bits inclusos, Torque ajustável.', price: 199.90, original_price: 399.90, category: 'Ferramentas', supplier: 'ToolPro' },
    { keywords: ['kit', 'ferramentas', 'chave'], name: 'Kit Ferramentas 129 Peças', description: 'Chaves, Alicates, Martelo, Maleta organizadora premium.', price: 149.90, original_price: 299.90, category: 'Ferramentas', supplier: 'ToolMaster' },

    // PET
    { keywords: ['pet', 'cachorro', 'gato', 'comedouro', 'automatico'], name: 'Comedouro Automático Pet 4L', description: 'Timer programável, Até 4 refeições, App WiFi, Câmera HD.', price: 249.90, original_price: 499.90, category: 'Pet', supplier: 'PetTech' },
    { keywords: ['pet', 'coleira', 'gps', 'rastreador'], name: 'Coleira GPS Pet Tracker', description: 'Rastreamento tempo real, Cerca virtual, 7 dias bateria.', price: 149.90, original_price: 299.90, category: 'Pet', supplier: 'PetTrack' },
];

export function normalize(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

/**
 * Busca produtos no catálogo global.
 * Útil para o backend (checkout) validar preços.
 */
export function findGlobalProductByName(name: string): GlobalProduct | undefined {
    return GLOBAL_PRODUCT_CATALOG.find(p => p.name === name);
}
