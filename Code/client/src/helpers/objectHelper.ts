interface Object {
    [key: string]: unknown;
}

export const objectHelper = {
    deleteEmptyProps(obj: object): object {
        const result: Object = {};

        for (const key in obj) {
            const value = (obj as Object)[key];
            if (value !== null && value !== undefined && value !== "") {
                result[key] = value;
            }
        }

        return result;
    }
}