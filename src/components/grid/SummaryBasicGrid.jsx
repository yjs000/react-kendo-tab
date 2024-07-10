import {useSelector} from "react-redux";
import dayjs from "dayjs";
import useDidMountEffect from "@/hooks/useDidMountEffect.jsx";
import {loadCode, useYnComboData} from "@/common/utils/CodeUtil.jsx";
import {useLocation} from "react-router";
import {DriverApi} from "@/components/driver/DriverApi.js";
import {ComboApi} from "@/components/ComboApi.js";
import GridData from "@/common/components/v1/grid/GridData.jsx";
import {Fragment} from "react";
import ButtonPrimary from "@/common/components/v1/buttons/ButtonPrimary.jsx";
import SearchFieldComboBox from "@/common/components/v1/searchField/SearchFieldComboBox.jsx";
import SearchFieldInput from "@/common/components/v1/searchField/SearchFieldInput.jsx";
import SearchFieldSearchBtn from "@/common/components/v1/searchField/SearchFieldSearchBtn.jsx";
import KendoGrid from "@/common/components/v1/kendo/KendoGrid.jsx";
import {GridColumn as Column} from "@progress/kendo-react-grid";
import DetailButton from "@/common/components/v1/grid/DetailButton.jsx";
import DriverInfoInsertPopup from "@/components/driver/DriverInfoInsertPopup.jsx";
import DriverInfoDetailPopup from "@/components/driver/DriverInfoDetailPopup.jsx";

/**
 * 기사 관리
 *
 * @author jisu
 * @since 2024-04-26<br />
 */

// //코드값이 (어떠한오류로인해) 비어있으면 다시 부름.
const code = localStorage.getItem("code") == null ? loadCode() : JSON.parse(localStorage.getItem("code"));
const empDiv = code.filter((item) => item.groupCodeId === "EMP_DIV");

