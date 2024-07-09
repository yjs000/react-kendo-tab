import {useLocation} from "react-router-dom";
import {Fragment, useEffect, useState} from "react";

import {timeComboData} from "@/common/utils/CodeUtil.jsx";
import GridData from "@/common/components/grid/GridData.jsx";
import SearchFieldDatePickerRange from "@/common/components/searchField/SearchFieldDatePickerRange.jsx";
import SearchFieldComboBox from "@/common/components/searchField/SearchFieldComboBox.jsx";
import SearchFieldSearchBtn from "@/common/components/searchField/SearchFieldSearchBtn.jsx";
import DemandAnalysisUserStatus from "@/components/demand/demandAnalysis/DemandAnalysisUserStatus.jsx";
import BarChart from "@/common/components/kendo/kendoChart/BarChart.jsx";
import DemandAnalysisMultiChartView from "@/components/demand/demandAnalysis/DemandAnalysisMultiChartView.jsx";
import {DemandAnalysisApi} from "@/components/demand/demandAnalysis/DemandAnalysisApi.js";

/**
 * 수요 분석> 수요 분석
 *
 * @author jewoo
 * @since 2024-06-03<br />
 */
const Chart = (menu) => {
    const location = useLocation();
    const pathname = location.pathname;
    const TITLE_LIST = pathname.slice(1, pathname.length).split("/"); /*menuTitle(menu, pathname)*/ //menu에서 menuTitle을 꺼냄.
    const DATA_ITEM_KEY = "index";
    const SELECTED_FIELD = "selected";
    const MENU_TITLE = "수요 분석"

    const { getDemandAnalysisMutation, getDemandAdministrationMutation, getDemandBusStopMutation} = DemandAnalysisApi();

    /** 차트 카테고리 */
    const [routeCategories,setRouteCategories]=useState([]);
    const [busStopWaitingCategories,setBusStopWaitingCategories]=useState([]);
    const [administrationCategories,setAdministrationCategories]=useState([]);
    const [busStopCategories,setBusStopCategories]=useState([]);

    const [administrationData, setAdministrationData] = useState();          // 행정동 별 승차/하차/환승 데이터
    const [busStopData, setBusStopData] = useState();                        // 정류장 별 승차/하차/환승 데이터
    let [administrationFilter, setAdministrationFilter] = useState([]);   // 행정동 별 승차/하차/환승 필터
    let [busStopFilter, setBusStopFilter] = useState([]);                 // 정류장 별 승차/하차/환승 필터

    return (
        <GridData
            dataItemKey={DATA_ITEM_KEY}
            selectedField={SELECTED_FIELD}
            menuTitle={MENU_TITLE}
            searchMutation={getDemandAnalysisMutation}
            renderItem={(props) => {
                /**
                 * 행정동 별 승차/하차/환승 api조회
                 * */
                const searchAdministration = (payload) => {
                    // 행정동 별 승차/하차/환승 정보 조회
                    getDemandAdministrationMutation
                        .mutateAsync(payload)
                        .then((data) => {
                            setAdministrationData({ data: data?.items ?? [],...payload})
                        });
                }
                /**
                 * 정류장 별 승차/하차/환승 정보 api조회
                 * */
                const searchBusStop = (payload) => {
                    // 정류장 별 승차/하차/환승 정보 조회
                    getDemandBusStopMutation
                        .mutateAsync(payload)
                        .then((data) => {
                            setBusStopData({ data: data?.items ?? [] ,...payload})
                        })
                }

                /**
                 * 조회 버튼 클릭 시 행정동 별 승차/하차/환승, 정류장 별 승차/하차/환승 api 조회
                 * */
                const searchFunc=()=>{
                    // 행정동 별 승차/하차/환승 filter
                    let _administrationfilter =[];
                    props.filter.map((item)=>{
                        _administrationfilter.push(item);
                    })
                    if(administrationFilter?.length !==0){
                        _administrationfilter.push(administrationFilter[0]);
                    }
                    administrationFilter=[];    //초기화

                    // 정류장 별 승차/하차/환승 filter
                    let _busStopfilter =[];
                    props.filter.map((item)=>{
                        _busStopfilter.push(item);
                    })
                    if(busStopFilter?.length !==0){
                        _busStopfilter.push(busStopFilter[0]);
                    }
                    busStopFilter=[]; //초기화

                    // 조회버튼 클릭 시
                    searchAdministration({filter: _administrationfilter, sorter: props.sort});
                    searchBusStop({filter: _busStopfilter, sorter: props.sort});
                }

                /**
                 * defaultFilter
                 * */
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    props.handleSearch({filter: props.defaultFilter, sorter: props.sort})
                    searchAdministration({filter: props.defaultFilter, sorter: props.sort})
                    searchBusStop({filter: props.defaultFilter, sorter: props.sort})
                }, [props.defaultFilter]);

                /**
                 *차트 카테고리
                 * */
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    // [행정동 별 승차/하차/환승] 카테고리
                    let administrationList =[];
                    administrationData?.data?.map((data)=>{
                        data?.totalCountByDong?.map((item) => {
                            administrationList.push(item?.administrationStatutoryDong)
                        })
                    })
                    // 증복 제거
                    administrationList = administrationList.filter(
                        (items, idx, callback) =>
                            idx === callback.findIndex(
                                (items1) => items1 === items
                            )
                    )
                    setAdministrationCategories(administrationList);

                    // [정류장 별 승차/하차/환승] 카테고리
                    let busStopList =[];
                    busStopData?.data?.map((data)=>{
                        data?.totalCountByBusStop?.map((item) => {
                            busStopList.push(item?.busStop)
                        })
                    })
                    // 증복 제거
                    busStopList = busStopList.filter(
                        (items, idx, callback) =>
                            idx === callback.findIndex(
                                (items1) => items1 === items
                            )
                    )
                    setBusStopCategories(busStopList);

                    // [노선 별 이용 수요] 카테고리
                    let routeList =[];
                    props?.data?.data[0]?.routeByUseDemand?.map((item)=>{
                        routeList.push(item.routeNumber)
                    })
                    setRouteCategories(routeList);

                    // [정류장 별 평균 환승 대기시간] 카테고리
                    let busStopWaitingList =[];
                    props?.data?.data[0]?.averageWaitingTimeByBusStop?.map((item)=>{
                        busStopWaitingList.push(item.busStopName)
                    })
                    setBusStopWaitingCategories(busStopWaitingList);
                }, [props.data.data, administrationData, busStopData]);

                /**
                 *  행정동 별 승차/하차/환승 필터 선택시
                 * */
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    let _filter =[];
                    if(administrationFilter?.length !==0){
                        props.filter.map((item)=>{
                            _filter.push(item);
                        })
                        _filter.push(administrationFilter[0]);
                        searchAdministration({filter: _filter, sorter: props.sort})
                    }
                    administrationFilter=[];    //초기화
                }, [administrationFilter]);

                /**
                 *  정류장 별 승차/하차/환승 필터 선택시
                 * */
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    let _filter =[];
                    if(busStopFilter?.length !==0){
                        props.filter.map((item)=>{
                            _filter.push(item);
                        })
                        _filter.push(busStopFilter[0]);
                        searchBusStop({filter: _filter, sorter: props.sort})
                    }
                    busStopFilter=[];    //초기화
                }, [busStopFilter]);

                /**
                 * 필수 조회조건이 있을 경우 form 에서 onSubmit으로 클릭 이벤트
                 **/
                const clickEventFunc =(e) =>{
                    searchFunc(); // 행정동 별 승차/하차/환승, 정류장 별 승차/하차/환승 api조회
                    e.preventDefault(); // 필수값 체크
                    props.handleSearch(); // 조회
                }
                return (
                    <Fragment>
                        <article className="subTitWrap">
                            <p className="subStep">
                                {TITLE_LIST.map((title, idx) => (
                                    <span key={idx}>{title}</span>
                                ))}
                            </p>

                            <div className="subTit">
                                <h2 className="titTxt">{TITLE_LIST.at(-1)}</h2>
                            </div>
                        </article>

                        <article className="subContWrap">
                            <form onSubmit={(e) => clickEventFunc(e)}>
                                <div className="subCont subContL">
                                    <p className="txtTitL">분석 조건 설정</p>
                                    <div className="cmn_sub_ipt">
                                        <SearchFieldDatePickerRange
                                            label={"기간"}
                                            fieldName={"date"} // filter 컬럼명
                                            defaultValue={{
                                                start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                                end: new Date()
                                            }}
                                            required={true}
                                            format={"yyyyMMdd"}
                                            parentProps={props}
                                        />
                                    </div>
                                    <div className="cmn_sub_ipt">
                                        <SearchFieldComboBox
                                            label={"시간대"}
                                            operator={"between"}
                                            data={timeComboData}
                                            defaultItemValue={timeComboData[0]} //디폴트값 체크 필요!!!!!
                                            id="time"
                                            dataItemKey={"codeId"}
                                            textField={"codeName"}
                                            parentProps={props}
                                            required={true}
                                        />
                                    </div>
                                    <SearchFieldSearchBtn parentProps={props}
                                                          deleteOnClick={true}>조회하기</SearchFieldSearchBtn>
                                </div>
                            </form>
                            <div className="subCont subContR">
                                <div className="gridWrap grid_dsa">
                                    {/* [이용객 현황] */}
                                    <DemandAnalysisUserStatus data={props?.data?.data[0]?.userStatus}/>
                                    {/* [행정동 별 승차/하차/환승] */}
                                    <BarChart
                                        title={"행정동 별 승차/하차/환승"}
                                        data={administrationData?.data}
                                        categories={administrationCategories}
                                        parentProps={administrationData}
                                        mode={"multiple"}
                                        xdataColume={"dongCount"}
                                        ydataColume={"administrationStatutoryDong"}
                                        xdataListColume={"totalCountByDong"}
                                        ydataListColume={"dongByBoardingType"}
                                        style={{width: "100%", height: "190px"}}
                                        popupYn={true}
                                        legendYn={true}
                                        stackYn={false}
                                        dropDownYn={true}
                                        dropDownList={[
                                            {codeId: "0", codeName: "승차 많은 순"},
                                            {codeId: "1", codeName: "하차 많은 순"},
                                            {codeId: "2", codeName: "환승 많은 순"}
                                        ]}
                                        dropDownId={"boardingType"}
                                        unit={"명"}
                                        setFilter={setAdministrationFilter}
                                    />
                                    {/* [ 월별 이용 수요 ] */}
                                    <DemandAnalysisMultiChartView data={props?.data?.data[0]?.monthByUseDemand}/>
                                    {/* [정류장 별 승차/하차/환승] */}
                                    <BarChart
                                        title={"정류장 별 승차/하차/환승"}
                                        data={busStopData?.data}
                                        categories={busStopCategories}
                                        parentProps={props}
                                        mode={"multiple"}
                                        xdataColume={"busStopCount"}
                                        ydataColume={"busStop"}
                                        xdataListColume={"totalCountByBusStop"}
                                        ydataListColume={"busStopByBoardingType"}
                                        style={{width: "100%", height: "190px"}}
                                        popupYn={true}
                                        legendYn={true}
                                        stackYn={false}
                                        dropDownYn={true}
                                        dropDownList={[
                                            {codeId: "0", codeName: "승차 많은 순"},
                                            {codeId: "1", codeName: "하차 많은 순"},
                                            {codeId: "2", codeName: "환승 많은 순"}
                                        ]}
                                        dropDownId={"boardingType"}
                                        unit={"명"}
                                        setFilter={setBusStopFilter}
                                    />
                                    {/* [ 노선별 이용 수요 ] */}
                                    <BarChart
                                        title={"노선별 이용 수요"}
                                        data={props?.data?.data[0]?.routeByUseDemand}
                                        categories={routeCategories}
                                        parentProps={props}
                                        mode={"single"}
                                        xdataColume={"routeDemandForUse"}
                                        ydataColume={"routeNumber"}
                                        style={{width: "100%", height: "190px"}}
                                        popupYn={true}
                                        legendYn={false}
                                        stackYn={false}
                                        dropDownYn={false}
                                        unit={"회"}
                                    />
                                    {/* [ 정류장 별 평균 환승 대기시간 ] */}
                                    <BarChart
                                        title={"정류장 별 평균 환승 대기시간"}
                                        data={props?.data?.data[0]?.averageWaitingTimeByBusStop}
                                        categories={busStopWaitingCategories}
                                        parentProps={props}
                                        mode={"single"}
                                        xdataColume={"waitingTime"}
                                        ydataColume={"busStopName"}
                                        style={{width: "100%", height: "190px"}}
                                        popupYn={true}
                                        legendYn={false}
                                        stackYn={false}
                                        dropDownYn={false}
                                        unit={"시간"}
                                    />
                                </div>
                            </div>
                        </article>
                    </Fragment>
                );
            }}
        />
    );
};
export default Chart;