import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'
import { invoiceSchema, invoicesSchema } from '../schemas/invoiceSchema';

const prisma = new PrismaClient()
@Injectable()
export class InvoicesService {
 
  async findAllByDueDate(date: string) {
    if (date == null){
      throw new Error("No date");
    }
    var dateObject = new Date(date);
    const allInvoices = await prisma.invoice.findMany({
      where: {
        due_date: {
          lte: dateObject,
        },
      },
    })
    try {
      invoicesSchema.parse(allInvoices)
      return JSON.stringify(allInvoices);
    } catch (error ){
      console.log(error);
      return "{}";
    }
  }

  async findAll() {
    const allInvoices = await prisma.invoice.findMany()
    try {
      invoicesSchema.parse(allInvoices)
      return JSON.stringify(allInvoices);
    } catch (error ){
      console.log(error);
      return "{}";
    }
  }

  async findOne(id: number) {
    const invoice = await prisma.invoice.findUnique(
      { where: { id: id } },
    );
    try {
      invoiceSchema.parse(invoice)
      return JSON.stringify(invoice);
    } catch (error ){
      console.log(error);
      return "{}";
    }
  }
}
