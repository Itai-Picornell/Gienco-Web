<template>
  <div class="w-full max-w-4xl mx-auto my-10 px-4 text-left">
    <div v-if="isLoading" class="flex flex-col">
      <div v-for="i in 3" :key="i" class="py-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center gap-6 animate-pulse">
        <div class="w-16 h-20 bg-neutral-900 rounded"></div>
        <div class="flex-1 space-y-3">
          <div class="w-3/4 h-5 bg-neutral-900 rounded"></div>
          <div class="w-1/2 h-4 bg-neutral-900 rounded"></div>
        </div>
        <div class="w-full sm:w-32 h-10 bg-neutral-900 rounded-full mt-4 sm:mt-0"></div>
      </div>
    </div>

    <div v-else-if="processedEvents.length > 0" class="flex flex-col">
      <div 
        v-for="event in processedEvents" 
        :key="event.id"
        class="py-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 group"
      >
        <div class="flex flex-col items-start sm:items-center justify-center min-w-[5rem] text-white">
          <span class="text-xs font-bold uppercase text-neutral-400">{{ formatDate(event.datetime).month }}</span>
          <span class="text-3xl font-black leading-tight">{{ formatDate(event.datetime).day }}</span>
          <span class="text-xs font-medium text-neutral-500">{{ formatDate(event.datetime).year }}</span>
        </div>

        <div class="flex flex-col flex-1">
          <h3 class="uppercase tracking-wide font-bold text-white text-lg">
            {{ event.venue.name }}
          </h3>
          <p class="text-neutral-400 mb-1">
            {{ event.venue.city }}, {{ event.venue.country }}
          </p>
          
          <div class="flex items-center text-neutral-500 text-sm font-medium gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{{ formatTime(event.datetime) }}</span>
            <span v-if="event.ends_at"> - {{ formatTime(event.ends_at) }}</span>
          </div>

          <p v-if="event.description" class="text-neutral-400 text-sm mt-2 line-clamp-2">
            {{ event.description }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
          
          <template v-if="event.free">
            <a 
              v-if="isValidUrl(event.offers?.[0]?.url)"
              :href="event.offers[0].url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 sm:flex-none text-center bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-sm hover:bg-neutral-200 transition shadow-lg"
            >
              ENTRADA GRATUITA
            </a>
            <div 
              v-else
              class="flex-1 sm:flex-none text-center bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-sm cursor-default"
            >
              ENTRADA GRATUITA
            </div>
          </template>

          <template v-else>
            
            <div 
               v-if="event.sold_out || event.offers?.[0]?.status?.toLowerCase() === 'sold out'"
               class="flex-1 sm:flex-none text-center bg-neutral-800 text-neutral-400 font-bold uppercase px-6 py-2 rounded-full text-sm cursor-default border border-neutral-700"
            >
              SOLD OUT
            </div>
            
            <template v-else>
              <a 
                v-if="event.offers?.[0]?.type && isValidUrl(event.offers?.[0]?.url)"
                :href="event.offers[0].url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 sm:flex-none text-center bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-sm hover:bg-neutral-200 transition"
              >
                {{ event.offers[0].type }}
              </a>
              </template>
            
          </template>

          <a 
            v-if="event.id"
            :href="getBandsintownLink(event.id, 'rsvp')"
            target="_blank"
            rel="noopener noreferrer"
            class="text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer flex-shrink-0 ml-2"
            aria-label="Recuérdame"
          >
            <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.43262 12.636C8.57118 12.3755 8.87692 12.2868 9.11572 12.4378C9.35459 12.589 9.43592 12.923 9.29736 13.1836C9.16551 13.4316 8.97621 13.6373 8.74854 13.7803C8.52083 13.9234 8.26278 13.9988 8 13.9988C7.73723 13.9988 7.47917 13.9234 7.25147 13.7803C7.0238 13.6373 6.83449 13.4316 6.70264 13.1836C6.56408 12.923 6.64541 12.589 6.88428 12.4378C7.12308 12.2868 7.42882 12.3755 7.56738 12.636C7.61134 12.7186 7.67458 12.7875 7.75049 12.8352C7.82637 12.8829 7.91244 12.9077 8 12.9077C8.08756 12.9077 8.17363 12.8829 8.24951 12.8352C8.32542 12.7875 8.38866 12.7186 8.43262 12.636ZM10.5 5.81764C10.5 5.09419 10.2364 4.40058 9.76758 3.88903C9.29874 3.37748 8.66304 3.08988 8 3.08988C7.33696 3.08988 6.70126 3.37748 6.23242 3.88903C5.76358 4.40058 5.5 5.09419 5.5 5.81764C5.5 7.80733 5.10852 9.12642 4.68897 9.96575C4.65083 10.042 4.61186 10.1139 4.57373 10.1821H11.4263C11.3881 10.1139 11.3492 10.042 11.311 9.96575C10.8915 9.12642 10.5 7.80733 10.5 5.81764ZM11.5 5.81764C11.5 7.64669 11.8586 8.78269 12.189 9.44364C12.3548 9.77538 12.5162 9.99316 12.6284 10.1224C12.6847 10.1872 12.7292 10.2298 12.7559 10.254C12.7691 10.2661 12.7779 10.2738 12.7817 10.2769C12.7812 10.2765 12.7805 10.2758 12.7798 10.2753L12.7778 10.2742C12.9608 10.4077 13.0423 10.656 12.9785 10.8858C12.9146 11.1159 12.7203 11.2732 12.5 11.2732H3.5C3.27971 11.2732 3.08537 11.1159 3.02149 10.8858C2.9577 10.656 3.03924 10.4077 3.22217 10.2742L3.22022 10.2753C3.21952 10.2758 3.21878 10.2765 3.21826 10.2769C3.22211 10.2738 3.23086 10.2661 3.24414 10.254C3.27075 10.2298 3.31535 10.1872 3.37158 10.1224C3.48378 9.99316 3.64518 9.77538 3.81104 9.44364C4.14145 8.78269 4.5 7.64669 4.5 5.81764C4.5 4.80481 4.86853 3.83323 5.5249 3.11705C6.18128 2.40088 7.07174 1.99878 8 1.99878C8.92826 1.99878 9.81872 2.40088 10.4751 3.11705C11.1315 3.83323 11.5 4.80481 11.5 5.81764Z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <div v-else class="py-10 text-center">
      <p class="text-neutral-400 text-lg">No hay conciertos programados próximamente.</p>
    </div>

    <div class="mt-10 pt-8 border-t border-neutral-800 flex flex-col items-center justify-center gap-4">
      <p class="text-white text-center font-medium">Recibe actualizaciones sobre nuevos espectáculos y música</p>
      <a 
        :href="`https://www.bandsintown.com/a/15639624-gienco?app_id=${appId}&came_from=267&utm_source=public_api&utm_medium=api&utm_campaign=track&trigger=track&language=es&locale=es&bg-color=%2309090b&text-color=%23ffffff`" 
        target="_blank" 
        rel="noopener noreferrer"
        class="bg-white text-black font-bold uppercase px-6 py-2 rounded-full text-sm hover:bg-neutral-200 transition-all flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.783 0H24v12h-5.217V0zm-6.261 5h5.217v7h-5.217V5zM6.26 5h5.217v7H6.261V5zM24 24H0V0h5.217v19h13.566v-1H6.26v-5H24v11z"/>
        </svg>
        Seguir
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const appId = import.meta.env.VITE_BANDSINTOWN_APP_ID || ''
const events = ref([])
const isLoading = ref(true)

// Validar que la URL es segura y existe
const isValidUrl = (url) => {
  if (!url) return false
  return url.startsWith('http://') || url.startsWith('https://')
}

// Lógica Computada: Filtra eventos caducados y los ordena cronológicamente
const processedEvents = computed(() => {
  const now = new Date()
  
  return events.value
    .filter(event => {
      if (event.ends_at) {
        return new Date(event.ends_at) > now
      }
      const expiryDate = new Date(event.datetime)
      expiryDate.setHours(24, 0, 0, 0)
      return expiryDate > now
    })
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .slice(0, 5)
})

// Enlaces de Campanita a Bandsintown
const getBandsintownLink = (id, type) => {
  const campaign = type === 'rsvp' ? 'rsvp' : 'waitlist'
  const trigger = type === 'rsvp' ? 'rsvp_going' : 'waitlist'
  return `https://www.bandsintown.com/e/${id}?app_id=${appId}&came_from=267&utm_medium=api&utm_source=public_api&utm_campaign=${campaign}&trigger=${trigger}&language=es&locale=es&bg-color=%2309090b&text-color=%23ffffff`
}

// Formateadores de UI
const formatDate = (datetimeString) => {
  if (!datetimeString) return { month: '', day: '', year: '' }
  const date = new Date(datetimeString)
  const month = date.toLocaleString('es-ES', { month: 'short' }).replace('.', '').toUpperCase() + '.'
  return { month, day: date.getDate().toString().padStart(2, '0'), year: date.getFullYear() }
}

const formatTime = (datetimeString) => {
  if (!datetimeString) return ''
  const date = new Date(datetimeString)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}h`
}

// Petición Inicial
onMounted(async () => {
  try {
    const timestamp = new Date().getTime()
    const endpoint = `https://rest.bandsintown.com/artists/Gienco/events?app_id=${appId}&date=upcoming&nocache=${timestamp}`
    
    const response = await fetch(endpoint, { cache: 'no-store' })
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    
    const data = await response.json()
    events.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('[EventsCalendar] Fetch error:', error)
    events.value = []
  } finally {
    isLoading.value = false
  }
})
</script>