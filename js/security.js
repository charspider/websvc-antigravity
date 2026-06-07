/**
 * security.js — Módulo Universal de Sanitización Frontend
 * Basado en: security-kit-completo.md — OWASP Top 10 / JAMstack
 *
 * USO COMO ES MODULE (recomendado):
 *   import { sanitizeInput, sanitizeObject, sanitizeURL } from './security.js';
 *
 * USO CON SCRIPT TAG (sin bundler):
 *   <script src="js/security.js"></script>
 *   window.SecurityUtils.sanitizeInput(...)
 */

'use strict';

// Mapea cada carácter peligroso a su entidad HTML segura
const ESCAPE_MAP = Object.freeze({
  '&': '&amp;',   // Siempre primero: evita doble-escape
  '<': '&lt;',    // Abre etiquetas HTML
  '>': '&gt;',    // Cierra etiquetas HTML
  '"': '&quot;',  // Rompe atributos entre comillas dobles
  "'": '&#x27;',  // Rompe atributos entre comillas simples
  '/': '&#x2F;',  // Cierra etiquetas anticipadamente
  '`': '&#x60;',  // Interpolación de template literals
  '=': '&#x3D;',  // Inyección de atributos HTML
});

const ESCAPE_REGEX = /[&<>"'`/=]/g;

// ── sanitizeInput ─────────────────────────────────────────────────────────────
// Escapa caracteres HTML peligrosos. Úsala SIEMPRE antes de insertar
// datos de usuario en el DOM (innerHTML, insertAdjacentHTML, etc.)
//
// sanitizeInput('<script>alert("xss")</script>')
// → '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
function sanitizeInput(text) {
  if (text === null || text === undefined) return '';
  return String(text).replace(ESCAPE_REGEX, (char) => ESCAPE_MAP[char]);
}

// ── sanitizeObject ────────────────────────────────────────────────────────────
// Aplica sanitizeInput() a todas las propiedades string de un objeto.
// Ideal para limpiar de una vez el payload completo de un formulario.
//
// sanitizeObject({ name: '<b>Ana</b>', age: 30 })
// → { name: '&lt;b&gt;Ana&lt;&#x2F;b&gt;', age: 30 }
function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    throw new TypeError('[security.js] sanitizeObject: el argumento debe ser un objeto plano.');
  }
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === 'string' ? sanitizeInput(value) : value,
    ])
  );
}

// ── sanitizeURL ───────────────────────────────────────────────────────────────
// Bloquea protocolos peligrosos en URLs (javascript:, data:, vbscript:, file:).
// Úsala antes de asignar una URL dinámica a href, src, action o window.open().
//
// sanitizeURL('javascript:alert(1)')   → '#'
// sanitizeURL('https://ejemplo.com')   → 'https://ejemplo.com'
function sanitizeURL(url) {
  if (typeof url !== 'string' || url.trim() === '') return '#';
  const trimmed = url.trim().toLowerCase();
  const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (BLOCKED_PROTOCOLS.some((proto) => trimmed.startsWith(proto))) {
    console.warn('[security.js] URL bloqueada por protocolo peligroso:', url);
    return '#';
  }
  return url.trim();
}

// ── validateHoneypot ──────────────────────────────────────────────────────────
// Valida el campo honeypot antes de enviar el formulario.
// Los humanos no ven el campo → siempre llega vacío.
// Los bots lo rellenan → detectados y bloqueados silenciosamente.
//
// @param {string} fieldId - ID del campo honeypot en el DOM
// @returns {boolean} true = humano (permitir envío), false = bot (abortar)
function validateHoneypot(fieldId = 'hp-url') {
  const hpField = document.getElementById(fieldId);
  if (!hpField) return true; // Campo no encontrado: no bloquear

  if (hpField.value.trim() !== '') {
    // BOT DETECTADO — Fallo silencioso (no alertar al bot de que fue pillado)
    console.warn('[security.js] Honeypot: envío bloqueado. Bot detectado.');
    return false;
  }
  return true;
}

// ── Exports ───────────────────────────────────────────────────────────────────
const SecurityUtils = { sanitizeInput, sanitizeObject, sanitizeURL, validateHoneypot };

export { sanitizeInput, sanitizeObject, sanitizeURL, validateHoneypot };
export default SecurityUtils;

// Fallback global para proyectos sin bundler (script tag clásico)
if (typeof window !== 'undefined') {
  window.SecurityUtils = SecurityUtils;
}
