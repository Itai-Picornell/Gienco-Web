<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="notificationStore.showModal" 
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @click.self="handleBackdropClick"
      >
        <Transition name="modal-scale">
          <div 
            v-if="notificationStore.showModal"
            class="bg-surface-dark border border-[#392829] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <!-- Header -->
            <div class="p-6 bg-gradient-to-br from-primary/10 to-transparent border-b border-[#392829]">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-2xl">
                    {{ notificationStore.modalType === 'confirm' ? 'help' : 'info' }}
                  </span>
                </div>
                <h3 class="text-white text-xl font-black uppercase tracking-tight">
                  {{ notificationStore.modalTitle }}
                </h3>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6">
              <p class="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                {{ notificationStore.modalMessage }}
              </p>
            </div>

            <!-- Footer -->
            <div class="p-6 pt-0 flex gap-3 justify-end">
              <button
                v-if="notificationStore.modalType === 'confirm'"
                @click="notificationStore.closeModal(false)"
                class="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold uppercase tracking-wide transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="notificationStore.closeModal(true)"
                class="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wide transition-colors"
              >
                {{ notificationStore.modalType === 'confirm' ? 'Confirmar' : 'Aceptar' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useNotificationStore } from '../stores/notification'

const notificationStore = useNotificationStore()

const handleBackdropClick = () => {
  if (notificationStore.modalType === 'alert') {
    notificationStore.closeModal(true)
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.2s ease;
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
