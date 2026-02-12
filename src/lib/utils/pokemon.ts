



/**
 * 포켓몬 타입 한글이름 가져오기
 * @param type 포켓몬 타입 (string)
 * @returns 포켓몬 타입 한글이름
 */
export function getKrTypeName(type: string) {
    const krTypeName: Record<string, string> = {
        normal: "노말",
        fire: "불꽃",
        water: "물",
        electric: "전기",
        grass: "풀",
        ice: "얼음",
        fighting: "격투",
        poison: "독",
        ground: "땅",
        flying: "비행",
        psychic: "에스퍼",
        bug: "벌레",
        rock: "바위",
        ghost: "고스트",
        dragon: "드래곤",
        dark: "악",
        steel: "강철",
        fairy: "페어리"
    };

    return krTypeName[type] || null;
}


/**
 * 포켓몬 스탯 한글이름 가져오기
 * @param type 스탯 이름 (string)
 * @returns 스탯 한글이름
 */
export function getKrStatName(name: string) {
    const krStatName: Record<string, string> = {
        hp: "체력",
        attack: "공격",
        defense: "방어",
        speed: "속도",
    };

    return krStatName[name];
}