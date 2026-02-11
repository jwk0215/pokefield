import { writable } from "svelte/store";





export type PokemonTypeDataType = {
    name: string;
    url: string;
}

export type PokemonDataType = {
    nameEn: string;
    nameKr: string;
    url: string;
}

export type PokemonDetailDataType = {
    nameKr: string;
    image: string;
    type: string[];
    stats: {
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        }
    }[];
    abilities: {
        ability: {
            name: string;
            url: string;
        };
        is_hidden: boolean;
    }[]
}

interface DataStoreType {
    typeDataList: PokemonTypeDataType[];
    pokemonDataRecord: Record<number, PokemonDataType>;
    pokemonDetailDataRecord: Record<number, PokemonDetailDataType>;
}

const initialStore: DataStoreType = {
    typeDataList: [],
    pokemonDataRecord: {},
    pokemonDetailDataRecord: {}
}


function createDataStore() {
    const { subscribe, update } = writable(initialStore);

    return {
        subscribe,
        setTypeDataList: (typeDataList: PokemonTypeDataType[]) => {
            update(store => {
                store.typeDataList = typeDataList;
                return store;
            });
        },
        setPokemonDataRecord: (pokemonDataRecord: Record<number, PokemonDataType>) => {
            update(store => {
                store.pokemonDataRecord = pokemonDataRecord;
                return store;
            });
        },
        updatePokemonDetailDataRecord: (id: number, data: PokemonDetailDataType) => {
            update(store => {
                store.pokemonDetailDataRecord[id] = data;
                return store;
            });
        }
    }
}
export default createDataStore();