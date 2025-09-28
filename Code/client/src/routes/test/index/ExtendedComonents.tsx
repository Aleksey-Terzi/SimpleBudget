import FormSection from "@/components/form/FormSection";
import Tab from "@/components/tabs/Tab";
import Tabs from "@/components/tabs/Tabs";
import TestGrid from "./TestGrid";
import LoadingProvider from "@/contexts/LoadingProvider";
import TestGrid2 from "./TestGrid2";
import TestSearch from "./TestSearch";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import { useStatusProvider } from "@/contexts/StatusProvider";
import TestApi from "./TestApi";

let _counter = 1;

export default function ExtendedComponents() {
    const { addError, removeError } = useStatusProvider();

    return (
        <FormSection className="h-full">

            <Tabs defaultSelectedTabKey="5">
                <Tab tabKey="1" icon="data" title="Test Grid" className="pt-4">
                    <LoadingProvider className="pt-2">
                        <TestGrid />
                    </LoadingProvider>
                </Tab>
                <Tab tabKey="2" icon="data" title="Test Grid 2" className="pt-4">
                    <LoadingProvider className="pt-2">
                        <TestGrid2 />
                    </LoadingProvider>
                </Tab>
                <Tab tabKey="3" title="Test Search" className="pt-4">
                    <LoadingProvider className="pt-2">
                        <TestSearch />
                    </LoadingProvider>
                </Tab>
                <Tab tabKey="4" title="Alerts" className="pt-4">
                    <Alert type="error">
                        This is an error
                    </Alert>
                    <Alert type="warning" className="mt-4">
                        This is a warning
                    </Alert>
                    <Alert type="info" className="mt-4">
                        This is an information
                    </Alert>

                    <div className="mt-3 flex gap-2">
                        <Button onClick={() => {
                            addError(`Error_${_counter}`, `This is the test error ${_counter}`);
                            _counter++;
                        }}>
                            Add Error
                        </Button>
                        <Button onClick={() => removeError()}>
                            Clear Errors
                        </Button>
                    </div>
                </Tab>
                <Tab tabKey="5" title="API" className="pt-4">
                    <TestApi />
                </Tab>
            </Tabs>
                
        </FormSection>
    );
}