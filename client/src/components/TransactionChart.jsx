import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TransactionsChart = () => {
  const [data, setData] = useState(Array(12).fill({ income: 0, expense: 0 }));
  const [isLoading, setIsLoading] = useState(true);

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

      console.log('Received transactions:', transactions); // Verificar los datos recibidos

      // Process transactions to get the income and expense per month
      const processedData = processTransactions(transactions);
      setData(processedData);
      setIsLoading(false);
    };

    fetchTransactions();
  }, []);

  const processTransactions = (transactions) => {
    const monthlyData = Array.from({ length: 12 }, () => ({ income: 0, expense: 0 }));

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getFullYear() === 2024) {
        const month = transactionDate.getMonth();
        if (transaction.type === 'income') {
          monthlyData[month].income += transaction.amount;
        } else if (transaction.type === 'expense') {
          monthlyData[month].expense += transaction.amount;
        }
      }
    });

    console.log('Processed monthly data:', monthlyData); // Verificar los datos procesados

    return monthlyData;
  };

  const chartData = {
    labels: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    datasets: [
      {
        label: 'Ingreso',
        data: data.map(month => month.income),
        borderColor: 'rgba(15, 50, 31, 1)',
        backgroundColor: 'rgba(23, 201, 100, 1)',
        borderWidth: 1,
      },
      {
        label: 'Gasto',
        data: data.map(month => month.expense),
        borderColor: 'rgba(59, 14, 30, 1)',
        backgroundColor: 'rgba(213, 17, 85, 1)',
        borderWidth: 1,
      }
    ],
  };

  console.log('Chart data:', chartData); // Verificar los datos del gráfico

  const chartOptions = {
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default TransactionsChart;
