import Link from "next/link";
import {Wrapper} from "@/app/components/Wrapper";
import BudgetItem from "@/app/components/budgetItem";
import budgets from "@/app/data";

export default function Home() {
    return (
        <Wrapper>
            <div>
                <div className="flex items-center justify-center flex-col py-10 w-full">
                    <div>
                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl font-bold text-center">
                                Prenez le contrôle <br/> de vos finances
                            </h1>
                            <p className="py-6 text-gray-800 text-center">
                                Suivez vos budgets et vos dépenses <br/> en toute simplicité avec notre application
                                intuitive !
                            </p>
                            <div className="flex justify-center items-center">
                                <Link href="/sign-in" className="btn btn-sm md:btn-md btn-outline btn-accent">Se
                                    connecter</Link>
                                <Link href="/sign-up" className="btn btn-sm md:btn-md btn-accent ml-2">S&apos;inscrire</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ul className="grid md:grid-cols-3 gap-4 my-5">
                {budgets.map((budget) => (
                    <Link href={`/manage/${budget.id}`} key={budget.id}>
                        <BudgetItem budget={budget} enableHover={1}/>
                    </Link>
                ))}
            </ul>
        </Wrapper>
    );
}