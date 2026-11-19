// backend/prisma/seed.ts
// Popula o banco com usuários, categorias, fretes e produtos padrão.
// Cada bloco só roda se a respectiva tabela estiver vazia, então é seguro
// rodar o seed mais de uma vez.
// Conferido com o schema.prisma: models User, Category, ImageFile, Shipping,
// Product, ProductCategory e ProductImages.
//
// As imagens são geradas na hora (gradiente + formas, em WebP) e gravadas como
// bytes na tabela ImageFile, o mesmo formato que a API usa nos uploads.
// Os preços e estoques dos produtos são fictícios, só para popular o catálogo.

import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'
import sharp from 'sharp'
import { randomUUID } from 'node:crypto'

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

// Cores usadas nas imagens geradas de cada categoria (início e fim do gradiente).
const categories = [
    {
        id: 'abc2573d-1893-404d-ae8b-27ccffe3904c',
        name: 'Infraestrutura',
        slug: 'infraestrutura',
        colors: ['#0ea5e9', '#1e3a8a'],
    },
    {
        id: '3ea0e2d4-aaf2-4fbf-91b1-42e8c79a9bc8',
        name: 'HD/SSD',
        slug: 'hd-ssd',
        colors: ['#22c55e', '#14532d'],
    },
    {
        id: '99ab14b3-16ca-4524-9742-1a55f710f921',
        name: 'Periféricos',
        slug: 'perifericos',
        colors: ['#a855f7', '#4c1d95'],
    },
    {
        id: 'a065ad59-58d4-40d8-a75d-8736c238b715',
        name: 'Placa de vídeo',
        slug: 'placa-de-video',
        colors: ['#f97316', '#7c2d12'],
    },
]

const shippingOptions = [
    {
        id: '9e9f6e9f-359a-493c-a0a9-86eade76a7d9',
        name: 'Gratuito',
        price: 0,
        deliveryTime: 10,
    },
    {
        id: 'd316cd5d-6abc-46ab-a183-212aa37a89a2',
        name: 'Express',
        price: 9.99,
        deliveryTime: 3,
    },
]

