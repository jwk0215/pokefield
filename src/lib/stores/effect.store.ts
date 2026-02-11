import { writable } from "svelte/store";




function createEffectStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        startEffect: () => set(true),
        stopEffect: () => set(false)
    }
}
export default createEffectStore();