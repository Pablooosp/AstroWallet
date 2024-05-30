import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Button, Input, DatePicker } from "@nextui-org/react";
import Coin from "../assets/coin.svg";
import Rise from "../assets/rise.svg";
import Fall from "../assets/fall.svg";
import IncomeTransactions from "../components/IncomeTransactions";
import ExpenseTransactions from "../components/ExpenseTransactions";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

const Dashboard = () => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [concept, setConcept] = useState("");
  const [balance, setBalance] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const {
    isOpen: isOpenIncomeModal,
    onOpen: onOpenIncomeModal,
    onOpenChange: onOpenChangeIncomeModal,
    onClose: onCloseIncomeModal
  } = useDisclosure();
  const {
    isOpen: isOpenExpenseModal,
    onOpen: onOpenExpenseModal,
    onOpenChange: onOpenChangeExpenseModal,
    onClose: onCloseExpenseModal
  } = useDisclosure();

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

  const updateBalanceAndCreateTransaction = async (operation, transactionType) => {
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date: transactionDate.toISOString(),
            type: transactionType,
            amount: parseFloat(amount),
            name: concept
          })
        }
      );
      if (!response2.ok) {
        throw new Error(`Error: ${response2.statusText}`);
      }

      const data = await response2.json();
      console.log("Transacción creada:", data);
      setDate(new Date());
      setAmount("");
      setConcept(""); // Corrige la variable 'setName' a 'setConcept'
      onCloseIncomeModal();
      onCloseExpenseModal();
    } catch (error) {
      console.error("Error al crear la transacción:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="w-full h-full">
      <Header />
      <section className="w-full h-[80%] border-y-1 border-[#867979] bg-[#0D0D0E]">
        <div className="w-full h-[15%] flex justify-between items-center">
          <p className="mx-10 font-bold text-4xl">Vista general 🏛️</p>
          <div className="mx-10 flex items-center justify-center">
            <Button
              onClick={onOpenIncomeModal}
              className="mr-4 bg-[#0f321f] w-28 hover:bg-[#17c663] hover:text-[#0f321f]"
              color="success"
              variant="bordered"
            >
              Ingreso 🤑
            </Button>
            <Button
              onClick={onOpenExpenseModal}
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
      <Modal isOpen={isOpenIncomeModal} onOpenChange={onOpenChangeIncomeModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Crear ingreso
          </ModalHeader>
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onCloseIncomeModal}>
              Close
            </Button>
            <Button color="primary" onPress={() => updateBalanceAndCreateTransaction('sum', 'income')}>
              Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenExpenseModal} onOpenChange={onOpenChangeExpenseModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Crear ingreso
          </ModalHeader>
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onCloseExpenseModal}>
              Close
            </Button>
            <Button color="primary" onPress={() => updateBalanceAndCreateTransaction('subtract', 'expense')}>
              Action
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
