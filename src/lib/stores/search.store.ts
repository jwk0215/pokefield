import { writable } from "svelte/store";
import type { PokemonDataType } from "./data.store";




interface SearchStoreType {
    keyword: string;
    typeList: string[];
    offset: number;
    searchedDataRecord: {[id: number]: PokemonDataType};
}

const initialStore: SearchStoreType = {
    keyword: '',
    typeList: [],
    offset: 0,
    searchedDataRecord: {}
};


function createSearchStore() {
    const { subscribe, update } = writable(initialStore);

    return {
        subscribe,
        search: (keyword: string, typeList: string[]) => {
            update((store: SearchStoreType) => {
                store.keyword = keyword;
                store.typeList = typeList;
                store.offset = 0;
                store.searchedDataRecord = {};
                return store;
            });
        },
        updateKeyword: (keyword: string) => {
            update((store: SearchStoreType) => {
                store.keyword = keyword;
                return store;
            });
        },
        updateType: (typeList: string[]) => {
            update((store: SearchStoreType) => {
                store.typeList = typeList;
                return store;
            });
        },
        updateOffset: (offset: number) => {
            update((store: SearchStoreType) => {
                store.offset = offset;
                return store;
            });
        },
        updateSearchedDataRecord: (record: {[id: number]: PokemonDataType}) => {
            update((store: SearchStoreType) => {
                store.searchedDataRecord = record;
                return store;
            });
        },
    }
}
export default createSearchStore();