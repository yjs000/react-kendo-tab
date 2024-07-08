import {Button} from "@progress/kendo-react-buttons";
import { Fragment, useContext, useEffect, useState } from "react";
import { TimePicker } from "@progress/kendo-react-dateinputs";
import CustomDropDownList from "@/components/kendo/CustomDropDownList.jsx";
import { RouteEditApi } from "@/components/app/businessPlan/routeEdit/RouteEditApi.jsx";
import { ComboApi } from "@/components/app/ComboApi.js";
import PopupDropDown from "@/components/common/popup/PopupDropDown.jsx";
import { modalContext } from "@/components/common/Modal.jsx";
import { isArray } from "@progress/kendo-react-common";
import CustomDefaultValueDropDownList from "@/components/kendo/CustomDefaultValueDropDownList.jsx";

let keyAdjust = 0; //화면 랜더링 시 평일/주말/기타 모두 같은 값으로 표시되는 에러 발생.
const RouteEditRouteTime = ({disabled, setRunTableShow, bizNum, stopInfo, setStopInfo, runSched, setRunSched, parentProps}) => {
    const [dayDiv, setDayDiv] = useState("wd"); //wd : weekday, we : weekend, et : etc

    //
    const modal = useContext(modalContext);

    //콤보
    // const [stopInfo, setStopInfo] = useState([]);

    //api
    const { getRouteNumberNameMutation } = ComboApi();
    const { getRouteEditBusStopTimeMutation, getRouteEditBusStopMutaion } = RouteEditApi();

    const [apiComplete1, setApiComplete1] = useState(false);
    const [apiComplete2, setApiComplete2] = useState(false);
    
    //최초 open시 데이터 형식 맞추기
    useEffect(()=>{
        if(!bizNum){
            return;
        }

        //api조회
        reqGetRouteEditBusStopMutaion();
    },[bizNum]);

    useEffect(()=>{
        if(apiComplete1){
            // 노선 시간표 api
            reqGetRouteEditBusStopTimeMutation();
        }
    },[apiComplete1])


    // 1. 한 노선에 대한 전체 정류장 콤보 api
    const reqGetRouteEditBusStopMutaion = () => {
        if(!parentProps?.popupValue?.routeId){
            return;
        }

        const param = {
            "databaseDivision": "edit",
            "routeId": parentProps.popupValue.routeId
        };

        if(getRouteEditBusStopMutaion){
            getRouteEditBusStopMutaion.mutateAsync(param).then((res) => {
                if (res?.status == "NS_OK") {
                    if(res.items.length > 0){
                        let result = res.items.map((item)=>{
                            let nameTmp = `${item.busStopSequenceNumber}.${item.busStopName}${item.mainViaPointYn==="Y"?"(주)":""}`;
                            return {...item, codeId:item.busStopSequenceNumber, codeName:nameTmp}
                        });

                        //다음 api
                        setStopInfo(result);
                        setApiComplete1(true);
                    }else{
                        modal.showAlert("알림", "정류장 데이터가 존재하지 않습니다.\n경로관리 > 노선편집 화면에서 지점을 추가해주세요."); // 성공 팝업 표출
                    }
                } else {
                    modal.showErrorAlert(res.status, res.detailMessage); //오류 팝업 표출
                }
            })
        }
    }
    
    const reqGetRouteEditBusStopTimeMutation = async () => {
        const param = {
            "businessPlanNumber": bizNum,
            "routeId": parentProps.popupValue.routeId
        };
        if(getRouteEditBusStopTimeMutation){
            getRouteEditBusStopTimeMutation.mutateAsync(param).then((res) => {
                if (res?.status == "NS_OK") {
                    if(res.items.length === 0){
                        runScheduleInit();
                    }else {
                        // const result = changeForm(res.items);
                        const resultAddSeq = res.items.map((item)=>{
                            let tmp = stopInfo.filter((item2)=>{return item.busStopId == item2.busStopId})[0];
                            if(!tmp?.busStopSequenceNumber){
                                modal.showAlert("알림", "정류장 데이터가 존재하지 않습니다("+item.busStopId+"/"+item.busStopName+").\n경로관리 > 노선편집 화면에서 지점을 추가해주세요.");
                            }
                            return {...item, busStopSequenceNumber : tmp.busStopSequenceNumber}
                        });
                        const result = changeForm(resultAddSeq);

                        setRunSched(result);
                    }

                } else {
                    modal.showErrorAlert(res?.status, res?.message); //오류 팝업 표출
                }
            });
        }
    }
    const runScheduleInit = () => {
        // 기점 / 종점 / 주요 노선 정보 필요
        const popVal = {...parentProps.popupValue};
        
        if(popVal?.startPointBusStopId === null || popVal?.startPointBusStopId === undefined || !popVal?.startPointBusStopId === "" ||
            popVal?.endPointBusStopId === null || popVal?.endPointBusStopId === undefined || !popVal?.endPointBusStopId === ""
        ){
            modal.showAlert("알림", "기점/종점 데이터가 존재하지 않습니다.\n경로관리 > 노선편집 화면에서 기점/종점을 설정해주세요.");
            return;
        }
        if( popVal?.startPointBusStopSequenceNumber === null || popVal?.startPointBusStopSequenceNumber === undefined || !popVal?.startPointBusStopSequenceNumber === "" ||
            popVal?.endPointBusStopSequenceNumber === null || popVal?.endPointBusStopSequenceNumber === undefined || !popVal?.endPointBusStopSequenceNumber === ""
        ){
            modal.showAlert("알림", "기점/종점의 순번 데이터가 존재하지 않습니다.\n경로관리 > 노선편집 화면에서 기점/종점을 설정해주세요.");
            return;
        }

        const mainStops = stopInfo.filter((item)=>{return item.mainViaPointYn === "Y"});
        
        const initRouteTimeData = [
            { "dayWeekDivision": "1", "runningSequenceNumber": 1, "routeDirection": "0", //"busStopTimeSequenceNumber": popVal.startPointBusStopSequenceNumber,
                "busStopSequenceNumber": popVal.startPointBusStopSequenceNumber, "busStopId": popVal.startPointBusStopId,"busStopName": popVal.startPointBusStopName,"arrivalPlannedTime": "00:00"},
            { "dayWeekDivision": "1", "runningSequenceNumber": 1, "routeDirection": "1", //"busStopTimeSequenceNumber": popVal.endPointBusStopSequenceNumber,
                "busStopSequenceNumber": popVal.endPointBusStopSequenceNumber, "busStopId": popVal.endPointBusStopId,"busStopName": popVal.endPointBusStopName,"arrivalPlannedTime": "00:00"},
        ];

        // let upCnt = 1;
        // let downCnt = 1; 
        mainStops.forEach((item)=>{
            const seqNum = Number(item.busStopSequenceNumber);
            if(Number(popVal.startPointBusStopSequenceNumber) < seqNum && seqNum < Number(popVal.endPointBusStopSequenceNumber)){
                initRouteTimeData.push({ "dayWeekDivision": "1", "runningSequenceNumber": 1, "routeDirection": "0",
                "busStopSequenceNumber": item.busStopSequenceNumber, "busStopId": item.busStopId,"busStopName": item.busStopName,"arrivalPlannedTime": "00:00"});
            }else if(Number(popVal.endPointBusStopSequenceNumber < seqNum)){
                initRouteTimeData.push({ "dayWeekDivision": "1", "runningSequenceNumber": 1, "routeDirection": "1",
                    "busStopSequenceNumber": item.busStopSequenceNumber, "busStopId": item.busStopId,"busStopName": item.busStopName,"arrivalPlannedTime": "00:00"});
            }
        })

        const result = changeForm(initRouteTimeData);
        setRunSched(result);
    }



    

    const changeForm = (data) => {
        const result = {
            wd: [],
            we: [],
            et: []
        };
        
        function findOrCreateSequenceEntry(sequenceArray, runningSequenceNumber) {
            let entry = sequenceArray.find(e => e.sequence === runningSequenceNumber);
            if (!entry) {
                entry = { sequence: runningSequenceNumber, up: [], down: [] };
                sequenceArray.push(entry);
            }
            return entry;
        }
        
        data.forEach(item => {
            if (item.dayWeekDivision === "1") {
                const direction = item.routeDirection === "0" ? "up" : "down";
                const sequenceEntry = findOrCreateSequenceEntry(result.wd, item.runningSequenceNumber);
                sequenceEntry[direction].push({
                    codeId: item.busStopSequenceNumber,
                    codeName: item.busStopName,
                    time: item.arrivalPlannedTime,

                    dayWeekDivision:item.dayWeekDivision,//주말
                    runningSequenceNumber:item.runningSequenceNumber,//회차
                    routeDirection:item.routeDirection,//상하행
                    busStopTimeSequenceNumber:item.busStopTimeSequenceNumber,//바스정류장 단순순번(0부터 순차적으로)

                    busStopSequenceNumber:item.busStopSequenceNumber,//버스정류장 전체 중 순번(ex) 400개 중 150번째)
                    busStopId:item.busStopId, //코드
                    busStopName:item.busStopName, //이름
                    arrivalPlannedTime:item.arrivalPlannedTime //시간
                });
            }else if(item.dayWeekDivision === "2"){
                const direction = item.routeDirection === "0" ? "up" : "down";
                const sequenceEntry = findOrCreateSequenceEntry(result.we, item.runningSequenceNumber);
                sequenceEntry[direction].push({
                    codeId: item.busStopSequenceNumber,
                    codeName: item.busStopName,
                    time: item.arrivalPlannedTime,

                    dayWeekDivision:item.dayWeekDivision,//주말
                    runningSequenceNumber:item.runningSequenceNumber,//회차
                    routeDirection:item.routeDirection,//상하행
                    busStopTimeSequenceNumber:item.busStopTimeSequenceNumber,//바스정류장 단순순번(0부터 순차적으로)
                    
                    busStopSequenceNumber:item.busStopSequenceNumber,//버스정류장 전체 중 순번(ex) 400개 중 150번째)
                    busStopId:item.busStopId, //코드
                    busStopName:item.busStopName, //이름
                    arrivalPlannedTime:item.arrivalPlannedTime //시간
                });
            }else if(item.dayWeekDivision === "3"){
                const direction = item.routeDirection === "0" ? "up" : "down";
                const sequenceEntry = findOrCreateSequenceEntry(result.et, item.runningSequenceNumber);
                sequenceEntry[direction].push({
                    codeId: item.busStopSequenceNumber,
                    codeName: item.busStopName,
                    time: item.arrivalPlannedTime,

                    dayWeekDivision:item.dayWeekDivision,//주말
                    runningSequenceNumber:item.runningSequenceNumber,//회차
                    routeDirection:item.routeDirection,//상하행
                    busStopTimeSequenceNumber:item.busStopTimeSequenceNumber,//바스정류장 단순순번(0부터 순차적으로)
                    
                    busStopSequenceNumber:item.busStopSequenceNumber,//버스정류장 전체 중 순번(ex) 400개 중 150번째)
                    busStopId:item.busStopId, //코드
                    busStopName:item.busStopName, //이름
                    arrivalPlannedTime:item.arrivalPlannedTime //시간
                });
            }
        });

        // Sort sequences in result.wd
        result.wd.sort((a, b) => a.sequence - b.sequence);
        return result;
    }

    const dayDivOnClick = (div) => {
        setDayDiv(div);
        return;
    }

    const changeRunSched = (div, event, _i, _upDown, _j) => {
        // let result = {...runSched};
        let result = {...runSched};
        let tmp = JSON.parse(JSON.stringify(result[dayDiv]));

        switch(div){
            case "addRound":{
                let roundFirst = JSON.parse(JSON.stringify(tmp[0])); //1회차를 가져온다.
                roundFirst?.up?.map((item)=>{item.time = "00:00"});
                roundFirst?.down?.map((item)=>{item.time = "00:00"});
                tmp.push(roundFirst);
                keyAdjust += 1000;
                break;
            }
            case "deleteRound":{
                // tmp = tmp.splice(_i,1);
                tmp = tmp.filter((_, idx)=>{
                    return _i !== idx;
                })
                keyAdjust += 1000;
                break;
            }
            // case "delRound":{
            //     tmp = tmp.slice(0, tmp.length-1);
            //     break;}
            case "copyFromWeekDay":{
                if (dayDiv === "we" || dayDiv === "et"){
                    tmp = JSON.parse(JSON.stringify(result?.wd));
                }else{
                    return;
                }
                keyAdjust += 1000;
                break;
            }
            case "editTime" : {
                tmp.map((a, i)=>{
                    if(i === _i){
                        a[_upDown].map((b, j)=>{
                            if(j === _j){
                                let tmpHour = event.value.getHours() < 10 ? "0"+event.value.getHours() : event.value.getHours()+"";
                                let tmpMin = event.value.getMinutes() < 10 ? "0"+event.value.getMinutes() : event.value.getMinutes()+"";
                                a[_upDown][j].time = tmpHour+":"+tmpMin; //{codeId: 1, codeName: '1.정류장1(주)', time: '09:33'}
                            }
                        })
                    }
                });
                keyAdjust += 1000;
                break;
            }
            case "editStop" : {
                tmp.map((a, i)=>{
                    if(i === _i){
                        //중복 체크
                        const isExist = a[_upDown].findIndex((b, j)=>{
                            return b.codeId == event.value.codeId; //{codeId: 1, codeName: '1.정류장1(주)', time: '09:33'}
                        })
                        if(isExist !== -1){
                            modal.showAlert("알림", "중복된 노선을 선택하셨습니다."); // 성공 팝업 표출
                            return;
                        }
                        //값 변경
                        a[_upDown].map((b, j)=>{
                            if(j === _j){
                                a[_upDown][j].codeId = event.value.codeId; //{codeId: 1, codeName: '1.정류장1(주)', time: '09:33'}
                            }
                        })
                    }
                });
                keyAdjust += 1000;
                break;
            }
            case "addMajorStop" : {
                tmp.map((a, i)=>{
                    a[_upDown].push({codeId: null, time: null});
                });
                keyAdjust += 1000;
                break;
            }
            case "deleteMajorStop": {
                tmp.map((a, i)=>{
                    a[_upDown] = a[_upDown].filter((b, j)=>{
                        if(j !== _j){
                            return b;
                        }
                    });
                    // if(i === _i){
                    //     a[_upDown] = a[_upDown].filter((b, j)=>{
                    //         if(j !== _j){
                    //             return b;
                    //         }
                    //     });
                    // }
                });
                keyAdjust += 1000;
                break;
            }
        }
        //onChange={()=>{changeRunSched("editTime", dayDiv, i, "up", j)}}
        result[dayDiv] = JSON.parse(JSON.stringify(tmp));
        setRunSched(result);
    }

    useEffect(()=>{
        if(runSched){
            parentProps.setPopupValue((prev)=>({...prev, runSched:runSched}))
        }
    },[runSched])

    return (
        <Fragment>
            <div className="popTbl">
                <h4 className="popContTit">운행 시간<Button type="button" className="btnS btnTxt" onClick={()=>{setRunTableShow(true)}}>배차 시간표 보기</Button></h4>
                <div className="btnWrap type02 mgB28">
                    <div className="btnWrapL">
                        <Button type="button" className={`btnS ${ dayDiv=="wd"?"btnType03":"btnTxt type02"}`} onClick={()=>{dayDivOnClick("wd")}}>평일</Button>
                        <Button type="button" className={`btnS ${ dayDiv=="we"?"btnType03":"btnTxt type02"}`}  onClick={()=>{dayDivOnClick("we")}}>공휴일(토, 일, 공휴일)</Button>
                        <Button type="button" className={`btnS ${ dayDiv=="et"?"btnType03":"btnTxt type02"}`} onClick={()=>{dayDivOnClick("et")}}>기타</Button>
                    </div>
                    <div className="btnWrapR">
                        <p className="btnCmt">*차량/기사별 배차는 ‘배차 코스 관리’에서 설정하실 수 있습니다.</p>
                        {disabled ? null : <Button type="button" className="btnS btnTxt" onClick={()=>{changeRunSched("copyFromWeekDay")}}>불러오기</Button>}
                    </div>
                </div>


                <div className="cardListWrap">
                    {runSched[dayDiv]?.map((itemWrap, i)=>{
                        let keyNum = keyAdjust;
                        if(dayDiv === "wd"){
                            keyNum += 10000;
                        } else if(dayDiv === "we"){
                            keyNum += 20000;
                        } else if(dayDiv === "et"){
                            keyNum += 30000;
                        }

                        return(
                            <div className="cardList" key={keyNum + i}>
                                <p className="cardNum" style={{width:"30px"}}></p>
                                <table className="cardCont" style={{width:"calc(100% - 102px)"}}>
                                <colgroup>
                                    <col width="70px"/>
                                    <col width="calc(100% - 114px)"/>
                                    <col width="44px"/>
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th className="fcGreen">상행</th>
                                        <td>
                                            <div className="cardIpt type02">
                                                {/* style={{width:"300px", whiteSpace:"nowrap",overflowX:"scroll"}} */}
                                                {itemWrap?.up?.map((item, j)=>{
                                                    return(
                                                    j === 0
                                                    ? <div key={keyNum + j}>
                                                        <div className="itpTit">기점 : {item.codeName}</div>
                                                        <TimePicker
                                                            // onChange={(e) => onChangeHandler(e, roopI, roopJ)}
                                                            required={false}
                                                            validationMessage='경유시간을 선택하세요'
                                                            format={"HH:mm"}
                                                            disabled={disabled}
                                                            defaultValue={new Date("2000","1","1",(item?.time||"00").slice(0,2), (item?.time||"00").slice(-2),"00")}
                                                            onChange={(event)=>{changeRunSched("editTime", event, i, "up", j)}}
                                                        />
                                                    </div>
                                                    : <div key={j} className={'disF'}>
                                                         {/* style={{background:"red", width:"200px", display:"flex"}} */}
                                                        <CustomDefaultValueDropDownList
                                                            data={stopInfo}
                                                            // id="codeId"
                                                            dataItemKey={"codeId"}
                                                            textField={"codeName"}
                                                            defaultValue={item?.codeId}
                                                            required={true}
                                                            disabled={disabled}
                                                            onChange={(event)=>{changeRunSched("editStop", event, i, "up", j)}}
                                                            />
                                                        <TimePicker
                                                            // onChange={(e) => onChangeHandler(e, roopI, roopJ)}
                                                            required={false}
                                                            validationMessage='경유시간을 선택하세요'
                                                            format={"HH:mm"}
                                                            disabled={disabled}
                                                            defaultValue={new Date("2000","1","1",(item?.time||"00").slice(0,2), (item?.time||"00").slice(-2),"00")}
                                                            onChange={(event)=>{changeRunSched("editTime", event, i, "up", j)}}
                                                        />
                                                        {disabled || i !== 0 //조회모드 || 행2번째 이상 = null
                                                        ? null
                                                        :<Button type="button" className="cardIconBtnS cardDelS" onClick={(event)=>{changeRunSched("deleteMajorStop", event, i, "up", j)}}>삭제</Button>
                                                        }
                                                    </div>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        {disabled || i !== 0 //조회모드 || 행2번째 이상 = null
                                        ? null
                                        : <td>
                                            <div className={"cardBtnWrap"}>
                                            {/* onChange={(event)=>{changeRunSched("addMajorStop", event, -1, "up", -1)}} */}
                                                <Button type="button" className="cardIconBtnS cardPlus" onClick={(event)=>{changeRunSched("addMajorStop", null ,null,"up",null)}}>추가</Button>
                                                {/* <Button type="button" className="btnS btnTxt type01">삭제</Button> */}
                                            </div>
                                        </td>}
                                    </tr>
                                    <tr>
                                        <th className="fcOrg">하행</th>
                                        <td>
                                            <div className="cardIpt type02">
                                                {itemWrap?.down?.map((item, j)=>{
                                                    return(
                                                    j === 0
                                                    ? <div style={{position:"relative"}} key={keyNum + j}>
                                                        <div className="itpTit">종점 : {item.codeName}</div>
                                                            <TimePicker
                                                                // onChange={(e) => onChangeHandler(e, roopI, roopJ)}
                                                                required={false}
                                                                validationMessage='경유시간을 선택하세요'
                                                                format={"HH:mm"}
                                                                disabled={disabled}
                                                                defaultValue={new Date("2000","1","1",(item?.time||"00").slice(0,2), (item?.time||"00").slice(-2),"00")}
                                                                onChange={(event)=>{changeRunSched("editTime", event, i, "down", j)}}
                                                            />
                                                        </div>
                                                    : <div key={keyNum + j} className={'disF'}>
                                                        <CustomDefaultValueDropDownList
                                                            data={stopInfo}
                                                            // id="codeId"
                                                            dataItemKey={"codeId"}
                                                            textField={"codeName"}
                                                            defaultValue={item?.codeId}
                                                            required={true}
                                                            disabled={disabled}
                                                            onChange={(event)=>{changeRunSched("editStop", event, i, "down", j)}}
                                                            />
                                                        <TimePicker
                                                            // onChange={(e) => onChangeHandler(e, roopI, roopJ)}
                                                            required={false}
                                                            validationMessage='경유시간을 선택하세요'
                                                            format={"HH:mm"}
                                                            disabled={disabled}
                                                            defaultValue={new Date("2000","1","1",(item?.time||"00").slice(0,2), (item?.time||"00").slice(-2),"00")}
                                                            onChange={(event)=>{changeRunSched("editTime", event, i, "down", j)}}
                                                        />
                                                        {disabled || i !== 0 //조회모드 || 행2번째 이상 = null
                                                        ? null
                                                        :<Button type="button" className="cardIconBtnS cardDelS" onClick={(event)=>{changeRunSched("deleteMajorStop", event, i, "down", j)}}>삭제</Button>
                                                        }
                                                    </div>
                                                    )
                                                })}
                                            </div>
                                        </td>
                                        {disabled || i !== 0 //조회모드 || 행2번째 이상 = null
                                        ? null
                                            // <td >
                                            //     <a href="#" className="btnClose">
                                            //         <span className="hidden">close</span>
                                            //     </a>
                                            // </td>
                                        : <td>
                                            <div className={"cardBtnWrap"}>
                                                <Button type="button" className="cardIconBtnS cardPlus" onClick={(event)=>{changeRunSched("addMajorStop", null ,null,"down",null)}}>추가</Button>
                                                {/* <Button type="button" className="btnS btnTxt type01">삭제</Button> */}
                                            </div>
                                        </td>}
                                    </tr>
                                </tbody>
                                </table>
                                
                                {disabled //조회모드 
                                ? null
                                : <Button type="button" className="cardIconBtn cardDel" onClick={()=>{changeRunSched("deleteRound",null,i)}}>삭제</Button>
                                }
                            </div>
                        )
                    })}

                    
                </div>
                {disabled
                ? null
                : <div className="btnWrap type01">
                    <Button type="button" className="btnM" themeColor={"primary"} onClick={()=>{changeRunSched("addRound")}}>추가하기</Button>
                    {/* <Button type="button" className="btnM btnTxt type01" themeColor={"primary"} onClick={()=>{changeRunSched("roundDel")}}>회차 삭제하기</Button> */}
                </div>}
                
            </div>
        </Fragment>
    );
};

export default RouteEditRouteTime;