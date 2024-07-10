import { useState } from 'react';

const usePagination = () => {
    const [paging, setPaging] = useState({ skip: 0, take: 10 });

    const handlePageChange = (skip, take) => {
        setPaging({ skip, take });
    };

    return {
        paging,
        handlePageChange,
    };
};

export default usePagination;
