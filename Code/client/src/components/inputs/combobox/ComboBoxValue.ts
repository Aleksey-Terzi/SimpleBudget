export interface ComboBoxValue {
    value: string | null;
    type: "selected" | "custom";
}

export const comboBoxEmptyValue: ComboBoxValue = { value: null, type: "selected" };