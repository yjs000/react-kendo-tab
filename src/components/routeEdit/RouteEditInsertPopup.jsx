import { Fragment, useContext, useEffect, useState } from "react";
import { modalContext } from "@/components/common/Modal.jsx";
import { Button } from "@progress/kendo-react-buttons";
import { isObjectEmpty } from "@/common/utils/Validation.jsx";
import message from "@/components/common/message.js";
import PopupDetailButtons from "@/components/common/popup/PopupDetailButtons.jsx";
import PopupInput from "@/components/common/popup/PopupInput.jsx";
import PopupDropDown from "@/components/common/popup/PopupDropDown.jsx";
import { dbTypeComboData, useYnComboData } from "@/common/utils/CodeUtil.jsx";
import { RouteEditApi } from "@/components/app/businessPlan/routeEdit/RouteEditApi.jsx";
import { loadCode } from "@/common/utils/CodeUtil.jsx";

const RouteEditInsertPopup = ({ parentProps, title, ...props }) => {
    const [isNextPopup, setIsNextPopup] = useState(false);
    const [cloneData, setCloneData] = useState({});
    const [motherRoute, setMotherRoute] = useState([]);

    return (<Fragment>
        {isNextPopup === false
        ? <ChooseCloneRoute parentProps={parentProps} title={title}  setIsNextPopup={setIsNextPopup} setCloneData={setCloneData} setMotherRoute={setMotherRoute} props={props}/>
        : <RouteEditDetailPopupNext parentProps={parentProps} title={title} cloneData={cloneData} motherRoute={motherRoute} props={props}/>
        }
        </Fragment>
    )
}
const ChooseCloneRoute = ({ parentProps, title, setIsNextPopup, setCloneData, setMotherRoute, ...props }) => {
    const modalOnOff = parentProps.popupShow === true ? "on" : "off";
    const modal = useContext(modalContext);

    const {getRouteEditCloneRouteComboMutation, getRouteEditCloneRouteComboByBackupVersionMutation, getRouteEditCloneBackupVersionComboMutation,
        getRouteEditCloneMutation} = RouteEditApi();

    const [param, setParam] = useState({"databaseDivision":null, "versionId":null, "routeId":null});
    const [backVerComboList, setBackVerComboList] = useState([]);
    const [routeComboList, setRouteComboList] = useState([]);

    const editParam = (e, div) => {
        let tmp = {"databaseDivision":null, "versionId":null, "routeId":null};
        if(div === "databaseDivision"){
            tmp = {"databaseDivision":e.value.codeId, "versionId":null, "routeId":null};
        }else if(div === "versionId"){
            tmp = {...param, "versionId":e.value.versionId, "routeId":null};
        }else if(div === "routeId"){
            tmp = {...param, "routeId":e.value.routeId};
        }
        setParam(tmp);
    }

    useEffect(()=>{
        if(param?.databaseDivision === "backup"){
            //백업 list data 조회
            reqGetRouteEditCloneBackupVersionComboMutation();
            setRouteComboList([]);
        }else if(param?.databaseDivision === "edit" || param?.databaseDivision === "operation"){
            //노선 list data 조회
            reqGetRouteEditCloneRouteComboMutation();
        }
    }, [param?.databaseDivision])

    useEffect(()=>{
        if(param?.databaseDivision === "backup" && param?.versionId){
            //backup id를 가지고... 노선 list data 조회
            reqGetRouteEditCloneRouteComboByBackupVersionMutation();
        }
    }, [param?.versionId])



    const cloneData = () => {
        //예외체크
        if(!param?.databaseDivision || param?.databaseDivision === ""){
            modal.showAlert("알림", "복제하실 데이터를 선택해주세요.");
            return;
        }
        else if(param.databaseDivision === "edit" || param.databaseDivision === "operation"){
            if(!param?.routeId || param?.routeId === ""){
                modal.showAlert("알림", "복제하실 데이터를 선택해주세요.");
                return;
            }
        }else if(param.databaseDivision === "backup"){
            if(!param?.versionId || param?.versionId === "" || 
                !param?.routeId || param?.routeId === ""){
                modal.showAlert("알림", "복제하실 데이터를 선택해주세요.");
                return;
            }
        }

        reqCloneData();
    }
    const reqCloneData = () => {
        const payload = param;
        modal.showReqConfirm("노선", "복제", async () => {
            // api 조회 후
            const res = getRouteEditCloneMutation && (await getRouteEditCloneMutation.mutateAsync(payload));

            // setCloneData 및 setIsNextPopup
            if (res?.status == "NS_OK") {
                modal.showAlert("알림", res.message); // 성공 팝업 표출
                setCloneData(res.item);
                setMotherRoute(routeComboList);
                setIsNextPopup(true);
            } else {
                modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
            }
        });

    }

    const reqGetRouteEditCloneRouteComboMutation = async () =>{
        const payload = param;
        const res = getRouteEditCloneRouteComboMutation && (await getRouteEditCloneRouteComboMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            setRouteComboList(res.items);
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    }
    const reqGetRouteEditCloneBackupVersionComboMutation = async () => {
        const payload = {};
        const res = getRouteEditCloneBackupVersionComboMutation && (await getRouteEditCloneBackupVersionComboMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            setBackVerComboList(res.items);
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    }
    const reqGetRouteEditCloneRouteComboByBackupVersionMutation = async () => {
        const payload = {"versionId": param.versionId};
        const res = getRouteEditCloneRouteComboByBackupVersionMutation && (await getRouteEditCloneRouteComboByBackupVersionMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            setRouteComboList(res.items);
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    }

    return (
        <article className={`modal ${modalOnOff}`}>
            <div className="cmn_popup" style={{ width: "400px" }}>
                {/* 상단 */}
                <div className="popTit">
                    <h3>{title} 복제</h3>
                    <a href="#" className="btnClose" onClick={parentProps.handleCancelButton}>
                        <span className="hidden">close</span>
                    </a>
                </div>
                
                <div className="popCont">
                    <div>
                        <div className="popTbl">
                            {/* <h4 className="popContTit">실 노선번호을 선택해주세요</h4> */}
                            <table className="tbl iptCol2">
                                <colgroup>
                                    <col width="400px"/>
                                </colgroup>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown 
                                                    label={"DB"}
                                                    data={dbTypeComboData}
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    required={true}
                                                    parentProps={parentProps}
                                                    value={param.databaseDivision ? dbTypeComboData.find(a => a.codeId === param.databaseDivision) : null}
                                                    onChange={(e)=>{editParam(e,"databaseDivision")}}
                                                >
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>
                                    {param.databaseDivision === "backup" &&
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown 
                                                    label={"DB 버전"}
                                                    data={backVerComboList}
                                                    dataItemKey={"versionId"}
                                                    textField={"versionId"}
                                                    required={true}
                                                    parentProps={parentProps}
                                                    onChange={(e)=>{editParam(e,"versionId")}}
                                                    value={param.versionId ? backVerComboList.find(a => a.versionId === param.versionId) : null}
                                                    // onChange={(e) => {setParam(prev => ({...prev, versionId: e.value.id}))}}
                                                    >
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>}
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown 
                                                    label={"노선"}
                                                    data={routeComboList}
                                                    dataItemKey={"routeId"}
                                                    textField={"routeName"}
                                                    required={true}
                                                    parentProps={parentProps}
                                                    value={param.routeId ? routeComboList.find(a => a.routeId === param.routeId) : null}
                                                    // value={routeComboList.find(a => a.routeId === param.routeId)}
                                                    onChange={(e)=>{editParam(e,"routeId")}}
                                                    // onChange={(e) => {setRouteDropValue(e.value.id)}}
                                                    >
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* 하단 submit 버튼 */}
                <div className="popBtn">
                    <div className="btnWrap">
                        <Button type="button" className="btnL" themeColor={"primary"}
                                onClick={()=>{cloneData()}}
                                >복제하기
                        </Button>
                    </div>
                </div>
            </div>
        </article>
        )
}
const RouteEditDetailPopupNext = ({ parentProps, title, cloneData, motherRoute, ...props }) => {

    const modalOnOff = parentProps.popupShow === true ? "on" : "off";
    const modal = useContext(modalContext);

    //state
    const [isSupportRoute, setIsSupportRoute] = useState(false);

    //공통code
    const code = localStorage.getItem("code") == null ? loadCode() : JSON.parse(localStorage.getItem("code")); //코드값이 (어떠한오류로인해) 비어있으면 다시 부름.

    //api
    const {getRouteEditExceptionRouteSerialNumberMutaion} = RouteEditApi();
    
    //콤보
    const RGSPH_CD = code.filter((item) => item.groupCodeId === "RGSPH_CD").map((item)=>{return {"codeId":item.codeId, "codeName":`${item.codeId}(${item.codeName})`}}); //지역번호 콤보
    const RUNG_TYPE = code.filter((item) => item.groupCodeId === "RUNG_TYPE"); //운행 형태 콤보
    const ROUTE_TYPE = code.filter((item) => item.groupCodeId === "ROUTE_TYPE"); //노선 형태 콤보
    const routeId2ComboList = [
        {codeId: "0", codeName: "0(노선버스)"},
        {codeId: "9", codeName: "9(기타)"},
    ];

    useEffect(()=>{
        parentProps.setPopupValue({
            ...parentProps.popupValue, 
            // ...cloneData,
            // "runningStartDate":cloneData.runningStartDate.replaceAll("-","").replaceAll(":","").replaceAll(" ",""),
            // "runningEndDate":cloneData.runningStartDate.replaceAll("-","").replaceAll(":","").replaceAll(" ",""),
            "routeNumber":cloneData.routeNumber, 
            "routeName":cloneData.routeName, 
            "routeDescription":cloneData.routeDescription, 
            "routeType":cloneData.routeType, 
            "runningType":cloneData.runningType, 
            "wideAreaRouteYn":cloneData.wideAreaRouteYn, 
            "remark":cloneData.remark
            });
    }, []);

    useEffect(()=>{
        if(parentProps?.popupValue?.motherRouteId){
            setIsSupportRoute(true);
        }else{
            setIsSupportRoute(false);
            parentProps.setPopupValue((prev)=>({...prev, supportNumber : null}));
        }
    }, [parentProps?.popupValue?.motherRouteId]);

    //노선 ID
    useEffect(()=>{
        const val = parentProps?.popupValue;
        if(val?.routeNumber){
            const reg = /^\d{4}$/; //시작이 숫자4개인 정규식

            //노선번호가 9000이상, 문자/특수문자 포함, 기존 노선번호와 중복, 지원번호 10 이상, 모노선 일련번호가 90000번대
            if(val?.regionCode && val?.routeIdMeansNumber){
                if(parseInt(val?.routeNumber.padStart(4, "0")) < 9000
                    && reg.test(val?.routeNumber.padStart(4, "0")) 
                    && motherRoute.findIndex(v => v.routeName === val?.routeNumber) === -1 
                    && (val?.supportNumber || 0 ) < 10
                    && (!val?.motherRouteId || parseInt(val?.motherRouteId?.substring(4)||"0") < 90000))
                {
                    let serNo = val?.routeNumber.padStart(4, "0") + (val?.supportNumber || 0);
                    parentProps.setPopupValue((prev)=>({...prev, routeIdSerialNumber : serNo}));
                }else{
                    reqGetRouteEditExceptionRouteSerialNumberMutaion();
                }
            }
        }
    }, [parentProps?.popupValue?.routeNumber,
        parentProps?.popupValue?.regionCode, 
        parentProps?.popupValue?.routeIdMeansNumber, 
        parentProps?.popupValue?.supportNumber])
    
    //노선 명칭
    useEffect(()=>{
        let routeName = parentProps?.popupValue?.routeNumber??"";
        routeName = routeName + (parentProps?.popupValue?.supportNumber ? " 지원"+parentProps?.popupValue?.supportNumber : "");
        parentProps.setPopupValue((prev)=>({...prev, "routeName":routeName}))
    },[parentProps?.popupValue?.routeNumber,
        parentProps?.popupValue?.supportNumber])

    const reqGetRouteEditExceptionRouteSerialNumberMutaion = async () => {
        const payload = {"regionSphereCode": parentProps?.popupValue?.regionCode, "measNumber": parentProps?.popupValue?.routeIdMeansNumber};
        const res = getRouteEditExceptionRouteSerialNumberMutaion && (await getRouteEditExceptionRouteSerialNumberMutaion.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            if(res?.item?.SerialNumber){
                parentProps.setPopupValue((prev)=>({...prev, routeIdSerialNumber : res?.item?.SerialNumber}))
                // parentProps.setPopupValue({...parentProps.popupValue, routeIdSerialNumber : res?.item?.SerialNumber});
            }
            // setRouteComboList(res.items);
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        const { popupValue, handleSave } = parentProps;
        if(isObjectEmpty(popupValue)) {
            alert(message.messageForEmpty);
        } else {
            let newPopupValue = {...popupValue,
                "routeId" : popupValue.regionCode + popupValue.routeIdMeansNumber + popupValue.routeIdSerialNumber
            };
            delete newPopupValue.regionCode;
            delete newPopupValue.routeIdMeansNumber;
            delete newPopupValue.routeIdSerialNumber;

            handleSave(newPopupValue);
        }
    }





    return (
        <article className={`modal ${modalOnOff}`}>
            <div className="cmn_popup" style={{ width: "800px" }}>
                {/* 상단 */}
                <div className="popTit">
                    <h3>{title} 등록</h3>
                    <a href="#" className="btnClose" onClick={parentProps.handleCancelButton}>
                        <span className="hidden">close</span>
                    </a>
                </div>

                {/* 중단 */}
                <form onSubmit={handleSubmit}>
                    <div className="popCont">
                        <div className="popTbl">
                            

                        <table className="tbl">
                                <colgroup>
                                    <col width="500px"/>
                                    <col width="50px"/>
                                    <col width="500px"/>
                                    <col width="50px"/>
                                    <col width="500px"/>
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                            <PopupDropDown 
                                                label={"모노선"}
                                                data={motherRoute}
                                                id={"motherRouteId"}
                                                dataItemKey={"routeId"}
                                                textField={"routeName"}
                                                parentProps={parentProps}
                                            >
                                            </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"경유지"} name={"branchLineViaPoint"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"노선번호"} name={"routeNumber"} maxByte={4} required={true} parentProps={parentProps}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown 
                                                    label={"노선 ID"}
                                                    data={RGSPH_CD}
                                                    id={"regionCode"}
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    required={true}
                                                    parentProps={parentProps}
                                                >
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                        <td>{/*간격*/}</td>
                                        <td>
                                            <PopupDropDown
                                                data={routeId2ComboList}
                                                id={"routeIdMeansNumber"}
                                                dataItemKey={"codeId"}
                                                textField={"codeName"}
                                                required={true}
                                                parentProps={parentProps}
                                            >
                                            </PopupDropDown>
                                        </td>
                                        <td>{/*간격*/}</td>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput name={"routeIdSerialNumber"} style={{width:"100%"}} maxByte={100} disabled={true} required={true} placeholder="" parentProps={parentProps} />
                                                
                                                {/* value={`${routeIdSerialNumber||"0000"}${routeIdSupportNumber||"0"}`} */}
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"노선명칭"} name={"routeName"} maxByte={100} disabled={true} required={true} parentProps={parentProps} />
                                            </div>
                                        </td>
                                    </tr>

                                    {isSupportRoute
                                    ?<tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"지원번호"} name={"supportNumber"} required={isSupportRoute} maxByte={4} placeholder={""} parentProps={parentProps}/>
                                            </div>
                                        </td>
                                    </tr>
                                    :null}
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"노선 설명"} name={"routeDescription"}  required={true} maxByte={20} parentProps={parentProps}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupDropDown 
                                                    label={"노선 형태"}
                                                    data={ROUTE_TYPE}
                                                    id="routeType"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    required={true}
                                                    parentProps={parentProps}>
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                {/* <PopupInput label={"운행형태"} name={"runningType"} disabled={true} maxByte={100} parentProps={parentProps}/> */}
                                                <PopupDropDown 
                                                    label={"운행 형태"}
                                                    data={RUNG_TYPE}
                                                    id="runningType"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    required={true}
                                                    parentProps={parentProps}>
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"기점"} name={"startPointBusStopId"} parentProps={parentProps} maxByte={100}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"종점"} name={"endPointBusStopId"} parentProps={parentProps} maxByte={100}/>
                                            </div>
                                        </td>
                                    </tr> */}
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"회차지 순번"} name={"turnPointSequenceNumber"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                {/* <PopupInput label={"관할"} name={"competenceInstitutionName"} parentProps={parentProps} maxByte={100}/> */}
                                                <PopupDropDown 
                                                    label={"관할"}
                                                    data={RGSPH_CD}
                                                    id={"competenceInstitutionName"}
                                                    dataItemKey={"codeName"}
                                                    textField={"codeName"}
                                                    required={true}
                                                    parentProps={parentProps}
                                                >
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                {/* <PopupInput label={"광역구분"} name={"wideAreaRouteYn"} parentProps={parentProps} maxByte={100}/> */}
                                                <PopupDropDown 
                                                    label={"광역 구분"}
                                                    data={useYnComboData}
                                                    id="wideAreaRouteYn"
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    required={true}
                                                    parentProps={parentProps}>
                                                </PopupDropDown>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"버스대수"} name={"permitBusCount"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"소요시간"} name={"requiredTime"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"배차간격 최소"} name={"minimumAllocationOfCarsInterval"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"배차간격 최대"} name={"maximumAllocationOfCarsInterval"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    {/* <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"운행개시일"} name={"runningStartDate"} parentProps={parentProps} maxByte={100}/>
                                            </div>
                                        </td>
                                    </tr> */}
                                    {/* <tr>
                                        <td>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"운행종료일"} name={"runningEndDate"} parentProps={parentProps} maxByte={100}/>
                                            </div>
                                        </td>
                                    </tr> */}
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"운행거리"} name={"length"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"앱 노선"} name={"applicationRouteDescription"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"앱 회차지"} name={"applicationTurningPointDescription"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
                                    <tr>
                                        <td colSpan={5}>
                                            <div className="cmn_pop_ipt">
                                                <PopupInput label={"비고"} name={"remark"} parentProps={parentProps} maxByte={100}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5}>
                                            <span className="fcGreen">※ 경로관리 시스템의 노선편집 화면에서 세부적인 내용을 수정하실 수 있습니다.</span>
                                        </td>
                                    </tr>
                                    {/* <tr><td><div className="cmn_pop_ipt">
                                        <PopupInput label={"?"} name={"routeEditBusStopTimeCreateRequestList"} parentProps={parentProps} maxByte={100}/>
                                    </div></td></tr> */}
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
}
export default RouteEditInsertPopup;
