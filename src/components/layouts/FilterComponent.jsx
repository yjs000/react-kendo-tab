import SearchFieldSearchBtn from "@/common/components/v1/searchField/SearchFieldSearchBtn.jsx";
import SearchButton from "@/components/buttons/SearchButton.jsx";

const FilterComponent = ({ filters, onFilterChange, onSearchClick }) => {
    console.log("filterComponent");
    const Comp = filters[0].component;
    return (
        <div className="subCont subContL">
            {/*{filters.map((filter, idx) => {*/}
            {/*    return (*/}
            {/*        <filter.component*/}
            {/*            key={idx}*/}
            {/*            data={filter.data}*/}
            {/*            onChange={(value) =>*/}
            {/*                onFilterChange({*/}
            {/*                    field: filter.field,*/}
            {/*                    value*/}
            {/*                })*/}
            {/*            }*/}
            {/*        />*/}
            {/*    );*/}
            {/*})}*/}
            {<Comp

            />}
            {<Comp

            />}
            <SearchButton onSearchClick={onSearchClick}>조회하기</SearchButton>
        </div>
    );
};

export default FilterComponent;
