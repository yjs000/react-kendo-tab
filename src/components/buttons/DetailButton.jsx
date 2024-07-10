import { Button } from "@progress/kendo-react-buttons";

const DetailButton = ({onClick, label}) => {
    return (
        <td>
            <Button className={"btnM"}
                    themeColor={"primary"}
                    onClick={onClick}>{label ?? "보기"}</Button>
        </td>
    );
};

export default DetailButton;