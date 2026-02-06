<script lang="ts">
    import loadingStore from "$lib/stores/loading.store";
</script>


{#if $loadingStore}
<div id="loading-wrapper" class="flex j-center a-center pos-abs left-0 top-0 w-100 h-100 bg-background">
    <div class="loading bg-p-red"></div>
    <div class="loading bg-p-blue"></div>
    <div class="loading bg-p-yellow"></div>
</div>
{/if}


<style>
    @keyframes loading {
        0% { transform: scale(0.7); }
        50% { transform: scale(1); }
        100% { transform: scale(0.7); }
    }

    #loading-wrapper {
        gap: 3rem;


        & .loading {
            width: 1.5rem;
            aspect-ratio: 1;
            border-radius: 50%;
            transform: scale(0.7);
            animation: loading 1s ease-in-out infinite;
        }
        & .loading:nth-child(2) { animation-delay: 0.2s; }
        & .loading:nth-child(3) { animation-delay: 0.4s; }
    }
</style>