<script lang="ts">
    import Alert from "$lib/components/alert.svelte";
    import Loading from "$lib/components/loading.svelte";
    import Modal from "$lib/components/modal.svelte";
    import Search from "$lib/components/modal/search.svelte";
    import ThemeController from "$lib/components/themeController.svelte";
    import alertStore from "$lib/stores/alert.store";
    import dataStore, { type PokemonDetailDataType } from "$lib/stores/data.store";
    import effectStore from "$lib/stores/effect.store";
    import modalStore from "$lib/stores/modal.store";
    import searchStore from "$lib/stores/search.store";
    import themeStore from "$lib/stores/theme.store";
    import { onMount } from "svelte";


    // LIMIT
    const PAGE_LIMIT = 20;


    // state
    let cardListState = $state<PokemonDetailDataType[]>([]);
    let offsetState = $state(0);
    let searchCardListState = $state<PokemonDetailDataType[]>([]);
    let searchOffsetState = $state(0);


    /**
     * effect()
    */
    $effect(() => {
        if ($effectStore) {
            effectStore.set(false);

            (async () => {
                // 검색
                if ($searchStore.keyword || $searchStore.type.length > 0) {


                // 일반
                } else {
                    
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

        } catch (error: any) {
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
                onclick={() => {
                    modalStore.setStore({
                        component: Search,
                        title: "포켓몬 검색"
                    });
                }}>
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

    <div id="container" class="w-100">
        <div id="limit" class="w-100 h-100 flex col">
            <main id="main" class="w-100 pos-rel">
                <ul id="card-list" class="w-100 flex">
                    
                </ul>

                {#if cardListState.length <= 0 || 
                ($searchStore.keyword.length > 0 && searchCardListState.length <= 0)}
                <Loading />
                {:else}
                <div id="more-btn-wrapper" class="pos-rel w-100 flex j-center a-center">
                    <button id="more-btn">
                        더 보기
                    </button>
                    
                    <Loading />
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


                    & #card-list {
                        flex-wrap: wrap;
                        gap: 2rem;
                    }


                    & #more-btn-wrapper {
                        padding: 2rem 0;
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
    }


    :global(*::-webkit-scrollbar) {
		width: 1rem;
		height: 1rem;
		background-color: var(--color-background);
	}
    :global(*::-webkit-scrollbar-corner) {
        background-color: var(--color-background);
    }
	/* :global(*::-webkit-scrollbar-thumb) {
        border-radius: 9999px;
        border: 0.3rem solid var(--color-background);
		background-color: var(--color-scroll-thumb);
	} */
</style>