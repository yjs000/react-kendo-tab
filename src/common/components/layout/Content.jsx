import {Outlet} from "react-router-dom";

const Content = () => {
    return (
        <div id={"content"}>
            <Outlet/>
        </div>
    );
};

export default Content;
