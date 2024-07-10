import { useState } from 'react';

const useSorting = () => {
    const [sorting, setSorting] = useState([]);

    const handleSortChange = (sort) => {
        setSorting(sort);
    };

    return {
        sorting,
        handleSortChange,
    };
};

export default useSorting;
