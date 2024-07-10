import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import message from "@/common/message.js";


/**
 * 조회부 comboBox
 * ---custom props------------------------
 * @param mutation
 * @param payload
 * @param parentProps
 * @param targetValue 키, 값 중 무엇을 데이터로 넘겨줄지. ex)운수사명 콤보인경우 compnayId, companyName으로 표출하고, companyName을 지정하여 서버에 전송
 * @param id 키 필드 이름 {[id] : comboDataObject[targetValue]}
 * ---------------------------------------
 * @param dataItemKey
 * @param textField
 * @param props
 * @returns {JSX.Element}
 *
 * @author jisu
 * @since 2024-04-22<br />
 * 1. 밖에서 data를 fetch한 후에 data를 넘겨주는 방법
 * 2. mutation을 넘겨서 컴포넌트안에서 data를 fetch하는 방법
 * 두가지가 있음.
 *
 * defaultItemValue를 세팅할 경우에는 1번의 방법만 가능.
 */
const SearchFieldComboBox = ({
    dataItemKey,
    textField,
    parentProps,
    defaultItemValue,
    targetValue,
    required,
    label,
    mutation,
    payload,
    id,
    operator,
    data,
    ...props
}) => {
    const [fetchData, setFetchData] = useState([]);
    const _fieldName = id ?? dataItemKey;
    const _operator = operator ?? "eq";
    const _targetValue = targetValue ?? dataItemKey;
    const decoS = !!required === false ? "" : "decoS";
    const placeholder = !!required === false ? "전체" : "선택";
    const comboData = mutation ? fetchData : data;
    const processedComboData = comboData?.map(item => ({ ...item, [textField]: item[textField] + "" }));

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
            {label ? <p className={`txtTit ${decoS}`}>{label}</p> : null} {/*프로젝트에 맞게 바꿔줄것*/}
            <ComboBox
                placeholder={placeholder}
                data={processedComboData}
                dataItemKey={dataItemKey}
                defaultValue={defaultItemValue}
                textField={textField}
                operator={operator}
                required={required}
                onChange={(e) => handleComboBoxOnChange(e)}
                validationMessage={message.searchFieldValidationMessage}
                {...props}
            />
        </Fragment>
    );
};

export default SearchFieldComboBox;

SearchFieldComboBox.propTypes = {
    parentProps : PropTypes.object.isRequired,
    dataItemKey : PropTypes.string.isRequired,
    textField : PropTypes.string.isRequired,
}