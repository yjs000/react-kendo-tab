import {useSelector} from "react-redux";
import {useContext} from "react";
import {modalContext} from "@/common/components/Modal.jsx";
import {OperatorApi} from "@/components/operator/OperatorApi.js";
import {AuthApi} from "@/components/auth/AuthApi.js";
import {ComboApi} from "@/components/ComboApi.js";
import {isObjectEmpty} from "@/common/utils/Validation.jsx";
import message from "@/common/message.js";
import PopupPhoneInput from "@/common/components/v1/popup/PopupPhoneInput.jsx";
import PopupCellphoneInput from "@/common/components/v1/popup/PopupCellphoneInput.jsx";
import {useYnComboData} from "@/common/utils/CodeUtil.jsx";
import PopupDropDown from "@/common/components/v1/popup/PopupDropDown.jsx";
import PopupDetailButtons from "@/common/components/v1/popup/PopupDetailButtons.jsx";
import PopupInput from "@/common/components/v1/popup/PopupInput.jsx";
import {Button} from "@progress/kendo-react-buttons";
import {Link} from "react-router-dom";


const OperatorDetailPopup = ({ parentProps, title, ...props }) => {
    const modalOnOff = parentProps.popupShow === true ? "on" : "off"; //className
    const disabled = parentProps.mode === "U" ? false : true;
    const auth = useSelector((store) => store.auth);
    const modal = useContext(modalContext);

    const { passwordResetMutation } = OperatorApi();
    const { getAuthUserIdMutation } = AuthApi();
    const { getCompanyIdMutation } = ComboApi();

    const handleSubmit = (e) => {
        e.preventDefault();
        const { popupValue, handleSave } = parentProps;

        if (isObjectEmpty(popupValue)) {
            alert(message.messageForEmpty);
        } else {
            handleSave();
        }
    };

    const initPswd = (e) => {
        modal.showConfirm("알림",
            "정말 초기화하시겠습니까?", {
                btns: [
                    {
                        title: "취소",
                        background: "#75849a"
                    },
                    {
                        title: "초기화",
                        click: async () => {
                            try {
                                passwordResetMutation.mutateAsync({userId : parentProps.popupValue.userId}).then((res) => {
                                    if(res.status == "NS_OK") {
                                        modal.showAlert("알림", "초기화되었습니다.");
                                        // alert("초기화되었습니다.")
                                        parentProps.handleCancelButton();
                                        parentProps.handleSearch();
                                    } else {
                                        modal.showAlert("알림", "초기화에 실패했습니다.");
                                    }
                                });
                            } catch (err) {
                                modal.showAlert("알림", "초기화에 실패했습니다.");
                            }
                        }
                    }
                ]
            });
    }

    return (
        <article className={`modal ${modalOnOff}`}>
            <div className="cmn_popup" style={{ width: "680px" }}>
                <div className="popTit">
                    <h3>{title} 상세</h3>
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
                                            <PopupInput label={"ID"} name={"userId"} parentProps={parentProps} disabled={true} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupInput
                                                label={"이름"}
                                                required={true}
                                                name={"userName"}
                                                parentProps={parentProps}
                                                disabled={disabled}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupPhoneInput label={"전화번호"} name={"telephoneNumber"} disabled={disabled} parentProps={parentProps} />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupCellphoneInput label={"휴대전화번호"} name={"mobilePhoneNumber"} disabled={disabled} parentProps={parentProps} />
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
                                                disabled={disabled}
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
                                                disabled={disabled}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupDropDown
                                                label={"잠김여부"}
                                                data={useYnComboData}
                                                id={"lockedYn"}
                                                dataItemKey={"codeId"}
                                                textField={"codeName"}
                                                parentProps={parentProps}
                                                disabled={true}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="cmn_pop_ipt">
                                            <PopupDropDown
                                                label={"사용여부"}
                                                data={useYnComboData}
                                                required={true}
                                                id={"useYn"}
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
                                                label={"권한"}
                                                mutation={getAuthUserIdMutation}
                                                dataItemKey={"authorityId"}
                                                textField={"authorityName"}
                                                parentProps={parentProps}
                                                disabled={disabled}
                                                required={true}
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
                                                disabled={disabled}
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
                            {auth.user.userAuth == "AD_01" && (
                                <Button className={"btnL"} themeColor={"primary"} onClick={initPswd}>
                                    비밀번호초기화
                                </Button>
                            )}
                            <PopupDetailButtons parentProps={parentProps} />
                        </div>
                    </div>
                </form>
            </div>
        </article>
    );
};

export default OperatorDetailPopup;
