import { useState, useEffect } from "react";
import callApi from "@/components/CommonApi.js";
import { useMutation } from "react-query";
import api from "@/common/queries/Api.js";

const endpoint = "/gunsan-bms-api/bms";
const useCrudOperations = (baseUrl) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [paging, setPaging] = useState({ skip: 0, take: 10 });
    const [sorting, setSorting] = useState([]);
    const [filters, setFilters] = useState({});

    const fetchMutation = useMutation(
        async () => {
            const response = await api.post({}, `${baseUrl}/search`);
            return response.data;
        },
        {
            onSuccess: (data) => {
                setData(data);
                setIsLoading(false);
            },
            onError: (error) => {
                setError(error);
                setIsLoading(false);
            }
        }
    );

    //TODO filter를 적용하기 전까지는 fetch하면 안됨.
    useEffect(() => {
        fetchMutation.mutate();
    }, [baseUrl, paging, sorting, filters]);

    const handleDetailButtonClick = (e) => {
        setSelectedItem(e.dataItem);
        setIsDetailsPopupOpen(true);
    };

    const handleAddButtonClick = () => {
        setIsAddPopupOpen(true);
    };

    const handleDetailsUpdate = (updatedData) => {
        const updatedGridData = data.map((item) => (item.id === updatedData.id ? updatedData : item));
        setData(updatedGridData);
        setIsDetailsPopupOpen(false);
    };

    const handleAddData = (newData) => {
        setData([...data, newData]);
        setIsAddPopupOpen(false);
    };

    const handlePageChange = (event) => {
        setPaging({ skip: event.page.skip, take: event.page.take });
    };

    const handleSortChange = (event) => {
        setSorting(event.sort);
    };

    const handleFilterChange = (field, value) => {
        setFilters({ ...filters, [field]: value });
    };

    return {
        data,
        selectedItem,
        isDetailsPopupOpen,
        isAddPopupOpen,
        handleDetailButtonClick,
        handleAddButtonClick,
        handleDetailsUpdate,
        handleAddData,
        setIsDetailsPopupOpen,
        setIsAddPopupOpen,
        handlePageChange,
        handleSortChange,
        handleFilterChange
    };
};

export default useCrudOperations;
