// pages/Page1.js

import useCrudOperations from "@/hooks/useCrudOperations.jsx";
import useFetchData from "@/hooks/useFetchData.jsx";
import FilterComponent from "@/components/layouts/FilterComponent.jsx";
import ButtonComponent from "@/components/layouts/ButtonComponent.jsx";
import GridComponent from "@/components/layouts/GridComponent.jsx";
import DynamicLayout from "@/components/layouts/DynamicLayout.jsx";

import { Button } from "@progress/kendo-react-buttons";
import layout1 from "@/layouts/layout1.js";
import ButtonPrimary from "@/common/components/buttons/ButtonPrimary.jsx";
import SearchFieldComboBox from "@/common/components/searchField/SearchFieldComboBox.jsx";
import HeaderComponent from "@/components/layouts/HeaderComponent.jsx";
import MainComponent from "@/components/layouts/MainComponent.jsx";

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
        handleSearchClick,
        handlePageChange,
        handleSortChange,
        handleFilterChange
    } = useCrudOperations("/v1/company/search");
    //TODO CRUD 각각 다 url태워야함

    const { data: comboBoxData } = useFetchData("/api/combobox-data");

    const filters = [
        {
            component: () => (
                <div className="cmn_sub_ipt">
                    <p className="txtTit">ID</p>
                    <SearchFieldComboBox data={[]} id="userId" dataItemKey={"userId"} textField={"userId"} />
                </div>
            ),
            data: {}
        },
        { component: () => <div>combobox2</div>, data: {} }
    ];

    const buttons = [
        {
            component: () => <ButtonPrimary>추가하기</ButtonPrimary>,
            onClick: () => handleAddButtonClick()
        },
        {
            component: () => <ButtonPrimary>다른버튼</ButtonPrimary>,
            onClick: () => console.log("click")
        }
    ];

    const columns = [
        { field: "id", title: "ID" },
        { field: "name", title: "Name" },
        { field: "details", title: "Details" },
        { cell: () => <button>상세보기</button> }
    ];
    const titles = ["hello"];

    const components = {
        HeaderComponent: (props) => <HeaderComponent {...props} onSearchClick={handleSearchClick}/>,
        MainComponent: (props) => <MainComponent {...props} onFilterChange={handleFilterChange} />,
        FilterComponent: (props) => <FilterComponent {...props} onFilterChange={handleFilterChange} />,
        GridComponent: (props) => (
            <GridComponent {...props} data={data} columns={columns} onRowClick={handleRowClick} onPageChange={handlePageChange} onSortChange={handleSortChange} />
        ),
        PopupComponent: (props) => <div>팝업영역</div>,
    };

    const layout = layout1(titles, filters, buttons);
    return <DynamicLayout layout={layout} components={components} />;
};

export default Page1;
