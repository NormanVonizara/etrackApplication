"use client"

import {UserButton, useUser} from "@clerk/nextjs"
import Link from "next/link"

export default function Navbar () {
    const {isLoaded, isSignedIn, user} = useUser()
    return(
        <div className="bg-base-200/30 px-5 md:px-[10%] py-4">
            {isLoaded && (
                (isSignedIn ? (
                    <>
                            <div className="flex items-center justify-between">
                                <div className="flex text-2xl items-center font-bold">
                                    e<span className="text-accent">.Track</span>
                                </div>
                                <div className="md:flex hidden">
                                    <Link href="" className="btn">Mes Budgets</Link>
                                    <Link href="" className="btn mx-4">Tableau de bord</Link>
                                    <Link href="" className="btn">Mes Transactions</Link>
                                </div>
                                <UserButton/>
                            </div>
                            <div className="md:hidden flex mt-4 justify-center">
                                <Link href="" className="btn btn-sm">Mes Budgets</Link>
                                <Link href="" className="btn btn-sm mx-4">Tableau de bord</Link>
                                <Link href="" className="btn btn-sm">Mes Transactions</Link>
                            </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex text-2xl items-center font-bold">
                            e<span className="text-accent">.Track</span>
                        </div>
                        <div className="flex justify-center">
                            <Link href="/sign-in" className="btn btn-sm">Se connecter</Link>
                            <Link href="/sign-up" className="btn btn-sm btn-accent mx-4">S'inscrire</Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}