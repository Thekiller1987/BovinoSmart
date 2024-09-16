// paypal.js
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

// Configuración del entorno de PayPal
function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID;
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

// Crear cliente de PayPal
function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

module.exports = { client };
