import {Fragment, useEffect, useRef, useState} from "react";
import {CustomOverlayMap, MapMarker, Polyline} from "react-kakao-maps-sdk";
import {RouteEditApi} from "@/components/routeEdit/RouteEditApi.jsx";
import CustomMap from "@/common/components/v1/map/CustomMap.jsx";

const Node = ({ points }) => {
    const point = points[0];

    return (
        <Fragment>
            <MapMarker
                title={`${point.pointName}(${point.pointId})`}
                position={{
                    lat: point.ycoordinate,
                    lng: point.xcoordinate
                }}
            />
            <CustomOverlayMap position={{ lat: point.ycoordinate, lng: point.xcoordinate }}>
                <div className="route route_01">{points.map((item) => item.pointSequenceNumber).join(":")}</div>
            </CustomOverlayMap>
        </Fragment>
    );
};
const BusStop = ({ point }) => {
    return (
        <Fragment>
            <MapMarker
                title={`${point.pointName}(${point.pointId})`}
                position={{
                    lat: point.ycoordinate,
                    lng: point.xcoordinate
                }}
            />
            <CustomOverlayMap position={{ lat: point.ycoordinate, lng: point.xcoordinate }}>
                <div className="route route_01">{point.pointSequenceNumber}</div>
            </CustomOverlayMap>
        </Fragment>
    );
};


const Map = () => {
    const mapRef = useRef(null);
    const [routePoints, setRoutePoints] = useState([]);
    const [vertexes, setVertexes] = useState([]);

    const routeId = '307090001';
    const { getRouteEditRoutePointMutaion, getRouteEditVertexMutaion } = RouteEditApi();

    useEffect(() => {
        getRouteEditRoutePointMutaion.mutateAsync({ databaseDivision: "edit", routeId: routeId }).then((res) => {
            setRoutePoints(res?.items ?? []);
        });

        getRouteEditVertexMutaion.mutateAsync({ databaseDivision: "edit", routeId: routeId }).then((res) => {
            setVertexes(res?.items ?? []);
        });
    }, []);

    useEffect(() => {
        if(routePoints?.length && mapRef?.current) {
            const bounds = new kakao.maps.LatLngBounds()
            routePoints
                .filter(point => point.xcoordinate && point.ycoordinate)
                .forEach((point) => {
                    bounds.extend(new kakao.maps.LatLng(point.ycoordinate, point.xcoordinate))
                })
            mapRef?.current?.setBounds(bounds)
        }
    }, [routePoints]);


    const routePointMarkers = routePoints.map((item, idx) => {
        return item.pointDivision === "0" ? ( //노드
            <Node key={idx} points={routePoints.filter((rp) => item.pointId == rp.pointId)} />
        ) : (
            <BusStop key={idx} point={item} />
        );
    });

    const polylinePath = vertexes.map((item) => item.vertexes.map((item) => ({ lng: item.xcoordinate, lat: item.ycoordinate })));

    return (
        <div className="cmn_map_wrap" style={{ height: "440px", overflow: "hidden" }}>
            <CustomMap
                mapRef={mapRef}
            >
                {routePointMarkers}
                <Polyline
                    path={polylinePath}
                    // strokeWeight={5} // 선의 두께 입니다
                    // strokeColor={"#FFAE00"} // 선의 색깔입니다
                    // strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle={"solid"} // 선의 스타일입니다
                />
            </CustomMap>
        </div>
    );
};

export default Map;
