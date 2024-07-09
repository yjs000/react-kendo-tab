import MenuBar from "@/common/components/layout/MenuBar.jsx";
import Header from "@/common/components/layout/Header.jsx";
import Content from "@/common/components/layout/Content.jsx";
import Footer from "@/common/components/layout/Footer.jsx";
import { Fragment } from "react";

const MainLayout = () => {
    return (
        <Fragment>
            <MenuBar />
            <Header />
            <Content />
            <Footer />
        </Fragment>
    );
};

export default MainLayout;
