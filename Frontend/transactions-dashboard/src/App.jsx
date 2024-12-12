import React, { useState, useEffect } from 'react';
import { fetchTransactions, fetchStatistics, fetchBarChartData } from './api.jsx';
import TransactionsTable from './TransactionsTable';
import StatisticsBox from './StatisticsBox';
import BarChart from './BarChart';

const App = () => {
  const [month, setMonth] = useState('03'); // Default to March
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);

  // Fetch data on month, search, or page change
  useEffect(() => {
    fetchTransactions(month, page, search).then(({ data }) =>
      setTransactions(data.transactions)
    );
    fetchStatistics(month).then(({ data }) => setStatistics(data.statistics));
    fetchBarChartData(month).then(({ data }) => setBarChartData(data.data));
  }, [month, search, page]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); // Reset page to 1 when month changes
  };

  return (
    <div className="container">
      <h1>Transactions Dashboard</h1>
      <div className="month-selector">
        <label>Select Month: </label>
        <select value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <TransactionsTable
        transactions={transactions}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
      />
      <StatisticsBox statistics={statistics} />
      <BarChart data={barChartData} />
    </div>
  );
};

export default App;
