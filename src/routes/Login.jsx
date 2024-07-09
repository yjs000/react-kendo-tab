import {Fragment, useCallback, useContext, useState} from "react";
import {Form, Formik} from "formik";

import {Input} from "@progress/kendo-react-inputs";
import {Button} from "@progress/kendo-react-buttons";
import {loadCode} from "@/common/utils/CodeUtil.jsx";
import {modalContext} from "@/common/components/Modal.jsx";
import {useCookies} from "react-cookie";
import {useSelector} from "react-redux";
import {jwtDecode} from "jwt-decode";
import {Navigate} from "react-router";
import {login} from "@/common/redux/action/AuthAction.jsx";
import {LoginApi} from "@/common/components/login/LoginApi.js";

const { VITE_DEFAULT_PATH } = import.meta.env;

const Login = ({
                   path, //컴포넌트 패키지 경로
                   ...options
               }) => {

    //auth가 있으면 main페이지로 이동.
    //formik 지우기
    const [cookies, setCookie, removeCookie] = useCookies();
    const auth = useSelector((store) => store.auth);

    const [formData, setFormData] = useState({
        id: localStorage.getItem("savedId") !== null ? localStorage.getItem("savedId") : "",
        password: null
    });
    //체크박스 상태
    const [isSavedId, setIsSavedId] = useState(formData.id !== null && formData.id !== "");
    const modal = useContext(modalContext);

    const {loginMutation} = LoginApi();


    /**
     * 로그인 API
     *
     * @author JungEun Woo
     * @since 2024-04-09<br />
     */
    const doLogin = async () => {
        const payload = {
            id: formData.id,
            password: formData.password
        };

        const result = await loginMutation.mutateAsync(payload);

        if (result.status === "NS_OK") {
            // 아이디 기억하기
            if (isSavedId) {
                localStorage.setItem("savedId", formData.id);
            }

            //코드가져오기
            await loadCode();
        }else{
            modal.showErrorAlert(result?.status, result?.message); //오류 팝업 표출
        }
    };

    /**
     * 로그인 입력 변경 Handler
     *
     * @author JungEun Woo
     * @since 2024-04-09<br />
     */
    const onChangeHandler = useCallback(
        (name, event) => {
            setFormData((prevState) => ({
                ...prevState,
                [name]: event.value
            }));
        },
        [formData]
    );

    /**
     * 아이디 기억하기 버튼 클릭 이벤트 Handler
     *
     * @author JungEun Woo
     * @since 2024-04-18<br />
     */
    const onCheckSavedId = useCallback(() => {
        if (isSavedId) {
            localStorage.removeItem("savedId");
        }
        setIsSavedId(!isSavedId);
    }, [isSavedId]);

    console.log("auth", auth)
    console.log("cookies.GS_RFT", cookies.GS_RFT)
    const isAuth = auth.isLogin && (auth?.user?.userId === (cookies.GS_RFT && jwtDecode(atob(cookies.GS_RFT || ""))?.sub));
    if (isAuth) {
        return <Navigate to="/" />;
    }
    console.log("isAuth", isAuth)

    return (
        <Fragment>
            <Formik enableReinitialize={true} initialValues={formData} onSubmit={doLogin}>
                {() => {
                    return (
                        <Fragment>
                            <Form>
                                <div className="login">
                                    <main className="loginWrap">
                                        <div className="loginContents">
                                            <h1 className="loginLogo">
                                                익산시 <span className="fcGreen">BMS</span>
                                            </h1>
                                            <fieldset className="loginForm">
                                                <Input
                                                    name={"id"}
                                                    type={"text"}
                                                    placeholder={"아이디를 입력해주세요."}
                                                    // minLength={4}
                                                    // maxByte={12}
                                                    required={true}
                                                    value={formData.id}
                                                    onChange={(event) => onChangeHandler("id", event)}
                                                />
                                                <Input
                                                    name={"password"}
                                                    type={"password"}
                                                    placeholder={"비밀번호를 입력해주세요"}
                                                    minLength={4}
                                                    maxLength={16}
                                                    required={true}
                                                    onChange={(event) => onChangeHandler("password", event)}
                                                />
                                            </fieldset>
                                            <div className="loginBtm">
                                                <Input
                                                    type="checkbox"
                                                    id="chk_01"
                                                    className="loginChk"
                                                    checked={isSavedId}
                                                    onClick={onCheckSavedId}
                                                />
                                                <label htmlFor="chk_01">아이디 기억하기</label>
                                            </div>
                                            <Button themeColor={"primary"} className={"loginBtn h60"} id={"login"} type={"onSubmit"} disabled={false}>
                                                로그인
                                            </Button>
                                        </div>
                                    </main>
                                </div>
                            </Form>
                        </Fragment>
                    );
                }}
            </Formik>

        </Fragment>
    );
};

export default Login;
