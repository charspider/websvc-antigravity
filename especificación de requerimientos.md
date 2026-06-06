**WEBS VC**

Webs profesionales para pequeños negocios

**Especificación de Requerimientos del Sistema**

Sitio Web Corporativo de Captación de Clientes

  ------------------------- ---------------------------------------------
  **Versión**               1.0 --- Borrador inicial

  **Fecha**                 Junio 2025

  **Proyecto**              Sitio web corporativo Webs VC

  **Clasificación**         Confidencial

  **Estado**                Listo para revisión
  ------------------------- ---------------------------------------------

**1. Introducción**

**1.1 Propósito del Documento**

Este documento define los requerimientos funcionales y no funcionales
para el desarrollo del sitio web corporativo de Webs VC. Sirve como
referencia técnica y de diseño para el equipo de desarrollo y como
contrato de entregables con el cliente.

**1.2 Descripción del Negocio**

Webs VC es una empresa de servicios digitales especializada en crear
páginas web modernas, sencillas y útiles para pequeños negocios y
locales comerciales a precios reducidos. Su propuesta de valor se basa
en tres pilares:

-   Diseño profesional y moderno a precio asequible

-   Proceso rápido y sin complicaciones para el cliente final

-   Presencia digital efectiva para negocios locales que aún no están en
    internet

**1.3 Alcance del Proyecto**

El alcance incluye el diseño, desarrollo y puesta en marcha de un sitio
web de presentación (landing page) multipágina con las siguientes
características principales:

-   Diseño visual de alta calidad inspirado en el estilo minimalista de
    Apple

-   Secciones de presentación de servicios, portafolio y precios

-   Formulario de contacto funcional con envío de notificaciones por
    correo electrónico y/o WhatsApp

-   Diseño 100% responsive adaptado a móvil, tablet y escritorio

-   Optimización básica para motores de búsqueda (SEO on-page)

Queda fuera del alcance de este documento la gestión de un blog, tienda
online, panel de administración o área privada de clientes.

**1.4 Definiciones y Acrónimos**

  ------------------------------------------------------------------------
  **Término**      **Definición**
  ---------------- -------------------------------------------------------
  **Landing page** Página web de aterrizaje diseñada para convertir
                   visitantes en clientes potenciales.

  **Responsive**   Diseño web que se adapta automáticamente a cualquier
                   tamaño de pantalla.

  **CTA**          Call To Action --- Botón o enlace que incita al usuario
                   a realizar una acción concreta.

  **SRS**          Software Requirements Specification --- Documento de
                   especificación de requerimientos.

  **SEO**          Search Engine Optimization --- Optimización para
                   motores de búsqueda.

  **API**          Application Programming Interface --- Interfaz de
                   programación de aplicaciones.

  **SMTP**         Simple Mail Transfer Protocol --- Protocolo de envío de
                   correo electrónico.
  ------------------------------------------------------------------------

**2. Descripción General del Sistema**

**2.1 Perspectiva del Producto**

El sitio web de Webs VC es el principal canal de captación de clientes
de la empresa. Debe transmitir profesionalismo, modernidad y confianza
desde el primer segundo de navegación. Su objetivo primario es convertir
visitantes en contactos cualificados mediante un formulario de contacto
optimizado.

**2.2 Usuarios Objetivo (Público Meta)**

-   Propietarios de pequeños negocios locales (tiendas, restaurantes,
    clínicas, talleres, etc.)

-   Autónomos y freelancers que buscan presencia digital

-   Negocios que actualmente no tienen página web o tienen una obsoleta

-   Rango de edad orientativo: 30--60 años, con conocimientos digitales
    básicos

**2.3 Restricciones Técnicas y de Diseño**

-   El sitio debe cargarse completamente en menos de 3 segundos en
    conexión 4G.

-   Debe funcionar correctamente en los navegadores: Chrome, Firefox,
    Safari y Edge (últimas 2 versiones).

-   El formulario de contacto debe funcionar sin necesidad de backend
    propio; se puede usar un servicio de terceros (Formspree, EmailJS,
    etc.).

-   El diseño visual debe respetar la paleta de colores y tipografía de
    la identidad de Webs VC.

**3. Arquitectura y Estructura del Sitio**

**3.1 Mapa de Sitio (Sitemap)**

