/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PIX PAYLOAD GENERATOR (BR CODE ISO/EMV)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Gera strings de pagamento PIX tecnicamente válidas (Padrão EMV QRCPS-MPM).
 * Calcula o CRC16 (Polynomial 0x1021) para garantir leitura em apps bancários.
 * 
 * [ZERO COST] | [HIGH CONVERSION] | [INSTANT PAYMENT]
 * ═══════════════════════════════════════════════════════════════════════════════
 */

function crc16(payload: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function formatField(id: string, value: string): string {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
}

export function generatePixPayload(
    key: string,
    name: string,
    city: string,
    amount: number,
    txId: string
): string {
    // Tratamento de dados
    const safeName = name.substring(0, 25).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const safeCity = city.substring(0, 15).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const safeTxId = txId.substring(0, 25).replace(/[^a-zA-Z0-9]/g, '');
    const amountStr = amount.toFixed(2);

    // Payload Base
    let payload =
        formatField('00', '01') +                          // Format Indicator
        formatField('26',                                  // Merchant Account Info
            formatField('00', 'br.gov.bcb.pix') +
            formatField('01', key)
        ) +
        formatField('52', '0000') +                        // Merchant Category Code
        formatField('53', '986') +                         // Transaction Currency (BRL)
        formatField('54', amountStr) +                     // Transaction Amount
        formatField('58', 'BR') +                          // Country Code
        formatField('59', safeName) +                      // Merchant Name
        formatField('60', safeCity) +                      // Merchant City
        formatField('62',                                  // Additional Data Field
            formatField('05', safeTxId)                    // Reference Label (TxID)
        ) +
        '6304';                                            // CRC16 ID + Length Placeholders

    // Calculate CRC16
    const crc = crc16(payload);

    return payload + crc;
}
