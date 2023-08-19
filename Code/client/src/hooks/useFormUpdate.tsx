import { useState } from "react";

export function useForceUpdate() {
    const [value, setValue] = useState(false);
    return () => setValue(!value);
}