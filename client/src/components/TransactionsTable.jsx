import React, { useState, useEffect } from "react";
import Delete from "../assets/delete.svg"

// Función para formatear la fecha
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", options);
};

const TransactionsTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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
      setData(transactions);
      setIsLoading(false);
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    const res = await fetch(
      `http://localhost:3000/api/transactions/${id}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setData(data.filter((transaction) => transaction._id !== id));
    }
  };

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

  return (
    <div className="h-[100%] w-[100%]">
      <div className="border border-[#867979] bg-black rounded-lg h-[100%] w-[100%]">
        <div className="capitalize rounded-lg text-center p-2 bg-[#3f4343] text-[#ece8e8]">
          Todas las transacciones
        </div>
        <div className="flex-1 rounded-b-lg">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
            </div>
          ) : (
            <>
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
                      className={`py-2 px-4 cursor-pointer ${getClassNamesFor(
                        "type"
                      )}`}
                      onClick={() => requestSort("type")}
                    >
                      Tipo
                    </th>
                    <th
                      className={`py-2 px-4 cursor-pointer ${getClassNamesFor(
                        "date"
                      )}`}
                      onClick={() => requestSort("date")}
                    >
                      Fecha
                    </th>
                    <th className="py-2 px-4 cursor-pointer rounded-tr-lg">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((item, index) => (
                    <tr
                      key={item._id}
                      className={index % 2 === 0 ? "bg-black" : "bg-[#0d0d0e]"}
                    >
                      <td className={`py-2 px-4 text-center border-b rounded-bl-lg border-gray-700`}>
                        {item.name}
                      </td>
                      <td className={`py-2 px-4 text-center border-b border-gray-700`}>
                        {item.amount}$
                      </td>
                      <td className={`py-2 px-4 text-center border-b border-gray-700`}>
                        <span className={`inline-block px-2 py-1 font-semibold text-sm rounded ${
                          item.type === "income" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className={`py-2 px-4 text-center border-b border-gray-700`}>
                        {formatDate(item.date)}
                      </td>
                      <td className="py-2 px-4 text-center border-b border-gray-700">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          <img src={Delete} alt="" width="20" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
