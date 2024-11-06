import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Autocomplete.css";
import { faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Autocomplete({ items, isMultiSelect = false, onGetDataUser, onGetDataProduct, onMixedData, isSuggestion = false }) {
    const [inputValue, setInputValue] = useState('');
    const [list, setList] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            let mixedList = [];
            if (onMixedData) {
                mixedList = await onMixedData();
                setList(mixedList);
            }
            else if (onGetDataUser) {
                const data = await onGetDataUser();
                setList(data);
            } else if (onGetDataProduct) {
                const data = await onGetDataProduct();
                setList(data);
            } else {
                setList(items);
            }
        };
   
        fetchData();
    }, [onGetDataUser, onGetDataProduct, items, onMixedData]);

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            const filteredList = list.filter(item =>
                item.firstName && item.lastName 
                    ? `${item.firstName} ${item.lastName}`.toLowerCase().includes(value.toLowerCase())
                    : item.name && item.price 
                    ? `${item.name}  ${item.price.toFixed(2)}€`.toLowerCase().includes(value.toLowerCase())
                    : item.toLowerCase().includes(value.toLowerCase()) &&
                    (!isMultiSelect || !selectedItems.includes(item))
            );
            setSuggestions(filteredList);
        } else {
            setSuggestions([]);
        }
    };

    const suggestionClick = (data) => {
        const itemName = data.firstName
            ? `${data.firstName} ${data.lastName}` 
            : `${data.name} ${data.price.toFixed(2)}€`; 

        if (isMultiSelect) {
            if (!selectedItems.includes(itemName)) {
                setSelectedItems([...selectedItems, itemName]);
            }
            setInputValue('');
        } else {
            setInputValue(itemName);
            setSuggestions([]);
        }
    };

    const deleteItem = (item) => {
        setSelectedItems(selectedItems.filter(selected => selected !== item));
    };

    const clickOutside = (event) => {
        if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    return (
        <div className="autocomplete" ref={autocompleteRef}>
            {isMultiSelect && selectedItems.length > 0 && (
                <div className="selected-items">
                    {selectedItems.map((item, index) => (
                        <div key={index} className="selected-item">
                            {item} 
                            <FontAwesomeIcon 
                                icon={faTrash} 
                                className="remove-item" 
                                onClick={() => deleteItem(item)} 
                            />
                        </div>
                    ))}
                </div>
            )}
            <input 
                type="text" 
                value={inputValue}
                onChange={handleChange}
                placeholder={isMultiSelect ? "Select multiple items..." : "Search for an item..."}
            />
            <FontAwesomeIcon icon={faSearch} className="icon" />
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((data, index) => (
                        <li 
                            key={index} 
                            onClick={() => suggestionClick(data)}
                        >
                            {data.firstName 
                                ? `${data.firstName} ${data.lastName}` 
                                : `${data.name} ${data.price.toFixed(2)}€`} 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
