<script lang="ts">
    import alertStore from "$lib/stores/alert.store";
    import { fade, fly } from "svelte/transition";


</script>



{#if $alertStore}
<div id="alert-background" class="pos-abs left-0 top-0 w-100 h-100 flex j-center a-center" transition:fade={{duration: 300}}>
    <div id="alert" class="bg-surface flex col a-center"  transition:fly={{x: 0, y: 30, duration: 300}}>
        <svg id="alert-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke-width="0"></g>
            <g stroke-linecap="round" stroke-linejoin="round"></g>
            <g>
                <path d="M12 10V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                <path d="M12 16V15.9888" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                <path d="M10.2518 5.147L3.6508 17.0287C2.91021 18.3618 3.87415 20 5.39912 20H18.6011C20.126 20 21.09 18.3618 20.3494 17.0287L13.7484 5.147C12.9864 3.77538 11.0138 3.77538 10.2518 5.147Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            </g>
        </svg>
        
        <p id="alert-msg" class="flex col a-center">
            <span>
                {$alertStore.error}
            </span>

            <span class="font-b">
                {$alertStore.message}
            </span>
        </p>

        <button id="close-btn" class="w-100 bg-p-red" onclick={() => alertStore.off()}>
            닫기
        </button>
    </div>
</div>
{/if}



<style>
    #alert-background {
        z-index: 2000;
        background-color: rgba(0, 0, 0, 0.3);


        & #alert {
            width: 90%;
            max-width: 70rem;
            border: 0.2rem solid var(--color-border);
            border-radius: 1rem;
            padding: 2rem;
            gap: 1rem;
            overflow: hidden;
            

            & #alert-icon {
                width: 4rem;
                aspect-ratio: 1;
                & * { color: var(--color-p-red); }
            }


            & #alert-msg {
                padding: 1rem 0;
                font-size: 1.6rem;
                gap: 1rem;
            }


            & #close-btn {
                padding: 1rem 0;
                font-size: 1.6rem;
                border: 0.2rem solid var(--color-border);
                border-radius: 1rem;
                color: #ffffff;
            }
        }
    }
</style>