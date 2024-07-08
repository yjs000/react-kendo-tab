import { Fragment, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { menuTitle } from "@/common/utils/DataTypeUtil.jsx";
import { RouteEditApi } from "@/components/app/businessPlan/routeEdit/RouteEditApi.jsx";
import GridData from "@/components/common/grid/GridData.jsx";
import SearchFieldSearchBtn from "@/components/style/button/SearchFieldSearchBtn.jsx";
import SearchFieldComboBox from "@/components/common/searchField/SearchFieldComboBox.jsx";
import { loadCode } from "@/common/utils/CodeUtil.jsx";
import { useYnComboData } from "@/common/utils/CodeUtil.jsx";
import KendoGrid from "@/components/kendo/KendoGrid.jsx";
import { GridColumn as Column } from "@progress/kendo-react-grid";
import DetailButton from "@/components/common/grid/DetailButton.jsx";
import RouteEditDetailPopup from "@/components/app/businessPlan/routeEdit/RouteEditDetailPopup.jsx";
import RouteEditInsertPopup from "@/components/app/businessPlan/routeEdit/RouteEditInsertPopup.jsx";
import GridHeaderBtnPrimary from "@/components/style/button/GridHeaderBtnPrimary.jsx";
import GridHeaderBtnTxt from "@/components/style/button/GridHeaderBtnTxt.jsx";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import dayjs from "dayjs";
import { modalContext } from "@/components/common/Modal.jsx";
import {BusinessPlanApi} from "@/components/app/businessPlan/businessPlan/BusinessPlanApi.jsx";
import { ExcelApi } from "@/components/common/excel/ExcelApi.js";

const RouteEdit = (menu) => { 
    const location = useLocation();
    const pathname = location.pathname;
    const modal = useContext(modalContext);

    const TITLE_LIST = menuTitle(menu, pathname);
    const DATA_ITEM_KEY = "routeId"; //KendoGrid에서 유니크한 컬럼
    const SELECTED_FIELD = "selected";
    const MENU_TITLE = "노선";

    //API
    const { getRouteEditMutation, getRouteEditSummaryMutation, insertRouteEditMutation, updateRouteEditMutation, deleteRouteEditMutation } = RouteEditApi();
    const { getBusinessPlanCheck } = BusinessPlanApi();
    const { excelDownLoadMutation } = ExcelApi('route-edit');
    
    //filter 콤보박스
    const code = localStorage.getItem("code") == null ? loadCode() : JSON.parse(localStorage.getItem("code")); //코드값이 (어떠한오류로인해) 비어있으면 다시 부름.
    const RUNG_TYPE = code.filter((item) => item.groupCodeId === "RUNG_TYPE"); //운행 형태 콤보
    const ROUTE_TYPE = code.filter((item) => item.groupCodeId === "ROUTE_TYPE"); //노선 형태 콤보
    
    
    const [isBizPlanExist, setIsBizPlanExist] = useState(false);
    useEffect(()=>{
        reqGetBusinessPlanCheck();
    },[]);
    const reqGetBusinessPlanCheck = async () => {
        const param = {};
        const checkResult = getBusinessPlanCheck && await getBusinessPlanCheck.mutateAsync(param);
        if (checkResult.status == "NS_OK") {
            if(checkResult.item === "Y"){
                setIsBizPlanExist(true);
            }else{
                setIsBizPlanExist(false);
            }
        } else {
            modal.showErrorAlert(checkResult.status, checkResult.message); //오류 팝업 표출
            setIsBizPlanExist(false);
        }
    }

    return(
        <GridData
            multiSelect={true}
            dataItemKey={DATA_ITEM_KEY}
            selectedField={SELECTED_FIELD}
            menuTitle={MENU_TITLE}
            searchMutation={getRouteEditMutation}
            insertMutation={insertRouteEditMutation}
            updateMutation={updateRouteEditMutation}
            deleteMutation={deleteRouteEditMutation}
            summaryMutation={getRouteEditSummaryMutation}
            excelMutation={excelDownLoadMutation}
            type={"route-edit"}
            renderItem={(props) => {
                // // eslint-disable-next-line react-hooks/rules-of-hooks
                // useEffect(() => {
                //     props.setPopupShow(true)
                // }, [])
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    if(isBizPlanExist){
                        props.handleSearch();
                        props.handleSummarySearch();
                    }
                }, [props.defaultFilter, isBizPlanExist]);

                return(
                <Fragment>
                    <section>
                        {/* 상단 */}
                        <article className="subTitWrap">
                            <p className="subStep">
                            <span>{TITLE_LIST[0]}</span>
                            <span>{TITLE_LIST[1]}</span>
                            {TITLE_LIST[2] !== "" && <span>{TITLE_LIST[2]}</span>}
                        </p>
                            <div className="subTit">
                                <h2 className="titTxt">{TITLE_LIST[2] !== "" ? TITLE_LIST[2] : TITLE_LIST[1]}</h2>
                                <div className="btnWrap">
                                    {isBizPlanExist
                                    ?<>
                                        <p className="btnCmt fcBK_01">적용 사업계획 : 
                                            <i className="fcGreen">{props?.summaryData?.item?.businessPlanNumber||""}-{props?.summaryData?.item?.businessPlanName||""}</i>
                                            (시행일자 {props?.summaryData?.item?.businessPlanStartYearMonthDay||""})
                                        </p>
                                        <GridHeaderBtnPrimary onClick={props.handleInsert}>노선 복제</GridHeaderBtnPrimary>
                                        <GridHeaderBtnTxt onClick={props.handleDelete}>선택 노선 삭제</GridHeaderBtnTxt>
                                        <GridHeaderBtnTxt onClick={props.excelDownload}>엑셀 출력</GridHeaderBtnTxt>
                                    </>
                                    :<p className="btnCmt fcBK_01">적용 사업계획 없음</p>}
                                    
                                </div>
                            </div>
                        </article>

                        {/* 하단 */}
                        <article className="subContWrap">
                            {/* 왼쪽 : 필터 */}
                            <div className="subCont subContL">
                                <div className="cmn_sub_ipt">
                                    <p className="txtTit">운행 여부</p>
                                    <SearchFieldComboBox
                                        data={useYnComboData}
                                        id="runningYn"
                                        dataItemKey={"codeId"}
                                        textField={"codeName"}
                                        parentProps={props}
                                    />
                                </div>
                                <div className="cmn_sub_ipt">
                                    <p className="txtTit">운행 형태</p>
                                    <SearchFieldComboBox
                                        data={RUNG_TYPE}
                                        id="runningType"
                                        dataItemKey={"codeId"}
                                        textField={"codeName"}
                                        parentProps={props}
                                    />
                                </div>
                                <div className="cmn_sub_ipt">
                                    <p className="txtTit">노선 형태</p>
                                    <SearchFieldComboBox
                                        data={ROUTE_TYPE}
                                        id="routeType"
                                        dataItemKey={"codeId"}
                                        textField={"codeName"}
                                        parentProps={props}
                                    />
                                </div>
                                <div className="cmn_sub_ipt">
                                    <p className="txtTit">벽지노선 여부</p>
                                    <SearchFieldComboBox
                                        data={useYnComboData}
                                        id="remoteAreaRouteYn"
                                        dataItemKey={"codeId"}
                                        textField={"codeName"}
                                        parentProps={props}
                                    />
                                </div>
                                {isBizPlanExist
                                ? <SearchFieldSearchBtn parentProps={props}>조회하기</SearchFieldSearchBtn>
                                : null}
                                
                            </div>

                            {/* 오른쪽 */}
                            <div className="subCont subContR">
                                {/* summary */}
                                <div className="cmn_total_wrap">
                                        <div className="cmn_total">
                                            <span className="totlaName">운행</span>
                                            <span className="totalNum">{props?.summaryData?.item?.runningCount || 0}</span>
                                            <span className="txt">개</span>
                                        </div>
                                        <div className="cmn_total">
                                            <span className="totlaName">상/하행</span>
                                            <span className="totalNum">{props?.summaryData?.item?.normalCount || 0}</span>
                                            <span className="txt">개</span>
                                        </div>
                                        <div className="cmn_total">
                                            <span className="totlaName">순환</span>
                                            <span className="totalNum fcGreen">{props?.summaryData?.item?.circulationCount || 0}</span>
                                            <span className="txt">개</span>
                                        </div>
                                        <div className="cmn_total">
                                            <span className="totlaName">벽지노선</span>
                                            <span className="totalNum fcRed">{props?.summaryData?.item?.remoteAreaRouteCount || 0}</span>
                                            <span className="txt">개</span>
                                        </div>
                                    </div>

                                    {/* grid */}
                                    <div className="cmn_gird_wrap">
                                        <p className="totalTxt">
                                            총 <i className="fcGreen">{props?.data?.totalSize || 0}</i>개
                                        </p>
                                        <div id="grid_01" className="cmn_grid">
                                            <ExcelExport data={props.data.data} ref={props._export} fileName={MENU_TITLE + dayjs().format("YYYYMMDD")}>
                                            <KendoGrid parentProps={props}>
                                                <Column field={"routeId"} title={""} width={"0px"} hidden={true}/>
                                                <Column field={"routeNumber"} title={"노선 번호"} />
                                                <Column field={"updateDate"} title={"변경 일자"} />
                                                <Column field={"runningYn"} title={"운행 여부"} />
                                                <Column field={"runningTypeName"} title={"운행 형태"} />
                                                <Column field={"remoteAreaRouteYn"} title={"벽지노선 여부"} />
                                                <Column field={"routeTypeName"} title={"노선 형태"} />
                                                <Column field={"startPointBusStopName"} title={"기점"} />
                                                <Column field={"endPointBusStopName"} title={"종점"} />
                                                <Column field={"length"} title={"운행거리(상행편도)"} width={"160px"}/>
                                                <Column field={"requiredTime"} title={"소요 시간"} />
                                                <Column
                                                    sortable={false}
                                                    field={"custom"}
                                                    title={"상세"}
                                                    cell={(cellProps) => <DetailButton gridProps={props} cellProps={cellProps} />}
                                                />
                                            </KendoGrid>
                                            </ExcelExport>
                                        </div>
                                    </div>
                                </div>
                        </article>
                    </section>

                    {props.popupShow ? (
                        props.mode === "I" ? (
                            <RouteEditInsertPopup parentProps={props} title={MENU_TITLE} />
                        ) : (
                            <RouteEditDetailPopup parentProps={props} title={MENU_TITLE} />
                        )
                    ) : null}
                </Fragment>);
            }}>
        </GridData>

    );
}
export default RouteEdit;