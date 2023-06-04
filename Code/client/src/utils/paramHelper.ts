import { EditorModel } from "../models/editorModel";

const paramHelper = {

    getEditorModel: (idText?: string): EditorModel => {
        const id: number | undefined = parseInt(idText || "");
        const action: "add" | "edit" = id && !isNaN(id) ? "edit" : "add";

        return {
            id: !isNaN(id) ? id : undefined,
            action
        };
    },

    getParams: (filter: any) => {
        const params = new URLSearchParams();

        for (const key in filter) {
            const value = filter[key];

            if (value) {
                params.append(key, encodeURIComponent(value));
            }
        }

        return params;
    }
}

export default paramHelper;