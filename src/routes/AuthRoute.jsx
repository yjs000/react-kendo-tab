import {Navigate} from "react-router";
import {useSelector} from "react-redux";
import {useCookies} from "react-cookie";
import {jwtDecode} from "jwt-decode";
import {Outlet} from "react-router-dom";

const AuthRoute = () => {
    const [cookies] = useCookies();
    const auth = useSelector((store) => store.auth);

    const isAuth = auth.isLogin && (auth?.user?.userId === (cookies.GS_RFT && jwtDecode(atob(cookies.GS_RFT || ""))?.sub));

    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthRoute;
