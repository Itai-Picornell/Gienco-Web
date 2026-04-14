<template>
  <main class="flex-grow pt-20 bg-background-dark min-h-screen">
    <!-- Hero Header -->
    <section class="relative py-16 md:py-24 overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-white/[0.03] rounded-full blur-[100px]"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <div class="flex flex-col items-center text-center mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-border-dark mb-6">
            <span class="material-symbols-outlined text-white text-3xl" aria-hidden="true">shield</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black leading-none tracking-tighter text-white mb-4">
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p class="text-text-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Cómo protegemos y tratamos tus datos personales
          </p>
          <div class="flex items-center gap-2 mt-6 text-xs text-gray-500">
            <span class="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_today</span>
            <span>Última actualización: 14 de abril de 2026</span>
          </div>
        </div>

        <!-- RGPD Summary Banner -->
        <div class="bg-white/[0.03] border border-border-dark rounded-xl p-6 mb-12">
          <div class="flex items-start gap-4">
            <span class="material-symbols-outlined text-emerald-500 text-2xl mt-0.5 flex-shrink-0" aria-hidden="true">verified_user</span>
            <div>
              <h2 class="text-white font-bold text-sm mb-2">Tu privacidad es nuestra prioridad</h2>
              <p class="text-gray-400 text-sm leading-relaxed">
                En cumplimiento del <strong class="text-gray-300">Reglamento (UE) 2016/679 (RGPD)</strong> y la
                <strong class="text-gray-300">Ley Orgánica 3/2018 (LOPDGDD)</strong>, te informamos de forma transparente
                sobre cómo recogemos, usamos y protegemos tus datos personales.
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Navigation -->
        <nav class="bg-card-dark border border-border-dark rounded-xl p-6 mb-12" aria-label="Índice de secciones">
          <h2 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Índice</h2>
          <ol class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <li v-for="(section, index) in sections" :key="section.id">
              <a
                :href="`#${section.id}`"
                class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-1"
              >
                <span class="text-xs font-mono text-gray-600 w-5">{{ String(index + 1).padStart(2, '0') }}</span>
                {{ section.title }}
              </a>
            </li>
          </ol>
        </nav>

        <!-- Legal Sections -->
        <div class="space-y-8">
          <article
            v-for="(section, index) in sections"
            :key="section.id"
            :id="section.id"
            class="bg-card-dark border border-border-dark rounded-xl overflow-hidden scroll-mt-24 transition-all duration-300 hover:border-gray-600"
          >
            <button
              @click="toggleSection(section.id)"
              class="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-inset"
              :aria-expanded="openSections.has(section.id)"
              :aria-controls="`content-${section.id}`"
            >
              <div class="flex items-center gap-4">
                <span class="text-xs font-mono text-gray-600 bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <h2 class="text-lg md:text-xl font-bold text-white">{{ section.title }}</h2>
              </div>
              <span
                class="material-symbols-outlined text-gray-500 transition-transform duration-300"
                :class="{ 'rotate-180': openSections.has(section.id) }"
                aria-hidden="true"
              >expand_more</span>
            </button>

            <Transition name="collapse">
              <div
                v-show="openSections.has(section.id)"
                :id="`content-${section.id}`"
                class="px-6 pb-6"
              >
                <div class="border-t border-border-dark pt-5 legal-content text-gray-400 text-sm leading-relaxed space-y-4" v-html="section.content"></div>
              </div>
            </Transition>
          </article>
        </div>

        <!-- Footer Links -->
        <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card-dark border border-border-dark rounded-xl">
          <router-link
            to="/terminos"
            class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">gavel</span>
            Ver Términos y Condiciones
          </router-link>
          <router-link
            to="/signup"
            class="inline-flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-border-dark hover:bg-white/10 hover:border-gray-500 px-5 py-2.5 rounded-lg transition-all active:scale-95"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_back</span>
            Volver al registro
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue'

/**
 * Vista de Política de Privacidad
 * Contenido redactado conforme al RGPD (UE 2016/679),
 * la LOPDGDD (LO 3/2018) y la LSSI-CE (Ley 34/2002).
 */

const openSections = reactive(new Set())

const toggleSection = (id) => {
  if (openSections.has(id)) {
    openSections.delete(id)
  } else {
    openSections.add(id)
  }
}

