import {useContext, useEffect, useRef, useState} from "react";
import {modalContext} from "@/common/components/Modal.jsx";
import {loadCode, useYnComboData} from "@/common/utils/CodeUtil.jsx";
import {ComboApi} from "@/components/ComboApi.js";
import {isObjectEmpty, RegExpTypes} from "@/common/utils/Validation.jsx";
import message from "@/common/message.js";
import PopupInput from "@/common/components/popup/PopupInput.jsx";
import PopupDropDown from "@/common/components/popup/PopupDropDown.jsx";
import PopupDetailButtons from "@/common/components/popup/PopupDetailButtons.jsx";
import PopupDatePicker from "@/common/components/popup/PopupDatePicker.jsx";
import PopupCellPhoneInput from "@/common/components/popup/PopupCellphoneInput.jsx";
import PopupUpload from "@/common/components/popup/PopupUpload.jsx";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const DriverInfoDetailPopup = ({ parentProps, title, ...props }) => {
    useEffect(() => {
        // processPopupData
        // grid에서는 formatting된 string을 사용하지만 popup에서는 날짜를 특수문자 빼고 숫자만 사용1
        const { popupValue } = parentProps;
        const newPopupValue = {
            ...popupValue,
            joinCompanyYearMonthDay: popupValue.joinCompanyYearMonthDay ? dayjs(popupValue.joinCompanyYearMonthDay).format(reqDateFormat): popupValue.joinCompanyYearMonthDay,
            resignYearMonthDay: popupValue.resignYearMonthDay ? dayjs(popupValue.resignYearMonthDay).format(reqDateFormat) : popupValue.resignYearMonthDay
        };
        parentProps.setPopupValue(newPopupValue);
    }, []);

    const modal = useContext(modalContext);
    const modalOnOff = parentProps.popupShow === true ? "on" : "off"; //className

    const fileRef = useRef(null);
    const [files, setFiles] = useState(
        parentProps.popupValue.fileList.map((file) => ({
            name: file.fileName,
            uid: file.fileSequenceNumber.toString()
        }))
    );

    const reqDateFormat = "YYYYMMDD";
    const disabled = parentProps.mode === "U" ? false : true;

    const code = localStorage.getItem("code") == null ? loadCode() : JSON.parse(localStorage.getItem("code"));
    const empDiv = code.filter((item) => item.groupCodeId === "EMP_DIV");

    const { getCompanyIdMutation } = ComboApi();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { popupValue, handleSave } = parentProps;
        if (isObjectEmpty(popupValue)) {
            modal.showAlert("알림", message.messageForEmpty);
        } else {
            const formData = new FormData();

            formData.delete("fileList");
            //insert file list //폼데이터에 달아줌
            files.filter((file) => file?.getRawFile instanceof Function).forEach((file) => formData.append("fileList", file.getRawFile()));

            //delete file list //popupValue에 달아줌 => driverModifyRequest에 들어갈 수 있게.
            const deleteFileList = [];
            const defaultFileSeqList = popupValue.fileList?.map((file) => file.fileSequenceNumber.toString()) ?? [];

            defaultFileSeqList.forEach(seq => {
                if(files.findIndex((file) => file.uid == seq) == -1) {
                    deleteFileList.push(seq);
                }
            })

            delete popupValue.deleteFileList;
            if(deleteFileList.length > 0) {
                popupValue.deleteFileList = deleteFileList
            }

            formData.append("driverModifyRequest", JSON.stringify(popupValue))
            handleSave(formData);
        }
    };

    return (
        <article className={`modal ${modalOnOff}`}>
            <div className="cmn_popup" style={{ width: "1320px" }}>
                <div className="popTit">
                    <h3>{title} 상세</h3>
                    <Link to={""} className="btnClose" onClick={parentProps.handleCancelButton} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="popCont">
                        <div className="popTbl">

                            <table className="tbl iptType02">
                                <colgroup>
                                    <col width="600px" />
                                    <col width="40px" />
                                    <col width="600px" />
                                </colgroup>

                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput
                                                    name={"driverName"}
                                                    required={true}
                                                    label={"기사명"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                    maxByte={100}
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput
                                                    name={"newEducationInstitutionName"}
                                                    label={"신규교육기관"}
                                                    parentProps={parentProps}
                                                    maxByte={100}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"기사 ID"} name={"driverId"} parentProps={parentProps} disabled={true} />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDatePicker
                                                    label={"신규교육일"}
                                                    parentProps={parentProps}
                                                    reqFormat={"YYYYMMDD"}
                                                    name={"newEducationYearMonthDay"}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDatePicker
                                                    label={"생년월일"}
                                                    parentProps={parentProps}
                                                    reqFormat={"YYYYMMDD"}
                                                    name={"birthDate"}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"신규교육이수여부"}
                                                    data={useYnComboData}
                                                    id="newEducationCompleteYn"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupCellPhoneInput
                                                    parentProps={parentProps}
                                                    label={"연락처"}
                                                    name={"mobilePhoneNumber"}
                                                    disabled={disabled}
                                                    maxByte={30}
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"신규교육대상"}
                                                    data={useYnComboData}
                                                    id="newEducationTargetYn"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"운수사"}
                                                    mutation={getCompanyIdMutation}
                                                    dataItemKey={"companyId"}
                                                    textField={"companyName"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput
                                                    name={"conserveEducationInstitutionName"}
                                                    label={"보수교육기관"}
                                                    parentProps={parentProps}
                                                    maxByte={100}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput
                                                    name={"employeeNumber"}
                                                    label={"사원번호"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                    maxByte={10}
                                                    valid={(value) => value.replace(RegExpTypes.NUMBER, "")}
                                                    placeholder={"사원번호를 입력해주세요 (숫자만 입력가능)"}
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDatePicker
                                                    label={"보수교육일"}
                                                    parentProps={parentProps}
                                                    reqFormat={"YYYYMMDD"}
                                                    name={"conserveEducationYearMonthDay"}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDatePicker
                                                    label={"입사일"}
                                                    reqFormat={"YYYYMMDD"}
                                                    name={"joinCompanyYearMonthDay"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"보수교육이수여부"}
                                                    data={useYnComboData}
                                                    id="conserveEducationCompleteYn"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDatePicker
                                                    label={"퇴사일"}
                                                    reqFormat={"YYYYMMDD"}
                                                    name={"resignYearMonthDay"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"보수교육대상"}
                                                    data={useYnComboData}
                                                    id="conserveEducationTargetYn"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput
                                                    name={"experienceEducationInstitutionName"}
                                                    label={"체험교육기관"}
                                                    parentProps={parentProps}
                                                    maxByte={100}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDatePicker
                                                    label={"체험교육일"}
                                                    parentProps={parentProps}
                                                    reqFormat={"YYYYMMDD"}
                                                    name={"experienceEducationYearMonthDay"}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"체험교육이수여부"}
                                                    data={useYnComboData}
                                                    id="experienceEducationCompleteYn"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeId"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"체험교육대상"}
                                                    data={useYnComboData}
                                                    id="experienceEducationTargetYn"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    parentProps={parentProps}
                                                    disabled={disabled}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                <tr>
                                    <td></td>
                                    <td rowSpan={"3"}></td>
                                    <td rowSpan={"3"}>
                                        <div className="cmn_pop_ipt">
                                            <PopupUpload
                                                label={"교육 이수 서류"}
                                                setFiles={setFiles}
                                                defaultFiles={files}
                                                fileRef={fileRef}
                                                mode={parentProps.mode}
                                                menuId={"MEN0000012"}
                                                mappingColumn01Value={parentProps.popupValue.driverId}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="popBtn">
                        <div className="btnWrap">
                            <PopupDetailButtons parentProps={parentProps} />
                        </div>
                    </div>
                </form>
            </div>
        </article>
    );
};

export default DriverInfoDetailPopup;
