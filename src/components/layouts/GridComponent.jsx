import { Grid, GridColumn as Column, GridNoRecords } from "@progress/kendo-react-grid";
import PropTypes from "prop-types";

const GridComponent = ({
                           data,
                           columns,
                           onRowClick,
                           pageable = true,
                           sortable = true,
                           onPageChange,
                           onSortChange,
                           selectable = 'single',
    children
                       }) => {

    return (
        <div className="subCont subContR ">
            <div className="cmn_gird_wrap">
                <p className="totalTxt">
                    총 <i className="fcGreen">{data?.length ?? 0}</i>개
                </p>
                <div id="grid_01" className="cmn_grid">
                    <Grid
                        data={data}
                        onRowClick={onRowClick}
                        pageable={pageable ? { info: false } : false}
                        sortable={sortable ? { mode: "multiple" } : false}
                        onPageChange={onPageChange}
                        onSortChange={onSortChange}
                        selectable={{ enabled: true, mode: selectable }}
                        // onSelectionChange={onSelectionChange}
                        // onHeaderSelectionChange={onHeaderSelectionChange}
                    >
                        {selectable === 'multiple' && (
                            <Column
                                field="__selection__"
                                width="40px"
                                headerSelectionValue={data.every(item => item.selected)}
                                sortable={false}
                            />
                        )}
                        {children}
                        <GridNoRecords>
                            조회된 데이터가 없습니다.
                        </GridNoRecords>
                    </Grid>
                </div>
            </div>
        </div>
    );
};

GridComponent.propTypes = {
    data: PropTypes.array.isRequired,
    pageable: PropTypes.bool,
    sortable: PropTypes.bool,
    onPageChange: PropTypes.func,
    onSortChange: PropTypes.func,
    selectable: PropTypes.oneOf(['single', 'multiple']),
};

export default GridComponent;
