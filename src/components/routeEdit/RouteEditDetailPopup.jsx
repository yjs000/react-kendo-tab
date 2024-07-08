import { useContext, useEffect, useState } from "react";
import { modalContext } from "@/components/common/Modal.jsx";
import { isObjectEmpty } from "@/common/utils/Validation.jsx";
import message from "@/components/common/message.js";
import PopupDetailButtons from "@/components/common/popup/PopupDetailButtons.jsx";
import PopupInput from "@/components/common/popup/PopupInput.jsx";
import PopupDropDown from "@/components/common/popup/PopupDropDown.jsx";
import { useYnComboData } from "@/common/utils/CodeUtil.jsx";
import { RouteEditApi } from "@/components/app/businessPlan/routeEdit/RouteEditApi.jsx";
import { ComboApi } from "@/components/app/ComboApi.js";
import { loadCode } from "@/common/utils/CodeUtil.jsx";
import RouteEditRunningTable from "@/components/app/businessPlan/routeEdit/RouteEditRunningTable.jsx";
import RouteEditRouteTime from "@/components/app/businessPlan/routeEdit/RouteEditRouteTime.jsx";
import RouteEditDetailMap from "@/components/app/businessPlan/routeEdit/RouteEditDetailMap.jsx";
import RouteEditDetailLine from "@/components/app/businessPlan/routeEdit/RouteEditDetailLine.jsx";
import RouteEditRouteTimeTable from "@/components/app/businessPlan/routeEdit/RouteEditRouteTimeTable.jsx";
import {RadioButton} from "@progress/kendo-react-inputs";

