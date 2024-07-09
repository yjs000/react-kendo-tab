import { Link } from "react-router-dom";

const Menu = () => {
    return (
        <div className={"navWrap"}>
            <ul className={"nav depth01"}>
                <li>
                    <Link to={""} onClick={(e) => e.preventDefault()}>
                        Layout
                    </Link>
                    <ul className={"nav depth02"}>
                        <li>
                            <Link to={"/layout1"}>layout1</Link>
                        </li>
                        <li>
                            <Link to={"/layout2"}>layout2</Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <Link to={"chart"}>차트</Link>
                </li>
                <li>
                    <Link to={"map"}>지도</Link>
                </li>
            </ul>
        </div>
    );
};

export default Menu;
