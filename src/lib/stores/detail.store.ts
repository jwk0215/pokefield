import { writable } from "svelte/store";




export  interface DetailStoreType {
    nameKr: string;
    image: string;
    type: string[];
    stats: {[name: string]: number};
    abilities: {[name: string]: boolean};
}

function createDetailStore() {
    const { subscribe, set } = writable<DetailStoreType | null>(null);

    return {
        subscribe,
        setStore(data: DetailStoreType) {
            set(data);
        },
        clearStore: () => set(null)
    }
}
export default createDetailStore();