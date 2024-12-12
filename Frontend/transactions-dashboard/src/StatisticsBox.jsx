import React from 'react';

const StatisticsBox = ({ statistics }) => (
  <div className="statistics-box">
    <div>Total Sale Amount: ${statistics.totalSaleAmount}</div>
    <div>Total Sold Items: {statistics.totalSoldItems}</div>
    <div>Total Not Sold Items: {statistics.totalNotSoldItems}</div>
  </div>
);

export default StatisticsBox;
