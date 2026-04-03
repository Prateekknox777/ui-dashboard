import React from 'react';
import { useFinanceData } from '../context/FinanceContext';

const Dashboard = () => {
  // Extracting totals directly from our global provider
  const { sumOfIncome, sumOfExpenses, netBalance, isDataLoading } = useFinanceData();

  if (isDataLoading) {
    return <section className="text-xl p-6 dark:text-white">Fetching dashboard data...</section>;
  }

  // Calculate percentage of income saved
  let savingsPercentage = 0;
  if (sumOfIncome > 0) {
    savingsPercentage = ((sumOfIncome - sumOfExpenses) / sumOfIncome) * 100;
  }

  return (
    <article className="transition-all duration-500 container mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 dark:text-white">Financial Summary Overview</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Net Balance Card */}
        <aside className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2 uppercase text-sm tracking-wide">Net Portfolio Balance</h3>
          <p className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">₹{netBalance.toFixed(2)}</p>
        </aside>
        
        {/* Income Card */}
        <aside className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2 uppercase text-sm tracking-wide">Aggregate Incoming</h3>
          <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">₹{sumOfIncome.toFixed(2)}</p>
        </aside>
        
        {/* Expense Card */}
        <aside className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border border-red-200 dark:border-red-800 hover:scale-105 transition-all duration-300">
          <h3 className="text-gray-500 dark:text-gray-400 font-bold mb-2 uppercase text-sm tracking-wide">Aggregate Outgoing</h3>
          <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">₹{sumOfExpenses.toFixed(2)}</p>
        </aside>
      </section>

      {/* Visual Tracking Bar */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded shadow-md border border-gray-200 dark:border-gray-700 hover:-translate-y-1 transition-all duration-300">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Savings Success Rate</h2>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          You are currently preserving {savingsPercentage.toFixed(1)}% of your generated income.
        </p>
        
        <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden shadow-inner border border-gray-300 dark:border-gray-600 group">
          <div 
            className="absolute top-0 left-0 h-full rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-[1500ms] ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
            style={{ 
              width: `${Math.max(0, savingsPercentage)}%`,
              backgroundImage: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              backgroundSize: '200% 100%',
              animation: 'gradient-xy 3s ease infinite'
            }}
          >
            <div 
              className="absolute inset-0 w-full h-full opacity-30" 
              style={{ 
                backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)', 
                backgroundSize: '1rem 1rem', 
                animation: 'stripes 1s linear infinite' 
              }}>
            </div>
            <span className="relative z-10 drop-shadow-md text-sm pl-2 tracking-wider">
              {savingsPercentage > 5 ? `${savingsPercentage.toFixed(1)}%` : ''}
            </span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Dashboard;
