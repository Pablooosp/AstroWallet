import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Button, Input, DatePicker } from "@nextui-org/react";
import Coin from "../assets/coin.svg";
import Rise from "../assets/rise.svg";
import Fall from "../assets/fall.svg";
import IncomeTransactions from "../components/IncomeTransactions";
import ExpenseTransactions from "../components/ExpenseTransactions";
import TransactionsChart from "../components/TransactionChart";

const Dashboard = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [concept, setConcept] = useState("");
  const [balance, setBalance] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const getUserData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("Usuario no encontrado en el localStorage o email no definido");
      return;
    }

    const userEmail = user.email;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userEmail}`
      );
      if (response.ok) {
        const userData = await response.json();
        setBalance(userData.balance);
        setGastos(userData.gastos);
        setIngresos(userData.ingresos);
      } else {
        console.error("Error al obtener los datos del usuario");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  const updateBalanceAndCreateTransaction = async (
    operation,
    transactionType
  ) => {
    console.log(date);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("Usuario no encontrado en el localStorage o email no definido");
      return;
    }

    const userEmail = user.email;

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${userEmail}/balance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: parseFloat(amount), operation }),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setBalance(updatedUser.balance);
        setGastos(updatedUser.gastos);
        setIngresos(updatedUser.ingresos);
        console.log("Usuario actualizado:", updatedUser);
      } else {
        console.error("Error al actualizar el balance");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }

    try {
      const transactionDate = new Date(date.year, date.month - 1, date.day);
      const response2 = await fetch(
        `http://localhost:3000/api/transactions/users/${userEmail}/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: transactionDate.toISOString(),
            type: transactionType,
            amount: parseFloat(amount),
            name: concept,
          }),
        }
      );
      if (!response2.ok) {
        throw new Error(`Error: ${response2.statusText}`);
      }

      const data = await response2.json();
      console.log("Transacción creada:", data);
      setDate(new Date());
      setAmount("");
      setConcept("");
      setShowIncomeModal(false);
      setShowExpenseModal(false);
    } catch (error) {
      console.error("Error al crear la transacción:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="w-full h-[80%]">
      <Header />
      <section className="w-full h-full border-y-1 border-[#867979] bg-[#0D0D0E]">
        <div className="w-full h-[15%] flex justify-between items-center">
          <p className="mx-10 font-bold text-4xl">Vista general 🏛️</p>
          <div className="mx-10 flex items-center justify-center">
            <Button
              onClick={() => setShowIncomeModal(true)}
              className="mr-4 bg-[#0f321f] w-28 hover:bg-[#17c663] hover:text-[#0f321f]"
              color="success"
              variant="bordered"
            >
              Ingreso 🤑
            </Button>
            <Button
              onClick={() => setShowExpenseModal(true)}
              className="ml-4 bg-[#3b0e1e] w-28 hover:bg-[#f2125f] hover:text-[#3b0e1e]"
              color="danger"
              variant="bordered"
            >
              Gasto 😤
            </Button>
          </div>
        </div>
        <div className="flex justify-center items-start w-full h-[15%]">
          <div className="m-4 mt-8 border border-[#867979] bg-black rounded-lg h-[100%] w-[30%] flex justify-start items-center">
            <div className="w-14 h-14 bg-[#0d1e1a] rounded-md ml-4">
              <img src={Rise} alt="" />
            </div>
            <div className="flex flex-col items-start justify-center gap-0 ml-2">
              <p className="text-[#979ca5]">Ingresos totales</p>
              <p className="text-3xl font-mono">${ingresos}</p>
            </div>
          </div>
          <div className="m-4 mt-8 border border-[#867979] bg-black rounded-lg h-[100%] w-[30%] flex items-center justify-start">
            <div className="w-14 h-14 bg-[#211315] rounded-md ml-4">
              <img src={Fall} alt="" />
            </div>
            <div className="flex flex-col items-start justify-center gap-0 ml-2">
              <p className="text-[#979ca5]">Gastos totales</p>
              <p className="text-3xl font-mono">${gastos}</p>
            </div>
          </div>
          <div className="m-4 mt-8 border border-[#867979] bg-black rounded-lg h-[100%] w-[30%] flex justify-start">
            <img src={Coin} alt="" className="w-14 ml-4" />
            <div className="flex flex-col items-start justify-center gap-0 ml-2">
              <p className="text-[#979ca5]">Balance</p>
              <p className="text-3xl font-mono">${balance}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-start h-[50%] w-full mt-8">
          <IncomeTransactions></IncomeTransactions>
          <ExpenseTransactions></ExpenseTransactions>
        </div>
      </section>
      <section className="w-full h-[100%] bg-[#0D0D0E] pt-8">
        <p className="mx-10 font-bold text-4xl">Vista gráfica 🔎</p>
        <div
          id="chart"
          className="border border-[#867979] bg-black rounded-lg w-[70%] h-[80%] mx-auto mt-10"
        >
          <TransactionsChart></TransactionsChart>
        </div>
      </section>
      {showIncomeModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-[#0D0D0E] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
              <div className="bg-[#0D0D0E] px-4 pt-5 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 p-10 text-center sm:mt-0 sm:text-left flex flex-col items-center justify-center">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Crear ingreso
                    </h3>
                    <div className="mt-2 w-60">
                      <form action="submit">
                        <Input
                          type="text"
                          label="Concepto"
                          aria-label="Concepto"
                          isRequired
                          value={concept}
                          onChange={(e) => setConcept(e.target.value)}
                        ></Input>
                        <Input
                          className="mt-2"
                          type="number"
                          label="Cantidad"
                          aria-label="Cantidad"
                          value={amount}
                          isRequired
                          onChange={(e) => setAmount(e.target.value)}
                        ></Input>
                        <DatePicker
                          className="mt-2"
                          aria-label="Fecha"
                          onChange={(date) => setDate(date)}
                        ></DatePicker>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black px-4 py-3 flex items-center justify-center">
                <Button
                  color="danger"
                  onPress={() => setShowIncomeModal(false)}
                  className="m-2"
                >
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={() =>
                    updateBalanceAndCreateTransaction("sum", "income")
                  }
                  className="m-2"
                >
                  Crear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showExpenseModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-[#0D0D0E] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
              <div className="bg-[#0D0D0E] px-4 pt-5 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 p-10 text-center sm:mt-0 sm:text-left flex flex-col items-center justify-center">
                    <h3 className="text-lg leading-6 font-medium text-white">
                      Crear gasto
                    </h3>
                    <div className="mt-2 w-60">
                      <form action="submit">
                        <Input
                          type="text"
                          label="Concepto"
                          aria-label="Concepto"
                          isRequired
                          value={concept}
                          onChange={(e) => setConcept(e.target.value)}
                        ></Input>
                        <Input
                          className="mt-2"
                          type="number"
                          label="Cantidad"
                          aria-label="Cantidad"
                          value={amount}
                          isRequired
                          onChange={(e) => setAmount(e.target.value)}
                        ></Input>
                        <DatePicker
                          className="mt-2"
                          aria-label="Fecha"
                          onChange={(date) => setDate(date)}
                        ></DatePicker>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-black px-4 py-3 flex items-center justify-center">
                <Button
                  color="danger"
                  onPress={() => setShowExpenseModal(false)}
                  className="m-2"
                >
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={() =>
                    updateBalanceAndCreateTransaction("subtract", "expense")
                  }
                  className="m-2"
                >
                  Crear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
