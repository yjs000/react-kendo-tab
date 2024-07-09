import { Fragment, useEffect, useState } from "react";

const withSearchFieldData = (Component) => {
    return (props) => {
        const {
            mutation,
            defaultItemValue,
            id,
            dataItemKey,
            textField,
            targetValue,
            required,
            payload,
            label,
            operator,
            data,
            parentProps,
        } = props;

        const [fetchData, setFetchData] = useState([]);
        const _fieldName = id ?? dataItemKey;
        const _operator = operator ?? "eq";
        const _targetValue = targetValue ?? dataItemKey;
        const decoS = !!required === false ? "" : "decoS";
        const placeholder = !!required === false ? "전체" : "선택";
        const comboData = mutation ? fetchData : data;
        const processedComboData = comboData?.map((item) => ({ ...item, [textField]: item[textField] + "" }));

        useEffect(() => {
            if (mutation) {
                mutation.mutateAsync(payload ?? {}).then((res) => {
                    //textField 컬럼의 데이터가 string이 아니면 오류남. 무조건 string으로 바꿈.
                    setFetchData(res?.items ?? []);
                });
            }
        }, []);

        useEffect(() => {
            if (defaultItemValue) {
                parentProps.defaultFilterChange({ field: _fieldName, operator: _operator, value: defaultItemValue?.[_targetValue] });
            }
        }, [data]);

        const handleComboBoxOnChange = (e) => {
            //값이 이미 있으면 바꿔치기. 값이 없어지면 obejct에서 삭제.
            const value = e.target.value;
            if (value) {
                return parentProps.filterChange({ field: _fieldName, operator: _operator, value: value?.[_targetValue] });
            } else {
                return parentProps.clearFilter(_fieldName);
            }
        };

        return (
            <Fragment>
                {label ? <p className={`txtTit ${decoS}`}>{label}</p> : null}
                <Component  //여기에 Input이 오는걸까 popupInput이 오는걸까...
                    fetchData={fetchData}
                    {...props}
                />
            </Fragment>
        );
    };
};

export default withSearchFieldData;
