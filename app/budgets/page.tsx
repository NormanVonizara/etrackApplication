"use client"

import {Wrapper} from "@/app/components/Wrapper";
import {useUser} from "@clerk/nextjs";
import {useState} from "react";

export default function Page() {
    const {user} = useUser()
    const {budgetName, setBudgetName} = useState<string>("")
    const {budgetAmount, setBudgetAmount} = useState<string>("")
    return (
        <Wrapper>
            <button className="btn" onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>Nouveau Budget
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Création d'un Budget</h3>
                    <div className="w-full flex flex-col">
                        <input
                            type="text"
                            value={budgetName}
                            placeholder="Nom du budget"
                            onChange={(e) => (setBudgetName(budgetName))}
                        />
                    </div>
                </div>
            </dialog>
        </Wrapper>
    )
}