const sections = ref([
  {
    id: 'responsable',
    title: 'Responsable del Tratamiento',
    content: `
      <p>En cumplimiento de los artículos 13 y 14 del <strong class="text-gray-300">Reglamento (UE) 2016/679</strong> (RGPD), te informamos de que el responsable del tratamiento de tus datos personales es:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li><strong class="text-gray-300">Responsable:</strong> Gienco</li>
        <li><strong class="text-gray-300">Email de contacto:</strong> giencoband@gmail.com</li>
        <li><strong class="text-gray-300">Sitio web:</strong> gienco.com</li>
      </ul>
    `
  },
  {
    id: 'datos-recogidos',
    title: 'Datos Personales que Recogemos',
    content: `
      <p>Recogemos los siguientes datos personales cuando te registras en nuestro Sitio Web:</p>
      <div class="overflow-x-auto mt-3">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-border-dark">
              <th class="text-left py-2 pr-4 text-gray-300 font-semibold">Dato</th>
              <th class="text-left py-2 pr-4 text-gray-300 font-semibold">Finalidad</th>
              <th class="text-left py-2 text-gray-300 font-semibold">Obligatorio</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border-dark/50">
              <td class="py-2 pr-4">Nombre</td>
              <td class="py-2 pr-4">Identificación y personalización</td>
              <td class="py-2">Sí</td>
            </tr>
            <tr class="border-b border-border-dark/50">
              <td class="py-2 pr-4">Correo electrónico</td>
              <td class="py-2 pr-4">Identif. de cuenta, comunicaciones</td>
              <td class="py-2">Sí</td>
            </tr>
            <tr>
              <td class="py-2 pr-4">Contraseña</td>
              <td class="py-2 pr-4">Seguridad de la cuenta</td>
              <td class="py-2">Sí</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4">La contraseña se almacena de forma cifrada y nunca es accesible en texto plano, ni siquiera para los administradores del Sitio Web.</p>
    `
  },
  {
    id: 'finalidad',
    title: 'Finalidad del Tratamiento',
    content: `
      <p>Tus datos personales serán tratados con las siguientes finalidades:</p>
      <ul class="list-disc list-inside mt-3 space-y-2 text-gray-400">
        <li><strong class="text-gray-300">Gestión de la cuenta de usuario:</strong> Crear y administrar tu cuenta personal en el Sitio Web.</li>
        <li><strong class="text-gray-300">Procesamiento de pedidos:</strong> Gestionar las compras de merchandising, incluyendo el envío y la facturación.</li>
        <li><strong class="text-gray-300">Comunicaciones transaccionales:</strong> Enviarte confirmaciones de registro, verificación de cuenta, confirmaciones de pedido y otros avisos esenciales del servicio.</li>
        <li><strong class="text-gray-300">Seguridad:</strong> Proteger la integridad de tu cuenta y prevenir usos fraudulentos.</li>
      </ul>
      <p class="mt-3"><strong class="text-gray-300">No realizamos perfiles automatizados ni tomamos decisiones automatizadas</strong> basadas en tus datos personales.</p>
    `
  },
  {
    id: 'base-juridica',
    title: 'Base Jurídica del Tratamiento',
    content: `
      <p>El tratamiento de tus datos se fundamenta en las siguientes bases jurídicas conforme al artículo 6 del RGPD:</p>
      <ul class="list-disc list-inside mt-3 space-y-2 text-gray-400">
        <li><strong class="text-gray-300">Consentimiento (art. 6.1.a RGPD):</strong> Al registrarte y aceptar estos términos, otorgas tu consentimiento explícito, libre, informado e inequívoco para el tratamiento de tus datos.</li>
        <li><strong class="text-gray-300">Ejecución de contrato (art. 6.1.b RGPD):</strong> El tratamiento es necesario para la ejecución de la relación contractual cuando realizas una compra de merchandising.</li>
        <li><strong class="text-gray-300">Interés legítimo (art. 6.1.f RGPD):</strong> La seguridad de la plataforma y la prevención de fraude.</li>
      </ul>
    `
  },
  {
    id: 'destinatarios',
    title: 'Destinatarios y Encargados del Tratamiento',
    content: `
      <p>Tus datos personales pueden ser comunicados o accedidos por los siguientes terceros, exclusivamente para las finalidades indicadas:</p>
      <ul class="list-disc list-inside mt-3 space-y-2 text-gray-400">
        <li><strong class="text-gray-300">Amazon Web Services (AWS):</strong> Proveedor de servicios de infraestructura cloud y autenticación (Cognito). Los datos se almacenan en servidores de la UE. AWS actúa como <strong class="text-gray-300">encargado del tratamiento</strong> conforme al artículo 28 del RGPD.</li>
        <li><strong class="text-gray-300">Fuerzas y cuerpos de seguridad:</strong> En caso de que así lo exija la normativa aplicable o una resolución judicial.</li>
      </ul>
      <p class="mt-3"><strong class="text-gray-300">No vendemos ni cedemos tus datos personales a terceros</strong> con fines comerciales o publicitarios.</p>
    `
  },
  {
    id: 'conservacion',
    title: 'Plazo de Conservación',
    content: `
      <p>Tus datos personales se conservarán mientras se mantenga la relación de servicio (tu cuenta de usuario esté activa).</p>
      <p class="mt-3">Una vez solicites la supresión de tu cuenta:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li>Los datos se eliminarán en un plazo máximo de <strong class="text-gray-300">30 días</strong>.</li>
        <li>Se mantendrán bloqueados durante el plazo legalmente establecido cuando existan obligaciones fiscales o legales (por ejemplo, datos de facturación durante <strong class="text-gray-300">5 años</strong> según legislación mercantil).</li>
      </ul>
    `
  },
  {
    id: 'derechos',
    title: 'Tus Derechos (Derechos ARCO+)',
    content: `
      <p>Conforme al RGPD y la LOPDGDD, dispones de los siguientes derechos sobre tus datos personales:</p>
      <div class="overflow-x-auto mt-3">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-border-dark">
              <th class="text-left py-2 pr-4 text-gray-300 font-semibold">Derecho</th>
              <th class="text-left py-2 text-gray-300 font-semibold">Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-border-dark/50">
              <td class="py-2 pr-4 font-medium text-gray-300">Acceso</td>
              <td class="py-2">Conocer qué datos tenemos sobre ti y cómo los tratamos.</td>
            </tr>
            <tr class="border-b border-border-dark/50">
              <td class="py-2 pr-4 font-medium text-gray-300">Rectificación</td>
              <td class="py-2">Corregir datos inexactos o completar datos incompletos.</td>
            </tr>
            <tr class="border-b border-border-dark/50">
              <td class="py-2 pr-4 font-medium text-gray-300">Supresión</td>
              <td class="py-2">Solicitar la eliminación de tus datos ("derecho al olvido").</td>
            </tr>
            <tr class="border-b border-border-dark/50">
              <td class="py-2 pr-4 font-medium text-gray-300">Oposición</td>
              <td class="py-2">Oponerte al tratamiento de tus datos para determinadas finalidades.</td>
            </tr>
            <tr class="border-b border-border-dark/50">
              <td class="py-2 pr-4 font-medium text-gray-300">Limitación</td>
              <td class="py-2">Solicitar la limitación del tratamiento en determinadas circunstancias.</td>
            </tr>
            <tr>
              <td class="py-2 pr-4 font-medium text-gray-300">Portabilidad</td>
              <td class="py-2">Recibir tus datos en un formato estructurado y de uso común.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-4">Para ejercer cualquiera de estos derechos, envía un correo a <strong class="text-gray-300">giencoband@gmail.com</strong> indicando:</p>
      <ul class="list-disc list-inside mt-2 space-y-1 text-gray-400">
        <li>Nombre completo y correo electrónico de tu cuenta.</li>
        <li>El derecho que deseas ejercer.</li>
        <li>Documentación que acredite tu identidad (copia de DNI/NIE/Pasaporte).</li>
      </ul>
      <p class="mt-3">Responderemos a tu solicitud en el plazo máximo de <strong class="text-gray-300">1 mes</strong> desde su recepción.</p>
      <p class="mt-3">Asimismo, tienes derecho a presentar una reclamación ante la <strong class="text-gray-300">Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" class="text-white hover:bg-white hover:text-black px-1 rounded transition-colors font-medium">www.aepd.es</a> si consideras que tus derechos no han sido atendidos correctamente.</p>
    `
  },
  {
    id: 'cookies',
    title: 'Cookies y Tecnologías Similares',
    content: `
      <p>El Sitio Web puede utilizar cookies técnicas estrictamente necesarias para el funcionamiento del servicio. No utilizamos cookies de seguimiento ni publicitarias propias.</p>
      <p class="mt-3">El Sitio Web integra contenido de terceros que pueden establecer sus propias cookies:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li><strong class="text-gray-300">Spotify:</strong> Reproductor embebido. Consulta la <a href="https://www.spotify.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" class="text-white hover:bg-white hover:text-black px-1 rounded transition-colors font-medium">política de Spotify</a>.</li>
      </ul>
      <p class="mt-3">Tu navegador te permite configurar las cookies y eliminarlas en cualquier momento desde la configuración del mismo.</p>
    `
  },
  {
    id: 'seguridad',
    title: 'Seguridad de los Datos',
    content: `
      <p>Gienco implementa medidas técnicas y organizativas adecuadas para proteger tus datos personales frente a accesos no autorizados, alteración, divulgación o destrucción. Entre ellas:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li>Cifrado de contraseñas mediante algoritmos seguros (gestión delegada en AWS Cognito).</li>
        <li>Comunicaciones cifradas mediante protocolo HTTPS/TLS.</li>
        <li>Infraestructura alojada en AWS con certificaciones de seguridad internacionales (ISO 27001, SOC 2).</li>
        <li>Acceso restringido a los datos personales exclusivamente al personal autorizado.</li>
        <li>Validación y sanitización de todas las entradas de usuario para prevenir ataques XSS e inyección.</li>
      </ul>
    `
  },
  {
    id: 'menores',
    title: 'Protección de Menores',
    content: `
      <p>El Sitio Web no está dirigido a menores de 16 años. Conforme al artículo 8 del RGPD y al artículo 7 de la LOPDGDD:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li>No recopilamos intencionadamente datos de menores de 16 años.</li>
        <li>Los menores de 16 años necesitan el consentimiento de su padre, madre o tutor legal para registrarse.</li>
        <li>Si detectamos que se han recogido datos de un menor sin consentimiento parental, procederemos a su eliminación inmediata.</li>
      </ul>
    `
  },
  {
    id: 'transferencias',
    title: 'Transferencias Internacionales',
    content: `
      <p>Los datos se alojan en servidores de <strong class="text-gray-300">Amazon Web Services</strong> ubicados en la <strong class="text-gray-300">Unión Europea</strong> (región eu-west-1, Irlanda).</p>
      <p class="mt-3">En caso de que fuese necesaria una transferencia internacional de datos fuera del Espacio Económico Europeo (EEE), esta se realizará únicamente bajo las garantías adecuadas establecidas en el RGPD, como:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li>Decisión de adecuación de la Comisión Europea.</li>
        <li>Cláusulas contractuales tipo aprobadas por la Comisión Europea.</li>
      </ul>
    `
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones de esta Política',
    content: `
      <p>Gienco se reserva el derecho a modificar la presente Política de Privacidad en cualquier momento para adaptarla a novedades legislativas o cambios en nuestras prácticas de tratamiento de datos.</p>
      <p class="mt-3">La fecha de la última actualización siempre estará visible en la cabecera de esta página. En caso de cambios sustanciales, se notificará a los usuarios registrados por correo electrónico.</p>
      <p class="mt-3">Te recomendamos revisar esta Política periódicamente.</p>
    `
  },
  {
    id: 'contacto',
    title: 'Contacto',
    content: `
      <p>Para cualquier cuestión relativa a la protección de tus datos personales o para ejercer tus derechos, puedes contactar con nosotros en:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li><strong class="text-gray-300">Email:</strong> giencoband@gmail.com</li>
      </ul>
      <p class="mt-3">Nos comprometemos a responder a tu solicitud en el menor tiempo posible y, en todo caso, dentro del plazo legal de un mes.</p>
    `
  }
])
</script>

<style scoped>
/* Animación de colapso */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 2000px;
}

/* Estilos para el contenido legal renderizado con v-html */
.legal-content :deep(ul) {
  margin-left: 0.5rem;
}

.legal-content :deep(strong) {
  font-weight: 600;
}

.legal-content :deep(table) {
  margin-top: 0.25rem;
}
</style>
