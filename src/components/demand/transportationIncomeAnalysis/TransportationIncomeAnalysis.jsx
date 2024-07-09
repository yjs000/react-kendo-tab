import {Fragment, memo, useEffect, useState} from "react";
import SearchFieldSearchBtn from "@/components/style/button/SearchFieldSearchBtn.jsx";
import GridData from "@/components/common/grid/GridData.jsx";
import { menuTitle } from "@/common/utils/DataTypeUtil.jsx";
import { useLocation } from "react-router-dom";
import SearchFieldComboBox from "@/components/common/searchField/SearchFieldComboBox.jsx";
import {ComboApi} from "@/components/app/ComboApi.js";
import TransportationIncomeAnalysisListItem from "@/components/app/demand/transportationIncomeAnalysis/TransportationIncomeAnalysisListItem.jsx";
import LineChart from "@/components/kendo/kendoChart/LineChart.jsx";
import {TransportationIncomeAnalysisApi} from "@/components/app/demand/transportationIncomeAnalysis/TransportationIncomeAnalysisApi.js"
import BarChart from "@/components/kendo/kendoChart/BarChart.jsx";
import TransportationIncomeAnalysisDonutChartView from "@/components/app/demand/transportationIncomeAnalysis/TransportationIncomeAnalysisDonutChartView.jsx";
import SearchFieldDatePickerRange from "@/components/common/searchField/SearchFieldDatePickerRange.jsx";

/**
 * 수요 분석 > 운송 수입금 분석
 *
 * @author jewoo
 * @since 2024-05-21<br />
 */
