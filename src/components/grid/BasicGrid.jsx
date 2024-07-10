import { Fragment, useEffect, useState } from "react";
import { GridColumn as Column } from "@progress/kendo-react-grid";

import { useYnComboData } from "@/common/utils/CodeUtil.jsx";
import { useLocation } from "react-router";
import { OperatorApi } from "@/components/operator/OperatorApi.js";
import SearchFieldComboBox from "@/common/components/v1/searchField/SearchFieldComboBox.jsx";
import SearchFieldInput from "@/common/components/v1/searchField/SearchFieldInput.jsx";
import SearchFieldSearchBtn from "@/common/components/v1/searchField/SearchFieldSearchBtn.jsx";
import OperatorInsertPopup from "@/components/operator/OperatorInsertPopup.jsx";
import OperatorDetailPopup from "@/components/operator/OperatorDetailPopup.jsx";
import DetailButton from "@/common/components/v1/grid/DetailButton.jsx";
import KendoGrid from "@/common/components/v1/kendo/KendoGrid.jsx";
import GridData from "@/common/components/v1/grid/GridData.jsx";
import { ComboApi } from "@/components/ComboApi.js";
import ButtonPrimary from "@/common/components/v1/buttons/ButtonPrimary.jsx";
import CellDateTime from "@/common/components/v1/grid/CellDateTime.jsx";

/**
 * 일반 조회.
 *
 * @author jisu
 * @since 2024.07.03<br />
 */

