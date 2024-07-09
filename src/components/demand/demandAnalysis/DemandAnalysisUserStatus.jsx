/**
 * 수요 분석 > 수요분석 이용객 현황
 * @author jewoo
 * @since 2024-05-21<br />
 */
const DemandAnalysisUserStatus = ({data, ...props}) => {
    //console.log("이용객 현황", data);
    return (
        <div className="gridItem">
            <div className="contTop">
                <h2 className="contTit">이용객 현황</h2>
            </div>
            <div className="cont col2 type01">
                <p className="totalLine">
                    <span className="totalName">총 이용객</span>
                    <span className="totalNum"><i>{data?.totalUser?.toLocaleString() || 0}</i> 명</span>
                </p>

                <ul className="listLine">
                    <li>
                        <span className="listName">평일 기본</span>
                        <span className="listTotal"><i className="txtNum">{data?.weekdayDefaultCount?.toLocaleString() || 0}</i> 명</span>
                    </li>
                    <li>
                        <span className="listName">평일 첨두</span>
                        <span className="listTotal"><i className="txtNum">{data?.weekdayPeakCount?.toLocaleString() || 0}</i> 명</span>
                    </li>
                    <li>
                        <span className="listName">휴일 기본</span>
                        <span className="listTotal"><i className="txtNum">{data?.holidayDefaultCount?.toLocaleString() || 0}</i> 명</span>
                    </li>
                    <li>
                        <span className="listName">휴일 첨두</span>
                        <span className="listTotal"><i className="txtNum">{data?.holidayPeakCount?.toLocaleString() || 0}</i> 명</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}
export default DemandAnalysisUserStatus;
