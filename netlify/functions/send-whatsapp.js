const twilio = require('twilio');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/**
 * Sends a WhatsApp message using Twilio Sandbox.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.message
 * @returns {Promise<Object>} Twilio message response metadata
 */
async function sendTwilioWhatsApp({ name, email, message }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const targetPhone = process.env.MI_TELEFONO_DESTINO;

  if (!accountSid || !authToken) {
    throw new Error('Configuración de Twilio incompleta en el servidor.');
  }

  if (!targetPhone) {
    throw new Error('Teléfono destino no configurado.');
  }

  const client = twilio(accountSid, authToken);

  const formattedMessage = `Nuevo mensaje de contacto en Webs VC:\n\n` +
    `👤 Nombre: ${name}\n` +
    `📧 Email: ${email}\n` +
    `✉️ Mensaje: ${message}`;

  const response = await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${targetPhone}`,
    body: formattedMessage
  });

  return { sid: response.sid, status: response.status };
}

exports.handler = async (event, context) => {
  // Preflight check for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Validate request method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Método no permitido. Usar POST.' })
    };
  }

  try {
    // Parse request body safely
    if (!event.body) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'El cuerpo de la petición está vacío.' })
      };
    }

    const data = JSON.parse(event.body);
    const { nombre, email, mensaje } = data;

    // Validate fields
    if (!nombre || !email || !mensaje) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Los campos nombre, email y mensaje son obligatorios.' })
      };
    }

    // Call business logic to send WhatsApp
    const result = await sendTwilioWhatsApp({
      name: nombre,
      email: email,
      message: mensaje
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: 'Mensaje de WhatsApp enviado correctamente.',
        data: result
      })
    };

  } catch (error) {
    console.error('Error en send-whatsapp serverless function:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Error interno del servidor al procesar la solicitud.'
      })
    };
  }
};
