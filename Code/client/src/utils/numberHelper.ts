const numberHelper = {

    formatNumber: (n?: number, abs = true) => {
        if (!n) return undefined;

        if (abs) {
            n = Math.abs(n);
        }

        return n.toLocaleString("en-CA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    parseNumber: (s?: string) => {
        if (!s || s.length === 0) return undefined;

        const trimmedValue = s.replaceAll(",", "");

        return Number(trimmedValue);
    }
}

export default numberHelper;