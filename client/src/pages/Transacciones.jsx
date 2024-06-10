import React from "react";
import Header from "../components/Header";
import TransactionsTable from "../components/TransactionsTable";

const Transacciones = () => {
    return (
        <div className="w-full h-[80%]">
            <Header></Header>
            <TransactionsTable></TransactionsTable>
        </div>
    );
};

export default Transacciones;