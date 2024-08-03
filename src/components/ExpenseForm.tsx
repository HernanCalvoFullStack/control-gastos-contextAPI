import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import type { DraftExpense, Value } from "../types"
import { categories } from "../data/categories"
import DatePicker from "react-date-picker"
import "react-calendar/dist/Calendar.css"
import "react-date-picker/dist/DatePicker.css"
import ErrorMessage from "./ErrorMessage"
import { useBudget } from "../hooks/useBudget"


const ExpenseForm = () => {

    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: "",
        category: "",
        date: new Date()
    })

    const [ error, setError ] = useState("")

    const [previousAmount, setPreviousAmount] = useState(0)

    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(() => {
        if(state.editingId) {
            const editingExpense = state.expenses.filter( currentExpense => currentExpense.id === state.editingId)[0]

            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId, state.expenses])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target
        const isAmountField = ["amount"].includes(name)
        
        setExpense({
            ...expense,
            [name] : isAmountField ? +value : value
        })
    }

    const handleChangeDate = (value : Value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validación
        if(Object.values(expense).includes("")) {
            setError("Todos los campos son obligatorios")
            return
        }

        // Validamos que no se supere el límite del presupuesto
        if(expense.amount - previousAmount > remainingBudget) {
            setError("Presupuesto superado")
            return
        }

        // Agregamos o actualizamos un  gasto
        if(state.editingId) {
            dispatch({type: "update-expense", payload: {expense: {id: state.editingId, ...expense}}})
        } else {
            dispatch({type: "add-expense", payload: {expense} })
        }

        // Reiniciamos el state
        setExpense({
            amount: 0,
            expenseName: "",
            category: "",
            date: new Date(),
        })
        setPreviousAmount(0)
    }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
        <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">{state.editingId ? "Actualizar Gasto" : "Nuevo Gasto"}</legend>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="flex flex-col gap-2">
            <label
                htmlFor="expenseName"
                className="text-xl"
            >Nombre Gasto:</label>
            <input 
                type="text" 
                id="expenseName"
                placeholder="Escribe el tipo de Gasto"
                className="bg-slate-100 p-2"
                name="expenseName"
                onChange={handleChange}
                value={expense.expenseName}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label
                htmlFor="amount"
                className="text-xl"
            >Cantidad:</label>
            <input 
                type="numbre" 
                id="amount"
                placeholder="Agrega la Cantidad del Gasto. Ej. 300"
                className="bg-slate-100 p-2"
                name="amount"
                onChange={handleChange}
                value={expense.amount}
            />
        </div>

        <div className="flex flex-col gap-2">
            <label
                htmlFor="category"
                className="text-xl"
            >Categoría:</label>
            <select 
                id="category"
                className="bg-slate-100 p-2"
                name="category"
                onChange={handleChange}
                value={expense.category}
            >
                <option value="">- Seleccione -</option>
                {categories.map( category => (
                    <option 
                        key={category.id}
                        value={category.id}
                    >{category.name}</option>
                ))}
            </select>
        </div>

        <div className="flex flex-col gap-2">
            <label
                htmlFor="amount"
                className="text-xl"
            >Fecha Gasto:</label>
            <DatePicker
                className="bg-slate-100 p-2 border-0"
                value={expense.date}
                onChange={handleChangeDate}
            />
        </div>

        <input 
            type="submit" 
            className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
            value={state.editingId ? "Guardar Cambios" : "Registrar Gasto"}
        />
    </form>
  )
}

export default ExpenseForm