El sitio constará de una única página larga (one-page scroll) dividida
en secciones bien diferenciadas, accesibles también desde el menú de
navegación fijo:

  -------------------------------------------------------------------------
  **ID         **Nombre**          **Descripción**
  Sección**                        
  ------------ ------------------- ----------------------------------------
  **SEC-01**   **Hero / Portada**  Mensaje principal, propuesta de valor y
                                   CTA principal.

  **SEC-02**   **Servicios**       Descripción de los servicios ofrecidos
                                   con iconos y texto breve.

  **SEC-03**   **Por qué           Ventajas competitivas: precio,
               elegirnos**         velocidad, calidad, soporte.

  **SEC-04**   **Ejemplos /        Muestra visual de webs creadas para
               Portafolio**        clientes anteriores.

  **SEC-05**   **Precios**         Tabla de precios clara con los distintos
                                   paquetes disponibles.

  **SEC-06**   **Testimonios**     Opiniones de clientes reales para
                                   generar confianza.

  **SEC-07**   **Contacto**        Formulario de contacto + datos de
                                   contacto directos.

  **SEC-08**   **Footer**          Mapa del sitio, redes sociales, aviso
                                   legal.
  -------------------------------------------------------------------------

**3.2 Navegación**

-   Menú de navegación fijo (sticky) en la parte superior, transparente
    al inicio y sólido al hacer scroll.

-   Logo de Webs VC en la esquina superior izquierda, enlazado a la
    sección Hero.

-   Menú hamburguesa en móvil con transición animada suave.

-   Enlace al formulario de contacto siempre visible como botón CTA en
    el menú.

-   Scroll suave (smooth scroll) al hacer clic en cualquier elemento del
    menú.

**4. Requerimientos Funcionales**

**4.1 SEC-01 --- Hero / Portada**

