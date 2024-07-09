import {Fragment, memo, useEffect} from "react";
import "hammerjs";
import DonutChart from "@/components/kendo/kendoChart/DonutChart.jsx";
import { getRandomColor } from "@/common/utils/DataTypeUtil.jsx";
/**
 * 수요 분석 > 통계 컴포넌트 : 도넛 차트 뷰
 *
 * @author jewoo
 * @since 2024-05-21<br />
 */
const TransportationIncomeAnalysisDonutChartView = ({className, data, id, value, unit, legendYn,chartTitle,  ...props}) => {
    
    useEffect(() => {
        //랜덤 색상 추가
        if(data){
            data.map((item, idx) =>{
                item["color"]=getRandomColor(idx);
            })
        }
    }, [data]);
    
    return (
        <div className={className}>
            <DonutChart
                data={data}
                style={{width: "152px", height: "152px",  border:"1px"}}
                id={id}
                value={value}
                legendYn={false}
                unit={unit}
                title={chartTitle || ''}
                toolTipYn={true}
            />
            <ul className="listLine">
                {data?.map((item, i) => {
                        return (<Fragment key={i}>
                            <li>
                                <span className="listName">{item[id] || ''}</span>
                                <span className="listTotal"><i
                                    className="txtNum">{item[value]?.toLocaleString() || 0}</i> {unit}</span>
                            </li>
                        </Fragment>)
                    }
                )}
            </ul>
        </div>
    )
}
export default memo(TransportationIncomeAnalysisDonutChartView);
