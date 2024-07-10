import SearchFieldSearchBtn from "@/common/components/searchField/SearchFieldSearchBtn.jsx";

const FilterComponent = ({ filters, onFilterChange}) => {
    return (
        <div className="subCont subContL">
            {filters.map((filter, idx) => {
                return <filter.component key={idx} data={filter.data} onChange={(value) => onFilterChange(filter.field, value)} />;
            })}
            <SearchFieldSearchBtn>조회하기</SearchFieldSearchBtn>

        </div>
    );
};

export default FilterComponent;
