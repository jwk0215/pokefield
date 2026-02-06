import type { Component } from "svelte";
import { writable } from "svelte/store";




interface ModalStoreType {
    component: Component;
    title: string;
}

function createModalStore() {
    const { subscribe, set, update } = writable<ModalStoreType | null>(null);

    return {
        subscribe,
        setStore(data: ModalStoreType) {
            set(data);
        },
        clearStore() {
            set(null);
        }
    }
}
export default createModalStore();