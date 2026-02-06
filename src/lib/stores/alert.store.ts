import { writable } from "svelte/store";




interface AlertStoreType {
    error: string;
    message: string;
}

function createAlertStore() {
    const { subscribe, set } = writable<AlertStoreType | null>(null)

    return {
        subscribe,
        on: (data: AlertStoreType) => {
            set(data);
        },
        off: () => {
            set(null);
        }
    }
}
export default createAlertStore();