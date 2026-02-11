<script lang="ts">
    import type { PokemonDetailDataType } from "$lib/stores/data.store";
    import { getKrTypeName } from "$lib/utils/pokemon";



    
    // props
    let { data } = $props<{
        data: PokemonDetailDataType
    }>();
</script>


<article id="card" class="flex col bg-surface">
    <img id="card-img" class="bg-background w-100" src="{data.image}" alt="img">

    <h3 id="card-title" class="w-100 flex a-center">
        {data.nameKr}
    </h3>

    <ul id="card-type-list" class="w-100 flex a-center">
        {#each data.type as type}
        <li class="card-type bg-{type}">
            {getKrTypeName(type)}
        </li>
        {/each}
    </ul>
</article>


<style>
    #card {
        min-width: 0;
        aspect-ratio: 1 / 1.3;
        padding: 2rem;
        gap: 1rem;
        border-radius: 1rem;
        border: 0.1rem solid var(--color-border);
        overflow: hidden;


        & #card-img {
            border: 0.1rem solid var(--color-border);
            padding: 1rem;
            border-radius: 1rem;
            aspect-ratio: 1;
        }


        & #card-title {
            flex: 1;
            font-size: 2rem;
        }


        & #card-type-list {
            flex: 1;
            gap: 1rem;
            flex-wrap: wrap;


            & .card-type {
                border-radius: 1rem;
                padding: 0.7rem 2rem;
                font-size: 1.8rem;
                color: #ffffff;
            }
        }
    }
</style>