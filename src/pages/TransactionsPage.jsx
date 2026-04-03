import React, { useState } from 'react';
import { useFinanceData } from '../context/FinanceContext';
import { useUserSession } from '../context/AuthContext';
import { toRupeeFormat, getDisplayDate } from '../utils/helpers';

const TransactionsPage = () => {
  // Pulling specific data from our global finance store
  const { financialRecords, removeRecord, insertNewRecord, isDataLoading } = useFinanceData();
  const { activeRole } = useUserSession();
  
  // Local state for UI toggles and forms
  const [isEntryFormVisible, setIsEntryFormVisible] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState('all');
  const [currentFilterCategory, setCurrentFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form input states for adding a new valid record
  const [entryTitle, setEntryTitle] = useState('');
  const [entryValue, setEntryValue] = useState('');
  const [entryType, setEntryType] = useState('expense');
  const [entryCategory, setEntryCategory] = useState('general');
  const [entryDate, setEntryDate] = useState('2026-03-25');

  if (isDataLoading) {
    return <section className="text-xl p-6 dark:text-gray-100">Loading your data...</section>;
  }

  // Generate filtered array by mapping through records
  const displayList = [];
  for (let idx = 0; idx < financialRecords.length; idx++) {
    const recordNode = financialRecords[idx];
    
    const matchesDesiredType = (currentFilterType === 'all' || recordNode.type === currentFilterType);
    const matchesDesiredCategory = (currentFilterCategory === 'all' || recordNode.category === currentFilterCategory);
    const matchesSearchText = recordNode.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (matchesDesiredType && matchesDesiredCategory && matchesSearchText) {
      displayList.push(recordNode);
    }
  }

  // Handle saving logic
  const handleRecordSubmit = (event) => {
    event.preventDefault();
    if (!entryTitle || !entryValue) {
      alert("Missing required fields!");
      return;
    }

    const compiledDataObject = {
      id: Math.random().toString(36).substring(7),
      description: entryTitle,
      amount: Number(entryValue),
      type: entryType,
      category: entryCategory,
      date: entryDate
    };
    
    insertNewRecord(compiledDataObject);
    setIsEntryFormVisible(false);
    
    setEntryTitle('');
    setEntryValue('');
  };

  // Convert array to text string and download locally
  const triggerDataExport = () => {
    const stringifiedData = JSON.stringify(financialRecords, null, 2);
    const binaryBlob = new Blob([stringifiedData], { type: "application/json" });
    const hiddenLink = document.createElement("a");
    hiddenLink.href = URL.createObjectURL(binaryBlob);
    hiddenLink.download = "my_finance_export.json";
    document.body.appendChild(hiddenLink);
    hiddenLink.click();
    document.body.removeChild(hiddenLink);
  };

  return (
    <article className="transition-all duration-500">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold dark:text-white">Record Log</h1>
        
        <aside className="flex gap-2">
          <button 
            onClick={triggerDataExport}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
          >
            Export JSON
          </button>
          
          {activeRole === 'admin' && (
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              onClick={() => setIsEntryFormVisible(!isEntryFormVisible)}
            >
              {isEntryFormVisible ? 'Cancel Form' : 'Append New Record'}
            </button>
          )}
        </aside>
      </header>

      {/* Conditionally render appending form if toggle active */}
      {isEntryFormVisible && activeRole === 'admin' && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded shadow border border-gray-200 dark:border-gray-700 mb-6 transition-all duration-300">
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Provide New Log Details</h2>
          <form onSubmit={handleRecordSubmit} className="flex flex-col gap-4 dark:text-gray-200">
            
            <div className="flex gap-4">
              <label>
                <input type="radio" value="expense" checked={entryType === 'expense'} onChange={(e) => setEntryType(e.target.value)} /> Expense Output
              </label>
              <label>
                <input type="radio" value="income" checked={entryType === 'income'} onChange={(e) => setEntryType(e.target.value)} /> Income Input
              </label>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Log Title</label>
                <input type="text" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded p-2 w-full transition-all duration-300 focus:border-blue-500 outline-none" value={entryTitle} onChange={(e) => setEntryTitle(e.target.value)} />
              </div>

              <div className="flex-1">
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Value Amount</label>
                <input type="number" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded p-2 w-full transition-all duration-300 focus:border-blue-500 outline-none" value={entryValue} onChange={(e) => setEntryValue(e.target.value)} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Select Date</label>
                <input type="date" className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded p-2 w-full" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
              </div>

              <div className="flex-1">
                <label className="block text-gray-600 dark:text-gray-400 mb-1">Allocate Category</label>
                <select className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded p-2 w-full" value={entryCategory} onChange={(e) => setEntryCategory(e.target.value)}>
                  <option value="general">Assorted</option>
                  <option value="food">Meals & Food</option>
                  <option value="groceries">Grocery Shop</option>
                  <option value="wages">Wages & Salary</option>
                  <option value="commute">Commute Cost</option>
                  <option value="leisure">Leisure & Fun</option>
                  <option value="side_hustle">Side Hustle</option>
                  <option value="utilities">Utilities</option>
                </select>
              </div>
            </div>

            <button type="submit" className="bg-green-600 text-white px-4 py-2 mt-2 rounded hover:bg-green-700 transition-all duration-300 hover:scale-[1.02]">Confirm Entry</button>
          </form>
        </section>
      )}

      {/* Controller Block for Array Manipulation */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300">
        
        <div className="flex flex-col md:flex-row gap-4 mb-6 dark:text-gray-200">
          <div className="flex flex-col flex-1">
             <span className="font-bold text-gray-600 dark:text-gray-400 mb-1">Query by Title:</span>
             <input type="text" placeholder="Lookup..." className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded p-2" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          
          <div className="flex flex-col flex-1">
             <span className="font-bold text-gray-600 dark:text-gray-400 mb-1">Cashflow Type:</span>
             <select className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded p-2" value={currentFilterType} onChange={(e) => setCurrentFilterType(e.target.value)}>
               <option value="all">Any Type</option>
               <option value="income">Credits (In)</option>
               <option value="expense">Debits (Out)</option>
             </select>
          </div>

          <div className="flex flex-col flex-1">
             <span className="font-bold text-gray-600 dark:text-gray-400 mb-1">Specific Category:</span>
             <select className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded p-2" value={currentFilterCategory} onChange={(e) => setCurrentFilterCategory(e.target.value)}>
               <option value="all">Any Category</option>
               <option value="general">Assorted</option>
               <option value="food">Meals & Food</option>
               <option value="groceries">Grocery Shop</option>
               <option value="wages">Wages & Salary</option>
               <option value="commute">Commute Cost</option>
               <option value="leisure">Leisure & Fun</option>
               <option value="side_hustle">Side Hustle</option>
               <option value="utilities">Utilities</option>
             </select>
          </div>
        </div>

        {/* Displaying records in a table layout */}
        <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700 mt-4">
          <table className="w-full text-left border-collapse dark:text-gray-200 min-w-[650px]">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="p-3">Occurred On</th>
                <th className="p-3">Title Description</th>
                <th className="p-3">Matched Category</th>
                <th className="p-3">Cashflow</th>
                <th className="p-3">Actual Value</th>
                {activeRole === 'admin' && <th className="p-3 text-center">Action</th>}
              </tr>
            </thead>
            <tbody>
              {displayList.map((rowItem) => (
                <tr key={rowItem.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="p-3 whitespace-nowrap">{getDisplayDate(rowItem.date)}</td>
                  <td className="p-3 font-semibold min-w-[150px]">{rowItem.description}</td>
                  <td className="p-3 capitalize">{rowItem.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm whitespace-nowrap ${rowItem.type === 'income' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {rowItem.type}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{toRupeeFormat(rowItem.amount)}</td>
                  {activeRole === 'admin' && (
                    <td className="p-3 text-center">
                      <button className="text-red-500 hover:text-red-700 dark:hover:text-red-400 px-2 font-bold transition-all duration-300 hover:scale-125" onClick={() => removeRecord(rowItem.id)}>
                        Drop
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              
              {displayList.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500 dark:text-gray-400">Zero records found for those conditions.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
};

export default TransactionsPage;
