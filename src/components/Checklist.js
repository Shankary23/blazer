import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import './checklist.css';  

const FireTrackerChecklist = () => {
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (index) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const checklistItems = t("checklist.items", { returnObjects: true });

  return (
    <div className="checklist-container">
      <h2 className="checklist-title">{t("checklist.title")}</h2>
      <ul className="checklist-items">
        {Array.isArray(checklistItems) &&
          checklistItems.map((item, index) => (
            <li key={index} className="checklist-item">
              <input
                type="checkbox"
                checked={!!checkedItems[index]}
                onChange={() => handleCheck(index)}
              />
              <span className={checkedItems[index] ? "checked" : ""}>{item}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FireTrackerChecklist;
