const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/transactionsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

  const transactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sold: { type: Boolean, default: false },
    saleAmount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  });
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  

// GET API with Search and Pagination
app.get('/api/transactions', async (req, res) => {
  try {
    const { search = '', page = 1, perPage = 10 } = req.query;

    // Pagination values
    const limit = parseInt(perPage, 10) || 10;
    const skip = (parseInt(page, 10) - 1) * limit;

    // Search criteria
    const searchCriteria = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: { $regex: search, $options: 'i' } }, // Optional: For price as string
          ],
        }
      : {};

    // Query the database
    const transactions = await Transaction.find(searchCriteria)
      .skip(skip)
      .limit(limit);

    // Count total records for pagination metadata
    const totalRecords = await Transaction.countDocuments(searchCriteria);

    res.json({
      data: transactions,
      metadata: {
        currentPage: parseInt(page, 10),
        perPage: limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/statistics', async (req, res) => {
  try {
    const { year, month } = req.query;

    // Validate input
    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required.' });
    }

    // Parse year and month into a date range
    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 1); // Start of the next month

    // Filter transactions within the specified month
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lt: endDate },
    });

    // Calculate statistics
    const totalSaleAmount = transactions
      .filter(transaction => transaction.sold)
      .reduce((sum, transaction) => sum + transaction.saleAmount, 0);

    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalNotSoldItems = transactions.filter(transaction => !transaction.sold).length;

    // Respond with statistics
    res.json({
      year,
      month,
      statistics: {
        totalSaleAmount,
        totalSoldItems,
        totalNotSoldItems,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/bar-chart', async (req, res) => {
  try {
    const { month } = req.query;

    // Validate input
    if (!month) {
      return res.status(400).json({ message: 'Month is required (format: MM).' });
    }

    // Parse the month into a date range (any year)
    const monthStart = new Date(`2024-${month}-01`); // Assuming 2024 as a reference year
    const monthEnd = new Date(`2024-${month}-01`);
    monthEnd.setMonth(monthEnd.getMonth() + 1); // Next month start date

    // Fetch transactions within the selected month (ignoring year)
    const transactions = await Transaction.find({
      date: { $gte: monthStart, $lt: monthEnd },
    });

    // Define price ranges
    const ranges = [
      { label: '0-100', min: 0, max: 100 },
      { label: '101-200', min: 101, max: 200 },
      { label: '201-300', min: 201, max: 300 },
      { label: '301-400', min: 301, max: 400 },
      { label: '401-500', min: 401, max: 500 },
      { label: '501-600', min: 501, max: 600 },
      { label: '601-700', min: 601, max: 700 },
      { label: '701-800', min: 701, max: 800 },
      { label: '801-900', min: 801, max: 900 },
      { label: '901-above', min: 901, max: Infinity },
    ];

    // Calculate the count of items in each range
    const rangeCounts = ranges.map(range => ({
      label: range.label,
      count: transactions.filter(
        transaction => transaction.price >= range.min && transaction.price < range.max
      ).length,
    }));

    // Respond with range data
    res.json({ month, data: rangeCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/pie-chart', async (req, res) => {
  try {
    const { month } = req.query;

    // Validate input
    if (!month) {
      return res.status(400).json({ message: 'Month is required (format: MM).' });
    }

    // Parse the month into a date range (ignoring year)
    const monthStart = new Date(`2024-${month}-01`); // Using 2024 as a reference year
    const monthEnd = new Date(`2024-${month}-01`);
    monthEnd.setMonth(monthEnd.getMonth() + 1);

    // Query transactions within the selected month
    const transactions = await Transaction.find({
      date: { $gte: monthStart, $lt: monthEnd },
    });

    // Calculate counts per category
    const categoryCounts = transactions.reduce((acc, transaction) => {
      const category = transaction.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Format response data
    const data = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    // Respond with pie chart data
    res.json({ month, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
