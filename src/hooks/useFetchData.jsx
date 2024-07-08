import {useEffect, useState} from 'react';
import callApi from "@/components/CommonApi.js";

const useFetchData = (endpoint, url, payload) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataFromApi = async () => {
            const data = await callApi(endpoint, url, payload);
            setData(data);
            setLoading(false);
        };

        fetchDataFromApi();
    }, [endpoint, url, payload]);

    return { data, loading };
};

export default useFetchData;