const SummaryBasicGrid = (menu) => {
    const location = useLocation();
    const pathname = location.pathname;

    const TITLE_LIST = pathname.slice(1, pathname.length).split("/"); /*menuTitle(menu, pathname)*/ //menu에서 menuTitle을 꺼냄.
    const DATA_ITEM_KEY = "driverId";
    const SELECTED_FIELD = "selected";
    const MENU_TITLE = "기사"

    const auth = useSelector((store) => store.auth);

    const { getDriverMutation, insertDriverMutation, updateDriverMutation, deleteDriverMutation, getDriverSummary } = DriverApi();
    const { getCompanyIdMutation } = ComboApi();

    return (
        <GridData
            dataItemKey={DATA_ITEM_KEY}
            selectedField={SELECTED_FIELD}
            menuTitle={MENU_TITLE}
            searchMutation={getDriverMutation}
            insertMutation={insertDriverMutation}
            updateMutation={updateDriverMutation}
            deleteMutation={deleteDriverMutation}
            summaryMutation={getDriverSummary}
            renderItem={(props) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useDidMountEffect(() => {
                    props.handleSearch();
                    props.handleSummarySearch();
                }, [props.defaultFilter]);

                const initialSummary = {
                    "workCount": 0,
                    "educationTargetYnYCount": 0,
                    "educationCompleteYnNCount": 0
                }

                const summary = props?.summaryData?.item ?? initialSummary;

                return (
                    <Fragment>
                        <article className="subTitWrap">
                            <p className="subStep">
                                {TITLE_LIST.map((title, idx) => (
                                    <span key={idx}>{title}</span>
                                ))}
                            </p>

                            <div className="subTit">
                                <h2 className="titTxt">{TITLE_LIST.at(-1)}</h2>
                                <div className="btnWrap">
                                    {auth.user.userAuth == "US-01" || auth.user.userAuth == "US-02" ? (
                                        null
                                    ) : <ButtonPrimary onClick={props.handleInsert}>등록</ButtonPrimary>}
                                    {/*<GridHeaderBtnTxt onClick={props.handleDelete}>삭제</GridHeaderBtnTxt>*/}
                                </div>
                            </div>
                        </article>

                        <article className="subContWrap">
                            <div className="subCont subContL">
                                <div className="cmn_sub_ipt">
                                    <SearchFieldComboBox
                                        mutation={getCompanyIdMutation}
                                        label={"운수사"}
                                        //defaultValue="전체"
                                        dataItemKey={"companyId"}
                                        textField={"companyName"}
                                        parentProps={props}
                                    />
                                </div>
                                <div className="cmn_sub_ipt">
                                    <SearchFieldInput
                                        label={"기사명"}
                                        name={"driverName"}
                                        parentProps={props} />
                                </div>
                                <div className="cmn_sub_ipt">
                                    <SearchFieldComboBox
                                        label={"교육대상"}
                                        data={useYnComboData}
                                        id="educationTargetYn"
                                        //defaultValue="전체"
                                        dataItemKey={"codeId"}
                                        textField={"codeName"}
                                        parentProps={props}
                                    />
                                </div>
                                <div className="cmn_sub_ipt">
                                    <SearchFieldComboBox
                                        label={"교육이수"}
                                        data={useYnComboData}
                                        id="educationCompleteYn"
                                        //defaultValue="전체"
                                        dataItemKey={"codeId"}
                                        textField={"codeName"}
                                        parentProps={props}
                                    />
                                </div>
                                <div className="cmn_sub_ipt">
                                    <SearchFieldComboBox
                                        label={"퇴사여부"}
                                        data={useYnComboData}
                                        id="resignYn"
                                        defaultItemValue={useYnComboData[1]}
                                        dataItemKey={"codeId"}
                                        textField={"codeName"}
                                        parentProps={props}
                                    />
                                </div>
                                <SearchFieldSearchBtn parentProps={props}>조회하기</SearchFieldSearchBtn>
                            </div>

                            <div className="subCont subContR">
                                <div className="cmn_total_wrap">
                                    <div className="cmn_total">
                                        <span className="totlaName">근무</span>
                                        <span className="totalNum">{summary.workCount}</span>
                                        <span className="txt">명</span>
                                    </div>
                                    <div className="cmn_total">
                                        <span className="totlaName">교육대상({dayjs().format("YYYY")}년)</span>
                                        <span className="totalNum">{summary.educationTargetYnYCount}</span>
                                        <span className="txt">명</span>
                                    </div>
                                    <div className="cmn_total">
                                        <span className="totlaName">교육 미이수</span>
                                        <span className="totalNum fcOrg">{summary.educationCompleteYnNCount}</span>
                                        <span className="txt">명</span>
                                    </div>
                                </div>

                                <div className="cmn_gird_wrap">
                                    <p className="totalTxt">
                                        총 <i className="fcGreen">{props?.data?.totalSize || 0}</i>개
                                    </p>

                                    <div id="grid_01" className="cmn_grid">
                                        <KendoGrid parentProps={props} >
                                            <Column field={"driverName"} title={"기사명"} />
                                            <Column field={"driverId"} title={"기사ID"} />
                                            <Column field={"companyName"} title={"운수사"} />
                                            {/*<Column field={"employeeDivisionName"} title={"사원구분"} />*/}
                                            <Column field={"resignYn"} title={"퇴사여부"} />
                                            <Column field={"employeeNumber"} title={"사원번호"} />
                                            <Column field={"educationTargetYn"} title={"교육대상"} />
                                            <Column field={"educationCompleteYn"} title={"교육이수"} />
                                            <Column field={"createDate"} title={"등록일자"} />
                                            <Column field={"updateDate"} title={"수정일자"} />
                                            <Column
                                                sortable={false}
                                                field={""}
                                                title={"상세"}
                                                cell={(cellProps) => <DetailButton gridProps={props} cellProps={cellProps} />}
                                            />
                                        </KendoGrid>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {props.popupShow ? (
                            props.mode === "I" ? (
                                <DriverInfoInsertPopup parentProps={props} title={MENU_TITLE} />
                            ) : (
                                <DriverInfoDetailPopup parentProps={props} title={MENU_TITLE} />
                            )
                        ) : null}
                    </Fragment>
                );
            }}
        />
    );
};

export default SummaryBasicGrid;
