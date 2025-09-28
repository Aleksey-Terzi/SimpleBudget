import { MenuItem } from "@/routes/formRoutes";
import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react";

interface ContextData {
    groups: {
        groupKey: string;
        menus: MenuItem[];
    }[]; 
    addMenu: (groupKey: string, menu: MenuItem) => void;
    clearMenus: (groupKey: string) => void;
}

const LoadingProviderContext = createContext<ContextData>({
    groups: [],
    addMenu: () => {},
    clearMenus: () => {},
});

interface AddAction {
    type: "add";
    groupKey: string;
    menu: MenuItem;
}

interface ClearAction {
    type: "clear";
    groupKey: string;
}

type Action = AddAction | ClearAction;

interface State {
    groups: {
        groupKey: string;
        menus: MenuItem[];
    }[];
}

const _initialState: State = {
    groups: []
}

function reducer(state: State, action: Action): State {
    const { type, groupKey } = action;
    switch (type) {
        case "add":
            {
                const groupToAdd = state.groups.find(x => x.groupKey === groupKey);
                return {
                    ...state,
                    groups: [
                        ...state.groups.filter(x => x.groupKey !== groupKey),
                        {
                            groupKey,
                            menus: groupToAdd?.menus
                                ? [
                                    ...groupToAdd.menus.filter(x => x.url !== action.menu.url),
                                    action.menu
                                ] : [action.menu]
                        }
                    ]
                };
            }
            
        case "clear":
            return {
                ...state,
                groups: [
                    ...state.groups.filter(x => x.groupKey !== groupKey),
                ]
            };

        default:
            throw new Error(`Unknown action: ${type}`);
    }
}

interface Props {
    children?: ReactNode;
}

export default function MenuProvider({ children }: Props) {
    const [{ groups }, dispatch] = useReducer(reducer, _initialState);

    const methods = useMemo(() => ({
        addMenu: (groupKey: string, menu: MenuItem) => dispatch({ type: "add", groupKey, menu }),
        clearMenus: (groupKey: string) => dispatch({ type: "clear", groupKey }),
    }), [dispatch]);


    return (
        <LoadingProviderContext.Provider value={{
            groups,
            ...methods,
        }}>
            {children}
        </LoadingProviderContext.Provider>
    );
}

let _counter = 1;

// eslint-disable-next-line react-refresh/only-export-components
export function useMenuProvider() {
    const { groups, addMenu, clearMenus } = useContext(LoadingProviderContext);
    const [groupKey] = useState(() => `sequential-group-key.${_counter++}`);
    const [localAddMenu] = useState(() => (menu: MenuItem) => addMenu(groupKey, menu));

    const context = useMemo(() => ({
        menus: groups.flatMap(g => g.menus),
        addMenu: localAddMenu,
    }), [groups, localAddMenu]);

    useEffect(() => () => clearMenus(groupKey), [clearMenus, groupKey]);

    return context;
}