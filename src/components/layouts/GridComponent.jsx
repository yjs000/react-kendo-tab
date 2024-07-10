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
        <div className="subCont subContR ">
            <div className="cmn_gird_wrap">
                <p className="totalTxt">
                    총 <i className="fcGreen">{0}</i>개
                </p>
                <div id="grid_01" className="cmn_grid">
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
                </div>
            </div>
        </div>
    );
};

export default GridComponent;