const products = [
    // Infraestrutura
    {
        name: 'Roteador Wireless Intelbras Action',
        slug: 'roteador-wireless-intelbras-action',
        price: 321.11,
        stock: 11,
        categorySlug: 'infraestrutura',
        description:
            'Velocidade Gigabit: Desfrute de conexões com fio ultrarrápidas para jogos e streaming 4K em suas portas LAN.\r\nWi-Fi Dual Band AC1200: Tenha internet rápida e estável em 2.4 GHz e 5 GHz, ideal para múltiplos dispositivos.',
    },
    {
        name: 'Switch TP-Link TL-SG1008D 8 Portas Gigabit',
        slug: 'switch-tp-link-tl-sg1008d-8-portas-gigabit',
        price: 119.9,
        stock: 25,
        categorySlug: 'infraestrutura',
        description:
            'Switch de mesa com 8 portas Gigabit, sem necessidade de configuração. Basta conectar os cabos para ampliar a sua rede cabeada em casa ou no escritório.',
    },
    {
        name: 'Access Point Ubiquiti UniFi U6 Lite',
        slug: 'access-point-ubiquiti-unifi-u6-lite',
        price: 699.0,
        stock: 8,
        categorySlug: 'infraestrutura',
        description:
            'Access point Wi-Fi 6 de teto, com alimentação via PoE. Ideal para cobrir ambientes com vários dispositivos conectados ao mesmo tempo.',
    },
    {
        name: 'Patch Panel 24 Portas Cat6',
        slug: 'patch-panel-24-portas-cat6',
        price: 239.9,
        stock: 14,
        categorySlug: 'infraestrutura',
        description:
            'Patch panel de 24 portas categoria 6 para rack de 19 polegadas. Organiza e identifica o cabeamento estruturado da rede.',
    },
    {
        name: 'Rack de Parede 12U 19"',
        slug: 'rack-de-parede-12u-19',
        price: 689.9,
        stock: 5,
        categorySlug: 'infraestrutura',
        description:
            'Rack de parede de 12U para equipamentos de 19 polegadas, com porta frontal. Indicado para organizar switches, patch panels e roteadores.',
    },
    {
        name: 'Cabo de Rede Cat6 Caixa 305m',
        slug: 'cabo-de-rede-cat6-caixa-305m',
        price: 749.9,
        stock: 6,
        categorySlug: 'infraestrutura',
        description:
            'Caixa de cabo de rede UTP categoria 6 com 305 metros. Indicada para instalações de rede cabeada em residências, escritórios e empresas.',
    },

    // HD/SSD
    {
        name: 'SSD Kingston NV2 1TB NVMe M.2',
        slug: 'ssd-kingston-nv2-1tb-nvme-m2',
        price: 429.9,
        stock: 30,
        categorySlug: 'hd-ssd',
        description:
            'SSD NVMe M.2 de 1TB com interface PCIe 4.0 e leitura de até 3500 MB/s. Deixa o sistema, os jogos e os programas muito mais rápidos.',
    },
    {
        name: 'SSD WD Blue SN580 1TB NVMe M.2',
        slug: 'ssd-wd-blue-sn580-1tb-nvme-m2',
        price: 479.9,
        stock: 22,
        categorySlug: 'hd-ssd',
        description:
            'SSD NVMe M.2 de 1TB com interface PCIe 4.0 e leitura de até 4150 MB/s. Boa opção para PCs de trabalho e jogos.',
    },
    {
        name: 'SSD Crucial BX500 480GB SATA',
        slug: 'ssd-crucial-bx500-480gb-sata',
        price: 249.9,
        stock: 40,
        categorySlug: 'hd-ssd',
        description:
            'SSD SATA de 2,5 polegadas com 480GB e leitura de até 540 MB/s. Ótimo para renovar notebooks e computadores mais antigos.',
    },
    {
        name: 'HD Seagate Barracuda 2TB 7200 RPM',
        slug: 'hd-seagate-barracuda-2tb-7200-rpm',
        price: 379.9,
        stock: 18,
        categorySlug: 'hd-ssd',
        description:
            'HD interno de 3,5 polegadas com 2TB, interface SATA e 7200 RPM. Indicado para guardar arquivos, backups e coleções de jogos.',
    },
    {
        name: 'SSD Portátil Samsung T7 1TB USB 3.2',
        slug: 'ssd-portatil-samsung-t7-1tb-usb-3-2',
        price: 649.9,
        stock: 12,
        categorySlug: 'hd-ssd',
        description:
            'SSD externo de 1TB com USB 3.2 e leitura de até 1050 MB/s. Compacto e resistente, bom para levar arquivos e backups para qualquer lugar.',
    },

    // Periféricos
    {
        name: 'Mouse Gamer Logitech G203 Lightsync',
        slug: 'mouse-gamer-logitech-g203-lightsync',
        price: 119.9,
        stock: 50,
        categorySlug: 'perifericos',
        description:
            'Mouse gamer com sensor de até 8000 DPI, 6 botões programáveis e iluminação RGB personalizável.',
    },
    {
        name: 'Teclado Mecânico Redragon Kumara K552',
        slug: 'teclado-mecanico-redragon-kumara-k552',
        price: 229.9,
        stock: 28,
        categorySlug: 'perifericos',
        description:
            'Teclado mecânico compacto com 87 teclas, ideal para quem quer economizar espaço na mesa sem abrir mão da resposta rápida das teclas.',
    },
    {
        name: 'Headset Gamer HyperX Cloud Stinger',
        slug: 'headset-gamer-hyperx-cloud-stinger',
        price: 249.9,
        stock: 20,
        categorySlug: 'perifericos',
        description:
            'Headset gamer leve e confortável, com drivers de 50mm e microfone giratório que silencia ao ser levantado.',
    },
    {
        name: 'Webcam Logitech C920s Full HD',
        slug: 'webcam-logitech-c920s-full-hd',
        price: 449.9,
        stock: 15,
        categorySlug: 'perifericos',
        description:
            'Webcam Full HD 1080p com microfone embutido e tampa de privacidade. Para reuniões, aulas e transmissões com boa qualidade de imagem.',
    },
    {
        name: 'Monitor Gamer LG UltraGear 24" IPS 144Hz',
        slug: 'monitor-gamer-lg-ultragear-24-ips-144hz',
        price: 899.0,
        stock: 9,
        categorySlug: 'perifericos',
        description:
            'Monitor de 24 polegadas com painel IPS, taxa de atualização de 144Hz e tempo de resposta de 1ms, para jogos fluidos e boas cores.',
    },

    // Placa de vídeo
    {
        name: 'Placa de Vídeo GeForce RTX 4060 8GB GDDR6',
        slug: 'placa-de-video-geforce-rtx-4060-8gb-gddr6',
        price: 1999.0,
        stock: 7,
        categorySlug: 'placa-de-video',
        description:
            'Placa de vídeo NVIDIA GeForce RTX 4060 com 8GB de memória GDDR6, com suporte a ray tracing e DLSS. Ótima para jogar em Full HD com alto desempenho.',
    },
    {
        name: 'Placa de Vídeo GeForce RTX 3060 12GB GDDR6',
        slug: 'placa-de-video-geforce-rtx-3060-12gb-gddr6',
        price: 1799.0,
        stock: 6,
        categorySlug: 'placa-de-video',
        description:
            'Placa de vídeo NVIDIA GeForce RTX 3060 com 12GB de memória GDDR6. Boa para jogos em Full HD e QHD e para edição de vídeo.',
    },
    {
        name: 'Placa de Vídeo Radeon RX 7600 8GB GDDR6',
        slug: 'placa-de-video-radeon-rx-7600-8gb-gddr6',
        price: 1699.0,
        stock: 5,
        categorySlug: 'placa-de-video',
        description:
            'Placa de vídeo AMD Radeon RX 7600 com 8GB de memória GDDR6, feita para jogar em Full HD com boa taxa de quadros.',
    },
    {
        name: 'Placa de Vídeo GeForce GTX 1650 4GB',
        slug: 'placa-de-video-geforce-gtx-1650-4gb',
        price: 1099.0,
        stock: 0, // sem estoque de propósito, para testar o filtro de produtos esgotados
        categorySlug: 'placa-de-video',
        description:
            'Placa de vídeo NVIDIA GeForce GTX 1650 com 4GB de memória. Opção de entrada para jogos leves e PCs de escritório com mais poder gráfico.',
    },
]

