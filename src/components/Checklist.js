import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

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
    <div className="p-4 max-w-lg mx-auto">
      <h2>{t("checklist.title")}</h2>
      <ul>
        {Array.isArray(checklistItems) &&
          checklistItems.map((item, index) => (
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
