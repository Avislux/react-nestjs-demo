import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UnauthorizedException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { jwtConstants } from '../auth/constants';
import { JwtService } from '@nestjs/jwt';
import { invoiceSchema, invoicesSchema} from "../schemas/invoiceSchema"

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService, private usersService: UsersService, private jwtService: JwtService) {}


  @Get("total")
  async findTotal(@Query() query,@Req() request: Request) {
    let isAuthorized = await this.authorize(request);
    if (!isAuthorized){
      return {"status": "Unauthorized"}
    }
    return this.invoicesService.findAllByDueDate(query.due_date);
  }
  @Get()
  async findAll(@Req() request: Request) {
    let isAuthorized =await  this.authorize(request);
    if (!isAuthorized){
      return {"status": "Unauthorized"}
    }
    return this.invoicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    let isAuthorized = await this.authorize(request);
    if (!isAuthorized){
      return {"status": "Unauthorized"}
    }
    return this.invoicesService.findOne(+id);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  
  private async authorize(request: Request){
    try {
      const token = this.extractTokenFromHeader(request);
      if (token == null){
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      let email = payload.email;
      const user = await this.usersService.findOne(email);
      if (user.id.toString() != payload.sub.toString()){
        throw new UnauthorizedException();
      }
    } catch (UnauthorizedException ) {
      console.log(UnauthorizedException);
      return false;
    }
   return true;
  }
}