const TransportationIncomeAnalysis = (menu) => {
    const location = useLocation();
    const pathname = location.pathname;
    const TITLE_LIST = menuTitle(menu, pathname);
    const DATA_ITEM_KEY = "index";
    const SELECTED_FIELD = "selected";
    const MENU_TITLE = "운송 수입금"

    const { getTransportationIncomeAnalysisMutation} = TransportationIncomeAnalysisApi();
    const { getCompanyIdMutation } = ComboApi();
    const monthCategories=["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
    const [routeCategories,setRouteCategories]=useState([]);

    return (
        <GridData
            dataItemKey={DATA_ITEM_KEY}
            selectedField={SELECTED_FIELD}
            menuTitle={MENU_TITLE}
            searchMutation={getTransportationIncomeAnalysisMutation}
            renderItem={(props) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    props.handleSearch()
                }, []);


                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    let list =[];
                    props?.data?.data[0]?.routeTransportationCost?.map((item)=>{
                        list.push(item.routeNumber)
                    })
                    setRouteCategories(list);
                }, [props.data.data]);

                return (
                    <Fragment>
                        <article className="subTitWrap">
                            <p className="subStep">
                                <span>{TITLE_LIST[0]}</span>
                                <span>{TITLE_LIST[1]}</span>
                                {TITLE_LIST[2] !== "" && <span>{TITLE_LIST[2]}</span>}
                            </p>

                            <div className="subTit">
                                <h2 className="titTxt">{TITLE_LIST[2] !== "" ? TITLE_LIST[2] : TITLE_LIST[1]}</h2>
                            </div>
                        </article>

                        <article className="subContWrap">
                            <div className="subCont subContL">
                                <p className="txtTitL">분석 조건 설정</p>
                                <SearchFieldDatePickerRange
                                    label={"기간"}
                                    fieldName={"date"} // filter 컬럼명
                                    defaultValue={{ start:  new Date(new Date().getFullYear(),new Date().getMonth(), 1), end: new Date() }}
                                    required={true}
                                    format={"yyyyMMddHHmmss"}
                                    parentProps={props}
                                />
                                <div className="cmn_sub_ipt">
                                    <SearchFieldComboBox
                                        mutation={getCompanyIdMutation}
                                        label={"운수사"}
                                        // defaultValue="전체"
                                        dataItemKey={"companyId"}
                                        textField={"companyName"}
                                        parentProps={props}
                                    />
                                </div>
                                <SearchFieldSearchBtn parentProps={props}>조회하기</SearchFieldSearchBtn>
                            </div>

                            <div className="subCont subContR">
                                <div className="gridWrap grid_isa">
                                    {/* [ 운송 수입금 현황 ] */}
                                    <TransportationIncomeAnalysisListItem
                                        title={"운송 수입금 현황"}
                                        subTitle={"총 운송 수입금"}
                                        totalCount={props?.data?.data[0]?.transportationCost}
                                        data={props?.data?.data[0]?.companyByTransportationCost}
                                        id={"companyName"}
                                        value={"transportationIncome"}
                                        unit={"원"}
                                        parentProps={props}
                                    />
                                    {/* [ 할인 금액 ] */}
                                    <TransportationIncomeAnalysisListItem
                                        title={"할인 금액"}
                                        subTitle={"총 할인 금액"}
                                        totalCount={props?.data?.data[0]?.totalDiscountCost}
                                        data={props?.data?.data[0]?.typeByDiscountCost}
                                        id={"discountTypeName"}
                                        value={"discountCost"}
                                        unit={"원"}
                                        parentProps={props}
                                    />
                                    {/* [ 월별 운송 수입금 ] */}
                                    <LineChart
                                        title={"월별 운송 수입금"}
                                        data={props?.data?.data[0]?.monthTransportationCost}
                                        categories={monthCategories}
                                        parentProps={props}
                                        mode={"multiple"}
                                        xdataColume={"thisYearAmount"}
                                        ydataColume={"thisYearMonth"}
                                        xdataListColume={"MonthByIncome"}
                                        ydataListColume={"companyName"}
                                        unit={"원"}
                                        style={{width: "100%", height: "190px"}}
                                    />
                                    {/* [ 월별 할인 금액 ] */}
                                    <BarChart
                                        title={"월별 할인 금액"}
                                        data={props?.data?.data[0]?.monthDiscountCost}
                                        categories={monthCategories}
                                        parentProps={props}
                                        mode={"multiple"}
                                        xdataColume={"thisYearAmount"}
                                        ydataColume={"thisYearMonth"}
                                        xdataListColume={"MonthByDiscount"}
                                        ydataListColume={"discountTypeName"}
                                        style={{width: "100%", height: "190px"}}
                                        legendYn={true}
                                        stackYn={true}
                                        unit={"원"}
                                    />
                                    {/* [ 노선별 운송 수입금 ] */}
                                    <BarChart
                                        title={"노선별 운송 수입금"}
                                        data={props?.data?.data[0]?.routeTransportationCost}
                                        categories={routeCategories}
                                        parentProps={props}
                                        mode={"single"}
                                        xdataColume={"transportationIncome"}
                                        ydataColume={"routeNumber"}
                                        style={{width: "100%", height: "190px"}}
                                        popupYn={true}
                                        legendYn={false}
                                        stackYn={false}
                                        unit={"원"}
                                    />
                                    {/* [ 유형별 운송 수입금 ] */}
                                    <div className="gridItem">
                                        <div className="contTop">
                                            <h2 className="contTit">유형별 운송 수입금</h2>
                                        </div>
                                        <div className="cont chartCol2">
                                            <TransportationIncomeAnalysisDonutChartView
                                                className={"chartCol2"}
                                                data={props?.data?.data[0]?.typeByTransportationPayment}
                                                id={"paymentTypeName"}
                                                value={"transportationIncome"}
                                                unit={"원"}
                                                legendYn={false}
                                                chartTitle={"결제수단"}
                                            />
                                            <TransportationIncomeAnalysisDonutChartView
                                                className={"chartCol2"}
                                                data={props?.data?.data[0]?.typeByTransportationPassenger}
                                                id={"passengerTypeName"}
                                                value={"transportationIncome"}
                                                unit={"원"}
                                                legendYn={false}
                                                chartTitle={"연령"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Fragment>
                );
            }}
        />
    );
};

export default memo(TransportationIncomeAnalysis);
