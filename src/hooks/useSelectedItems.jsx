import { useState } from 'react';

const useSelectedItems = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelectedItem = (item) => {
        setSelectedItem(item);
    };

    return {
        selectedItem,
        handleSelectedItem,
    };
};

export default useSelectedItems;
