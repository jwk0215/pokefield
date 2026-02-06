import { writable } from "svelte/store";




function createThemeStore() {
    const { subscribe, set } = writable(true);

    return {
        subscribe,
        setStore() {
            const themeMode = localStorage.getItem("pk-theme");

            if (!themeMode) {
                set(true);
                localStorage.setItem("pk-theme", "light");
            } else {
                const isLight = themeMode === "light";
                if (!isLight) document.documentElement.classList.add("dark");
                set(isLight);
            }
        },
        changeTheme() {
            const themeMode = localStorage.getItem("pk-theme");
            const changedTheme = themeMode === "light" ? "dark" : "light";
            const isLight = changedTheme === "light";

            if (isLight) document.documentElement.classList.remove("dark");
            else document.documentElement.classList.add("dark");
            
            localStorage.setItem("pk-theme", changedTheme);
            set(changedTheme === "light");
        }
    }
}
export default createThemeStore();