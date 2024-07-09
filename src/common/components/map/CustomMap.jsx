import { Fragment, memo } from "react";
import { Map, useKakaoLoader, ZoomControl } from "react-kakao-maps-sdk";


const CustomMap = ({
                       children,
                       mapRef = null,
                       ...props
                   }) => {
    useKakaoLoader();

    return (
        <Fragment>
            <Map
                ref={mapRef}
                center={{ lat: 35.9675044427494, lng: 126.73685366539058 }}
                isPanto={false}
                level={8}
                minLevel={10}
                maxLevel={1}
                style={{width: "100%", height: "calc(100vh - 201px)"}}
                {...props}
            >
                <ZoomControl position={"BOTTOMRIGHT"} />
                {children}
            </Map>
        </Fragment>
    );
};

export default memo(CustomMap);