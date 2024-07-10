import {useEffect, useState} from 'react';
import {useQuery, useQueryClient} from 'react-query';
import usePagination from "@/hooks/usePagination.jsx";
import useSorting from "@/hooks/useSorting.jsx";
import useFiltering from "@/hooks/useFiltering.jsx";
import {CrudMode} from "@/common/utils/enum.js";
import callApi from "@/components/CommonApi.js";

const useGridData = (baseUrl) => {
    console.log("useGridData")
    const queryClient = useQueryClient();

    const [crudMode, setCrudMode] = useState(CrudMode.READ);
    const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);


    // 페이징, 정렬, 필터링 훅 가져오기
    // const { paging, handlePageChange } = usePagination();
    // const { sorting, handleSortChange } = useSorting();
    const { filters, applyFilters, handleFilterChange, handleApplyFilterChange} = useFiltering();

    // const showPopup = (isShowPopup) => {
    //     if(isShowPopup) {
    //         if(crudMode === CrudMode.CREATE) {
    //             setIsDetailPopupOpen(false);
    //             setIsAddPopupOpen(true);
    //             return true;
    //         } else if (crudMode === CrudMode.UPDATE) {
    //             setIsDetailPopupOpen(true);
    //             setIsAddPopupOpen(false);
    //             return true;
    //         }
    //     }
    //     setIsDetailPopupOpen(false);
    //     setIsAddPopupOpen(false);
    //     return false;
    // }
    //
    // // 데이터 조회 쿼리
    // const { isLoading } = useQuery(
    //     ['fetchData', baseUrl, paging, sorting, applyFilters],
    //     async () => {
    //         return await callApi(`${baseUrl}/search`, {
    //             page: paging,
    //             filter: applyFilters,
    //             sorter: sorting,
    //         });
    //     },
    //     {
    //         // enabled: false, // 초기에는 쿼리 실행을 막음
    //         onSuccess: (data) => {
    //             setData(data);
    //         },
    //         onError: error => {
    //             throw new Error(error);
    //         }
    //     }
    // );
    //
    // const handleDetailButtonClick = () => {
    //     setCrudMode(CrudMode.READ);
    //     showPopup(true)
    // };
    //
    // const handleAddButtonClick = () => {
    //     setCrudMode(CrudMode.CREATE);
    //     showPopup(true)
    // };
    //
    // // const handleDetailsUpdate = (updatedData) => {
    // //     const updatedGridData = data.map((item) => (item.id === updatedData.id ? updatedData : item));
    // //     setData(updatedGridData);
    // //     setIsDetailsPopupOpen(false);
    // // };
    //
    // const handleAddData = (newData) => {
    //     setData([...data, newData]);
    //     setIsAddPopupOpen(false);
    // };
    //
    // const handleSelectedItem = (e) => {
    //     const newSelectedState = e.dataItem
    //     setSelectedItem(newSelectedState);
    // }
    //
    // const handleSearchClick = () => {
    //     // handleApplyFilterChange(filters);
    //     // queryClient.invalidateQueries(['fetchData', baseUrl, paging, sorting, applyFilters]);
    // };

    return {
        data,
        // isLoading,
        selectedItem,
        isAddPopupOpen,
        isDetailPopupOpen,
        // handleSelectedItem,
        // handleSearchClick,
        // handleDetailButtonClick,
        // handleAddButtonClick,
        // // handleDetailsUpdate,
        // handleAddData,
        setIsAddPopupOpen,
        // handlePageChange,
        // handleSortChange,
        handleFilterChange
    };
};

export default useGridData;
