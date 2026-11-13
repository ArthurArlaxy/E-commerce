// backend/prisma/seed.ts
// Popula o banco com usuários, categorias, fretes e produtos padrão.
// Cada bloco só roda se a respectiva tabela estiver vazia, então é seguro
// Conferido com o schema.prisma: models User, Category, Shipping, Product, ProductCategory e ProductImages.

import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

function seedPassword(envName: string, devFallback: string) {
    const value = process.env[envName]
    if (value) return value
    if (process.env.NODE_ENV === 'production') {
        throw new Error(`${envName} é obrigatória em produção`)
    }
    return devFallback
}

const users = [
    {
        id: '997ec7e1-14ca-4e42-9604-bec1f0e38dcf',
        name: 'Administrador',
        email: 'admin@gmail.com',
        role: Role.admin,
        passwordEnv: 'SEED_ADMIN_PASSWORD',
        passwordFallback: 'Admin@12345',
    },
    {
        id: 'f9da7f7c-8582-4c24-89d7-0c04962ac82f',
        name: 'Arthur Albuquerque Amancio De Oliveira',
        email: 'arthur@gmail.com',
        role: Role.client,
        passwordEnv: 'SEED_CLIENT_PASSWORD',
        passwordFallback: 'Client@12345',
    },
]

async function main() {
    // 1. Usuários (o admin não pode ser criado pela API: createUser força role "client")
    if ((await prisma.user.count()) === 0) {
        for (const { passwordEnv, passwordFallback, ...u } of users) {
            const password = bcrypt.hashSync(seedPassword(passwordEnv, passwordFallback), 10)
            await prisma.user.create({ data: { ...u, password } })
        }
        console.log('Seed: usuários criados.')
    }

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())