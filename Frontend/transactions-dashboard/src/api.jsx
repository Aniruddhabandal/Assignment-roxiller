import axios from 'axios';

const API_BASE_URL = ' http://localhost:3000/api'; 

export const fetchTransactions = (month, page = 1, search = '') =>
  axios.get(`${API_BASE_URL}/transactions`, {
    params: { month, page, search },
  });

export const fetchStatistics = (month) =>
  axios.get(`${API_BASE_URL}/statistics`, { params: { month } });

export const fetchBarChartData = (month) =>
  axios.get(`${API_BASE_URL}/bar-chart`, { params: { month } });

