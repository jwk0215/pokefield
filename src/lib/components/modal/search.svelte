<script lang="ts">
    import dataStore from "$lib/stores/data.store";
    import { getKrTypeName } from "$lib/utils/pokemon";


</script>



<div id="search-wrapper" class="w-100 flex col">
    <span class="info color-title">검색어 입력</span>
    <input id="search-input" type="text" class="w-100 bg-surface" placeholder="포켓몬 이름">
    
    <span class="info color-title">포켓몬 타입 선택</span>
    <ul id="search-type-list" class="w-100 flex">
        {#each $dataStore.typeList as type}
            {@const TYPE_KOR_NAME = getKrTypeName(type.name)}
            {#if TYPE_KOR_NAME}
            <li class="type bg-surface">
                <label class="type-label w-100 h-100 flex a-center">
                    <input type="checkbox">
                    <div class="type-icon {`bg-${type.name}`}"></div>
                    <span class="type-name">
                        {TYPE_KOR_NAME}
                    </span>
                </label>
            </li>
            {/if}
        {/each}
    </ul>

    <button id="search-btn" class="w-100 bg-p-blue font-b">
        검색하기
    </button>
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
            border: 0.2rem solid var(--color-border);
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
                
                
                & .type-label {
                    position: relative;
                    height: 4rem;
                    border-radius: 1rem;
                    border: 0.2rem solid var(--color-border);
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


        & #search-btn {
            margin-top: 2rem;
            height: 4rem;
            border: 0.2rem solid var(--color-border);
            border-radius: 1rem;
            font-size: 1.7rem;
            color: #ffffff;
        }
    }
</style>