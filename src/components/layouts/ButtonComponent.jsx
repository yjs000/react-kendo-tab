const ButtonComponent = ({ buttons }) => {

    return (
        <div className="subTit">
            <h2 className="titTxt">title</h2>
            <div className="btnWrap">
                {buttons.map((button, idx) => {
                    return (
                        <button.component key={idx} onClick={button.onClick}>
                            {button.label}
                        </button.component>
                    );
                })}
            </div>
        </div>
    );
};

export default ButtonComponent;
