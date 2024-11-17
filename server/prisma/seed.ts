import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
      password: "password"
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
      password: "password1"
    },
  })

  const invoices = await prisma.invoice.createMany({data:[
      {
        id: 1,
        vendor_name: 'Mailing',
        amount: 100.00,
        due_date: new Date('12/1/2024'),
        description: 'Mailing invoice',
        user_id: 1,
        paid: false,
      },
      {
        id: 2,
        vendor_name: 'IT',
        amount: 200.00,
        due_date: new Date('12/10/2024'),
        description: 'IT invoice',
        user_id: 1,
        paid: false,
      }, {
        id: 3,
        vendor_name: 'Google',
        amount: 250.50,
        due_date: new Date('11/5/2024'),
        description: 'Google services',
        user_id: 1,
        paid: true,
      },  {
        id: 4,
        vendor_name: 'AWS',
        amount: 10000,
        due_date: new Date('8/5/2024'),
        description: '',
        user_id: 1,
        paid: true,
      },  {
        id: 5,
        vendor_name: 'Newrelic',
        amount: 1500.50,
        due_date: new Date('11/5/2024'),
        description: 'System monitoring',
        user_id: 1,
        paid: true,
      }

    ]});
  console.log({ alice, bob,invoices })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })