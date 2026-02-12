<script lang="ts">
    import Alert from "$lib/components/alert.svelte";
    import Card from "$lib/components/card.svelte";
    import Loading from "$lib/components/loading.svelte";
    import Modal from "$lib/components/modal.svelte";
    import Search from "$lib/components/modal/search.svelte";
    import ThemeController from "$lib/components/themeController.svelte";
    import actionStore from "$lib/stores/action.store";
    import alertStore from "$lib/stores/alert.store";
    import dataStore, { type PokemonDataType, type PokemonDetailDataType } from "$lib/stores/data.store";
    import effectStore from "$lib/stores/effect.store";
    import loadingStore from "$lib/stores/loading.store";
    import modalStore from "$lib/stores/modal.store";
    import searchStore from "$lib/stores/search.store";
    import themeStore from "$lib/stores/theme.store";
    import { onMount } from "svelte";




    // LIMIT
    const LIMIT = 20;

    
    // state
    let viewRecordState = $state<{[id: number]: PokemonDetailDataType}>({});
    let moreState = $state(true);
    let containerEl = $state<HTMLElement>();


    /**
     * more button evt()
     */
    function moreEvt() {
        if (!$actionStore) return;
        
        loadingStore.on();
        searchStore.updateOffset($searchStore.offset + LIMIT);
        effectStore.startEffect();
    }


    /**
     * reset
     */
    function reset() {
        if (!$actionStore) return;
        
        scrollTop();
        searchStore.search('', []);
        effectStore.startEffect();
    }


    /**
     * scroll top
     */
    function scrollTop() {
        if (!$actionStore) return;
        
        containerEl?.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    /**
     * open search modal()
     */
    function openSearchModal() {
        if (!$actionStore) return;
                    
        modalStore.setStore({
            component: Search,
            title: "검색"
        });
    }

    
    /**
     * effect()
    */
    $effect(() => {
        if ($effectStore) {
            effectStore.stopEffect();
            actionStore.setStore(false);
            loadingStore.on();

            (async () => {
                try {
                    const baseDataRecord = $dataStore.pokemonDataRecord;
                    let searchedDataRecord = $searchStore.searchedDataRecord;
                    let keyword = $searchStore.keyword;
                    let typeList = $searchStore.typeList;
                    let offset = $searchStore.offset;

                    // searchStore 구독
                    searchStore.subscribe((store) => {
                        searchedDataRecord = store.searchedDataRecord;
                        keyword = store.keyword;
                        typeList = store.typeList;
                        offset = store.offset;
                    });

                    // 첫 검색
                    if (Object.keys(searchedDataRecord).length === 0) {
                        viewRecordState = [];
                        
                        let unfilteredRecord: {[id: number]: PokemonDataType} = {};
                        let filteredRecord: {[id: number]: PokemonDataType};

                        // 선택한 타입이 없거나 전부 선택한 경우
                        if (
                            typeList.length <= 0 ||
                            typeList.length === $dataStore.typeDataList.length
                        ) {
                            unfilteredRecord = baseDataRecord;

                        // 선택한 타입이 있는 경우
                        } else {
                            for (const type of typeList) {
                                const res = await fetch("https://pokeapi.co/api/v2/type/" + type);

                                if (!res.ok) {
                                    throw new Error(`[${type}]에 대한 데이터 호출 실패`);
                                }

                                const typeData = await res.json();

                                for (const data of typeData.pokemon ?? []) {
                                    const id = Number(data.pokemon.url.split('/').at(-2));

                                    // 현재 포켓몬 공식 페이지에 1025까지만 나와있음
                                    if (id > 1025) continue;

                                    if (!baseDataRecord[id]) {
                                        throw new Error(`[${id}]에 대한 기본 데이터가 없습니다. 업데이트 요망`);
                                    }

                                    if (!unfilteredRecord[id]) {
                                        unfilteredRecord[id] = baseDataRecord[id];
                                    }
                                }
                            }
                        }

                        // 키워드
                        if (keyword.length > 0) {
                            filteredRecord = {};
                            
                            for (const [id, data] of Object.entries(unfilteredRecord)) {
                                if (data.nameKr.includes(keyword)) {
                                    console.log(data.nameKr);
                                    filteredRecord[Number(id)] = data;
                                }
                            }

                        // 키워드 없는 경우
                        } else {
                            filteredRecord = unfilteredRecord;
                        }

                        searchStore.updateSearchedDataRecord(filteredRecord);
                    }
                    
                    // 디테일 데이터 가져오기
                    const record: {[id: number]: PokemonDetailDataType} = {};

                    for (const [idx, [id, data]] of Object.entries(searchedDataRecord).entries()) {
                        if (idx < offset) continue;

                        if (idx >= (offset + LIMIT)) break;
                        
                        if ($dataStore.pokemonDetailDataRecord[Number(id)]) {
                            record[Number(id)] = $dataStore.pokemonDetailDataRecord[Number(id)];
                            continue;
                        }

                        const res = await fetch(data.url);
                        if (!res.ok) throw new Error(`[${id}] 디테일 데이트 호출 실패`);

                        const detail = await res.json();
                        const result: PokemonDetailDataType = {
                            nameKr: data.nameKr,
                            image: detail.sprites.other["official-artwork"].front_default,
                            type: detail.types.map((t: any) => t.type.name),
                            stats: detail.stats,
                            abilities: detail.abilities
                        };

                        dataStore.updatePokemonDetailDataRecord(Number(id), result);
                        record[Number(id)] = result;
                    }

                    moreState = !(Object.keys(searchedDataRecord).length <= (offset + LIMIT));
                    viewRecordState = {...viewRecordState, ...record};
                    loadingStore.off();
                    actionStore.setStore(true);
                    
                } catch (error: any) {
                    console.log(error);
                    
                    alertStore.on({
                        error: error.message,
                        message: "확인 후 다시 시도해주세요."
                    });
                }
            })();
        }
    });


    /**
     * onMount()
    */
    onMount(async () => {
        try {
            themeStore.setStore();
            const pokemonDataListRes = await fetch("/data/pokemon-data.json");
            const typeRes = await fetch("https://pokeapi.co/api/v2/type");
            
            if (!typeRes.ok || !pokemonDataListRes.ok) throw new Error("onMount() 데이터 호출 실패");
    
            dataStore.setTypeDataList((await typeRes.json()).results);
            dataStore.setPokemonDataRecord(await pokemonDataListRes.json());

            effectStore.startEffect();

        } catch (error: any) {
            console.log(error);
            
            alertStore.on({
                error: error.message,
                message: "확인 후 다시 시도해주세요."
            });
        }
    });
</script>


<div id="app" class="w-100 h-100 bg-background pos-rel flex col a-center">
    <header id="header" class="w-100 bg-surface pos-sticky left-0 top-0">
        <div id="header-limit" class="w-100 h-100 flex a-center">
            <h1 id="title" class="flex a-center">
                <span class="font-b color-p-red">포켓몬</span>
                <span class="font-b color-p-blue">사전</span>
            </h1>

            <div id="btn-wrapper" class="flex a-center">
                <button id="search-on-btn" class="bg-background" aria-label="search button"
                onclick={openSearchModal}>
                    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
                        <g stroke-width="0"></g>
                        <g stroke-linecap="round" stroke-linejoin="round"></g>
                        <g><path fill="currentColor" fill-rule="evenodd" d="M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2z"></path></g>
                    </svg>
                </button>

                <ThemeController />
            </div>
        </div>
    </header>

    <div id="container" class="w-100" bind:this={containerEl}>
        <div id="limit" class="w-100 h-100 flex col">
            <main id="main" class="w-100 pos-rel flex col">
                <ul id="card-list" class="w-100">
                    {#each Object.entries(viewRecordState) as [id, data]}
                    <Card id={Number(id)} data={data} />
                    {/each}
                </ul>

                {#if Object.keys(viewRecordState).length <= 0}
                    {#if $loadingStore}
                    <Loading />
                    {/if}
                {:else}
                <div id="more-btn-wrapper" class="pos-rel w-100 flex j-center a-center">
                    {#if $loadingStore}
                    <Loading />
                    {/if}

                    {#if moreState}
                    <button id="more-btn" class="w-100 bg-p-blue" onclick={moreEvt}>
                        + 더 보기
                    </button>
                    {/if}
                </div>
                {/if}
            </main>
    
            <footer id="footer" class="w-100">
                <p id="footer-info" class="w-100 h-100 flex j-center a-center">
                    본 사이트는 학습의 목적으로 제작된 토이 프로젝트 사이트입니다.
                </p>
            </footer>
        </div>
    </div>

    <div id="convenience-wrapper" class="pos-abs right-0 bottom-0 flex col">
        {#if $searchStore.keyword.length > 0 || $searchStore.typeList.length > 0}
        <button class="convenience-btn" aria-label="page reset button" onclick={reset}>
            <svg style="width: 50%; margin-top: 0.5rem;" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <g stroke-width="0"></g>
                <g stroke-linecap="round" stroke-linejoin="round"></g>
                <g>
                    <path fill="currentColor" d="M13.9907,1.31133017e-07 C14.8816,1.31133017e-07 15.3277,1.07714 14.6978,1.70711 L13.8556,2.54922 C14.421,3.15654 14.8904,3.85028 15.2448,4.60695 C15.8028,5.79836 16.0583,7.109 15.9888,8.42277 C15.9193,9.73654 15.5268,11.0129 14.8462,12.1388 C14.1656,13.2646 13.2178,14.2053 12.0868,14.8773 C10.9558,15.5494 9.67655,15.9322 8.3623,15.9918 C7.04804,16.0514 5.73937,15.7859 4.55221,15.2189 C3.36505,14.652 2.33604,13.8009 1.55634,12.7413 C0.776635,11.6816 0.270299,10.446 0.0821822,9.14392 C0.00321229,8.59731 0.382309,8.09018 0.928918,8.01121 C1.47553,7.93224 1.98266,8.31133 2.06163,8.85794 C2.20272,9.83451 2.58247,10.7612 3.16725,11.556 C3.75203,12.3507 4.52378,12.989 5.41415,13.4142 C6.30452,13.8394 7.28602,14.0385 8.27172,13.9939 C9.25741,13.9492 10.2169,13.6621 11.0651,13.158 C11.9133,12.6539 12.6242,11.9485 13.1346,11.1041 C13.6451,10.2597 13.9395,9.30241 13.9916,8.31708 C14.0437,7.33175 13.8521,6.34877 13.4336,5.45521 C13.178,4.90949 12.8426,4.40741 12.4402,3.96464 L11.7071,4.69779 C11.0771,5.32776 9.99996,4.88159 9.99996,3.99069 L9.99996,1.31133017e-07 L13.9907,1.31133017e-07 Z M1.499979,4 C2.05226,4 2.499979,4.44772 2.499979,5 C2.499979,5.55229 2.05226,6 1.499979,6 C0.947694,6 0.499979,5.55228 0.499979,5 C0.499979,4.44772 0.947694,4 1.499979,4 Z M3.74998,1.25 C4.30226,1.25 4.74998,1.69772 4.74998,2.25 C4.74998,2.80229 4.30226,3.25 3.74998,3.25 C3.19769,3.25 2.74998,2.80228 2.74998,2.25 C2.74998,1.69772 3.19769,1.25 3.74998,1.25 Z M6.99998,0 C7.55226,0 7.99998,0.447716 7.99998,1 C7.99998,1.55229 7.55226,2 6.99998,2 C6.44769,2 5.99998,1.55229 5.99998,1 C5.99998,0.447716 6.44769,0 6.99998,0 Z"></path>
                </g>
            </svg>
        </button>
        {/if}

        <button class="convenience-btn" aria-label="scroll top button" onclick={scrollTop}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke-width="0"></g>
                <g stroke-linecap="round" stroke-linejoin="round"></g>
                <g>
                    <path d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z" fill="currentColor"></path>
                </g>
            </svg>
        </button>
    </div>
    
    <Modal />
    <Alert />
</div>


<style>
    #app {
        /* HEADER */
        & #header {
            height: 6rem;
            border-bottom: 0.1rem solid var(--color-border);


            & #header-limit {
                padding: 0 2rem;
                margin: 0 auto;
                max-width: 140rem;
                justify-content: space-between;


                & #title {
                    gap: 0.3rem;
                    font-size: 2rem;
                }


                & #btn-wrapper {
                    gap: 1rem;


                    & #search-on-btn {
                        border: 0.1rem solid var(--color-border);
                        width: 3.5rem;
                        aspect-ratio: 1;
                        border-radius: 1rem;
                        padding: 0.6rem;
                        overflow: hidden;

                        & svg,
                        & svg * { color: var(--color-title); }
                    }
                }
            }
        }


        & #container {
            flex: 1;
            overflow-y: scroll;


            & #limit {
                max-width: 140rem;
                margin: 0 auto;
                padding: 0 2rem;
    
    
                /* MAIN */
                & #main {
                    flex: 1;
                    padding: 5rem 0;
                    gap: 5rem;


                    & #card-list {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 5rem;
                    }
                    @media (max-width: 1219px) {
                        & #card-list {
                            grid-template-columns: repeat(3, 1fr);
                            gap: 4rem;
                        }
                    }
                    @media (max-width: 1024px) {
                        & #card-list {
                            grid-template-columns: repeat(2, 1fr);
                            gap: 3rem;
                        }
                    }



                    & #more-btn-wrapper {
                        
                        
                        & #more-btn {
                            padding: 1.3rem 0;
                            font-size: 1.8rem;
                            border-radius: 1rem;
                            border: 0.1rem solid var(--color-border);
                            color: #ffffff;
                        }
                    }
                }
                @media (max-width: 1219px) {
                    & #main {
                        padding: 4rem 0;
                        gap: 4rem;
                    }
                }
                @media (max-width: 1024px) {
                    & #main {
                        padding: 3rem 0;
                        gap: 3rem;
                    }
                }
    
    
                /* FOOTER */
                & #footer {
                    flex-shrink: 0;
                    max-width: 140rem;
                    height: 6rem;
                    
                    
                    & #footer-info {
                        border-top: 0.1rem solid var(--color-border);
                        font-size: 1.6rem;
                    }
                }
            }
        }


        & #convenience-wrapper {
            width: 5.5rem;
            gap: 2rem;
            transform: translate(-5rem, -10rem);
            z-index: 500;


            & .convenience-btn {
                width: 100%;
                aspect-ratio: 1;
                border-radius: 50%;
                background-color: var(--color-surface);
                border: 0.1rem solid var(--color-border);


                & * {
                    color: var(--color-title);
                }
            }
        }
    }


    :global(*::-webkit-scrollbar) {
		width: 1.2rem;
		height: 1.2rem;
		background-color: var(--color-background);
	}
    :global(*::-webkit-scrollbar-corner) {
        background-color: var(--color-background);
    }
	:global(*::-webkit-scrollbar-thumb) {
        border-radius: 9999px;
        border: 0.2rem solid var(--color-background);
		background-color: var(--color-scroll-thumb);
	}
</style>