"use client"

import {Wrapper} from "@/app/components/Wrapper";
import {useUser} from "@clerk/nextjs";
import {useEffect, useState} from "react";
import CurrencyInput from 'react-currency-input-field'
import EmojiPicker from 'emoji-picker-react'
import {addBudget, getBudget} from "@/app/actions"
import {toast} from 'react-toastify'
import {Budget} from "@/type"
import Link from "next/link"
import BudgetItem from "@/app/components/budgetItem";
import {Landmark} from "lucide-react";

export default function Page() {

    const {user} = useUser()
    const [budgetName, setBudgetName] = useState<string>("")
    const [budgetAmount, setBudgetAmount] = useState<string>("1000")
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
    const [selectedEmoji, setSelectedEmoji] = useState<string>("")
    const [budgets, setBudgets] = useState<Budget[]>([])

    const handleBudgetAmount = (value: string) => {
        setBudgetAmount(value)
    }
    const handleEmojiSelect = (emojiObject: { emoji: string }) => {
        setSelectedEmoji(emojiObject.emoji)
        setShowEmojiPicker(false)
    }
    const handleAddBudget = async () => {
        try {
            const amount = parseFloat(budgetAmount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error("Le montant doit être un nombre positif.");
            }
            await addBudget(
                user?.primaryEmailAddress?.emailAddress as string,
                budgetName,
                amount,
                selectedEmoji
            )
            fetchBudgets()
            const modal = document.getElementById("my_modal_3") as HTMLDialogElement
            if (modal) {
                modal.close()
            }
            toast.success("Nouveau budget ajouté avec succès !")
            setBudgetName("")
            setBudgetAmount("1000")
            setSelectedEmoji("")
            setShowEmojiPicker(false)
        } catch (error) {
            toast.error(`Erreur lors de l'ajout d'un budget ${error}`)
        }
    }
    const fetchBudgets = async () => {
        if (user?.primaryEmailAddress?.emailAddress) {
            try {
                const userBudgets = await getBudget(user?.primaryEmailAddress?.emailAddress)
                setBudgets(userBudgets)
            } catch (error) {
                toast.error(`Erreur lors de la récupération du budget ${error}`)
            }
        }
    }
    useEffect(() => {
        fetchBudgets()
    }, [user?.primaryEmailAddress?.emailAddress])
    return (
        <Wrapper>
            <button className="btn"
                    onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
                Nouveau Budget
                <Landmark className="w-4"/>
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Création d&apos;un Budget</h3>
                    <div className="w-full flex flex-col py-5">
                        <input
                            type="text"
                            value={budgetName}
                            placeholder="Nom du budget"
                            onChange={(e) => (setBudgetName(e.target.value))}
                            className="input input-bordered mb-3"
                        />
                        <CurrencyInput
                            id="budgetAmount"
                            name="budgetAmount"
                            placeholder="Montant du Budget"
                            value={budgetAmount}
                            defaultValue={1000}
                            decimalsLimit={2}
                            onValueChange={handleBudgetAmount}
                            className="input input-bordered mb-3"
                            prefix="$"
                        />
                        <div className="flex justify-end items-center">
                            <button
                                className="bg-gray-200 transition-all hover:bg-gray-300 hover:border-gray-400 w-12 h-12 rounded-full mb-2 text-2xl border-2 border-gray-300"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                {selectedEmoji || "🫵"}
                            </button>
                        </div>
                        {showEmojiPicker &&
							<div className="flex justify-end mb-5">
								<EmojiPicker onEmojiClick={handleEmojiSelect}/>
							</div>
                        }
                        <button className="btn" onClick={handleAddBudget}>
                            Ajouter un budget
                        </button>
                    </div>
                </div>
            </dialog>
            <ul className="grid md:grid-cols-3 gap-4 my-5">
                {budgets.map((budget) => (
                    <Link href={`/manage/${budget.id}`} key={budget.id}>
                        <BudgetItem budget={budget} enableHover={1}/>
                    </Link>
                ))}
            </ul>
        </Wrapper>
    )
}