import React from 'react';
import { useFinanceData } from '../context/FinanceContext';
import { toRupeeFormat } from '../utils/helpers';

const InsightsPage = () => {
  const { financialRecords, isDataLoading } = useFinanceData();

  if (isDataLoading) {
    return <section className="text-xl p-6 dark:text-white">Analyzing financial data...</section>;
  }

  // 1. Determine the highest area of expenditure
  let maxExpenseRecord = null;
  const sumsByCategory = {};
  let grossExpenses = 0;
  
  if (financialRecords && financialRecords.length > 0) {
    for(let i=0; i < financialRecords.length; i++) {
        const item = financialRecords[i];
        if (item.type === 'expense') {
            if (!maxExpenseRecord || item.amount > maxExpenseRecord.amount) {
              maxExpenseRecord = item;
            }
            sumsByCategory[item.category] = (sumsByCategory[item.category] || 0) + Number(item.amount);
            grossExpenses += Number(item.amount);
          }
    }
  }

  let dominantCategory = null;
  let dominantCategoryValue = 0;
  for (const categoryKey in sumsByCategory) {
    if (sumsByCategory[categoryKey] > dominantCategoryValue) {
      dominantCategory = categoryKey;
      dominantCategoryValue = sumsByCategory[categoryKey];
    }
  }

  // 2. Aggregate data on a monthly basis
  const periodicData = {};
  for(let j=0; j < financialRecords.length; j++) {
      const record = financialRecords[j];
      if (record.date) {
        // Extract Year-Month string
        const monthGroup = record.date.substring(0, 7); 
        if (!periodicData[monthGroup]) {
          periodicData[monthGroup] = { credits: 0, debits: 0 };
        }
        if (record.type === 'income') {
          periodicData[monthGroup].credits += Number(record.amount);
        } else {
          periodicData[monthGroup].debits += Number(record.amount);
        }
      }
  }

  // Sort months downward
  const sortedPeriodicKeys = Object.keys(periodicData).sort((a, b) => b.localeCompare(a)); 

  // 3. Automated advice generation
  let systemObservation = "Insufficient data points for a trend observation.";
  if (dominantCategoryValue > 0) {
      const concentration = ((dominantCategoryValue / grossExpenses) * 100).toFixed(1);
      if (concentration > 50) {
          systemObservation = `Alert: A massive ${concentration}% of your outflow is locked into "${dominantCategory}". A tighter budget is highly recommended.`;
      } else if (concentration > 30) {
          systemObservation = `Pattern spotted: ${concentration}% of outgoing funds go toward "${dominantCategory}". Monitoring this could optimize your savings.`;
      } else {
          systemObservation = `Healthy distribution detected. Your highest outflow area is "${dominantCategory}" at ${concentration}%, which is reasonable.`;
      }
  }

  return (
    <article className="transition-all duration-500">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold dark:text-white">Analytical Insights</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Spend Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border border-indigo-200 dark:border-indigo-900 border-t-4 border-t-indigo-500 hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2 uppercase tracking-wide text-sm">Primary Spend Category</h3>
          <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 capitalize">
            {dominantCategory ? dominantCategory : 'None Recorded'}
          </p>
          {dominantCategoryValue > 0 && (
             <p className="text-indigo-600 dark:text-indigo-400 mt-2 font-bold tracking-tight">
               {toRupeeFormat(dominantCategoryValue)} Total Deduction
             </p>
          )}
        </div>

        {/* System Recommendation Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border border-purple-200 dark:border-purple-900 border-t-4 border-t-purple-500 hover:-translate-y-1 transition-transform duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2 uppercase tracking-wide text-sm">Smart Suggestion</h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 italic flex gap-3 items-start">
            <span className="text-2xl mt-1">🧠</span>
            <span>{systemObservation}</span>
          </p>
        </div>
      </section>

      {/* Month-over-Month Data Table */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 dark:text-white border-b pb-3 dark:border-gray-700">Periodic Cashflow Comparison</h2>
        
        {sortedPeriodicKeys.length === 0 ? (
          <p className="text-gray-500 italic">Financial data timeline is currently empty.</p>
        ) : (
          <div className="overflow-x-auto rounded border border-gray-100 dark:border-gray-700">
            <table className="w-full text-left border-collapse dark:text-gray-200">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900">
                  <th className="p-4 font-bold uppercase tracking-wider text-sm">Timeline Period</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-sm">Total Inflows</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-sm">Total Outflows</th>
                  <th className="p-4 font-bold uppercase tracking-wider text-sm">Net Position</th>
                </tr>
              </thead>
              <tbody>
                {sortedPeriodicKeys.map(timeKey => {
                  const payload = periodicData[timeKey];
                  const netGain = payload.credits - payload.debits;
                  return (
                    <tr key={timeKey} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <td className="p-4 font-semibold">{timeKey}</td>
                      <td className="p-4 text-green-600 dark:text-green-400 font-bold">{toRupeeFormat(payload.credits)}</td>
                      <td className="p-4 text-red-600 dark:text-red-400 font-bold">{toRupeeFormat(payload.debits)}</td>
                      <td className="p-4 font-extrabold flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs mr-2 ${netGain >= 0 ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}>
                           {netGain >= 0 ? '🟢' : '🔴'}
                        </span>
                        <span className={netGain >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          {netGain >= 0 ? '+' : ''}{toRupeeFormat(netGain)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </article>
  );
};

export default InsightsPage;
