import {Transaction} from "@/type";
import Link from "next/link";

interface Props {
    transaction: Transaction
}

export default function TransactionItem ({transaction}: Props) {
    return (
        <li key={transaction.id} className="flex justify-between items-center">
            <div className="my-4">
                <button className="btn">
                    <div className="badge badge-accent">
                        - {transaction.amount} $
                    </div>
                    {transaction.budgetName}
                </button>
            </div>
            <div className="md:hidden flex flex-col items-end">
                <span className="font-bold text-sm">{transaction.description}</span>
                <span className="font-bold text-sm">
                    {transaction.createdAt.toLocaleDateString("fr-FR")}&nbsp;à&nbsp;{transaction.createdAt.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })}
                </span>
            </div>
            <div className="hidden md:flex">
                <span className="font-bold text-sm">
                    {transaction.description}
                </span>
            </div>
            <div className="hidden md:flex">
                <span className="text-gray-500 text-sm">
                    {transaction.createdAt.toLocaleDateString("fr-FR")}&nbsp;à&nbsp;{transaction.createdAt.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })}
                </span>
            </div>
            <div className="hidden md:flex">
                <Link href={`/manage/${transaction.budgetId}`} className="btn">Voir plus</Link>
            </div>
        </li>
    )
}