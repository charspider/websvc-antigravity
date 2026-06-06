/* ============================================================
   FORM — Validación, envío EmailJS, enlace WhatsApp
   ============================================================ */

const ContactForm = (() => {

  /* ---- Configuration ---- */
  const CONFIG = {
    /* Reemplazar con credenciales reales de EmailJS */
    emailjsServiceId: 'YOUR_SERVICE_ID',
    emailjsTemplateId: 'YOUR_TEMPLATE_ID',
    emailjsPublicKey: 'YOUR_PUBLIC_KEY',
    /* Número de WhatsApp (con código de país, sin +) */
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
    const message = `Hola, soy ${data.nombre} y tengo un negocio de ${data.negocio}.\n\nMe interesa el plan ${data.plan} de Webs VC.\n\nMi correo es ${data.email} y mi teléfono ${data.telefono}. ¿Podemos hablar?`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
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
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    /* Collect data */
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    /* Show loading state */
    setLoadingState(true);
    hideError();

    try {
      /* Attempt EmailJS send (if SDK loaded) */
      if (typeof emailjs !== 'undefined') {
        await emailjs.send(
          CONFIG.emailjsServiceId,
          CONFIG.emailjsTemplateId,
          {
            from_name: data.nombre,
            from_email: data.email,
            phone: data.telefono,
            business_type: data.negocio,
            plan: data.plan,
            message: data.mensaje || 'Sin mensaje adicional',
            date: new Date().toLocaleString('es-ES'),
          },
          CONFIG.emailjsPublicKey
        );
      }

      showSuccess();

      /* Auto-open WhatsApp in new tab after brief delay */
      setTimeout(() => {
        const waLink = generateWhatsAppLink(data);
        window.open(waLink, '_blank');
      }, 1500);

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
  }

  function showSuccess() {
    if (form) form.style.display = 'none';
    if (successMessage) successMessage.classList.add('is-visible');
  }

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
