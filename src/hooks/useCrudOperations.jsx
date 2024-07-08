import { useState, useEffect } from 'react';
import callApi from "@/components/CommonApi.js";

const endpoint = "gunsan-bms-api"
const useCrudOperations = (url) => {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsPopupOpen, setIsDetailsPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [paging, setPaging] = useState({ skip: 0, take: 10 });
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchData = async () => {
    const response = await callApi(endpoint, url, {paging, sorting, filters});
    setData(response.data);
  };

  //TODO filter를 적용하기 전까지는 fetch하면 안됨.
  useEffect(() => {
    fetchData();
  }, [url, paging, sorting, filters]);

  const handleDetailButtonClick = (e) => {
    setSelectedItem(e.dataItem);
    setIsDetailsPopupOpen(true);
  };

  const handleAddButtonClick = () => {
    setIsAddPopupOpen(true);
  };

  const handleDetailsUpdate = (updatedData) => {
    const updatedGridData = data.map(item => item.id === updatedData.id ? updatedData : item);
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
