import StatusProvider from "@/contexts/StatusProvider";
import BasicComponents from "./BasicComponents";
import ExtendedComponents from "./ExtendedComonents";

export default function TestIndex() {
    return (
        <StatusProvider>
            <div className="flex gap-3">
                <div className="w-7/12">
                    <BasicComponents />
                </div>
                <div className="w-5/12">
                    <ExtendedComponents />
                </div>
            </div>
        </StatusProvider>
    )
}