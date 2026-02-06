import { writable } from "svelte/store";




interface SearchStoreType {
    searchedKeyword: string;
    keyword: string;
    type: string[];
}

const initialStore: SearchStoreType = {
    searchedKeyword: '',
    keyword: '',
    type: []
};


function createSearchStore() {
    const { subscribe, update } = writable(initialStore);

    return {
        subscribe,
        updateKeyword: (keyword: string) => {
            update(store => {
                store.keyword = keyword;
                return store;
            });
        },
        updateType: (type: string) => {
            update(store => {
                if (store.type.includes(type)) store.type.filter(t => t !== type);
                else store.type.push(type);

                return store;
            });
        }
    }
}
export default createSearchStore();