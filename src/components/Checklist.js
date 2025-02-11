import React, { useState } from 'react';

import { useTranslation } from "react-i18next";

const checklistItems = [
    "Initialize React project",
    "Set up project structure",
    "Install necessary dependencies (React Router, Axios, etc.)",
    "Choose and configure fire data API",
    "Set up API calls using Axios or Fetch",
    "Handle API errors and loading states",
    "Design layout and components",
    "Implement interactive map for fire locations",
    "Display fire details in a user-friendly format",
    "Ensure responsive design (without Tailwind)",
    
];

const FireTrackerChecklist = () => {
    const { t } = useTranslation();
    const [checkedItems, setCheckedItems] = useState({});

    const handleCheck = (index) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };


    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2>{t("checklist.title")}</h2>
            <ul>
                {t("checklist.items", { returnObjects: true }).map((item, index) => (
                    <li key={index}>
                        <input 
                            type="checkbox" 
                            checked={!!checkedItems[index]} 
                            onChange={() => handleCheck(index)}
                        />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FireTrackerChecklist;
