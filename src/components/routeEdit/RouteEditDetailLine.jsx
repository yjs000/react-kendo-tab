import { Fragment, useEffect, useState } from "react";
import { RouteEditApi } from "@/components/app/businessPlan/routeEdit/RouteEditApi.jsx";

const RouteEditDetailLine = ({ parentProps }) => {

    const lineTestData = (serverResult) => {
        const busStopList = serverResult.filter(item => item.pointDivision == "0")
        let arr = [];
        const CUT_COUNT = 6;// 노선 그려주기 위해 n개씩 자르기
        for (let i = 0; i <= busStopList.length; i += CUT_COUNT) {
            let tmp = busStopList.slice(i, i + CUT_COUNT)
            arr.push(tmp);
        }
        return { totalSize: busStopList?.length ?? 0, data: arr ?? [] };
    }

    const [beltData, setBeltData] = useState({totalSize: 0, data: []});

    const { getRouteEditRoutePointMutaion } = RouteEditApi();
    const { popupValue } = parentProps;
    let rotationPoint = null;

    useEffect(()=>{
        getRouteEditRoutePointMutaion.mutateAsync({ databaseDivision: "edit", routeId: popupValue.routeId }).then((res) => {
            const data = res?.items ?? [];
            rotationPoint = data.find(v => v.startPointEndPointDivision === "2")
            setBeltData(lineTestData(data));
        });

    },[]);

    const getColoredItemName = (item) => {
        //red : 상행 yellow : 하행
        if(rotationPoint) {
            return item.pointSequenceNumber < rotationPoint.pointSequenceNumber ? "itemName_red" : "itemName_yellow";
        } else {
            return "itemName_red"
        }
    }

    return (
        <div className="cmn_map_wrap" style={{height:"440px", overflow:"auto"}}>
            <div className="subContView">
                <div className="busLineWrap">

                    {beltData?.data?.map((_data, _i)=>{

                        return (
                            <Fragment key={_i}>
                                {/* 경유 정류소 줄단위 */}
                                <div className={_i == beltData?.data.length - 1 ? "busLine last" : "busLine"}>
                                    {/*  경유 정류소 */}
                                    {_data.map((v, i) => {
                                        // 이 정류소를 지나는 버스 목록
                                        return (
                                            <Fragment key={i}>
                                                <div className={_i == beltData?.data.length - 1 && i == _data.length - 1 ? "item last" : "item"}>
                                                    {/* 정류소명 및 아이콘 */}
                                                    {_i == '0' && i == '0' ?
                                                        <>
                                                            <span className="txtPoint fcYl">기점</span>
                                                            <p className="itemName"><span>{v.pointName}</span></p>
                                                        </>
                                                        :
                                                        <>
                                                            {_i == beltData?.data.length - 1 && i == _data.length - 1 ?
                                                                <>
                                                                    <span className="txtPoint fcYl">종점</span>
                                                                    <p className="itemName"><span>{v.pointName}</span></p>
                                                                </>
                                                                :
                                                                <p className={ getColoredItemName(v) }><span>{v.pointName}</span></p>
                                                            }
                                                        </>
                                                    }
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                    )}
                                    {_data.length < 6 ? //라인 한줄에 정류장이 10개 미만일경우 빈 div 채우기
                                        (
                                            Array(6 - _data.length).fill(0).map((_, i) => (
                                                <div className="item itemNone" key={i}></div>
                                            ))
                                        )
                                        : ""}
                                </div >
                            </Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
export default RouteEditDetailLine;