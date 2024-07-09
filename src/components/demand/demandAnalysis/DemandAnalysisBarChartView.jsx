import DemandAnalysisMultiChart from "@/components/app/demand/demandAnalysis/DemandAnalysisMultiChart.jsx";

/**
 * 수요 분석 > 수요분석 바 차트 컴포넌트 view (행정동 별 승차/하차/환승, 정류장 별 승차/하차/환승)
 *
 * @author jewoo
 * @since 2024-06-03<br />
 */
const DemandAnalysisBarChartView = ({data, ...props}) => {
    //console.log("월별 이용 수요", data);
    const monthCategories= data?.previousYearDemandForUse?.map((item)=>{
        return(
            item?.thisYearMonth
        )
    });

    return (
        <div className="gridItem">
            <div className="contTop">
                <h2 className="contTit">월별 이용 수요</h2>
            </div>
            <div className="cont">
                <div>
                    <div className="mainChart">
                        <DemandAnalysisMultiChart
                            data={data}
                            categories={monthCategories}
                            style={{width: "100%", height: "190px"}}/>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default DemandAnalysisBarChartView;