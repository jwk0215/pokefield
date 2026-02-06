import fs from "fs";
import path from "path";




async function fetchJSON(api) {
    const res = await fetch(api);

    if (!res.ok) {
        console.warn(`Error: ID[${api}]`);
        return null;
    }
    
    return await res.json();
}


async function generatePokemonDataJSON() {
    console.log("JSON 구성 시작...");

    const outputPath = path.resolve("static/data/pokemon-data.json");
    const data = {};

    const list = await fetchJSON("https://pokeapi.co/api/v2/pokemon?limit=1030");

    for (const pokemon of list.results) {
        const id = Number(pokemon.url.split('/').at(-2));
        
        const species = await fetchJSON(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

        const krName = species?.names.find(n => {
            return n.language.name === "ko";
        })?.name;

        if (krName) {
            data[id] = {
                nameEn: pokemon.name,
                nameKr: krName,
                url: pokemon.url
            };
            console.log(`ID[${id}] 완료`);
        }
    }

    fs.writeFileSync(
        outputPath,
        JSON.stringify(data, null, 4),
        "utf-8"
    );

    console.log("JSON 저장 완료: " + outputPath);
}

generatePokemonDataJSON();