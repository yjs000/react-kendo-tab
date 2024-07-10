// pages/Page1.js

import useGridData from "@/hooks/useGridData.jsx";
import useFetchData from "@/hooks/useFetchData.jsx";
import FilterComponent from "@/components/layouts/FilterComponent.jsx";
import ButtonComponent from "@/components/layouts/ButtonComponent.jsx";
import GridComponent from "@/components/layouts/GridComponent.jsx";
import DynamicLayout from "@/components/layouts/DynamicLayout.jsx";

import { Button } from "@progress/kendo-react-buttons";
import layout1 from "@/layouts/layout1.js";
import ButtonPrimary from "@/common/components/v1/buttons/ButtonPrimary.jsx";
import SearchFieldComboBox from "@/common/components/v1/searchField/SearchFieldComboBox.jsx";
import HeaderComponent from "@/components/layouts/HeaderComponent.jsx";
import MainComponent from "@/components/layouts/MainComponent.jsx";
import DetailButton from "@/components/buttons/DetailButton.jsx";
import { GridColumn } from "@progress/kendo-react-grid";
import { Fragment } from "react";
import Page1InsertPopup from "@/components/layout/page1/Page1InsertPopup.jsx";
import Page1DetailPopup from "@/components/layout/page1/Page1DetailPopup.jsx";
import CommonSearchFieldComboBox from "@/components/CommonSearchFieldComboBox.jsx";
import { useYnComboData } from "@/common/utils/CodeUtil.jsx";

const Page1 = () => {
    console.log("page1")
    const {
        data,
        isAddPopupOpen,
        isDetailPopupOpen,
        selectedItem,
        handleAddButtonClick,
        handleDetailButtonClick,
        handlePageChange,
        handleSortChange,
        handleFilterChange,
        handleSearchClick,
        handleSelectedItem
    } = useGridData("/v1/company");
    //TODO CRUD 각각 다 url태워야함

    const { data: companyIdCombo } = useFetchData("/v1/combo/company-id/search");

    const filters = [
        {
            component: () => (
                <div className="cmn_sub_ipt">
                    <CommonSearchFieldComboBox label={"운수사"} data={companyIdCombo} dataItemKey={"companyId"} textField={"companyName"} />
                </div>
            )
        },
        {
            component: () => (
                <div className="cmn_sub_ipt">
                    <CommonSearchFieldComboBox label={"폐업여부"} data={useYnComboData} id={"closedDownBusinessYn"} dataItemKey={"codeId"} textField={"codeName"} targetValue={"codeId"} />
                </div>
            )
        }
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

    const Grid = (props) => (
        <GridComponent {...props} data={data} onRowClick={handleSelectedItem} onPageChange={handlePageChange} onSortChange={handleSortChange}>
            <GridColumn field={"companyName"} title={"운수사명"} />
            <GridColumn field={"companyId"} title={"운수사ID"} />
            <GridColumn field={"closedDownBusinessYn"} title={"폐업여부"} />
            <GridColumn field={"representativeName"} title={"대표자명"} />
            <GridColumn field={"telephoneNumber"} title={"대표번호"} />
            <GridColumn field={"email"} title={"이메일"} />
            <GridColumn field={"address"} title={"영업소"} />
            <GridColumn field={"creatDate"} title={"등록일자"} />
            <GridColumn field={"updateDate"} title={"수정일자"} />
            <GridColumn
                sortable={false}
                field={"custom"}
                title={"상세"}
                cell={(cellProps) => <DetailButton gridProps={props} cellProps={cellProps} onClick={handleDetailButtonClick} />}
            />
        </GridComponent>
    );
    const titles = ["hello", "mello", "bello"];

    const components = {
        HeaderComponent: (props) => <HeaderComponent {...props} onSearchClick={handleSearchClick} />,
        MainComponent: (props) => <MainComponent {...props} />,
        FilterComponent: (props) => <FilterComponent {...props} onFilterChange={handleFilterChange} onSearchClick={handleSearchClick} />,
        GridComponent: Grid,
        PopupComponent: (props) => (
            <Fragment>
                {isAddPopupOpen && <Page1InsertPopup data={selectedItem} />}
                {isDetailPopupOpen && <Page1DetailPopup data={selectedItem} />}
            </Fragment>
        )
    };

    const layout = layout1(titles, filters, buttons);
    return <DynamicLayout layout={layout} components={components} />;
    // return null;
};

export default Page1;
