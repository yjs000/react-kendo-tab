import {useContext} from "react";
import {modalContext} from "@/common/components/Modal.jsx";
import {AuthApi} from "@/components/auth/AuthApi.js";
import {ComboApi} from "@/components/ComboApi.js";
import {isObjectEmpty} from "@/common/utils/Validation.jsx";
import message from "@/common/message.js";
import PopupInput from "@/common/components/popup/PopupInput.jsx";
import PopupPhoneInput from "@/common/components/popup/PopupPhoneInput.jsx";
import PopupCellphoneInput from "@/common/components/popup/PopupCellphoneInput.jsx";
import PopupDropDown from "@/common/components/popup/PopupDropDown.jsx";
import PopupDetailButtons from "@/common/components/popup/PopupDetailButtons.jsx";
import {Link} from "react-router-dom";


const OperatorInsertPopup = ({ parentProps, title, ...props }) => {
    const modal = useContext(modalContext);
    const modalOnOff = parentProps.popupShow === true ? "on" : "off"; //className

    const { getAuthUserIdMutation } = AuthApi();
    const { getCompanyIdMutation } = ComboApi();

    const handleSubmit = (e) => {
        e.preventDefault();
        const {popupValue, handleSave} = parentProps;

        if(isObjectEmpty(popupValue)) {
            modal.showAlert("알림", message.messageForEmpty);
        } else {
            handleSave();
        }
    };

    return (
        <article className={`modal ${modalOnOff}`}>
            <div className="cmn_popup" style={{ width: "680px" }}>
                <div className="popTit">
                    <h3>{title} 등록</h3>
                    <Link to={""} className="btnClose" onClick={parentProps.handleCancelButton} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="popCont">
                        <div className="popTbl">

                            <table className="tbl">
                                <colgroup>
                                    <col width="600px" />
                                </colgroup>

                                <tbody>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupInput label={"ID"} required={true} name={"userId"} parentProps={parentProps} maxByte={10}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupInput label={"이름"} required={true} name={"userName"} parentProps={parentProps} maxByte={100}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupPhoneInput label={"전화번호"} name={"telephoneNumber"} parentProps={parentProps} maxByte={30}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupCellphoneInput label={"휴대전화번호"} name={"mobilePhoneNumber"} parentProps={parentProps} maxByte={30}/>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupInput
                                                label={"직책"}
                                                name={"jobTitle"}
                                                parentProps={parentProps}
                                                required={false}
                                                maxByte={20}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupInput
                                                label={"부서"}
                                                name={"department"}
                                                parentProps={parentProps}
                                                required={false}
                                                maxByte={50}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupDropDown
                                                label={"권한"}
                                                mutation={getAuthUserIdMutation}
                                                required={true}
                                                dataItemKey={"authorityId"}
                                                textField={"authorityName"}
                                                parentProps={parentProps}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                {parentProps.popupValue.authorityId == "US-03" && <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupDropDown
                                                label={"운수사"}
                                                mutation={getCompanyIdMutation}
                                                required={true}
                                                dataItemKey={"companyId"}
                                                textField={"companyName"}
                                                parentProps={parentProps}
                                            />
                                        </div>
                                    </td>
                                </tr>}

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="popBtn">
                        <div className="btnWrap">
                            <PopupDetailButtons parentProps={parentProps}/>
                        </div>
                    </div>
                </form>
            </div>
        </article>
    );
};

export default OperatorInsertPopup;
