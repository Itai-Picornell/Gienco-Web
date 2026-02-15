import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
    const showModal = ref(false)
    const modalType = ref('alert') // 'alert' or 'confirm'
    const modalTitle = ref('')
    const modalMessage = ref('')
    const modalResolve = ref(null)

    const alert = (message, title = 'Aviso') => {
        return new Promise((resolve) => {
            modalType.value = 'alert'
            modalTitle.value = title
            modalMessage.value = message
            showModal.value = true
            modalResolve.value = resolve
        })
    }

    const confirm = (message, title = 'Confirmar') => {
        return new Promise((resolve) => {
            modalType.value = 'confirm'
            modalTitle.value = title
            modalMessage.value = message
            showModal.value = true
            modalResolve.value = resolve
        })
    }

    const closeModal = (result = true) => {
        showModal.value = false
        if (modalResolve.value) {
            modalResolve.value(result)
            modalResolve.value = null
        }
    }

    return {
        showModal,
        modalType,
        modalTitle,
        modalMessage,
        alert,
        confirm,
        closeModal
    }
})
