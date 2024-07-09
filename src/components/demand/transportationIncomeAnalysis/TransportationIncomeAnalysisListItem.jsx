import {Fragment} from "react";

/**
 * 수요 분석 > 통계 컴포넌트 : 리스트
 * title : 컴포넌트 제목
 * subTitle : subTitle
 * totalCount : 총 값
 * data : 리스트 데이터
 * id : 리스트 id
 * value : 리스트 값
 * unit : 단위
 * @author jewoo
 * @since 2024-05-21<br />
 */
const TransportationIncomeAnalysisListItem = ({parentProps, title, subTitle, totalCount, data, id, value, unit, ...props}) => {
    return (
        <div className="gridItem">
            <div className="contTop">
                <h2 className="contTit">{title || ''}</h2>
            </div>
            <div className="cont col2 type01">
                <p className="totalLine">
                    <span className="totalName">{subTitle || ''}</span>
                    <span className="totalNum"><i>{totalCount?.toLocaleString() || 0}</i> {unit}</span>
                </p>
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
        </div>
    )
}
export default TransportationIncomeAnalysisListItem;
