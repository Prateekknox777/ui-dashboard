import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FINANCIAL_RECORDS } from '../data/mockData';

// Context to manage financial state across the components
const FinanceContext = createContext();

// Hook to use our finance data securely
export const useFinanceData = () => {
    return useContext(FinanceContext);
};

export const FinanceProvider = ({ children }) => {
  // State for all logged incomes and expenses
  const [financialRecords, setFinancialRecords] = useState([]);
  
  // Loading state for UI feedback
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Initialize data from local storage on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const persistedData = localStorage.getItem("personal-finance-data-storage");
      
      if (persistedData) {
        setFinancialRecords(JSON.parse(persistedData));
      } else {
        setFinancialRecords(INITIAL_FINANCIAL_RECORDS);
        localStorage.setItem("personal-finance-data-storage", JSON.stringify(INITIAL_FINANCIAL_RECORDS));
      }
      
      setIsDataLoading(false);
    }, 850); // Simulate network delay subtly different from previous 1000
    
    return () => clearTimeout(timer); // Good practice cleanup
  }, []);

  // Function to save new records
  const insertNewRecord = (recordObj) => {
    const updatedRecords = [recordObj, ...financialRecords];
    setFinancialRecords(updatedRecords);
    localStorage.setItem("personal-finance-data-storage", JSON.stringify(updatedRecords));
  };

  // Function to remove records using array filter method
  const removeRecord = (recordId) => {
    const filteredRecords = financialRecords.filter(item => item.id !== recordId);
    setFinancialRecords(filteredRecords);
    localStorage.setItem("personal-finance-data-storage", JSON.stringify(filteredRecords));
  };

  // Compute totals by iterating through the current records
  let sumOfIncome = 0;
  let sumOfExpenses = 0;
  
  for (let idx = 0; idx < financialRecords.length; idx++) {
    const currentAmount = Number(financialRecords[idx].amount);
    if (financialRecords[idx].type === 'income') {
      sumOfIncome += currentAmount;
    } else {
      sumOfExpenses += currentAmount;
    }
  }

  // Final balance is the difference
  const netBalance = sumOfIncome - sumOfExpenses;

  // Bundle everything into a single context value object
  const providerContextValue = {
    financialRecords,
    isDataLoading,
    insertNewRecord,
    removeRecord,
    sumOfIncome,
    sumOfExpenses,
    netBalance
  };

  return (
    <FinanceContext.Provider value={providerContextValue}>
      {children}
    </FinanceContext.Provider>
  );
};
