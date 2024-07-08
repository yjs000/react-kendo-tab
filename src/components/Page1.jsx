// pages/Page1.js

import useCrudOperations from "@/hooks/useCrudOperations.jsx";
import useFetchData from "@/hooks/useFetchData.jsx";
import FilterComponent from "@/components/FilterComponent.jsx";
import ButtonComponent from "@/components/ButtonComponent.jsx";
import GridComponent from "@/components/GridComponent.jsx";
import DynamicLayout from "@/components/DynamicLayout.jsx";

import { Button } from "@progress/kendo-react-buttons";
import layout1 from "@/components/layouts/layout1.jsx";


const Page1 = () => {
    const {
        data,
        selectedItem,
        isDetailsPopupOpen,
        isAddPopupOpen,
        handleRowClick,
        handleAddButtonClick,
        handleDetailsUpdate,
        handleAddData,
        setIsDetailsPopupOpen,
        setIsAddPopupOpen,
        handlePageChange,
        handleSortChange,
        handleFilterChange
    } = useCrudOperations("/api/page1-data");
    //TODO CRUD 각각 다 url태워야함

    const { data: comboBoxData } = useFetchData("/api/combobox-data");

    const filters = [
        { component: <div>combobox1</div>, data: {} },
        { component: <div>combobox2</div>, data: {} }
    ];

    const buttons = [
        {
            component: <Button>추가하기</Button>,
            onClick: () => handleAddButtonClick()
        },
        {
            component: <Button>다른버튼</Button>,
            onClick: () => console.log("click")
        }
    ];

    const columns = [
        { field: "id", title: "ID" },
        { field: "name", title: "Name" },
        { field: "details", title: "Details" },
        { cell: () => <button>상세보기</button> }
    ];
    const components = {
        FilterComponent: (props) => <FilterComponent {...props} onFilterChange={handleFilterChange} />,
        ButtonComponent: (props) => <ButtonComponent {...props} />,
        GridComponent: (props) => (
            <GridComponent {...props} data={data} onRowClick={handleRowClick} onPageChange={handlePageChange} onSortChange={handleSortChange} />
        )
    };

    const layout = layout1(filters, buttons, [], columns)
    return <DynamicLayout layout={layout} components={components} />;
};

export default Page1;
