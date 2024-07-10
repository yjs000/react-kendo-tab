import {Route, Routes} from "react-router-dom";
import {Fragment} from "react";
import "@progress/kendo-theme-default/dist/all.css";
import "@/assets/css/common.css";
import "@/assets/css/kendo_custom.css";
import Login from "@/routes/Login.jsx";
import BasicGrid from "@/components/grid/BasicGrid.jsx";
import AuthRoute from "@/routes/AuthRoute.jsx";
import MainLayout from "@/routes/MainLayout.jsx";
import DefaultFilterGrid from "@/components/grid/DefaultFilterGrid.jsx";
import SummaryBasicGrid from "@/components/grid/SummaryBasicGrid.jsx";
import PageNotFound from "@/components/pageNotFound/PageNotFound.jsx";
import Page1 from "@/components/layout/page1/Page1.jsx";

function App() {

    return (
        <Fragment>
            <Routes>
                {/*<Route path={"/"} element={<AuthRoute />}>*/}
                    {/*<Route path={"/"} element={<MainLayout />}>*/}
                        <Route path={"/layout1"} element={<Page1 />}></Route>
                        <Route path={"/layout2"} element={<DefaultFilterGrid />}></Route>
                        <Route path={"/layout3"} element={<SummaryBasicGrid />}></Route>
                        <Route path={"/*"} element={<PageNotFound />} />
                    {/*</Route>*/}
                {/*</Route>*/}
                <Route path={"/login"} element={<Login/>} />
                <Route path={"/*"} element={<PageNotFound />} />
            </Routes>
        </Fragment>
    );
}

export default App;
