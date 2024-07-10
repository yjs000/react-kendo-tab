import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import callApi from "@/components/CommonApi.js";


const useFetchData = (url, params, options = {}) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const mutation = useMutation(
        async () => callApi(url, params),
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
    }, []);

    return { data, isLoading, error };
};

export default useFetchData;
