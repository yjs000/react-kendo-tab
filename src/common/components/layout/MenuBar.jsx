import {modalContext} from "@/common/components/Modal.jsx";
import {useContext} from "react";
import {useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import {persistor} from "@/common/redux/store/StorePersist.jsx";
import {LoginApi} from "@/common/components/v1/login/LoginApi.js";
import Menu from "@/common/components/layout/Menu.jsx";
import {Navigate} from "react-router";

const MenuBar = () => {
    const [, , removeCookie] = useCookies();
    const auth = useSelector((store) => store.auth);
    const modal = useContext(modalContext);

    const { logoutMutation } = LoginApi();

    /**
     * 로그아웃 API
     *
     * @author JungEun Woo
     * @since 2024-04-12<br />
     */
    const doLogout = async () => {
        modal.showConfirm("알림", "로그아웃하시겠습니까?", {
            btns: [
                {
                    title: "취소",
                    background: "#75849a"
                },
                {
                    title: "로그아웃",
                    click: async () => {
                        try {
                            const result = await logoutMutation.mutateAsync();
                            if (result.status === "NS_OK") {
                                await persistor.purge();
                                removeCookie("GS_RFT", { path: "/" });
                            } else {
                                modal.showAlert("알림", "로그아웃을 하지 못하였습니다.");
                            }
                        } catch (err) {
                            modal.showAlert("알림", "로그아웃을 하지 못하였습니다.");
                        }
                    }
                }
            ]
        });
    };

    return (
        <header>
            <h1 className="logo" style={{ cursor: "pointer" }} onClick={() => <Navigate to={"/"} />}>
                LOGO
            </h1>
            <Menu />
            <div className="userWrap">
                {auth ? (
                    <a className="iconLogout" onClick={doLogout}>
                        로그아웃
                    </a>
                ) : null}
            </div>
        </header>
    );
};

export default MenuBar;
