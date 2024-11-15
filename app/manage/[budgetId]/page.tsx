"use client"

import {useEffect, useState} from "react"
import {addTransactionToBudget, deleteBudget, deleteTransaction, getTransactionsByBudgetId} from "@/app/actions"
import {Budget} from "@/type";
import BudgetItem from "@/app/components/budgetItem"
import {Wrapper} from "@/app/components/Wrapper"
import {Send, Trash2} from "lucide-react"
import CurrencyInput from "react-currency-input-field"
import {toast} from "react-toastify"
import Swal from "sweetalert2"
import {redirect} from "next/navigation"

export default function Page({params}: { params: Promise<{ budgetId: string }> }) {
    const [budgetId, setBudgetId] = useState<string>("")
    const [budget, setBudget] = useState<Budget>()

    async function fetchBudgetData(budgetId: string) {
        try {
            if (budgetId) {
                const budgetData = await getTransactionsByBudgetId(budgetId)
                setBudget(budgetData)
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du budget et de la transaction :", error)
            throw error
        }
    }

    const [description, setDescription] = useState<string>("")
    const [amount, setAmount] = useState<string>("1000")
    const handleAmount = (value: string) => {
        setAmount(value)
    }
    const handleAddTransaction = async () => {
        if (!amount || !description) {
            toast.error("Veuillez remplir tous les champs")
            return
        }
        try {
            const amountNumber = parseFloat(amount)
            if (isNaN(amountNumber) || amountNumber <= 0) {
                throw new Error("Le montant doit être un nombre positif.");
            }
            const newTransaction = await addTransactionToBudget(budgetId, amountNumber, description)
            toast.success("Transaction ajoutée avec succès")
            fetchBudgetData(budgetId)
            setDescription("")
            setAmount("1000")
        } catch (error) {
            toast.error(`Vous avez dépassé votre budget ${error}`)
        }
    }
    useEffect(() => {
        const getId = async () => {
            const resolveParams = await params
            setBudgetId(resolveParams.budgetId)
            fetchBudgetData(resolveParams.budgetId)
        }
        getId()
    }, [params])
    const handleDeleteBudget = async () => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Êtes vous sûr de vouloir supprimer ce budget et toutes ses transactions associées ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Non, annuler',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    deleteBudget(budgetId)
                    Swal.fire('Supprimé!', 'L\'élément a été supprimé.', 'success')
                    redirect("/budgets")
                } catch (error) {
                    console.error("Erreur lors de la suppression du budget : ", error)
                    throw error
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Annulé', 'L\'élément n\'a pas été supprimé.', 'info')
            }
        });
    }
    const handleDeleteTransaction = async (transactionId: string) => {
        Swal.fire({
            title: 'Confirmation',
            text: 'Êtes vous sûr de vouloir supprimer cette transaction ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Non, annuler',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    deleteTransaction(transactionId)
                    Swal.fire('Supprimé!', 'L\'élément a été supprimé.', 'success')
                    fetchBudgetData(budgetId)
                } catch (error) {
                    console.error("Erreur lors de la suppression du budget : ", error)
                    throw error
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Annulé', 'L\'élément n\'a pas été supprimé.', 'info')
            }
        });
    }
    return (
        <Wrapper>
            {budget &&
				<div className="flex md:flex-row flex-col">
					<div className="md:w-1/3 w-full">
						<div className="flex justify-end mb-4">
							<button onClick={() => handleDeleteBudget()} className="btn btn-error rounded-full">
								<Trash2/>
							</button>
						</div>
						<BudgetItem budget={budget} enableHover={0}/>
						<div className="space-y-4 flex flex-col mt-4">
							<input
								type="text"
								value={description}
								placeholder="Description"
								onChange={(e) => (setDescription(e.target.value))}
								className="input input-bordered"
							/>
							<CurrencyInput
								id="budgetAmount"
								name="budgetAmount"
								placeholder="Montant"
								value={amount}
								defaultValue={1000}
								decimalsLimit={2}
								onValueChange={handleAmount}
								className="input input-bordered"
								prefix="$"
							/>
							<button onClick={handleAddTransaction} className="btn">
								Ajouter la transaction
							</button>
						</div>
					</div>
                    {
                        budget?.transactions && budget.transactions.length > 0 ?
                            (
                                <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">
                                    <table className="table table-zebra">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Montant</th>
                                                <th>Description</th>
                                                <th>Date</th>
                                                <th>Heure</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                budget.transactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <th className="text-lg md:text-3xl">{transaction.emoji}</th>
                                                        <th>
                                                            <div className="badge badge-accent badge-xs md:badge-sm">
                                                                - {transaction.amount}$
                                                            </div>
                                                        </th>
                                                        <td>{transaction.description}</td>
                                                        <td>{transaction.createdAt.toLocaleDateString("fr-FR")}</td>
                                                        <td>{transaction.createdAt.toLocaleTimeString("fr-FR", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit"
                                                        })}</td>
                                                        <td>
                                                            <button onClick={() => handleDeleteTransaction(transaction.id)} className="btn btn-sm">
                                                                <Trash2 className="w-4"/>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            ) :
                            (
                                <div className="md:w-2/3 mt-10 md:ml-4 flex items-center justify-center">
                                    <Send strokeWidth={1.5} className="w-8 h-8 text-accent"/>
                                    <span className="text-gray-500 ml-2">Aucune Transaction ...</span>
                                </div>
                            )
                    }
				</div>
            }
        </Wrapper>
    )
}