<script lang="ts">
    import modalStore from "$lib/stores/modal.store";
    import { fade, fly } from "svelte/transition";
</script>



{#if $modalStore}
{@const MODAL_COMPONENT = $modalStore.component}
<div id="modal-background" class="pos-abs left-0 top-0 w-100 h-100 flex j-center a-center" transition:fade={{duration: 300}}>
    <div id="modal" class="bg-surface flex col"  transition:fly={{x: 0, y: 30, duration: 300}}>
        <div id="modal-bar" class="w-100 flex a-center">
            <h2 id="modal-title" class="font-b">
                {$modalStore.title}
            </h2>

            <button id="close-btn" class="bg-p-red flex j-center a-center"
            onclick={() => {
                modalStore.clearStore();
            }}>
                닫기
            </button>
        </div>

        <div id="modal-content" class="bg-background">
            <MODAL_COMPONENT />
        </div>
    </div>
</div>
{/if}



<style>
    #modal-background {
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0.3);
        
        
        & #modal {
            width: 90%;
            max-width: 70rem;
            border: 0.2rem solid var(--color-border);
            border-radius: 1rem;
            padding: 1rem;
            gap: 1rem;
            overflow: hidden;


            & #modal-bar {
                justify-content: space-between;
                border-radius: 1rem;


                & #modal-title {
                    color: var(--color-title);
                    font-size: 1.7rem;
                }


                & #close-btn {
                    width: 4.5rem;
                    height: 3rem;
                    border-radius: 0.7rem;
                    color: #ffffff;
                    font-size: 1.6rem;
                    border: 0.1rem solid var(--color-border);
                }
            }


            & #modal-content {
                padding: 2rem;
                border: 0.1rem solid var(--color-border);
                border-radius: 1rem;
            }
        }
    }
</style>