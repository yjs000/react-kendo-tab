import {DatePicker} from "@progress/kendo-react-dateinputs";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import {Fragment} from "react";

import {RegExpTypes} from "@/common/utils/Validation.jsx";
import message from "@/common/message.js";

/**
 * @author jisu
 * @since 2024.04.29
 *
 * custom param
 * @Param parentProps
 * @param reqFormat 서버로 보내줄 format. dayjs 날짜 포맷. default 년월일
 * @param id 서버에보내줄 데이터의 key 필드 명. 없으면 name으로 설정.
 * @param label title
 * -----------------
 *
 */
const PopupDatePicker = ({ parentProps, id, label, reqFormat = "YYYYMMDD", ...props }) => {
    const { required } = props;
    const fieldName = id ? id : props.name;
    const defaultValue = parentProps?.popupValue?.[fieldName]
    const defaultValueDate = defaultValue ? dayjs(defaultValue).toDate() : defaultValue;
    const decoS = !!required === false ? "" : "decoS";
    const placeholder = !!props.disabled === true && parentProps.mode == "I" ? message.disabledPlaceholderForInsert : null ;
    const format = props.foramt ?? "yyyy-MM-dd";
    const requestFormat = reqFormat ?? format.replace(RegExpTypes.NOT_ALPHABET, "");

    const handleDateChange = (e) => {
        const newPopupValue = { ...parentProps.popupValue, [fieldName]: e.value ? dayjs(e.value).format(requestFormat) : e.value };
        parentProps.setPopupValue(newPopupValue);
    };

    return (
        <Fragment>
            {label ? (
                <Fragment>
                    <span className={`iptTit ${decoS}`}>{label}</span>
                    <div className="inpArea cal">
                        <DatePicker
                            value={defaultValueDate}
                            format={format}
                            onChange={(event) => handleDateChange(event)}
                            validationMessage={message.defaultValidationMessage}
                            placeholder={placeholder}
                            {...props}
                        />
                    </div>
                </Fragment>
            ) : (
                <DatePicker
                    value={defaultValueDate}
                    format={format}
                    onChange={(event) => handleDateChange(event)}
                    validationMessage={message.defaultValidationMessage}
                    placeholder={placeholder}
                    {...props}
                />
            )}
        </Fragment>
    );
};

PopupDatePicker.propTypes = {
    parentProps: PropTypes.object.isRequired
};

export default PopupDatePicker;
