import { Button } from "@progress/kendo-react-buttons";
/**
 * 필수 조회조건이 있을 경우 deleteOnClick == true
 * form 에서 onSubmit으로 클릭 이벤트
 * */
const SearchFieldSearchBtn = ({children, onSearchClick, ...props }) => {

    return (
        <Button type="submit" className="wfull btnL" themeColor={"primary"} onClick={onSearchClick} {...props}>
            {children}
        </Button>
    );
};

export default SearchFieldSearchBtn;
