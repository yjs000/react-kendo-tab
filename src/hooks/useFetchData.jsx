import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import api from '@/common/queries/Api';

const fetchData = async (url, params) => {
    const response = await api.post(params, url);
    return response.data;
};

const useFetchData = (url, params, options = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const mutation = useMutation(
        async () => fetchData(url, params),
        {
            onSuccess: (data) => {
                setData(data);
                setIsLoading(false);
            },
            onError: (error) => {
                setError(error);
                setIsLoading(false);
            },
            ...options,
        }
    );

    useEffect(() => {
        mutation.mutate();
    }, [url, params]);

    return { data, isLoading, error };
};

export default useFetchData;