//코드값이 (어떠한오류로인해) 비어있으면 다시 부름. //코드 값은 component 바깥에서 부를 것.
// const code = localStorage.getItem("code") == null ? loadCode() : JSON.parse(localStorage.getItem("code"));
// const dept = code.filter((item) => item.groupCodeId === "DEPT");
const BasicGrid = (menu) => {
    const location = useLocation();
    const pathname = location.pathname;
    console.log("pathName", pathname);

    const TITLE_LIST = pathname.slice(1, pathname.length).split("/"); /*menuTitle(menu, pathname)*/ //menu에서 menuTitle을 꺼냄.
    const DATA_ITEM_KEY = "userId"; //kendo 참고. grid record의 pk. pk가 여러개인경우 no(이름은자유)로 주고, gridData에 rowNumber={DATA_ITEM_KEY} 추가
    const SELECTED_FIELD = "selected"; //grid record의 선택여부를 계산할 컬럼. 1번행이 selected면 1번행의 데이터에 selected=true가 들어감.
    const MENU_TITLE = "사용자"; //popup과 grid에서 공통으로 사용할 제목

    const { getUserMutation, insertUserMutation, updateUserMutation, deleteUserMutation } = OperatorApi();
    const { getComboUserMutation, getAuthIdMutation } = ComboApi();

    const [userIdComboData, setUserIdComboData] = useState([]);

    useEffect(() => {
        getComboUserMutation.mutateAsync({}).then((res) => {
            setUserIdComboData(res?.items?.map((item) => item) ?? []);
        });
    }, []);

    return (
        <GridData
            dataItemKey={DATA_ITEM_KEY}
            selectedField={SELECTED_FIELD}
            menuTitle={MENU_TITLE}
            searchMutation={getUserMutation}
            insertMutation={insertUserMutation}
            updateMutation={updateUserMutation}
            deleteMutation={deleteUserMutation} //삭제를 넣어두긴 했지만, 화면에 삭제기능은 없음.
            // isPage={false} //paing여부가 필요할경우
            renderItem={(props) => {
                //여기에 실제 코드 작성

                const searchOnSubmit = (e) => { //onsubmit과 deleteOnClick을 설정해주면 필수값을 vlidate함
                    if(e) {
                        e.preventDefault();
                    }
                    props.handleSearch();
                };

                // eslint를 끄기 위한 주석
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                    //자동조회
                    searchOnSubmit();
                }, []);

                return (
                    <Fragment>
                        <article className="subTitWrap">
                            {/*이런것들은 publishing영역*/}
                            <p className="subStep">
                                {TITLE_LIST.map((title, idx) => (
                                    <span key={idx}>{title}</span>
                                ))}
                            </p>
                            <div className="subTit">
                                <h2 className="titTxt">{TITLE_LIST.at(-1)}</h2>
                                <div className="btnWrap">
                                    <ButtonPrimary onClick={props.handleInsert}>등록</ButtonPrimary>
                                </div>
                            </div>
                        </article>

                        <article className="subContWrap">
                            <form onSubmit={searchOnSubmit}>
                                <div className="subCont subContL">
                                    <div className="cmn_sub_ipt">
                                        <p className="txtTit">ID</p> {/*searchFieldComboBox에 label로 달아줘도 되고, 이렇게 바깥에 써도 됨*/}
                                        {/*component만 공통*/}
                                        <SearchFieldComboBox
                                            data={userIdComboData}
                                            id="userId"
                                            dataItemKey={"userId"}
                                            textField={"userId"}
                                            parentProps={props}
                                        />
                                    </div>
                                    <div className="cmn_sub_ipt">
                                        <p className="txtTit">이름</p>
                                        <SearchFieldInput name={"userName"} parentProps={props} />
                                    </div>
                                    <div className="cmn_sub_ipt">
                                        <p className="txtTit">전화번호</p>
                                        <SearchFieldInput name={"telephoneNumber"} parentProps={props} />
                                    </div>
                                    <div className="cmn_sub_ipt">
                                        <p className="txtTit">부서</p>
                                        <SearchFieldInput name={"department"} parentProps={props} />
                                    </div>
                                    <div className="cmn_sub_ipt">
                                        <p className="txtTit">권한</p>
                                        <SearchFieldComboBox
                                            mutation={getAuthIdMutation}
                                            id="authorityId"
                                            dataItemKey={"authorityId"}
                                            textField={"authorityName"}
                                            parentProps={props}
                                        />
                                    </div>
                                    <div className="cmn_sub_ipt">
                                        <SearchFieldComboBox
                                            required={true}
                                            label={"잠김여부"}
                                            data={useYnComboData}
                                            id="lockedYn"
                                            dataItemKey={"codeId"}
                                            textField={"codeName"}
                                            parentProps={props}
                                        />
                                    </div>
                                    {/*시간 datepicker bms 소스 참고*/}
                                    {/*<div className="cmn_sub_ipt">*/}
                                    {/*    <SearchFieldTimePicker*/}
                                    {/*        label={"시간"}*/}
                                    {/*        name={"time"}*/}
                                    {/*        parentProps={props}*/}
                                    {/*        required={true}*/}
                                    {/*        // steps={{minute: 30}}    //30분 간격*/}
                                    {/*        defaultBeforeValue={dayjs(new Date(new Date().setMinutes(new Date().getMinutes() - 30))).format("HHmm")}*/}
                                    {/*        defaultAfterValue={dayjs(new Date()).format("HHmm")}*/}
                                    {/*    />*/}
                                    {/*</div>*/}
                                    <SearchFieldSearchBtn parentProps={props} deleteOnClick={true}>
                                        조회하기
                                    </SearchFieldSearchBtn>
                                </div>
                            </form>

                            <div className="subCont subContR ">
                                <div className="cmn_gird_wrap">
                                    <p className="totalTxt">
                                        총 <i className="fcGreen">{props?.data?.totalSize || 0}</i>개
                                    </p>

                                    <div id="grid_01" className="cmn_grid">
                                        <KendoGrid parentProps={props}>
                                            <Column field={"userId"} title={"ID"} />
                                            <Column field={"userName"} title={"이름"} />
                                            <Column field={"telephoneNumber"} title={"전화번호"} />
                                            <Column field={"mobilePhoneNumber"} title={"휴대전화"} />
                                            <Column field={"jobTitle"} title={"직책"} />
                                            <Column field={"department"} title={"부서"} />
                                            <Column field={"authorityName"} title={"권한"} />
                                            <Column field={"lockedYn"} title={"잠김여부"} />
                                            <Column field={"useYn"} title={"사용여부"} />
                                            <Column
                                                field={"updateDate"}
                                                title={"등록일자"}
                                                cell={(cellProps) => <CellDateTime cellProps={cellProps} />}
                                            />
                                            <Column
                                                sortable={false}
                                                field={"custom"}
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
                                <OperatorInsertPopup parentProps={props} title={MENU_TITLE} />
                            ) : (
                                <OperatorDetailPopup parentProps={props} title={MENU_TITLE} />
                            )
                        ) : null}
                    </Fragment>
                );
            }}
        />
    );
};

export default BasicGrid;
