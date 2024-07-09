import {useCallback} from "react";
import "hammerjs";
import {
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartLegend, ChartTooltip, ChartSeriesItemTooltip, ChartValueAxis, ChartValueAxisItem,
} from "@progress/kendo-react-charts";

/**
 * 수요 분석 > 수요분석 멀티 차트 (월별 이용 수요)
 * data : 차트 데이터
 * categories : 차트 카테고리
 * xdataColume : x축 데이터 기준 컬럼
 * ydataColume : y축 데이터 기준 컬럼
 * style : 차트 style
 * unit : tooltip에서 사용할 단위
 * @author jewoo
 * @since 2024-05-23<br />
 */
const DemandAnalysisMultiChart = ({
                       parentProps,
                       data,
                       categories,
                       style,
                       ...props
                   }) => {
    //console.log("MultiChart", data);

    /**
     * tooltip context
     */
    const tooltipRender = ({point}) => (
        <span>
          <>{point?.series.name  || ''} : {point?.value?.toLocaleString() || 0}{point?.series.unit  || ''}</>
        </span>
    );

    /**
     * y축 숫자일 경우 천단위 콤마
     */
    const createContent = useCallback(event => {
        if (typeof (event.value) == "number") {
            return event.value?.toLocaleString();
        }
        return null;
    }, []);


    /*전년도 값 list*/
    const previousYearData = data?.previousYearDemandForUse.map((item) => {
        return (
            item?.thisYearAmount
        )
    });
    /*해당년도 값 list*/
    const relevantYearData= data?.relevantYearDemandForUse.map((item)=>{
        return(
            item?.thisYearAmount
        )
    });
    /*전년대비 증감 값 list*/
    const increaseData = data?.increaseDemandForUse.map((item)=>{
        return(
            item?.comparedToPreviousYearIncreasePercent
        )
    });

    /**
     * multi value setting
     */
    const series = [
        {
            type: "column",
            data: previousYearData,
            name: "전년도",
           color: "#b9e047",
            axis: "won",
            unit: "원"
        },
        {
            type: "column",
            data: relevantYearData,
            name: "해당년도",
           color: "#63c38a",
            axis: "won",
            unit: "원"
        }
        ,{
            type: "line",
            data: increaseData,
            name: "전년대비 증감",
            color: "#159ebc",
            axis: "percent",
            unit: "%"
        }
    ];

    /**
     * multi axis setting
     */
    const valueAxis = [
        {
            name: "won",
            min: 0,
           // max: 60,
        },
        {
            name: "percent",
            min: -10,
            max: 10,
        }
    ];

    /**
     * 축 교차 값
     */
    const axisCrossingValue = [0, 32];  // 축 왼쪽, 오른쪽으로 표출

    //console.log("series", series);
    return (
        <Chart style={style}
               transitions={false}     /*animation disabled*/
        >
            <ChartLegend position="top"/>
            <ChartCategoryAxis>
                <ChartCategoryAxisItem
                    categories={categories}
                   // startAngle={45}
                   axisCrossingValue={axisCrossingValue}
                />
            </ChartCategoryAxis>
            <ChartTooltip/>
            <ChartSeries>
                {series.map((item, idx) => (
                    <ChartSeriesItem
                        key={idx}
                        type={item.type}
                        data={item.data}
                        name={item.name}
                        axis={item.axis}
                        unit={item.unit}
                        color={item.color}
                    >
                        <ChartSeriesItemTooltip render={tooltipRender}/>
                    </ChartSeriesItem>
                ))}
            </ChartSeries>
            <ChartValueAxis>
                {valueAxis.map((item, idx) => (
                    <ChartValueAxisItem
                        key={idx}
                        name={item.name}
                        min={item.min || null}
                        max={item.max || null}
                        labels={{
                            content: createContent  //천단위 콤마
                        }}
                    />
                ))}
            </ChartValueAxis>
        </Chart>
    )
}
export default DemandAnalysisMultiChart;
