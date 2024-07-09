import withSearchFieldData from "@/common/components/searchField/withSearchFieldData.jsx";

const TestSearchFieldComboBox = ({...props}) => {
    console.log("props",props)
}

const WithComponent = withSearchFieldData(TestSearchFieldComboBox)
const SearchFieldComboBoxWithDefaultData = () => {
        return <WithComponent />
}
export default SearchFieldComboBoxWithDefaultData;
