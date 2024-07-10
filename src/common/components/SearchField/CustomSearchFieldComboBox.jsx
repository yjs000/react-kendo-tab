import { useCallback, useEffect, useState } from "react";
import message from "@/common/message.js";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import UseFiltering from "@/hooks/useFiltering.jsx";

const CustomSearchFieldComboBox = ({
                                       data,
                                       id,
                                       dataItemKey,
                                       textField,
                                       targetValue,
                                       operator = "eq",
                                       required = false,
                                       ...props
                                   }) => {
    const [searchInput, setSearchInput] = useState("");
    const {filter, handleFilterChange, clearFilter} = UseFiltering();
    const _keyField = id ?? dataItemKey;
    const _valueField = targetValue ?? dataItemKey;
    const placeholder = !!required === false ? "전체" : "선택";

    /*comboData는 string만 가능, searchInput이 있는경우 filter*/
    const validateData = data
        ?.map((item) => ({...item, [textField]: item[textField] + ""}))
        .filter(value => (value[textField] != null ? value[textField].includes(searchInput) : false))
    ;

    const handleComboBoxFilterChange = useCallback((event) => setSearchInput(event.filter.value), [data]);
    const handleChange = (e) => {
        //값이 이미 있으면 바꿔치기. 값이 없어지면 obejct에서 삭제.
        const value = e.target.value;
        if (value) {
            handleFilterChange({ field: _keyField, operator: operator, value: value?.[_valueField] });
        } else {
            clearFilter(_keyField);
        }
    };
    return (
        <ComboBox
            placeholder={placeholder}
            data={validateData}
            dataItemKey={dataItemKey}
            textField={textField}
            operator={operator}
            onChange={(e) => handleChange(e)}
            validationMessage={message.searchFieldValidationMessage}
            filterable={true}
            onFilterChange={handleComboBoxFilterChange}
            listNoDataRender={() => {
                return (
                    <div className="k-nodata">
                        <div>데이터가 없습니다.</div>
                    </div>
                );
            }}
            {...props}
        />
    );
};

export default CustomSearchFieldComboBox;