// Gera uma imagem WebP de 800x800 com gradiente e formas (sem texto, para não depender
// de fontes instaladas). O "variant" muda a posição das formas para as imagens de um
// mesmo produto não ficarem idênticas. Para usar fotos reais, troque o conteúdo desta
// função por sharp(fs.readFileSync('caminho/da/foto.jpg')).resize(...).webp(...).
async function createPlaceholderImage(colors: string[], variant: number) {
    const [startColor, endColor] = colors
    const circleX = variant % 2 === 0 ? 560 : 240
    const circleY = variant % 2 === 0 ? 260 : 540
    const barX = variant % 2 === 0 ? 120 : 400

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
            <defs>
                <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="${startColor}"/>
                    <stop offset="1" stop-color="${endColor}"/>
                </linearGradient>
            </defs>
            <rect width="800" height="800" fill="url(#background)"/>
            <circle cx="${circleX}" cy="${circleY}" r="190" fill="#ffffff" fill-opacity="0.14"/>
            <rect x="${barX}" y="520" width="280" height="120" rx="24" fill="#ffffff" fill-opacity="0.18"/>
            <rect x="${barX + 40}" y="160" width="180" height="180" rx="40" fill="#000000" fill-opacity="0.12"/>
        </svg>`

    const data = await sharp(Buffer.from(svg)).webp({ quality: 80 }).toBuffer()
    const id = randomUUID()

    return { id, url: `/images/${id}`, data }
}

async function main() {
    // 1. Usuários (o admin não pode ser criado pela API: createUser força role "client")
    if ((await prisma.user.count()) === 0) {
        for (const { passwordEnv, passwordFallback, ...u } of users) {
            const password = bcrypt.hashSync(seedPassword(passwordEnv, passwordFallback), 10)
            await prisma.user.create({ data: { ...u, password } })
        }
        console.log('Seed: usuários criados.')
    }

    // 2. Categorias (cada uma com a sua imagem, gravada em ImageFile)
    if ((await prisma.category.count()) === 0) {
        for (const { colors, ...category } of categories) {
            const image = await createPlaceholderImage(colors, 0)

            await prisma.category.create({
                data: {
                    ...category,
                    imageUrl: image.url,
                    file: { create: { id: image.id, data: image.data } },
                },
            })
        }
        console.log('Seed: categorias criadas.')
    }

    // 3. Fretes
    if ((await prisma.shipping.count()) === 0) {
        await prisma.shipping.createMany({ data: shippingOptions })
        console.log('Seed: fretes criados.')
    }

    // 4. Produtos (cada um com 2 imagens e uma categoria)
    if ((await prisma.product.count()) === 0) {
        const savedCategories = await prisma.category.findMany({ select: { id: true, slug: true } })
        const categoryIdBySlug = new Map(savedCategories.map((category) => [category.slug, category.id]))
        const colorsBySlug = new Map(categories.map((category) => [category.slug, category.colors]))

        for (const [index, { categorySlug, ...product }] of products.entries()) {
            const categoryId = categoryIdBySlug.get(categorySlug)
            const colors = colorsBySlug.get(categorySlug)

            if (!categoryId || !colors) {
                throw new Error(`Categoria "${categorySlug}" não encontrada para o produto "${product.name}"`)
            }

            const images = await Promise.all([
                createPlaceholderImage(colors, index),
                createPlaceholderImage(colors, index + 1),
            ])

            await prisma.product.create({
                data: {
                    ...product,
                    images: {
                        create: images.map((image, order) => ({
                            url: image.url,
                            order,
                            isCover: order === 0,
                            file: { create: { id: image.id, data: image.data } },
                        })),
                    },
                    productCategories: { create: { categoryId } },
                },
            })
        }
        console.log(`Seed: ${products.length} produtos criados.`)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())