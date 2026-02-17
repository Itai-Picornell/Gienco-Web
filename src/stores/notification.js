import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
    const showModal = ref(false)
    const modalType = ref('alert') // 'alert' or 'confirm'
    const modalTitle = ref('')
    const modalMessage = ref('')
    const modalResolve = ref(null)

    /**
     * Muestra un modal de alerta informativa y espera a que el usuario lo cierre.
     * 
     * @param {string} message - Mensaje a mostrar en el cuerpo de la alerta.
     * @param {string} [title='Aviso'] - Título del modal. Default 'Aviso'.
     * @returns {Promise<void>} Promesa que se resuelve cuando el usuario cierra la alerta.
     */
    const alert = (message, title = 'Aviso') => {
        return new Promise((resolve) => {
            modalType.value = 'alert'
            modalTitle.value = title
            modalMessage.value = message
            showModal.value = true
            modalResolve.value = resolve
        })
    }

    /**
     * Muestra un modal de confirmación con opciones (Aceptar/Cancelar).
     * 
     * @param {string} message - Pregunta o mensaje de confirmación.
     * @param {string} [title='Confirmar'] - Título del modal. Default 'Confirmar'.
     * @returns {Promise<boolean>} Promesa que resuelve a True si el usuario acepta, False si cancela.
     */
    const confirm = (message, title = 'Confirmar') => {
        return new Promise((resolve) => {
            modalType.value = 'confirm'
            modalTitle.value = title
            modalMessage.value = message
            showModal.value = true
            modalResolve.value = resolve
        })
    }

    /**
     * Cierra el modal activo y resuelve la promesa pendiente con el resultado proporcionado.
     * 
     * @param {boolean} [result=true] - Valor con el que se resolverá la promesa (para confirmaciones).
     */
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
