import {getSelectedState, Grid, GridColumn as Column, GridNoRecords} from "@progress/kendo-react-grid";
import { useCallback } from "react";
import PropTypes from "prop-types";

/**
 * GridData와 함께 사용하는 KendoGrid 묶음.
 *
 *
 * @author jisu
 * @since 2024.04.30
 * -----------custom props-----------
 * @param parentProps 상위(gridData)에서 넘겨준 데이터를 props로 넘겨주어야 한다.
 * @param processData grid data의 포맷등을 변경할 때 쓸 수 있는 callback
 * ----------------------------------
 * @param children
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const KendoGrid = ({ parentProps, children, processData, ...props }) => {
    const parentData = parentProps?.data || { data: [], totalSize: 0 };
    const filter = parentProps.filter;
    const sort = parentProps.sort;
    const sortChange = parentProps.sortChange;
    const page = parentProps.page;
    const pageChange = parentProps.pageChange;
    const selectedState = parentProps.selectedState;
    const dataItemKey = parentProps.dataItemKey;
    const selectedField = parentProps.selectedField;
    const setSelectedState = parentProps.setSelectedState;
    const dataState = parentProps.dataState;
    const idGetter = parentProps.idGetter;
    const selectMode = parentProps.multiSelect ? "multiple" : "single";
    const isPage = parentProps.isPage;

    const processedData = processData instanceof Function ? processData(dataState.data) : dataState.data;

    const onSelectionChange = (event) => {
        const newSelectedState = getSelectedState({
            event,
            selectedState: selectedState,
            dataItemKey: dataItemKey
        });
        setSelectedState(newSelectedState);
    };

    const onHeaderSelectionChange = useCallback((event) => {
        const checkboxElement = event.syntheticEvent.target;
        const checked = checkboxElement.checked;
        const newSelectedState = {};
        event.dataItems.forEach((item) => {
            newSelectedState[idGetter(item)] = checked;
        });
        setSelectedState(newSelectedState);
    }, []);

    return (
        <Grid
            data={processedData}
            sortable={{ mode: "multiple" }}
            sort={sort}
            filter={filter}
            pageable={isPage ? { info: false } : false}
            onSortChange={sortChange}
            skip={page.skip}
            take={page.take}
            total={parentData.totalSize}
            onPageChange={pageChange}
            dataItemKey={dataItemKey}
            selectedField={selectedField}
            selectable={{ enabled: true, mode: selectMode }}
            onSelectionChange={onSelectionChange}
            onHeaderSelectionChange={onHeaderSelectionChange}
            {...props}
        >
            {parentProps.multiSelect ? props.checkbox ?? (
                <Column
                    field={parentProps.selectedField}
                    width={"40px"}
                    headerSelectionValue={
                        parentProps.dataState.data.findIndex((item) => {
                            return !parentProps.selectedState[parentProps.idGetter(item)];
                        }) === -1 && parentProps.dataState.data.length > 0
                    }
                    onHeaderSelectionChange={parentProps.onHeaderSelectionChange}
                    sortable={false}
                />
            ) : null}
            <GridNoRecords>
                조회된 데이터가 없습니다.
            </GridNoRecords>
            {children}
        </Grid>
    );
};

export default KendoGrid;

KendoGrid.propTypes = {
    parentProps: PropTypes.object.isRequired
};
