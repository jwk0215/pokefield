import { writable } from "svelte/store";




function createActionStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        setStore: (bool: boolean) => set(bool)
    }
}
export default createActionStore();