// backend/prisma/seed.ts
// Popula o banco com usuários, categorias, fretes e produtos padrão.
// Cada bloco só roda se a respectiva tabela estiver vazia, então é seguro
// executar a cada subida: não recria o que você apagou nem sobrescreve nada.
// Conferido com o schema.prisma: models User, Category, Shipping, Product, ProductCategory e ProductImages.

import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Senhas vêm do ambiente: nenhum hash ou senha real fica no repositório.
// O fallback existe só para desenvolvimento local.
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

const categories = [
    {
        id: '5837c3d3-cab1-4c79-b17c-779563a7744c',
        name: 'Periféricos',
        slug: 'perifericos',
        imageUrl: 'https://i.ibb.co/MxhyV9BG/images.jpg',
    },
    {
        id: '8b548091-77da-4ba2-85db-a2a836e4433a',
        name: 'SSD/HD',
        slug: 'ssd-hd',
        imageUrl: 'https://i.ibb.co/Xf9K2BrJ/images.jpg',
    },
    {
        id: '9e0512ea-52ff-4097-b97d-37418b1fb823',
        name: 'Placas de vídeo',
        slug: 'placas-de-video',
        imageUrl: 'https://i.ibb.co/xSKWXzrj/images.jpg',
    },
]

const shippings = [
    { id: '5fec84d8-8cc7-4515-8a1c-b3b5529fb210', name: 'Express', price: '10.00', deliveryTime: 3 },
    { id: 'd9354155-cd97-47ca-b5a4-54c406258a12', name: 'Gratuito', price: '0.00', deliveryTime: 7 },
]

// categoryId vem do ProductCategory.csv e images do ProductImages.csv.
// O Mouse Gamer Redragon Cobra ficou de fora: está deletado (deletedAt preenchido).
const products = [
    {
        id: '40d6e5b6-2045-407d-ab4c-70863588bdd9',
        name: 'Microfone Gamer USB RGB',
        slug: 'microfone-gamer-usb-rgb',
        price: '249.99',
        description:
            'Microfone gamer USB com iluminação RGB, suporte de mesa e captação de áudio projetada para chamadas, transmissões ao vivo, gravações e jogos.',
        stock: 10,
        categoryId: '5837c3d3-cab1-4c79-b17c-779563a7744c', // Periféricos
        images: [
            { id: '7b045542-70bc-425c-b04d-0b1d35540c13', url: 'https://i.ibb.co/p6nTzfp2/042035608dd4.jpg', order: 0, isCover: true },
            { id: '7716afce-2451-434e-a72c-1adbc2e3140f', url: 'https://i.ibb.co/0RbTVB73/0910547fe34b.jpg', order: 1, isCover: false },
        ],
    },
    {
        id: '81e836ae-49a3-4c68-8ec7-5240b53ec85e',
        name: 'Mouse Pad Gamer Anime',
        slug: 'mouse-pad-gamer-anime',
        price: '89.90',
        description:
            'Mouse pad gamer com estampa inspirada em anime, superfície otimizada para movimentos precisos do mouse e acabamento desenvolvido para maior durabilidade.',
        stock: 4,
        categoryId: '5837c3d3-cab1-4c79-b17c-779563a7744c', // Periféricos
        images: [
            { id: 'd6910373-2b3a-46bd-8a05-abe48f57dda9', url: 'https://i.ibb.co/cSjT45yJ/7f80986787a5.webp', order: 0, isCover: true },
        ],
    },
    {
        id: 'a9872a58-6626-4aaa-bb85-c0a5bf91af2e',
        name: 'Placa de Vídeo NVIDIA GeForce RTX 5070 Ti Shadow 3X',
        slug: 'placa-de-video-nvidia-geforce-rtx-5070-ti-shadow-3x',
        price: '6499.90',
        description:
            'Placa de vídeo NVIDIA GeForce RTX 5070 Ti com sistema de refrigeração Shadow 3X, desenvolvida para oferecer alto desempenho em jogos, criação de conteúdo e aplicações gráficas.',
        stock: 0, // sem estoque de propósito: útil para testar o erro de estoque do checkout
        categoryId: '9e0512ea-52ff-4097-b97d-37418b1fb823', // Placas de vídeo
        images: [
            { id: 'a9639caf-cdfa-497f-862b-9df407d378fb', url: 'https://i.ibb.co/9kwtCdQ5/bc93acf35dfb.webp', order: 0, isCover: true },
        ],
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

    // 2. Categorias
    if ((await prisma.category.count()) === 0) {
        await prisma.category.createMany({ data: categories })
        console.log('Seed: categorias criadas.')
    }

    // 3. Fretes
    if ((await prisma.shipping.count()) === 0) {
        await prisma.shipping.createMany({ data: shippings })
        console.log('Seed: fretes criados.')
    }

    // 4. Produtos (dependem das categorias; vínculo por productCategories, mais as imagens)
    if ((await prisma.product.count()) === 0) {
        for (const { categoryId, images, ...p } of products) {
            await prisma.product.create({
                data: {
                    ...p,
                    isActive: true,
                    productCategories: { create: { categoryId } },
                    images: { create: images },
                },
            })
        }
        console.log('Seed: produtos criados.')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())