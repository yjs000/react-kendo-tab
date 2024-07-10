const HeaderComponent = ({titles, buttons, onSearchClick}) => {
    return (
        <article className="subTitWrap">
            <p className="subStep">
                <span>{titles[0]}</span>
                <span>{titles[1]}</span>
                {titles[2] !== "" && <span>{titles[2]}</span>}
            </p>

            <div className="subTit">
                <h2 className="titTxt">{titles[2] !== "" ? titles[2] : titles[1]}</h2>
                <div className="btnWrap">
                    {buttons.map((button, idx) => {
                        return (
                            <button.component key={idx} onClick={onSearchClick}>
                                {button.label}
                            </button.component>
                        );
                    })}
                </div>
            </div>
        </article>
    );
};

export default HeaderComponent;
