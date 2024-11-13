import {Budget} from "@/type"
import clsx from "clsx"

interface Props {
    budget: Budget,
    enableHover?: number
}

export default function BudgetItem({budget, enableHover}: Props) {
    const transactionsCount = budget.transactions ? budget.transactions.length : 0
    const totalTransactionAmount =
        budget.transactions ?
            budget.transactions.reduce((sum, transaction) => sum + transaction.amount, 0 ) : 0
    const remainingAmount = budget.amount - totalTransactionAmount
    const progressValue =
        totalTransactionAmount > budget.amount ?
            100 :
            (totalTransactionAmount / budget.amount) * 100
    const hoverClasse = enableHover === 1 ?
        "hover:shadow-xl hover:border-accent" :
        ""
    return (
        <li key={budget.id} className={clsx("p-4 rounded-xl border-2 border-base-300 list-none", hoverClasse)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="bg-accent/20 rounded-full text-xl h-12 w-12 flex justify-center items-center">
                        {budget.emoji}
                    </div>
                    <div className="flex flex-col ml-3">
                        <span className="text-xl font-bold">{budget.name}</span>
                        <span className="text-gray-500 text-sm">{transactionsCount} transaction(s)</span>
                    </div>
                </div>
                <div className="text-xl font-bold text-accent">${budget.amount}</div>
            </div>
            <div className="my-5">
                <progress className="progress progress-accent w-full" value={progressValue} max="100"></progress>
            </div>
            <div className="flex items-center justify-between text-gray-500 text-sm">
                <span className="">{totalTransactionAmount} $ dépensés</span>
                <span className="">{remainingAmount} $ restants</span>
            </div>
        </li>
    )
}