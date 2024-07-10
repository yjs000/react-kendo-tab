import withSearchFieldData from "@/common/components/v1/searchField/withSearchFieldData.jsx";

const TestSearchFieldComboBox = ({...props}) => {
    console.log("props",props)
}

const WithComponent = withSearchFieldData(TestSearchFieldComboBox)
const SearchFieldComboBoxWithDefaultData = () => {
        return <WithComponent />
}
export default SearchFieldComboBoxWithDefaultData;
