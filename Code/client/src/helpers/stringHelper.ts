export const stringHelper = {
    uppercaseFirstLetter(s: string | undefined | null) {
        return s ? s[0].toUpperCase() + s.slice(1) : s;
    }
}