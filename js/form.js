/* ============================================================
   FORM — Validación, envío via fetch() + Netlify Function,
          enlace directo WhatsApp
   ============================================================ */

const ContactForm = (() => {

  /* ---- Configuration ---- */
  const CONFIG = {
    /* Endpoint de la Netlify Function que envía el WhatsApp vía Twilio */
    apiEndpoint: '/.netlify/functions/send-whatsapp',
    /* Número de WhatsApp para el enlace directo de fallback (con código de país, sin +) */
    whatsappNumber: '34684614988',
  };

  /* ---- Validation Rules ---- */
  const VALIDATORS = {
    required(value) {
      return value.trim().length > 0;
    },
    email(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    },
    phone(value) {
      return /^[+]?[\d\s()-]{6,20}$/.test(value);
    },
  };

  const ERROR_MESSAGES = {
    nombre: 'Por favor, introduce tu nombre completo.',
    telefono: 'Introduce un número de teléfono válido.',
    email: 'Introduce un correo electrónico válido.',
    negocio: 'Selecciona el tipo de negocio.',
    plan: 'Selecciona el plan que te interesa.',
  };

  /* ---- DOM References ---- */
  let form = null;
  let formWrapper = null;
  let successMessage = null;
  let errorMessage = null;
  let submitBtn = null;

  /* ---- Validation ---- */
  function validateField(field) {
    const name = field.name;
    const value = field.value;
    const group = field.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;

    let isValid = true;

    /* Check required */
    if (field.hasAttribute('required') && !VALIDATORS.required(value)) {
      isValid = false;
    }

    /* Type-specific validation */
    if (isValid && value.trim().length > 0) {
      if (field.type === 'email' && !VALIDATORS.email(value)) {
        isValid = false;
      }
      if (field.type === 'tel' && !VALIDATORS.phone(value)) {
        isValid = false;
      }
    }

    /* Update UI */
    if (group) {
      group.classList.toggle('has-error', !isValid);
    }
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid && value.trim().length > 0);

    if (errorEl && !isValid) {
      errorEl.textContent = ERROR_MESSAGES[name] || 'Este campo es obligatorio.';
    }

    return isValid;
  }

  function validateAllFields() {
    const fields = form.querySelectorAll('[data-validate]');
    let allValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        allValid = false;
      }
    });

    return allValid;
  }

  /* ---- Honeypot check ---- */
  function isSpam() {
    const honeypot = form.querySelector('[data-honeypot]');
    return honeypot && honeypot.value.length > 0;
  }

  /* ---- WhatsApp link generator ---- */
  function generateWhatsAppLink(data) {
    const name = data.nombre ? data.nombre.trim() : '';
    const email = data.email ? data.email.trim() : '';
    const phone = data.telefono ? data.telefono.trim() : '';
    const business = data.negocio || '';
    const plan = data.plan || '';
    const userMessage = data.mensaje ? data.mensaje.trim() : '';

    let text = `Hola Webs VC, me pongo en contacto desde la web:\n\n`;
    text += `👤 Nombre: ${name}\n`;
    text += `📧 Email: ${email}\n`;
    
    if (phone) {
      text += `📞 Teléfono: ${phone}\n`;
    }
    if (business) {
      text += `🏢 Negocio: ${business}\n`;
    }
    if (plan) {
      text += `💼 Plan de interés: ${plan}\n`;
    }
    if (userMessage) {
      text += `✉️ Mensaje: ${userMessage}\n`;
    }

    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedText}`;
  }

  /* ---- Form submission ---- */
  async function handleSubmit(event) {
    event.preventDefault();

    /* Anti-spam */
    if (isSpam()) {
      showSuccess();
      return;
    }

    /* Validate */
    if (!validateAllFields()) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    /* Collect data */
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    /* Combine fields to send to Twilio serverless function */
    let customMessage = data.mensaje ? data.mensaje.trim() : '';
    
    const extraDetails = [];
    if (data.telefono) {
      extraDetails.push(`📞 Teléfono: ${data.telefono.trim()}`);
    }
    if (data.negocio) {
      extraDetails.push(`🏢 Sector: ${data.negocio}`);
    }
    if (data.plan) {
      extraDetails.push(`💼 Plan: ${data.plan}`);
    }

    if (extraDetails.length > 0) {
      customMessage = `${customMessage}\n\n${extraDetails.join('\n')}`.trim();
    }

    const payload = {
      nombre: data.nombre ? data.nombre.trim() : '',
      email: data.email ? data.email.trim() : '',
      mensaje: customMessage || 'Interesado en los servicios de Webs VC.'
    };

    /* Show loading state */
    setLoadingState(true);
    hideError();

    try {
      const response = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud al servidor.');
      }

      /* Clean the form */
      form.reset();

      /* Reset visual validation classes */
      const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
      inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
        const group = input.closest('.form-group');
        if (group) {
          group.classList.remove('has-error');
        }
      });

      /* Show success message to the user */
      showSuccess();

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      showError();
    } finally {
      setLoadingState(false);
    }
  }

  /* ---- UI State helpers ---- */
  function setLoadingState(isLoading) {
    if (!submitBtn) return;
    submitBtn.classList.toggle('btn--loading', isLoading);
    submitBtn.disabled = isLoading;

    const btnText = submitBtn.querySelector('.btn__text');
    if (btnText) {
      btnText.textContent = isLoading ? 'Enviando...' : 'Enviar solicitud';
    }
  }

  function showSuccess() {
    if (form) form.style.display = 'none';
    if (successMessage) successMessage.classList.add('is-visible');
  }

  // Define showError and hideError functions properly
  function showError() {
    if (errorMessage) errorMessage.classList.add('is-visible');
  }

  function hideError() {
    if (errorMessage) errorMessage.classList.remove('is-visible');
  }

  /* ---- Pre-select plan from pricing CTA ---- */
  function handlePlanPreselect() {
    const urlParams = new URLSearchParams(window.location.hash.replace('#contacto', '').replace('?', ''));
    /* Also check query params on the URL for links like #contacto?plan=Profesional */
    const hash = window.location.hash;
    if (hash.includes('plan=')) {
      const planValue = decodeURIComponent(hash.split('plan=')[1]);
      const planSelect = form ? form.querySelector('[name="plan"]') : null;
      if (planSelect && planValue) {
        /* Find option that matches */
        const options = Array.from(planSelect.options);
        const match = options.find(opt =>
          opt.value.toLowerCase() === planValue.toLowerCase()
        );
        if (match) {
          planSelect.value = match.value;
        }
      }
    }
  }

  /* ---- Init ---- */
  function init() {
    form = document.getElementById('contact-form');
    formWrapper = document.getElementById('contact-form-wrapper');
    successMessage = document.getElementById('contact-success');
    errorMessage = document.getElementById('contact-error-message');
    submitBtn = form ? form.querySelector('[type="submit"]') : null;

    if (!form) return;

    /* Real-time validation on blur */
    const validateFields = form.querySelectorAll('[data-validate]');
    validateFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', handleSubmit);

    handlePlanPreselect();
    window.addEventListener('hashchange', handlePlanPreselect);
  }

  return { init, generateWhatsAppLink };
})();

document.addEventListener('DOMContentLoaded', ContactForm.init);
