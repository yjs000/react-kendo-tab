import { useCallback, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";

const CloseableTabs = ({ children, onSelect, onClose }) => {
    //onClose 구현 필요
    return <Tabs onSelect={onSelect}>{children}</Tabs>;
};
const CloseableTab = ({ children, onClose }) => {
    return (
        <>
            <div>
                <Tab>{children}</Tab>
                <Button onClick={onClose}>X</Button>
            </div>
        </>
    );
};

function TabLayout() {
    const [tabList, setTabList] = useState([]);
    const [renderedPanels, setRenderedPanels] = useState(null);
    const [inputData, setInputData] = useState(["test"]);

    const onMenuSelect = useCallback((index) => {
        setTabList((prev) => (prev.includes(index) ? prev : prev.concat(index)));
    }, []);

    const onSelect = useCallback((index) => {
        setRenderedPanels(index);
    }, []);

    const onClose = useCallback((index) => {
        setRenderedPanels((prev) => prev.remove(index));
    }, []);

    return (
        <>
            {/*메뉴*/}
            <Tabs onSelect={onMenuSelect}>
                <TabList>
                    <Tab>0</Tab>
                    <Tab>1</Tab>
                    <Tab>2</Tab>
                </TabList>
            </Tabs>

            {/*탭*/}
            <CloseableTabs onSelect={onSelect} onClose={onClose}>
                <TabList>
                    {tabList.map((tab) => (
                        <CloseableTab>{tab}</CloseableTab>
                    ))}
                </TabList>
                <TabPanel forceRender={renderedPanels == 0}>Panel 0</TabPanel>
                <TabPanel forceRender={renderedPanels == 1}>
                    <Input value={inputData} setValue={setInputData} onChange={(e) => setInputData(e.value)} />
                </TabPanel>
                <TabPanel forceRender={renderedPanels == 2}>Panel 2</TabPanel>
            </CloseableTabs>
        </>
    );
}

export default TabLayout;
