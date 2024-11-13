"use server"

import prisma from "@/lib/prisma"

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

export async function addBudget (email:string, name:string, amount:string, selectedEmoji:string) {
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
                emoji : selectedEmoji,
                userId: user.id
            }
        })
    } catch (error) {
        console.error("Erreur lors de l'ajout du budget :", error)
        throw error
    }
}

export async function getBudget(email:string) {
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