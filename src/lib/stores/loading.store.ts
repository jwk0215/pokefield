import { writable } from "svelte/store";




function createLoadingStore() {
    const { subscribe, set } = writable(true);

    return {
        subscribe,
        on: () => {
            set(true);
        },
        off: () => {
            set(false);
        }
    }
}
export default createLoadingStore();