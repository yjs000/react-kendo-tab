import { Button } from "@progress/kendo-react-buttons";

const ButtonPrimary = ({ children, ...props }) => {
    return (
        <Button className="btnM" themeColor={"primary"} {...props}>
            {children}
        </Button>
    );
};

export default ButtonPrimary;
