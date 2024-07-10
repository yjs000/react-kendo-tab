import {useContext, useRef, useState} from "react";
import {modalContext} from "@/common/components/Modal.jsx";
import {loadCode, useYnComboData} from "@/common/utils/CodeUtil.jsx";
import {ComboApi} from "@/components/ComboApi.js";
import {isObjectEmpty, RegExpTypes} from "@/common/utils/Validation.jsx";
import message from "@/common/message.js";
import PopupInput from "@/common/components/v1/popup/PopupInput.jsx";
import PopupDropDown from "@/common/components/v1/popup/PopupDropDown.jsx";
import PopupDetailButtons from "@/common/components/v1/popup/PopupDetailButtons.jsx";
import PopupDatePicker from "@/common/components/v1/popup/PopupDatePicker.jsx";
import PopupCellPhoneInput from "@/common/components/v1/popup/PopupCellphoneInput.jsx";
import PopupUpload from "@/common/components/v1/popup/PopupUpload.jsx";
import {Link} from "react-router-dom";

const code = localStorage.getItem("code") == null ? loadCode() : JSON.parse(localStorage.getItem("code"));
const empDiv = code.filter((item) => item.groupCodeId === "EMP_DIV");

const DriverInfoInsertPopup = ({ parentProps, title, ...props }) => {
    const modal = useContext(modalContext);
    const modalOnOff = parentProps.popupShow === true ? "on" : "off"; //className

    const fileRef = useRef(null);
    const [files, setFiles] = useState([]);

    const { getCompanyIdMutation } = ComboApi();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { popupValue, handleSave } = parentProps;

        if (isObjectEmpty(popupValue)) {
            modal.showAlert("알림", message.messageForEmpty);
        } else {
            const formData = new FormData();
            formData.append("driverCreateRequest", JSON.stringify(popupValue));
            files.forEach((file) => formData.append("fileList", file.getRawFile()));
            handleSave(formData);
        }
    };

    return (
        <article className={`modal ${modalOnOff}`}>
            <div className="cmn_popup" style={{ width: "1320px" }}>
                <div className="popTit">
                    <h3>{title} 등록</h3>
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
                                                    required={true}
                                                    name={"driverName"}
                                                    label={"기사명"}
                                                    parentProps={parentProps}
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
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown
                                                    label={"운수사"}
                                                    required={true}
                                                    mutation={getCompanyIdMutation}
                                                    dataItemKey={"companyId"}
                                                    textField={"companyName"}
                                                    parentProps={parentProps}
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



export default DriverInfoInsertPopup;
