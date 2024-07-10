import { useState } from "react";

const useFiltering = () => {

    const [filters, setFilters] = useState([]);
    const [applyFilters, setApplyFilters] = useState([]);

    // const filterReducer = (prevFilters, newItems) => {
    //     const updatedFilters = [...prevFilters];
    //
    //     newItems.forEach((item) => {
    //         const { field, operator, value } = item;
    //         const existingIndex = updatedFilters.findIndex((filter) => filter.field === field);
    //
    //         if (existingIndex === -1) {
    //             updatedFilters.push({ field, operator, value });
    //         } else {
    //             updatedFilters[existingIndex] = { field, operator, value };
    //         }
    //     });
    //
    //     return updatedFilters;
    // };
    //
    // const handleFilterChange = ({ field, operator, value }) => {
    //     console.log("handleFilterChange", {field, operator, value});
    //     setFilters((prevFilters) => filterReducer(prevFilters, [{ field, operator, value }]));
    // };
    //
    // const handleApplyFilterChange = (newApplyFilter) => {
    //     setApplyFilters(newApplyFilter);
    // };
    //
    // /**
    //  * filter가 지워져서 undefined가되면,
    //  * [key] : undefined || null 로 데이터가 남아있는 문제 발생.
    //  * [key] 를 지워주는 역할
    //  */
    // const clearFilter = (field) => {
    //     const idx = filters.findIndex((item) => item.field == field);
    //     const newFilter = [...filters];
    //     if (idx != -1) {
    //         newFilter.splice(idx, 1);
    //         setFilters(newFilter);
    //     }
    // };
    //
    console.log("filter useFiltering", filters)
    return {
        filters,
        applyFilters,
        // clearFilter,
        // handleFilterChange,
        // handleApplyFilterChange
    };
};

export default useFiltering;