const RouteEditDetailPopup = ({ parentProps, title, ...props }) => { 
    const modalOnOff = parentProps.popupShow === true ? "on" : "off";
    const disabled = parentProps.mode === "U" ? false : true;
    const modal = useContext(modalContext);

    //state
    // const [isSupportRoute, setIsSupportRoute] = useState(false);
    const [motherRoute, setMotherRoute] = useState([]);
    const [mapDiv, setMapDiv] = useState("gis");
    const [runTableShow, setRunTableShow] = useState(false);
    const [runSched, setRunSched] = useState({});

    //공통code
    const code = localStorage.getItem("code") == null ? loadCode() : JSON.parse(localStorage.getItem("code")); //코드값이 (어떠한오류로인해) 비어있으면 다시 부름.

    //api
    const {
        getRouteEditSummaryMutation,
        getRouteEditExceptionRouteSerialNumberMutaion,
        getRouteEditDetailMutation,
        getRouteEditRunningCountMutation,
        getRouteEditVehicleCountMutation
    } = RouteEditApi();
    const { getRouteNumberNameMutation } = ComboApi();

    //콤보
    const RGSPH_CD = code
        .filter((item) => item.groupCodeId === "RGSPH_CD")
        .map((item) => {
            return { codeId: item.codeId, codeName: `${item.codeId}(${item.codeName})` };
        }); //지역번호 콤보
    const RUNG_TYPE = code.filter((item) => item.groupCodeId === "RUNG_TYPE"); //운행 형태 콤보
    const ROUTE_TYPE = code.filter((item) => item.groupCodeId === "ROUTE_TYPE"); //노선 형태 콤보
    const routeId2ComboList = [
        { codeId: "0", codeName: "0(노선버스)" },
        { codeId: "9", codeName: "9(기타)" }
    ];
    const [bizNum, setBizNum] = useState("");
    const [stopInfo, setStopInfo] = useState([]);
    const [runningCount, setRunningCount] = useState([
        // //예시
        // {
        //     "businessPlanNumber": 0,
        //     "routeId": "307000850",
        //     "dayWeekDivision": "1",
        //     "basicRunningCount": 11,
        //     "occhighRunningCount": 22
        // },{
        //     "businessPlanNumber": 0,
        //     "routeId": "307000850",
        //     "dayWeekDivision": "2",
        //     "basicRunningCount": 33,
        //     "occhighRunningCount": 44
        // },{
        //     "businessPlanNumber": 0,
        //     "routeId": "307000850",
        //     "dayWeekDivision": "3",
        //     "basicRunningCount": 55,
        //     "occhighRunningCount": 66
        // },
    ]);
    const [vehicleCount, setVehicleCount] = useState([
        // //예시
        // {
        //     "businessPlanNumber": 0,
        //     "routeId": "307000850",
        //     "dayWeekDivision": "1",
        //     "basicRunningVehicleCount": 99,
        //     "occhighRunningVehicleCount": 88
        // },
        // {
        //     "businessPlanNumber": 0,
        //     "routeId": "307000850",
        //     "dayWeekDivision": "2",
        //     "basicRunningVehicleCount": 77,
        //     "occhighRunningVehicleCount": 66
        // },
        // {
        //     "businessPlanNumber": 0,
        //     "routeId": "307000850",
        //     "dayWeekDivision": "3",
        //     "basicRunningVehicleCount": 55,
        //     "occhighRunningVehicleCount": 44
        // },
    ]);

    const changeMapDiv = (e) => {
        setMapDiv(e.value);
    }

    useEffect(() => {
        //모노선 콤보
        reqGetRouteNumberNameMutation();

        //detail 조회
        reqGetRouteEditDetailMutation();
        reqGetRouteEditSummaryMutation(); //사업번호 조회
    }, []);

    useEffect(() => {
        if (bizNum !== "" && bizNum) {
            reqGetRouteEditRunningCountMutation();
            reqGetRouteEditVehicleCountMutation();
        }
    }, [bizNum]);

    // useEffect(() => {
    //     if (parentProps?.popupValue?.motherRouteId) {
    //         setIsSupportRoute(true);
    //     } else {
    //         setIsSupportRoute(false);
    //         parentProps.setPopupValue((prev) => ({ ...prev, supportNumber: null }));
    //     }
    // }, [parentProps?.popupValue?.motherRouteId]);

    //노선 ID
    useEffect(() => {
        const val = parentProps?.popupValue;
        if (val?.routeNumber) {
            const reg = /^\d{4}$/; //시작이 숫자4개인 정규식

            //노선번호가 9000이상, 문자/특수문자 포함, 기존 노선번호와 중복, 지원번호 10 이상, 모노선 일련번호가 90000번대
            if (val?.regionCode && val?.routeIdMeansNumber) {
                if (
                    parseInt(val?.routeNumber.padStart(4, "0")) < 9000 &&
                    reg.test(val?.routeNumber.padStart(4, "0")) &&
                    motherRoute.findIndex((v) => v.routeName === val?.routeNumber) === -1 &&
                    (val?.supportNumber || 0) < 10 &&
                    (!val?.motherRouteId || parseInt(val?.motherRouteId?.substring(4) || "0") < 90000)
                ) {
                    let serNo = val?.routeNumber.padStart(4, "0") + (val?.supportNumber || 0);
                    parentProps.setPopupValue((prev) => ({ ...prev, routeIdSerialNumber: serNo }));
                } else {
                    reqGetRouteEditExceptionRouteSerialNumberMutaion();
                }
            }
        }
    }, [
        parentProps?.popupValue?.routeNumber,
        parentProps?.popupValue?.regionCode,
        parentProps?.popupValue?.routeIdMeansNumber,
        parentProps?.popupValue?.supportNumber
    ]);

    //노선 명칭
    useEffect(() => {
        let routeName = parentProps?.popupValue?.routeNumber ?? "";
        routeName = routeName + (parentProps?.popupValue?.supportNumber ? " 지원" + parentProps?.popupValue?.supportNumber : "");
        parentProps.setPopupValue((prev) => ({ ...prev, routeName: routeName }));
    }, [parentProps?.popupValue?.routeNumber, parentProps?.popupValue?.supportNumber]);

    const reqGetRouteEditExceptionRouteSerialNumberMutaion = async () => {
        const payload = { regionSphereCode: parentProps?.popupValue?.regionCode, measNumber: parentProps?.popupValue?.routeIdMeansNumber };
        const res = getRouteEditExceptionRouteSerialNumberMutaion && (await getRouteEditExceptionRouteSerialNumberMutaion.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            if (res?.item?.SerialNumber) {
                parentProps.setPopupValue((prev) => ({ ...prev, routeIdSerialNumber: res?.item?.SerialNumber }));
                // parentProps.setPopupValue({...parentProps.popupValue, routeIdSerialNumber : res?.item?.SerialNumber});
            }
            // setRouteComboList(res.items);
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    };

    const reqGetRouteNumberNameMutation = async () => {
        const payload = {};
        const res = getRouteNumberNameMutation && (await getRouteNumberNameMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            if (res?.items) {
                setMotherRoute(res.items);
            }
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    };

    const reqGetRouteEditDetailMutation = async () => {
        const payload = { routeId: parentProps.popupValue.routeId };
        const res = getRouteEditDetailMutation && (await getRouteEditDetailMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            if (res?.item) {
                parentProps.setPopupValue((prev) => ({ ...prev, ...res.item }));
            }
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    };

    const reqGetRouteEditSummaryMutation = async () => {
        const payload = {};
        const res = getRouteEditSummaryMutation && (await getRouteEditSummaryMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            if (res?.item?.businessPlanNumber) {
                setBizNum(res?.item?.businessPlanNumber);
            }
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    };

    const reqGetRouteEditRunningCountMutation = async () => {
        const payload = { businessPlanNumber: bizNum, routeId: parentProps.popupValue.routeId };
        const res = getRouteEditRunningCountMutation && (await getRouteEditRunningCountMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            if (res?.items) {
                setRunningCount(res?.items);
            }
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    };

    const reqGetRouteEditVehicleCountMutation = async () => {
        const payload = { businessPlanNumber: bizNum, routeId: parentProps.popupValue.routeId };
        const res = getRouteEditVehicleCountMutation && (await getRouteEditVehicleCountMutation.mutateAsync(payload));
        if (res?.status == "NS_OK") {
            if (res?.items) {
                setVehicleCount(res?.items);
            }
        } else {
            modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { popupValue, handleSave } = parentProps;
        if (isObjectEmpty(popupValue)) {
            alert(message.messageForEmpty);
        } else {
            const newPopupValue = {...parentProps.popupValue};
            let data = newPopupValue.runSched;

            let runSchedList = [];
            ["wd","we","et"].map((wkDiv, w)=>{
                data[wkDiv].map((round, r)=>{
                    let tmp = {};
                    tmp.routeId = parentProps.popupValue.routeId;
                    tmp.dayWeekDivision = (w+1).toString();
                    tmp.runningSequenceNumber = (r+1).toString();
                    round.up.map((item, i)=>{
                        tmp.routeDirection = "0";
                        tmp.busStopTimeSequenceNumber = (i+1).toString();
    
                        tmp.busStopSequenceNumber = item.codeId;
                        tmp.busStopId = stopInfo.filter((stopItem)=>{return stopItem.busStopSequenceNumber === item.codeId})[0].busStopId; //find
                        tmp.arrivalPlannedTime = (item.time??"00:00").replaceAll(":","");
                        runSchedList.push({...tmp});
                    })
                    round.down.map((item, i)=>{
                        tmp.routeDirection = "1";
                        tmp.busStopTimeSequenceNumber = (i+1).toString();
    
                        tmp.busStopSequenceNumber = item.codeId;
                        tmp.busStopId = stopInfo.filter((stopItem)=>{return stopItem.busStopSequenceNumber === item.codeId})[0].busStopId; //find
                        tmp.arrivalPlannedTime = (item.time??"00:00").replaceAll(":","");

                        runSchedList.push({...tmp});
                    })
                })
            })
            newPopupValue.routeEditBusStopTimeModifyRequestList = runSchedList;
            handleSave(newPopupValue);

            // 테스트 데이터
            // const tmp = [
            //     {routeId:parentProps.popupValue.routeId,
            //     dayWeekDivision:"1",
            //     runningSequenceNumber:"1",
            //     routeDirection:"0",
            //     busStopTimeSequenceNumber:"1",

            //     busStopSequenceNumber:"1",
            //     busStopId:"307000964",
            //     arrivalPlannedTime:"1022"
            //     },
            //     {routeId:parentProps.popupValue.routeId,
            //     dayWeekDivision:"1",
            //     runningSequenceNumber:"1",
            //     routeDirection:"1",
            //     busStopSequenceNumber:"100",
            //     busStopTimeSequenceNumber:"1",
            //     busStopId:"307001587",
            //     arrivalPlannedTime:"1355"
            //     }];
            // newPopupValue.routeEditBusStopTimeModifyRequestList = tmp;

            // handleSave(newPopupValue);
        }
    };

    return (
        <article className={`modal ${modalOnOff}`}>
            <div className="cmn_popup" style={{width: "1700px"}}>
                {/* 상단 타이틀 */}
                <div className="popTit">
                    <h3>{title} 상세</h3>
                    <a href="#" className="btnClose" onClick={parentProps.handleCancelButton}>
                        <span className="hidden">close</span>
                    </a>
                </div>

                {/* 중단 */}
                <form onSubmit={handleSubmit}>
                    <div style={{display:"flex"}}>
                        {/* 중단 좌측 */}
                        <div className="popCont" style={{width: "50%"}}>
                        <div className="popTbl">
                                {/* 노선 정보 */}
                                <h4 className="popContTit">노선 정보</h4>
                                <table className="tbl iptCol2" >
                                    <colgroup>
                                        <col width="500px" />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        label={"모노선"}
                                                        name={"motherRouteId"}
                                                        maxByte={20}
                                                        disabled={true}
                                                        parentProps={parentProps}
                                                    />
                                                    {/* <PopupDropDown
                                                        label={"모노선"}
                                                        data={motherRoute}
                                                        // mutation={getRouteNumberNameMutation}
                                                        id={"motherRouteId"}
                                                        dataItemKey={"routeId"}
                                                        textField={"routeName"}
                                                        disabled={disabled}
                                                        parentProps={parentProps}
                                                    ></PopupDropDown> */}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        label={"노선번호"}
                                                        name={"routeNumber"}
                                                        maxByte={4}
                                                        disabled={true}
                                                        parentProps={parentProps}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        label={"노선ID"}
                                                        name={"routeId"}
                                                        maxByte={20}
                                                        disabled={true}
                                                        parentProps={parentProps}
                                                    />
                                                </div>
                                            </td>
                                            {/* <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupDropDown
                                                        label={"노선 ID"}
                                                        data={RGSPH_CD}
                                                        id={"regionCode"}
                                                        dataItemKey={"codeId"}
                                                        textField={"codeName"}
                                                        required={true}
                                                        disabled={disabled}
                                                        parentProps={parentProps}
                                                    ></PopupDropDown>
                                                </div>
                                            </td>
                                            <td></td>
                                            <td>
                                                <PopupDropDown
                                                    data={routeId2ComboList}
                                                    id={"routeIdMeansNumber"}
                                                    dataItemKey={"codeId"}
                                                    textField={"codeName"}
                                                    required={true}
                                                    disabled={disabled}
                                                    parentProps={parentProps}
                                                ></PopupDropDown>
                                            </td>
                                            <td></td>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        name={"routeIdSerialNumber"}
                                                        style={{ width: "100%" }}
                                                        maxByte={100}
                                                        disabled={true}
                                                        required={true}
                                                        placeholder=""
                                                        parentProps={parentProps}
                                                    />
                                                </div>
                                            </td> */}
                                        </tr>

                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        label={"노선명칭"}
                                                        name={"routeName"}
                                                        maxByte={100}
                                                        disabled={true}
                                                        parentProps={parentProps}
                                                    />
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        label={"지원번호"}
                                                        name={"supportNumber"}
                                                        disabled={true}
                                                        maxByte={100}
                                                        placeholder={""}
                                                        parentProps={parentProps}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        label={"노선 설명"}
                                                        name={"routeDescription"}
                                                        required={true}
                                                        maxByte={20}
                                                        disabled={disabled}
                                                        parentProps={parentProps}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupDropDown
                                                        label={"노선 형태"}
                                                        data={ROUTE_TYPE}
                                                        id="routeType"
                                                        dataItemKey={"codeId"}
                                                        textField={"codeName"}
                                                        required={true}
                                                        disabled={disabled}
                                                        parentProps={parentProps}
                                                    ></PopupDropDown>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupDropDown
                                                        label={"운행 형태"}
                                                        data={RUNG_TYPE}
                                                        id="runningType"
                                                        dataItemKey={"codeId"}
                                                        textField={"codeName"}
                                                        required={true}
                                                        disabled={disabled}
                                                        parentProps={parentProps}
                                                    ></PopupDropDown>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupDropDown
                                                        label={"관할"}
                                                        data={RGSPH_CD}
                                                        id={"competenceInstitutionName"}
                                                        dataItemKey={"codeName"}
                                                        textField={"codeName"}
                                                        required={true}
                                                        disabled={disabled}
                                                        parentProps={parentProps}
                                                    ></PopupDropDown>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupDropDown
                                                        label={"광역 구분"}
                                                        data={useYnComboData}
                                                        id="wideAreaRouteYn"
                                                        dataItemKey={"codeId"}
                                                        textField={"codeName"}
                                                        required={true}
                                                        disabled={disabled}
                                                        parentProps={parentProps}
                                                    ></PopupDropDown>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="cmn_pop_ipt">
                                                    <PopupInput
                                                        label={"비고"}
                                                        name={"remark"}
                                                        parentProps={parentProps}
                                                        disabled={disabled}
                                                        maxByte={200}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="fcGreen">
                                                    ※ 경로관리 시스템의 노선편집 화면에서 세부적인 내용을 수정하실 수 있습니다.
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="decoLine"></div>

                                {/*운행정보 테이블*/}
                                <RouteEditRunningTable runningCount={runningCount} vehicleCount={vehicleCount} />

                                <div className="decoLine"></div>

                                {/*운행시간표*/}
                                <RouteEditRouteTime disabled={disabled} setRunTableShow={setRunTableShow} bizNum={bizNum} stopInfo={stopInfo} setStopInfo={setStopInfo} 
                                                    runSched={runSched} setRunSched={setRunSched} parentProps={parentProps}/>

                            </div>
                        </div>

                        {/* 중단 우측 */}
                        <div className="popCont bgGrey" style={{width: "50%", overflow:"hidden"}}>

                        <div className="popTbl">
                        <h4 className="popContTit">노선 경로</h4>
                        <div className="disF flexB mgB24">
                            <div className="radioBox">
                                <RadioButton label={"GIS 노선"}
                                                name={"mapDiv"}
                                                id={"gis"}
                                                value={"gis"}
                                                // parentProps={props}
                                                checked={mapDiv === "gis"}
                                                onChange={(e)=>{changeMapDiv(e)}}
                                                />
                                <RadioButton label={"띠노선"}
                                                name={"mapDiv"}
                                                id={"line"}
                                                value={"line"}
                                                // parentProps={props}
                                                checked={mapDiv === "line"}
                                                onChange={(e)=>{changeMapDiv(e)}}
                                                />
                            </div>
                        </div>
                            {mapDiv === "gis"
                            ? <RouteEditDetailMap parentProps={parentProps}/>
                            : <RouteEditDetailLine parentProps={parentProps} />}
                            </div>
                        </div>
                    </div>




                    {/* 기존 소스 가져오기 위해 ...지수님 소스 일단 주석처리
                    <div className="popCont type01">
                        <div className={"col2"}>
                            <div className="popTbl w600">
                                <h4 className="popContTit">노선 경로</h4>

                                <div className="disF flexB mgB40">
                                    <div className="radioBox">
                                        <input type="radio" id="radio_01" name="radio" />
                                        <label htmlFor="radio_01">GIS 노선</label>
                                        <input type="radio" id="radio_02" name="radio" />
                                        <label htmlFor="radio_02">띠노선</label>
                                    </div>
                                    <p className="totalTxtPop mgB0">
                                        노선 캡쳐 목록 <i>3</i> 개
                                    </p>
                                </div>
                                <div className="cmn_map_wrap">
                                    <CustomMap />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    
                    <div className="popBtn">
                        <div className="btnWrap">
                            <PopupDetailButtons parentProps={parentProps} />
                        </div>
                    </div>
                </form>
            </div>
            {runTableShow
            ? <RouteEditRouteTimeTable runTableShow={runTableShow} setRunTableShow={setRunTableShow} runSched={runSched} setRunSched={setRunSched}/>
            : null}
        </article>
    );
};
export default RouteEditDetailPopup;
