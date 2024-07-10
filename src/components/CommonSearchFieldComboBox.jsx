import {Fragment} from "react";
import CustomSearchComboBox from "@/common/components/v1/kendo/CustomSearchComboBox.jsx";
import CustomSearchFieldComboBox from "@/common/components/SearchField/CustomSearchFieldComboBox.jsx";

/**
 * 조회부 콤보박스
 * @param label label이름
 * @param data dropdown의 data
 * @param id 선택한 item의 key값을 api에 보낼때 어떤 값으로 보낼지 설정
 * @param dataItemKey selector의 key
 * @param textField selector의 value
 * @param targetValue 선택한 item의 value값을 api에 보낼때 어떤 값으로 보낼지 설정
 * @param required 필수여부
 * @param operator dropdown을 선택해서 filter 데이터에 들어갈 때 operation 설정
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const CommonSearchFieldComboBox = ({label, data, id, dataItemKey, textField, targetValue,
                                       required, operator, ...props}) => {
    const decoS = !!required === false ? "" : "decoS";

    return (
        <Fragment>
            {/*publishing영역*/}
            {label ? <p className={`txtTit ${decoS}`}>{label}</p> : null}
            <CustomSearchFieldComboBox
                data={data}
                id={id}
                dataItemKey={dataItemKey}
                textField={textField}
                targetValue={targetValue}
                operator={operator}
                required={required}
                {...props}
            />
        </Fragment>
    );
};

export default CommonSearchFieldComboBox;
