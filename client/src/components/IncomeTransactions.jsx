import React, { useState, useEffect } from "react";

// Función para formatear la fecha
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", options);
};

const IncomeTransactions = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : null;

      if (!userEmail) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(
        `http://localhost:3000/api/transactions/users/${userEmail}/transactions`
      );
      const transactions = await res.json();
      const incomeTransactions = transactions.filter(
        (transaction) => transaction.type === "income"
      );
      setData(incomeTransactions);
      setIsLoading(false);
    };

    fetchTransactions();
  }, []);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Paginación
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedData.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (key) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === key
      ? sortConfig.direction === "ascending"
        ? "asc"
        : "desc"
      : undefined;
  };

  const totalPages = Math.ceil(sortedData.length / transactionsPerPage);

  return (
    <div className="h-[99%] w-[45%] m-8">
      <div className="border border-[#867979] bg-black rounded-lg h-[100%] w-[100%]">
        <div className="capitalize rounded-lg text-center p-2 bg-[#0f321f] text-[#17c964]">
          Ingresos
        </div>
        <div className="flex-1 rounded-b-lg"> {/* Agregamos la clase rounded-b-lg para redondear la parte inferior */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
          ) : (
            <table className="w-full rounded-lg bg-gray-800 text-gray-300">
              <thead>
                <tr className="bg-[#0d0d0e] text-gray-100 rounded-t-lg">
                  <th
                    className={`py-2 px-4 cursor-pointer rounded-tl-lg ${getClassNamesFor(
                      "name"
                    )}`}
                    onClick={() => requestSort("name")}
                  >
                    Concepto
                  </th>
                  <th
                    className={`py-2 px-4 cursor-pointer ${getClassNamesFor(
                      "amount"
                    )}`}
                    onClick={() => requestSort("amount")}
                  >
                    Cantidad
                  </th>
                  <th
                    className={`py-2 px-4 cursor-pointer rounded-tr-lg ${getClassNamesFor(
                      "date"
                    )}`}
                    onClick={() => requestSort("date")}
                  >
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((item, index) => (
                  <tr
                    key={item._id}
                    className={index % 2 === 0 ? "bg-black" : "bg-[#0d0d0e]"}
                  >
                    <td
                      className={`py-2 px-4 text-center ${
                        index === currentTransactions.length - 1 ? "" : ""
                      } border-b rounded-bl-lg border-gray-700`}
                    >
                      {item.name}
                    </td>
                    <td
                      className={`py-2 px-4 text-center ${
                        index === currentTransactions.length - 1 ? "" : ""
                      } border-b border-gray-700`}
                    >
                      {item.amount}$
                    </td>
                    <td
                      className={`py-2 px-4 text-center ${
                        index === currentTransactions.length - 1 ? "" : ""
                      } border-b rounded-br-lg border-gray-700`}
                    >
                      {formatDate(item.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {totalPages > 1 && ( /* Condición para mostrar la paginación solo si hay más de una página */
        <div className="flex justify-center mt-2">
          {Array.from({
            length: Math.ceil(sortedData.length / transactionsPerPage),
          }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`py-1 px-3 bg-[#3f3f46] text-white rounded-lg mx-1 text-sm ${
                currentPage === index + 1
                  ? "bg-gray-700"
                  : "hover:bg-gray-700 hover:text-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomeTransactions;
