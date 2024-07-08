const FilterComponent = ({ filters, onFilterChange }) => {
    console.log(filters);
    return (
        <div>
            {filters.map((filter, idx) => {
                const component = filter.component;
                return <component key={idx} data={filter.data} onChange={(value) => onFilterChange(filter.field, value)} />;
            })}
        </div>
    );
};

export default FilterComponent;
