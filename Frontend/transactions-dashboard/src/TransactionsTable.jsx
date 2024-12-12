import React from 'react';

const TransactionsTable = ({ transactions, search, setSearch, page, setPage }) => {
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="transactions-table">
      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id=0}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default TransactionsTable;
