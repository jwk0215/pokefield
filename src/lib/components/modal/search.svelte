<script lang="ts">
    import dataStore from "$lib/stores/data.store";
    import effectStore from "$lib/stores/effect.store";
    import modalStore from "$lib/stores/modal.store";
    import searchStore from "$lib/stores/search.store";
    import { getKrTypeName } from "$lib/utils/pokemon";




    // state
    let keywordState = $state($searchStore.keyword);
    let typeListState = $state<string[]>($searchStore.typeList);


    // derived
    let searchState = $derived.by(() => {
        if ($searchStore.keyword !== keywordState) return true;
        if ($searchStore.typeList.length !== typeListState.length) return true;

        for (let i = 0; i < $searchStore.typeList.length; i++) {
            if ($searchStore.typeList[i] !== typeListState[i]) return true;
        }

        return false;
    });


    /**
     * reset evt()
     */
    function reset() {
        keywordState = '';
        typeListState = [];
    }
    
    
    /**
     * onchange evt()
     * @param e Event
     */
    function onchangeEvt(e: Event) {
        const input = e.target as HTMLInputElement;
        const type = input.name;

        if (input.checked) {
            typeListState.push(type);
        } else {
            typeListState = typeListState.filter(t => t !== type);
        }
    }
    
    
    /**
     * search evt()
     */
    function searchEvt() {
        searchStore.search(keywordState, typeListState);
        effectStore.startEffect();
        modalStore.clearStore();
    }
</script>



<div id="search-wrapper" class="w-100 flex col">
    <span class="info color-title">검색어 입력</span>
    <input id="search-input" type="text" class="w-100 bg-surface" placeholder="이름" bind:value={keywordState}>
    
    <span class="info color-title">타입 선택</span>
    <ul id="search-type-list" class="w-100 flex">
        {#each $dataStore.typeDataList as type}
            {@const TYPE_KOR_NAME = getKrTypeName(type.name)}
            {#if TYPE_KOR_NAME}
            <li class="type bg-surface">
                <label class="type-label w-100 h-100 flex a-center">
                    <input type="checkbox" name="{type.name}" onchange={onchangeEvt} checked={typeListState.includes(type.name)}>
                    <div class="type-icon {`bg-${type.name}`}"></div>
                    <span class="type-name">
                        {TYPE_KOR_NAME}
                    </span>
                </label>
            </li>
            {/if}
        {/each}
    </ul>

    <div id="btn-wrapper" class="flex">
        <button id="search-btn" class="w-100 bg-p-blue" onclick={searchEvt} disabled={!searchState}>
            검색하기
        </button>

        <button id="reset-btn" class="bg-p-red flex j-center a-center" aria-label="reset button" onclick={reset}>
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <g stroke-width="0"></g>
                <g stroke-linecap="round" stroke-linejoin="round"></g>
                <g>
                    <path fill="currentColor" d="M13.9907,1.31133017e-07 C14.8816,1.31133017e-07 15.3277,1.07714 14.6978,1.70711 L13.8556,2.54922 C14.421,3.15654 14.8904,3.85028 15.2448,4.60695 C15.8028,5.79836 16.0583,7.109 15.9888,8.42277 C15.9193,9.73654 15.5268,11.0129 14.8462,12.1388 C14.1656,13.2646 13.2178,14.2053 12.0868,14.8773 C10.9558,15.5494 9.67655,15.9322 8.3623,15.9918 C7.04804,16.0514 5.73937,15.7859 4.55221,15.2189 C3.36505,14.652 2.33604,13.8009 1.55634,12.7413 C0.776635,11.6816 0.270299,10.446 0.0821822,9.14392 C0.00321229,8.59731 0.382309,8.09018 0.928918,8.01121 C1.47553,7.93224 1.98266,8.31133 2.06163,8.85794 C2.20272,9.83451 2.58247,10.7612 3.16725,11.556 C3.75203,12.3507 4.52378,12.989 5.41415,13.4142 C6.30452,13.8394 7.28602,14.0385 8.27172,13.9939 C9.25741,13.9492 10.2169,13.6621 11.0651,13.158 C11.9133,12.6539 12.6242,11.9485 13.1346,11.1041 C13.6451,10.2597 13.9395,9.30241 13.9916,8.31708 C14.0437,7.33175 13.8521,6.34877 13.4336,5.45521 C13.178,4.90949 12.8426,4.40741 12.4402,3.96464 L11.7071,4.69779 C11.0771,5.32776 9.99996,4.88159 9.99996,3.99069 L9.99996,1.31133017e-07 L13.9907,1.31133017e-07 Z M1.499979,4 C2.05226,4 2.499979,4.44772 2.499979,5 C2.499979,5.55229 2.05226,6 1.499979,6 C0.947694,6 0.499979,5.55228 0.499979,5 C0.499979,4.44772 0.947694,4 1.499979,4 Z M3.74998,1.25 C4.30226,1.25 4.74998,1.69772 4.74998,2.25 C4.74998,2.80229 4.30226,3.25 3.74998,3.25 C3.19769,3.25 2.74998,2.80228 2.74998,2.25 C2.74998,1.69772 3.19769,1.25 3.74998,1.25 Z M6.99998,0 C7.55226,0 7.99998,0.447716 7.99998,1 C7.99998,1.55229 7.55226,2 6.99998,2 C6.44769,2 5.99998,1.55229 5.99998,1 C5.99998,0.447716 6.44769,0 6.99998,0 Z"></path>
                </g>
            </svg>
        </button>
    </div>
</div>



<style>
    #search-wrapper {


        & .info {
            margin: 2rem 0 0.8rem 0;
            font-size: 1.6rem;
        }
        & .info:first-of-type { margin-top: 0; }
        

        & #search-input {
            height: 4rem;
            border: 0.1rem solid var(--color-border);
            border-radius: 1rem;
            padding: 0 1.5rem;
            font-size: 1.7rem;
        }
        & #search-input:focus { border-color: var(--color-p-blue); }


        & #search-type-list {
            gap: 1rem;
            flex-wrap: wrap;
            

            & .type {
                width: fit-content;
                height: fit-content;
                overflow: hidden;
                border-radius: 1rem;
                
                
                & .type-label {
                    position: relative;
                    height: 4rem;
                    border-radius: 1rem;
                    border: 0.1rem solid var(--color-border);
                    padding: 0 1.2rem;
                    gap: 0.5rem;
                    cursor: pointer;
                    overflow: hidden;
                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0.3;
                    }


                    & input { display: none; }


                    & .type-icon {
                        width: 1.5rem;
                        aspect-ratio: 1;
                        border-radius: 50%;
                    }


                    & .type-name {
                        font-size: 1.5rem;
                    }
                }
                & .type-label:has(:checked) {
                    &::after { background-color: var(--color-p-yellow); }
                }
            }
        }


        & #btn-wrapper {
            margin-top: 2rem;
            gap: 2rem;
    
    
            & #search-btn {
                height: 4rem;
                border: 0.1rem solid var(--color-border);
                border-radius: 1rem;
                font-size: 1.7rem;
                color: #ffffff;
            }
            & #search-btn:disabled {
                background-color: var(--color-border);
                cursor: default;
            }


            & #reset-btn {
                height: 4rem;
                aspect-ratio: 1;
                padding: 0.8rem;
                border-radius: 1rem;
                border: 0.1rem solid var(--color-border);

                & * {
                    color: #ffffff;
                }
            }
        }
    }
</style>