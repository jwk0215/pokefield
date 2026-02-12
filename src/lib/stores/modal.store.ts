import type { Component } from "svelte";
import { writable } from "svelte/store";




interface ModalStoreType<C extends Component<any> = Component<any>> {
    title: string;
    component: C;
    props?: C extends Component<infer P> ? P : never;
}

function createModalStore() {
    const { subscribe, set, update } = writable<ModalStoreType<any> | null>(null);

    return {
        subscribe,
        setStore<C extends Component<any>>(data: ModalStoreType<C>) {
            set(data);
        },
        clearStore() {
            set(null);
        }
    }
}
export default createModalStore();