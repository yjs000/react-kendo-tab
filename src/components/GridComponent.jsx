import { Grid, GridColumn } from '@progress/kendo-react-grid';

const GridComponent = ({
                           data,
                           columns,
                           onRowClick,
                           pageable = true,
                           sortable = true,
                           onPageChange,
                           onSortChange,
                           selectable = 'single'
                       }) => {
    return (
        <Grid
            data={data}
            onRowClick={onRowClick}
            pageable={pageable}
            sortable={sortable}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
            selectable={selectable}
        >
            {columns.map((col, idx) => (
                <GridColumn key={idx} {...col} />
            ))}
        </Grid>
    );
};

export default GridComponent;
