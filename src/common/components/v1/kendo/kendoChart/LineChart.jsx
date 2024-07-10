import {useCallback, useEffect, useState} from "react";
import "hammerjs";
import {
    Chart,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartLegend, ChartTooltip, ChartSeriesItemTooltip, ChartValueAxis, ChartValueAxisItem,
} from "@progress/kendo-react-charts";
import { getRandomColor } from "@/common/utils/CommonUtil.jsx";

/**
 * 수요 분석 > 통계 컴포넌트 : 라인 차트
 *  title : 컴포넌트 제목
 *  data : 차트 데이터
 *  categories : 차트 카테고리
 *  xdataColume : x축 데이터 기준 컬럼
 *  ydataColume : y축 데이터 기준 컬럼
 *  xdataListColume : 다중 데이터 일 경우 x축 데이터 리스트 기준 컬럼
 *  ydataListColume : 다중 데이터 일 경우 y축 데이터 리스트 기준 컬럼
 *  mode : 데이터 single/muliti 구분
 *  style : 차트 style
 *  legendYn : legend 존재 여부
 *  unit : tooltip에서 사용할 단위
 * @author jewoo
 * @since 2024-05-21<br />
 */
const LineChart = ({
                       parentProps,
                       title,
                       data,
                       categories,
                       xdataColume,
                       ydataColume,
                       xdataListColume,
                       ydataListColume,
                       style,
                       mode,
                       unit,
                       ...props
                   }) => {

    const [chartList, setChartList] = useState([]);

    useEffect(() => {
        if (data) {
            // 단일 차트인 경우
            if (mode !== "multiple") {
                let list = [];
                data?.map((item) => {
                    list.push(item[xdataColume]);
                })
                setChartList(list);
            }
        }
    }, [data]);

    /**
     * tooltip context
     */
    const tooltipRender = ({point}) => (
        <span>
          <>{mode == "multiple"
              ? point?.series.name : point?.category || ''} : {point?.value?.toLocaleString() || 0}{unit}</>
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

    return (
        <div className="gridItem">
            <div className="contTop">
                <h2 className="contTit">{title || ''}</h2>
            </div>
            <div className="cont">
                <div>
                    <div className="mainChart">
                        <Chart style={style}
                               transitions={false}     /*animation disabled*/
                        >
                            <ChartValueAxis>
                                <ChartValueAxisItem
                                    labels={{
                                        content: createContent
                                    }}
                                />
                            </ChartValueAxis>
                            <ChartLegend position="top"/>
                            <ChartTooltip/>
                            <ChartSeries>
                                {mode == "multiple"
                                    ? data?.map((item, idx) => {
                                        let list = [];
                                        item[xdataListColume]?.map((data) => {
                                            list.push(data[xdataColume]);
                                        })
                                        return (
                                            <ChartSeriesItem
                                                type="line"
                                                name={item[ydataListColume]}
                                                key={item[ydataListColume]+idx}
                                                data={list}
                                                color={getRandomColor(idx)}
                                            >
                                                <ChartSeriesItemTooltip render={tooltipRender}/>
                                            </ChartSeriesItem>
                                        )
                                    })
                                    : <ChartSeriesItem
                                        type="line"
                                        name={ydataColume}
                                        key={ydataColume}
                                        data={chartList}
                                        color={getRandomColor(0)}>
                                        <ChartSeriesItemTooltip render={tooltipRender}/>
                                    </ChartSeriesItem>
                                }
                            </ChartSeries>
                            <ChartCategoryAxis>
                                <ChartCategoryAxisItem
                                    categories={categories}
                                />
                            </ChartCategoryAxis>
                        </Chart>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LineChart;
