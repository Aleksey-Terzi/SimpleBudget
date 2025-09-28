import { useEffect, useState } from "react";
import { cache } from "@/cache/cache";
import { useLoadAction } from "@/hooks/useLoadAction";
import { DictionaryStorageKey } from "@/helpers/enums";

export function useDictionarySearch<Model extends object>(
    storageKey: DictionaryStorageKey,
    dictionaryFactory: () => Promise<Model>
) {
    const [model, setModel] = useState<Model | null>(() => cache.dictionary.get<Model>(storageKey));

    const { runLoad } = useLoadAction(async () => {
        if (model) {
            return;
        }
        const funcOrModel = cache.dictionary.get(storageKey, dictionaryFactory);
        const newModel = funcOrModel instanceof Promise ? await funcOrModel : funcOrModel;
        setModel(newModel);
    });

    useEffect(() => {
        runLoad();
    }, [runLoad]);

    return {
        model
    };
}