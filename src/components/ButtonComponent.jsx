const ButtonComponent = ({ buttons }) => {
    return (
        <div>
            {buttons.map((button, idx) => {
                const component = button.component;
                return (<component
                    key={idx}
                    onClick={button.onClick}
                >
                    {button.label}
                    </component>)
            })}
        </div>
    );
};

export default ButtonComponent;