La sección Hero es lo primero que ve el visitante. Debe impactar
visualmente y comunicar la propuesta de valor en menos de 5 segundos.

  ---------------------------------------------------------------------------
  **ID**   **Requerimiento**                                  **Prioridad**
  -------- -------------------------------------------------- ---------------
  RF-01    Mostrar un título principal impactante con la      Alta
           propuesta de valor de Webs VC.                     

  RF-02    Incluir un subtítulo con descripción breve del     Alta
           servicio (máx. 2 líneas).                          

  RF-03    Mostrar un botón CTA principal (\'Solicitar mi web Alta
           gratis\') que lleve al formulario de contacto.     

  RF-04    Incluir una imagen o vídeo de fondo de alta        Alta
           calidad relacionada con diseño web.                

  RF-05    Mostrar badges de confianza: \'+ 50 webs           Media
           creadas\', \'Entrega en 7 días\', \'Precio desde   
           199€\'.                                            

  RF-06    Animación de entrada de los elementos (fade-in al  Baja
           cargar la página).                                 
  ---------------------------------------------------------------------------

**4.2 SEC-02 --- Servicios**

Presentación visual y clara de los servicios que ofrece Webs VC.

  ---------------------------------------------------------------------------
  **ID**   **Requerimiento**                                  **Prioridad**
  -------- -------------------------------------------------- ---------------
  RF-07    Mostrar mínimo 4 servicios en formato de tarjeta   Alta
           (card) con icono, título y descripción.            

  RF-08    Los servicios incluirán: Diseño web, Optimización  Alta
           móvil, SEO básico, Dominio y hosting.              

  RF-09    Efecto hover en las tarjetas (sombra o cambio de   Media
           color suave).                                      

  RF-10    Diseño en grid de 2 o 4 columnas según el ancho de Alta
           pantalla.                                          
  ---------------------------------------------------------------------------

**4.3 SEC-03 --- Por qué Elegirnos**

  ---------------------------------------------------------------------------
  **ID**   **Requerimiento**                                  **Prioridad**
  -------- -------------------------------------------------- ---------------
  RF-11    Mostrar 4-6 puntos diferenciales con icono, título Alta
           breve y descripción.                               

  RF-12    Incluir el punto \'Precio asequible\' con          Alta
           referencia al precio de partida.                   

  RF-13    Incluir el punto \'Entrega rápida\' con mención al Alta
           plazo garantizado.                                 

  RF-14    Incluir contadores animados (ej: \'50+ clientes\', Media
           \'7 días promedio\', \'100% satisfacción\').       
  ---------------------------------------------------------------------------

**4.4 SEC-04 --- Portafolio / Ejemplos**

  ---------------------------------------------------------------------------
  **ID**   **Requerimiento**                                  **Prioridad**
  -------- -------------------------------------------------- ---------------
  RF-15    Galería visual de mínimo 4 proyectos realizados    Alta
           (imagen + nombre del negocio + sector).            

  RF-16    Opción de filtrado por sector (restauración,       Baja
           salud, comercio, servicios).                       

  RF-17    Al hacer clic en un proyecto, mostrar un modal o   Media
           abrir el sitio en nueva pestaña.                   

  RF-18    Efecto overlay al pasar el ratón sobre cada        Media
           proyecto.                                          
  ---------------------------------------------------------------------------

**4.5 SEC-05 --- Precios**

  ---------------------------------------------------------------------------
  **ID**   **Requerimiento**                                  **Prioridad**
  -------- -------------------------------------------------- ---------------
  RF-19    Mostrar mínimo 3 planes de precios (Básico,        Alta
           Profesional, Premium) en tarjetas comparativas.    

  RF-20    Destacar visualmente el plan más popular o         Alta
           recomendado.                                       

  RF-21    Cada plan incluirá: precio, lista de               Alta
           características incluidas y botón CTA.             

  RF-22    Los botones CTA de cada plan enlazarán             Media
           directamente al formulario de contacto, pasando el 
           plan seleccionado como referencia.                 

  RF-23    Incluir texto de garantía debajo de la tabla de    Baja
           precios (\'Sin permanencia, sin sorpresas\').      
  ---------------------------------------------------------------------------

**4.6 SEC-06 --- Testimonios**

  ---------------------------------------------------------------------------
  **ID**   **Requerimiento**                                  **Prioridad**
  -------- -------------------------------------------------- ---------------
  RF-24    Mostrar mínimo 3 testimonios de clientes reales    Alta
           con foto, nombre, negocio y valoración por         
           estrellas.                                         

  RF-25    Implementar carrusel automático con navegación     Media
           manual por puntos o flechas.                       

  RF-26    Incluir valoración global media visible (ej: 4.9/5 Media
           basado en X reseñas).                              
  ---------------------------------------------------------------------------

**4.7 SEC-07 --- Formulario de Contacto (Requerimiento Crítico)**

El formulario de contacto es el elemento más crítico del sitio, ya que
es el principal mecanismo de generación de leads. Debe ser sencillo,
rápido y confiable.

  ---------------------------------------------------------------------------
  **ID**   **Requerimiento**                                  **Prioridad**
  -------- -------------------------------------------------- ---------------
  RF-27    El formulario incluirá los campos: Nombre          Alta
           completo, Teléfono, Correo electrónico, Tipo de    
           negocio, Mensaje/descripción (opcional), Plan de   
           interés (seleccionable).                           

  RF-28    Todos los campos obligatorios mostrarán validación Alta
           en tiempo real con mensajes de error claros en     
           español.                                           

  RF-29    Al enviar el formulario, se enviará una            Alta
           notificación al correo electrónico configurado de  
           Webs VC con todos los datos del cliente.           

  RF-30    Opcionalmente, se enviará una notificación vía     Alta
           WhatsApp Business API o enlace \'wa.me\' con un    
           mensaje preformateado con los datos del cliente.   

  RF-31    Al enviar correctamente, el formulario mostrará un Alta
           mensaje de confirmación positivo (\'¡Gracias! Te   
           contactaremos en menos de 24h\').                  

  RF-32    En caso de error de envío, mostrar mensaje de      Alta
           error claro con alternativa de contacto directo.   

  RF-33    El formulario incluirá protección anti-spam básica Media
           (honeypot o reCAPTCHA invisible).                  

  RF-34    Incluir enlace directo a WhatsApp junto al         Alta
           formulario como alternativa de contacto inmediato. 

  RF-35    Mostrar datos de contacto adicionales: correo,     Media
           teléfono y horario de atención.                    
  ---------------------------------------------------------------------------

**4.7.1 Flujo de Envío del Formulario**

El proceso de envío de datos sigue el siguiente flujo:

1.  El usuario rellena y envía el formulario en la web.

2.  El frontend valida los campos en el lado del cliente (JavaScript).

3.  Se realiza una petición HTTP POST al servicio de formularios
    configurado (Formspree, EmailJS, o similar).

4.  El servicio envía un correo electrónico a la dirección configurada
    de Webs VC con los datos del lead.

5.  Paralelamente (o como alternativa), se genera un enlace wa.me con el
    mensaje preformateado para redireccionar al cliente a WhatsApp.

6.  Se muestra al usuario un mensaje de confirmación en pantalla.

**4.7.2 Contenido de la Notificación por Correo**

El correo de notificación enviado a Webs VC incluirá:

-   Asunto: \'🔔 Nuevo contacto desde la web --- \[Nombre del
    cliente\]\'

-   Nombre completo del solicitante

-   Teléfono de contacto

-   Correo electrónico

-   Tipo de negocio

-   Plan de interés seleccionado

-   Mensaje opcional

-   Fecha y hora del envío

**4.7.3 Mensaje Preformateado para WhatsApp**

El mensaje generado para WhatsApp (enlace wa.me) tendrá el siguiente
formato:

Hola, soy \[Nombre\] y tengo un negocio de \[Tipo de negocio\].

Me interesa el plan \[Plan seleccionado\] de Webs VC.

Mi correo es \[correo\] y mi teléfono \[teléfono\]. ¿Podemos hablar?

**5. Requerimientos No Funcionales**

**5.1 Diseño Visual --- Estilo Apple**

El diseño debe evocar modernidad, limpieza y confianza, con influencia
directa del lenguaje visual de marcas como Apple y Linear. Los
principios de diseño que deben guiar el desarrollo son:

  -----------------------------------------------------------------------------
  **Principio**            **Especificación**
  ------------------------ ----------------------------------------------------
  **Espaciado generoso**   Amplios márgenes y espacio en blanco entre secciones
                           para no saturar al usuario.

  **Tipografía limpia**    Fuente principal: Inter o SF Pro Display (Google
                           Fonts). Tamaños: H1 ≥ 56px, H2 ≥ 36px, body 17-18px.

  **Paleta de colores**    Fondo blanco o muy claro (#FAFAFA). Un color
                           principal (azul o negro). Toques de color solo en
                           CTAs y acentos.

  **Imágenes de calidad**  Usar únicamente fotos de alta resolución (propias o
                           de Unsplash/Pexels). Evitar imágenes de stock
                           genéricas.

  **Microinteracciones**   Transiciones CSS suaves en hover, scroll y aparición
                           de elementos (0.2-0.3s ease).

  **Modo oscuro (bonus)**  Implementar modo oscuro opcional activable por el
                           usuario.
  -----------------------------------------------------------------------------

**5.2 Responsividad**

El diseño debe adaptarse perfectamente a los siguientes breakpoints:

-   Móvil: 320px -- 767px (diseño en columna única, menú hamburguesa)

-   Tablet: 768px -- 1023px (diseño de 2 columnas donde aplique)

-   Escritorio pequeño: 1024px -- 1279px

-   Escritorio: 1280px en adelante (diseño completo)

Consideraciones especiales para móvil:

-   El formulario de contacto debe ocupar el 100% del ancho en móvil.

-   Los botones CTA deben tener mínimo 44px de alto para facilitar el
    toque.

-   El menú de navegación debe colapsar en hamburguesa con acceso a
    todas las secciones.

**5.3 Rendimiento**

-   Puntuación en Google PageSpeed Insights mayor de 90 en móvil y 95 en
    escritorio.

-   Tiempo de carga del LCP (Largest Contentful Paint) menor de 2.5
    segundos.

-   Uso de imágenes en formato WebP con lazy loading.

-   Minificación de CSS y JavaScript.

-   Fuentes web cargadas con font-display: swap para evitar bloqueo del
    render.

**5.4 SEO Básico (On-Page)**

-   Etiqueta \<title\> y meta descripción únicos y optimizados para
    \'páginas web para pequeños negocios \[ciudad\]\'.

-   Jerarquía de encabezados correcta: un único H1 por página, seguido
    de H2 y H3.

-   Atributos alt descriptivos en todas las imágenes.

-   URL limpia y descriptiva.

-   Archivo sitemap.xml y robots.txt correctamente configurados.

-   Implementación de datos estructurados (Schema.org) para
    LocalBusiness.

**5.5 Accesibilidad**

-   Cumplimiento básico de WCAG 2.1 nivel AA.

-   Contraste mínimo de 4.5:1 entre texto y fondo.

-   Todos los elementos interactivos accesibles mediante teclado.

-   Etiquetas ARIA donde sean necesarias en el formulario.

**5.6 Seguridad**

-   El sitio debe servirse íntegramente por HTTPS.

-   El formulario de contacto debe incluir protección anti-spam.

-   No se almacenarán datos personales de usuarios sin consentimiento
    explícito (RGPD).

-   Incluir política de privacidad y aviso legal enlazados desde el
    footer.

**6. Stack Tecnológico Recomendado**

**6.1 Frontend**

Se recomienda el siguiente stack tecnológico para garantizar modernidad,
rendimiento y facilidad de mantenimiento:

  -------------------------------------------------------------------------
  **Categoría**     **Tecnología**      **Motivo**
  ----------------- ------------------- -----------------------------------
  **Framework**     **Next.js 14 /      Rendimiento superior, SSG/SSR, SEO
                    Astro**             óptimo out-of-the-box.

  **Estilos**       **Tailwind CSS**    Diseño rápido, consistente y
                                        responsive sin CSS personalizado
                                        excesivo.

  **Animaciones**   **Framer Motion**   Animaciones fluidas y de alto nivel
                                        con código declarativo.

  **Formulario**    **React Hook Form + Validación robusta y envío sin
                    Formspree /         backend propio.
                    EmailJS**           

  **Iconos**        **Lucide React /    Iconos modernos, ligeros y
                    Heroicons**         consistentes.

  **Imágenes**      **Next/Image        Conversión a WebP, lazy loading y
                    (optimización       redimensionado automático.
                    automática)**       
  -------------------------------------------------------------------------

**6.2 Infraestructura y Despliegue**

-   Hosting recomendado: Vercel (gratuito para proyectos pequeños,
    despliegue automático desde Git).

-   Alternativa de hosting: Netlify o GitHub Pages (para sitios
    estáticos).

-   Dominio: Namecheap o GoDaddy (precio aprox. 10-15€/año para .es o
    .com).

-   Certificado SSL: Gratuito incluido con Vercel/Netlify.

-   Servicio de formularios: Formspree (100 envíos/mes gratis) o EmailJS
    (200 envíos/mes gratis).

**7. Criterios de Aceptación**

El proyecto se considerará completado satisfactoriamente cuando se
cumplan todos los criterios de aceptación de prioridad Alta y al menos
el 70% de los de prioridad Media.

  ------------------------------------------------------------------------------------
  **CA-ID**   **Criterio de Aceptación**                  **Prioridad**   **Estado**
  ----------- ------------------------------------------- --------------- ------------
  **CA-01**   El formulario de contacto envía             Alta            Pendiente
              correctamente los datos al correo de Webs                   
              VC.                                                         

  **CA-02**   El botón de WhatsApp abre una conversación  Alta            Pendiente
              con el mensaje preformateado correcto.                      

  **CA-03**   El sitio es completamente funcional en      Alta            Pendiente
              Chrome, Firefox, Safari y Edge.                             

  **CA-04**   El sitio obtiene \>90 puntos en PageSpeed   Alta            Pendiente
              Insights en móvil.                                          

  **CA-05**   Todas las secciones del mapa de sitio están Alta            Pendiente
              implementadas.                                              

  **CA-06**   El menú hamburguesa funciona correctamente  Alta            Pendiente
              en móvil.                                                   

  **CA-07**   El scroll suave entre secciones funciona en Media           Pendiente
              todos los navegadores.                                      

  **CA-08**   Los contadores animados se activan al       Media           Pendiente
              entrar en el viewport.                                      

  **CA-09**   La tabla de precios muestra correctamente   Alta            Pendiente
              los 3 planes.                                               

  **CA-10**   El sitio se sirve por HTTPS sin             Alta            Pendiente
              advertencias de seguridad.                                  
  ------------------------------------------------------------------------------------

**8. Plan de Desarrollo Orientativo**

**8.1 Fases del Proyecto**

  ---------------------------------------------------------------------------------
  **Fase**           **Actividades**        **Duración**   **Entregable**
  ------------------ ---------------------- -------------- ------------------------
  **Fase 1 ---       Wireframes, paleta de  **3-5 días**   Prototipo visual
  Diseño**           colores, selección de                 aprobado.
                     tipografía, prototipo                 
                     en Figma.                             

  **Fase 2 ---       Desarrollo HTML/CSS de **5-7 días**   Sitio estático
  Maquetación**      todas las secciones.                  funcional.
                     Responsive design.                    

  **Fase 3 ---       Animaciones,           **3-4 días**   Formulario funcionando
  Interactividad**   formulario de                         en staging.
                     contacto, integración                 
                     email y WhatsApp.                     

  **Fase 4 ---       Pruebas en distintos   **2-3 días**   Sitio aprobado para
  Revisión**         dispositivos,                         producción.
                     corrección de bugs,                   
                     optimización.                         

  **Fase 5 ---       Despliegue en Vercel,  **1 día**      Sitio live en internet.
  Lanzamiento**      configuración de                      
                     dominio, DNS y HTTPS.                 
  ---------------------------------------------------------------------------------

**8.2 Estimación Total**

Duración total estimada del proyecto: 14 a 20 días laborables desde la
aprobación del diseño.

Esta estimación puede variar según el volumen de contenido y revisiones
solicitadas por el cliente.

**9. Control de Versiones del Documento**

  -----------------------------------------------------------------------------
  **Versión**   **Fecha**    **Autor**         **Cambios**
  ------------- ------------ ----------------- --------------------------------
  **1.0**       Junio 2025   Webs VC           Borrador inicial del documento.

  -----------------------------------------------------------------------------

Documento preparado por Webs VC · Confidencial

Para más información contacte en: contacto@websvc.es
