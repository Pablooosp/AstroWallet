import { Input, Button, Radio, DatePicker } from "@nextui-org/react";
import { useState } from "react";


const TransactionForm = ({ type, closeModal }) => {
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const transactionType = type === 'income' ? 'Ingreso' : 'Gasto';
  const userEmail = 'user@example.com'; // Reemplaza con el email real del usuario
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/users/${userEmail}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.toISOString(),
          type,
          amount,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Transacción creada:', data);
      // Opcional: limpiar el formulario después de crear la transacción
      setDate(new Date());
      setAmount('');
      setName('');
      closeModal();
    } catch (error) {
      console.error('Error al crear la transacción:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">{`Crear ${transactionType}`}</h2>
      <div className="mb-4">
        <Input
          fullWidth
          label="Nombre"
          placeholder="Nombre de la transacción"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <DatePicker
          label="Fecha"
          value={date}
          onChange={setDate}
          required
        />
      </div>
      <div className="mb-4">
        <Input
          fullWidth
          type="number"
          label="Cantidad"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <Radio.Group value={type} aria-label="Tipo de Transacción">
          <Radio value="income" isDisabled>
            Ingreso
          </Radio>
          <Radio value="expense" isDisabled>
            Gasto
          </Radio>
        </Radio.Group>
      </div>
      <Button type="submit" shadow color="primary" auto>
        Crear {transactionType}
      </Button>
    </form>
  );
};

export default TransactionForm;
