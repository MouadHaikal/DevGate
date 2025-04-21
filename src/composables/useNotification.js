import { ref } from 'vue';

const isActive = ref(false);
const message = ref('');
const type = ref('info'); // 'success', 'error', 'info'

export function useNotification() {
    function showNotification(text, notifType = 'info', duration = 3000) {
        message.value = text;
        type.value = notifType;
        isActive.value = true;

        setTimeout(() => {
            isActive.value = false;
        }, duration);
    }

    return {
        isActive,
        message,
        type,
        showNotification
    };
}
