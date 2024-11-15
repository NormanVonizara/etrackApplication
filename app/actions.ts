"use server"

import prisma from "@/lib/prisma"
import {Budget, Transaction} from "@/type";

export async function checkAndAddUser(email: string | undefined) {
    if (!email) return
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!existingUser) {
            await prisma.user.create({
                data: {email}
            })
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur :", error)
    }
}

export async function addBudget(email: string, name: string, amount: number, selectedEmoji: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {email}
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé")
        }
        await prisma.budget.create({
            data: {
                name,
                amount,
                emoji: selectedEmoji,
                userId: user.id
            }
        })
    } catch (error) {
        console.error("Erreur lors de l'ajout du budget :", error)
        throw error
    }
}

export async function getBudget(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {email},
            include: {
                budgets: {
                    include: {
                        transactions: true
                    }
                }
            }
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé !")
        }
        return user.budgets
    } catch (error) {
        console.error("Erreur lors de la récupération des budgets", error)
        throw error
    }
}

export async function getTransactionsByBudgetId(budgetId: string) {
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId
            },
            include: {
                transactions: true
            }
        })
        if (!budget) {
            throw new Error("Budget non trouvé")
        }
        return budget
    } catch (error) {
        console.error("Erreur lors de la récupération du transaction : ", error)
        throw error
    }
}

export async function addTransactionToBudget(budgetId: string, amount: number, description: string) {
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId
            },
            include: {
                transactions: true
            }
        })

        if (!budget) {
            throw new Error("Budget non trouvé")
        }

        const totalTransactions = budget.transactions.reduce((sum, transaction) => {
            return sum + transaction.amount
        }, 0)
        const totalNewTransaction = totalTransactions + amount
        if (totalNewTransaction > budget.amount) {
            throw new Error("Le montant total des transactions dépasse le montant du budget .")
        }
        const newTransaction = await prisma.transaction.create({
            data: {
                amount,
                description,
                emoji: budget.emoji,
                budget: {
                    connect: {
                        id: budget.id
                    }
                }
            }
        })

    } catch (error) {
        console.error("Erreur lors de l'ajout de la transaction :", error)
        throw error
    }
}

export async function deleteBudget(budgetId: string) {
    try {
        await prisma.transaction.deleteMany({
            where: {budgetId}
        })
        await prisma.budget.delete({
            where: {
                id: budgetId
            }
        })
    } catch (error) {
        console.error("Erreur lors de la suppression du budget et de ses transactions associées : ", error)
        throw error
    }
}

export async function deleteTransaction(transactionId: string) {
    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId
            }
        })
        if (!transaction) {
            throw new Error("Transaction non trouvé")
        }
        await prisma.transaction.delete({
            where: {
                id: transactionId
            }
        })
    } catch (error) {
        console.error("Erreur lors de la suppression de la transaction : ", error)
        throw error
    }
}

export async function getTransactionByEmailAndPeriod(email: string, period: string) {
    try {
        const now = new Date()
        let dateLimit
        switch (period) {
            case "last30":
                dateLimit = new Date()
                dateLimit.setDate(now.getDate() - 30)
                break
            case "last90":
                dateLimit = new Date()
                dateLimit.setDate(now.getDate() - 90)
                break
            case "last7":
                dateLimit = new Date()
                dateLimit.setDate(now.getDate() - 7)
                break
            case "last365":
                dateLimit = new Date()
                dateLimit.setDate(now.getFullYear() - 1)
                break
            default:
                throw new Error("Période invalide .")
        }
        const user = prisma.user.findUnique({
            where: {email},
            include: {
                budgets: {
                    include: {
                        transactions: {
                            where: {
                                createdAt: {
                                    gte: dateLimit
                                }
                            },
                            orderBy: {
                                createdAt: "desc"
                            }
                        }
                    }
                }
            }
        })
        if (!user) {
            throw new Error("Utilisateur non trouvé")
        }
        const transactions = user.budgets.flatMap((budget) => {
            budget.transactions.map((transaction) => ({
                ...transaction,
                budgetName: budget.name
            }))
        })
        return transactions
    } catch (error) {
        console.error("Erreur lors de la récupération des transactions :", error)
        throw error
    }
}