<script lang="ts">
    import detailStore, { type DetailStoreType } from "$lib/stores/detail.store";
    import { onDestroy, onMount } from "svelte";
    import Loading from "../loading.svelte";
    import dataStore from "$lib/stores/data.store";
    import alertStore from "$lib/stores/alert.store";
    import { getKrStatName } from "$lib/utils/pokemon";




    // props type
    type PropsType = {
        id: number;
    }
    
    
    // props
    let { id }: PropsType = $props();
    
    
    /**
     * onMount()
    */
    onMount(async () => {
        try {
            const detailData = $dataStore.pokemonDetailDataRecord[id];
            if (!detailData) throw new Error(`[${id}]` + " 에 대한 데이터가 스토어에 존재하지 않습니다.");

            const result: DetailStoreType = {
                nameKr: detailData.nameKr,
                image: detailData.image,
                type: detailData.type,
                stats: {},
                abilities: {}
            };

            for (const stat of detailData.stats) {
                const name = stat.stat.name;

                if (
                    name === "hp" ||
                    name === "attack" ||
                    name === "defense" ||
                    name === "speed"
                ) result.stats[stat.stat.name] = stat.base_stat;
            }

            for (const data of detailData.abilities) {
                const res = await fetch(data.ability.url);
                if (!res.ok) throw new Error(`[${data.ability.name}] 에 대한 정보 호출 실패`);

                const abilityData = await res.json();
                const abilityKrName = abilityData.names.find((n: any) => n.language.name === "ko")?.name;
                if (!abilityKrName) throw new Error(`[${data.ability.name}] 에 대한 한글 정보가 없습니다.`);

                result.abilities[abilityKrName] = data.is_hidden;
            }

            detailStore.setStore(result);
            
        } catch (error: any) {
            console.log(error);
                    
            alertStore.on({
                error: error.message,
                message: "확인 후 다시 시도해주세요."
            });
        }
    });


    /**
     * onDestroy()
    */
    onDestroy(() => {
        detailStore.clearStore();
    });
</script>



<div id="detail-wrapper" class="w-100 flex col pos-rel">
    {#if $detailStore}
    <div id="base-wrapper" class="w-100 flex a-center">
        <img id="img" src="{$detailStore.image}" alt="img">

        <ul id="stats" class="flex col j-center h-100">
            <li class="stat w-100 flex a-center">
                <span class="stat-name">이름</span>
                <span class="stat-title-name">{$detailStore.nameKr}</span>
            </li>

            <li id="stat-info" class="flex a-center w-100">
                <span class="stat-info-number">0</span>
                <span class="stat-info-number">255</span>
            </li>
            
            {#each Object.entries($detailStore.stats) as [name, overall]}
            <li class="stat w-100 flex a-center">
                <span class="stat-name">{getKrStatName(name)}</span>

                <div class="stat-overall h-100">
                    <div class="h-100 flex j-center a-center {name}"
                    style="width: {Math.floor((overall / 255) * 100)}%;">
                        {overall}
                    </div>
                </div>
            </li>
            {/each}
        </ul>
    </div>

    <div id="ability-wrapper" class="w-100 flex col">
        <div id="ability-title" class="flex a-center">
            기술:

            <div class="ability-info flex a-center">
                <div class="info-color"></div>
                <span>일반</span>
            </div>

            <div class="ability-info flex a-center hidden">
                <div class="info-color"></div>
                <span>히든</span>
            </div>
        </div>

        <ul id="ability-list" class="flex">
            {#each Object.entries($detailStore.abilities) as [name, hidden]}
            <li class="ability" class:hidden={hidden}>
                {name}
            </li>
            {/each}
        </ul>
    </div>
    {:else}
    <Loading />
    {/if}
</div>



<style>
    #detail-wrapper {
        height: 40rem;


        & #base-wrapper {
            height: 73%;
            gap: 2rem;


            & #img {
                width: 35%;
                aspect-ratio: 1;
            }


            & #stats {
                flex: 1;


                & #stat-info {
                    justify-content: space-between;
                    padding-left: 6rem;


                    & .stat-info-number {
                        font-size: 1.5rem;
                    }
                }


                & .stat {
                    height: 5rem;
                    gap: 2rem;


                    & .stat-name {
                        width: 4rem;
                        text-align: center;
                        font-size: 2rem;
                    }
                    
                    
                    & .stat-title-name {
                        flex: 1;
                        text-align: center;
                        font-size: 2rem;
                    }


                    & .stat-overall {
                        flex: 1;
                        height: 3.5rem;
                        border-radius: 1rem;
                        background-color: var(--color-border);
                        
                        
                        & * {
                            font-size: 1.5rem;
                            border-radius: 1rem;
                            color: #ffffff;
                        }
                        & .hp { background-color: rgb(233, 91, 91); }
                        & .attack { background-color: rgb(128, 165, 59); }
                        & .defense { background-color: rgb(181, 71, 209); }
                        & .speed { background-color: rgb(91, 176, 233); }
                    }
                }
            }
        }


        & #ability-wrapper {
            flex: 1;


            & #ability-title {
                font-size: 2rem;
                gap: 1rem;


                & .ability-info {
                    font-size: 1.5rem;
                    gap: 0.5rem;
                    
                    & .info-color {
                        width: 1.8rem;
                        aspect-ratio: 1;
                        border-radius: 50%;
                        background-color: rgb(100, 55, 55);
                    }
                }
                & .ability-info.hidden {
                    & .info-color {
                        background-color: rgb(133, 123, 39);
                    }
                }
            }


            & #ability-list {
                flex: 1;
                padding: 1rem 0 0 0;
                gap: 1rem;
                align-items: flex-start;
                flex-wrap: wrap;


                & .ability {
                    padding: 0.7rem 1.5rem;
                    font-size: 1.8rem;
                    background-color: rgb(100, 55, 55);
                    color: #ffffff;
                    border-radius: 1rem;
                }
                & .ability.hidden {
                    background-color: rgb(133, 123, 39);
                }
            }
        }
    }
</style>