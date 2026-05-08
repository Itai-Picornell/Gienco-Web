<template>
  <main class="flex-grow pt-20 bg-background-dark min-h-screen">
    <!-- Hero Header -->
    <section class="relative py-16 md:py-24 overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px]"></div>
        <div class="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-white/[0.03] rounded-full blur-[100px]"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <div class="flex flex-col items-center text-center mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-border-dark mb-6">
            <span class="material-symbols-outlined text-white text-3xl" aria-hidden="true">gavel</span>
          </div>
          <h1 class="text-h1 font-display leading-none text-white mb-4">
            TÉRMINOS Y CONDICIONES
          </h1>
          <p class="text-body text-text-muted max-w-lg mx-auto leading-relaxed">
            Condiciones de uso del sitio web de Gienco
          </p>
          <div class="flex items-center gap-2 mt-6 text-xs text-gray-500">
            <span class="material-symbols-outlined text-[14px]" aria-hidden="true">calendar_today</span>
            <span>Última actualización: 6 de mayo de 2026</span>
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
            to="/privacidad"
            class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span class="material-symbols-outlined text-[18px]" aria-hidden="true">shield</span>
            Ver Política de Privacidad
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
 * Vista de Términos y Condiciones de Uso
 * Contenido redactado conforme al RGPD (UE 2016/679) y la LSSI-CE.
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
    id: 'identificacion',
    title: 'Identificación del Responsable',
    content: `
      <p>En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), le informamos que el presente sitio web es titularidad de:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li><strong class="text-gray-300">Titular:</strong> Gienco (proyecto musical)</li>
        <li><strong class="text-gray-300">Responsable legal:</strong> [Nombre completo del titular]</li>
        <li><strong class="text-gray-300">NIF/DNI:</strong> [Número de identificación fiscal]</li>
        <li><strong class="text-gray-300">Domicilio a efectos de notificaciones:</strong> [Dirección postal]</li>
        <li><strong class="text-gray-300">Email de contacto:</strong> giencoband@gmail.com</li>
        <li><strong class="text-gray-300">Sitio web:</strong> giencoband.com</li>
      </ul>
      <p class="mt-3 text-xs text-gray-500">[Datos pendientes de completar por el titular antes de la publicación oficial.]</p>
    `
  },
  {
    id: 'objeto',
    title: 'Objeto y Aceptación',
    content: `
      <p>Los presentes Términos y Condiciones regulan el acceso y uso del sitio web de Gienco (en adelante, "el Sitio Web"), así como la relación entre el Sitio Web y sus usuarios.</p>
      <p>El acceso al Sitio Web y/o la utilización de cualquiera de sus servicios implica la aceptación plena y sin reservas de todas y cada una de las presentes condiciones. Si no estás de acuerdo con alguna de estas condiciones, te rogamos que no utilices el Sitio Web.</p>
      <p>Gienco se reserva el derecho a modificar en cualquier momento los presentes Términos y Condiciones, siendo la versión publicada en cada momento la que regirá la relación con los usuarios.</p>
    `
  },
  {
    id: 'registro',
    title: 'Registro y Cuenta de Usuario',
    content: `
      <p>Para acceder a determinados servicios del Sitio Web (como la compra de merchandising), el usuario deberá crear una cuenta proporcionando los siguientes datos:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li><strong class="text-gray-300">Nombre</strong></li>
        <li><strong class="text-gray-300">Correo electrónico</strong></li>
        <li><strong class="text-gray-300">Contraseña</strong></li>
      </ul>
      <p class="mt-3">El usuario se compromete a:</p>
      <ul class="list-disc list-inside mt-2 space-y-1 text-gray-400">
        <li>Proporcionar información veraz, exacta y actualizada.</li>
        <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
        <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta.</li>
        <li>Ser mayor de 16 años o contar con el consentimiento de un tutor legal.</li>
      </ul>
      <p class="mt-3">Gienco se reserva el derecho a suspender o eliminar cuentas que incumplan estos términos o que muestren actividad fraudulenta.</p>
    `
  },
  {
    id: 'uso',
    title: 'Condiciones de Uso',
    content: `
      <p>El usuario se compromete a utilizar el Sitio Web de conformidad con la ley, las buenas costumbres y el orden público. Queda expresamente prohibido:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li>Utilizar el Sitio Web con fines ilícitos o contrarios a estos Términos.</li>
        <li>Intentar acceder de forma no autorizada a sistemas o datos del Sitio Web.</li>
        <li>Realizar ingeniería inversa o intentar descompilar cualquier componente del Sitio Web.</li>
        <li>Utilizar bots, scrapers u otros medios automatizados sin autorización.</li>
        <li>Difundir contenido ofensivo, difamatorio o que vulnere derechos de terceros.</li>
        <li>Suplantar la identidad de otro usuario o persona.</li>
      </ul>
    `
  },
  {
    id: 'propiedad-intelectual',
    title: 'Propiedad Intelectual e Industrial',
    content: `
      <p>Todos los contenidos del Sitio Web, incluyendo pero no limitándose a textos, imágenes, fotografías, logotipos, marcas, composiciones musicales, diseño gráfico, código fuente y software, están protegidos por las leyes de propiedad intelectual e industrial vigentes.</p>
      <p class="mt-3"><strong class="text-gray-300">Gienco</strong> es titular o licenciataria de todos los derechos de propiedad intelectual e industrial sobre los contenidos del Sitio Web.</p>
      <p class="mt-3">Queda terminantemente prohibida la reproducción, distribución, comunicación pública, transformación o cualquier otra forma de explotación de los contenidos del Sitio Web sin la autorización expresa y por escrito de Gienco.</p>
      <p class="mt-3">El uso del Sitio Web no otorga al usuario ningún derecho sobre la propiedad intelectual de los contenidos.</p>
    `
  },
  {
    id: 'compras',
    title: 'Compras y Merchandising',
    content: `
      <p>El Sitio Web ofrece la venta de productos de merchandising oficial de Gienco bajo un modelo de <strong class="text-gray-300">producción bajo demanda (print-on-demand)</strong>: cada pedido se confecciona expresamente para el comprador una vez confirmado el pago. No se mantiene stock previo.</p>

      <h3 class="text-gray-300 font-semibold mt-4 mb-2">Precios y disponibilidad</h3>
      <ul class="list-disc list-inside space-y-1 text-gray-400">
        <li>Los precios mostrados están expresados en euros (€) e incluyen los impuestos aplicables.</li>
        <li>Gienco se reserva el derecho a modificar precios sin previo aviso; los pedidos ya confirmados se respetarán al precio vigente en el momento de la compra.</li>
        <li>La validación final de precio y disponibilidad de tallas se realiza en el servidor en el momento de tramitar el pedido.</li>
      </ul>

      <h3 class="text-gray-300 font-semibold mt-4 mb-2">Medio de pago: Bizum</h3>
      <p>El pago se realiza mediante <strong class="text-gray-300">Bizum</strong> al número y nombre indicados en el correo electrónico de confirmación del pedido. Es <strong class="text-gray-300">imprescindible incluir el número de pedido en el concepto del Bizum</strong> para que podamos identificarlo.</p>
      <ul class="list-disc list-inside mt-2 space-y-1 text-gray-400">
        <li>El plazo máximo para completar el pago es de <strong class="text-gray-300">48 horas</strong> desde la confirmación del pedido.</li>
        <li>Transcurrido ese plazo sin recibir el Bizum, el pedido se cancelará automáticamente y deberá iniciarse de nuevo el proceso.</li>
        <li>La confirmación del pago es <strong class="text-gray-300">manual</strong>: tras verificar la recepción del Bizum, recibirás un correo confirmando que el pedido se ha enviado a producción.</li>
      </ul>

      <h3 class="text-gray-300 font-semibold mt-4 mb-2">Entrega: recogida en mano</h3>
      <p>Por tratarse de un proyecto musical de cercanía, <strong class="text-gray-300">Gienco no realiza envíos postales</strong>. La entrega se efectúa siempre <strong class="text-gray-300">en persona</strong>, en un lugar y horario coordinado entre las partes:</p>
      <ul class="list-disc list-inside mt-2 space-y-1 text-gray-400">
        <li>Una vez el pedido esté listo, Gienco contactará por <strong class="text-gray-300">WhatsApp</strong> al número de teléfono facilitado por el comprador para acordar la recogida.</li>
        <li>El comprador deberá recoger el pedido en un plazo razonable desde la notificación. Si no fuera posible la entrega tras varios intentos, Gienco se reserva el derecho a cancelar la operación previa comunicación al comprador.</li>
      </ul>

      <h3 class="text-gray-300 font-semibold mt-4 mb-2">Derecho de desistimiento</h3>
      <p>Conforme al artículo 102 del Real Decreto Legislativo 1/2007 (LGDCU), el comprador dispone, con carácter general, de <strong class="text-gray-300">14 días naturales</strong> desde la recepción del producto para desistir de la compra sin necesidad de justificar la decisión.</p>
      <p class="mt-2"><strong class="text-gray-300">Excepción aplicable:</strong> al tratarse de productos confeccionados conforme a las especificaciones del consumidor o claramente personalizados (talla y diseño elegidos), <strong class="text-gray-300">el derecho de desistimiento NO resulta de aplicación</strong>, según el artículo 103.c de la misma norma. No se admitirán por tanto devoluciones por arrepentimiento del comprador.</p>
      <p class="mt-2">Lo anterior no afecta a las garantías legales sobre productos defectuosos: si el artículo recibido presenta un defecto de fabricación o no se corresponde con lo pedido, contacta con nosotros y procederemos a su sustitución o reembolso conforme a la normativa vigente.</p>

      <p class="mt-4">Para cualquier incidencia con tu pedido, puedes contactarnos en <strong class="text-gray-300">giencoband@gmail.com</strong>.</p>
    `
  },
  {
    id: 'responsabilidad',
    title: 'Limitación de Responsabilidad',
    content: `
      <p>Gienco no se hace responsable de:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li>Interrupciones, errores o fallos técnicos en el Sitio Web, ya sean de origen interno o externo.</li>
        <li>Daños derivados del uso indebido del Sitio Web por parte del usuario.</li>
        <li>Contenidos de sitios web de terceros a los que se pueda acceder desde enlaces del Sitio Web.</li>
        <li>Virus o programas maliciosos que pudieran afectar al equipo del usuario como consecuencia del acceso al Sitio Web.</li>
      </ul>
      <p class="mt-3">Gienco se esfuerza por mantener la información del Sitio Web actualizada y libre de errores, pero no garantiza su integridad, exactitud o actualización permanente.</p>
    `
  },
  {
    id: 'enlaces',
    title: 'Enlaces a Terceros',
    content: `
      <p>El Sitio Web puede contener enlaces a plataformas de terceros como Spotify, Instagram, YouTube y Bandsintown. Estos enlaces se proporcionan únicamente para conveniencia del usuario.</p>
      <p class="mt-3">Gienco no controla ni se responsabiliza del contenido, las políticas de privacidad ni las prácticas de estos sitios web de terceros. Recomendamos revisar los términos y condiciones y la política de privacidad de cada sitio web de terceros que visites.</p>
    `
  },
  {
    id: 'legislacion',
    title: 'Legislación Aplicable y Jurisdicción',
    content: `
      <p>Los presentes Términos y Condiciones se rigen por la legislación española y, en particular, por:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li><strong class="text-gray-300">Reglamento (UE) 2016/679</strong> (RGPD) — Reglamento General de Protección de Datos.</li>
        <li><strong class="text-gray-300">Ley Orgánica 3/2018</strong> (LOPDGDD) — Ley de Protección de Datos Personales y garantía de los derechos digitales.</li>
        <li><strong class="text-gray-300">Ley 34/2002</strong> (LSSI-CE) — Ley de Servicios de la Sociedad de la Información y del Comercio Electrónico.</li>
        <li><strong class="text-gray-300">Real Decreto Legislativo 1/2007</strong> (LGDCU) — Texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.</li>
        <li><strong class="text-gray-300">Reglamento (UE) 524/2013</strong> sobre resolución de litigios en línea en materia de consumo.</li>
      </ul>
      <p class="mt-3">Para la resolución de cualquier controversia, las partes se someterán a la jurisdicción y competencia de los juzgados y tribunales del domicilio del usuario, conforme a la legislación vigente en materia de consumidores y usuarios.</p>
    `
  },
  {
    id: 'resolucion-litigios',
    title: 'Resolución Online de Litigios',
    content: `
      <p>De conformidad con el <strong class="text-gray-300">Reglamento (UE) 524/2013</strong>, la Comisión Europea pone a disposición de los consumidores una plataforma de resolución de litigios en línea, accesible desde:</p>
      <p class="mt-2">
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" class="text-white hover:bg-white hover:text-black px-1 rounded transition-colors font-medium break-all">
          https://ec.europa.eu/consumers/odr/
        </a>
      </p>
      <p class="mt-3">Si tienes una reclamación que no hayamos podido resolver de forma amistosa por correo electrónico, puedes acudir a esta plataforma para iniciar un procedimiento extrajudicial de resolución del conflicto.</p>
      <p class="mt-3">Adicionalmente, puedes presentar reclamaciones en los organismos de consumo de tu Comunidad Autónoma o ante la Junta Arbitral de Consumo correspondiente.</p>
    `
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones',
    content: `
      <p>Gienco se reserva el derecho a modificar los presentes Términos y Condiciones en cualquier momento. Las modificaciones serán efectivas desde su publicación en el Sitio Web.</p>
      <p class="mt-3">Se recomienda al usuario revisar periódicamente estos Términos. El uso continuado del Sitio Web tras la publicación de cambios constituirá la aceptación de dichas modificaciones.</p>
      <p class="mt-3">En caso de cambios sustanciales, se notificará a los usuarios registrados a través del correo electrónico asociado a su cuenta.</p>
    `
  },
  {
    id: 'contacto',
    title: 'Contacto',
    content: `
      <p>Para cualquier consulta sobre estos Términos y Condiciones, puedes contactar con nosotros en:</p>
      <ul class="list-disc list-inside mt-3 space-y-1 text-gray-400">
        <li><strong class="text-gray-300">Email:</strong> giencoband@gmail.com</li>
      </ul>
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
</style>
