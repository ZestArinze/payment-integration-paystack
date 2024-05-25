import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { PAYSTACK_WEBHOOK_SIGNATURE_KEY } from '../constants';
import { InitializeTransactionDto } from './dto/initialize-transaction.dto';
import { PaystackCallbackDto, PaystackWebhookDto } from './dto/paystack.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/initialize')
  async initializeTransaction(@Body() dto: InitializeTransactionDto) {
    return await this.transactionsService.initializeTransaction(dto);
  }

  @Get('/callback')
  async verifyTransaction(
    @Query() query: PaystackCallbackDto,
  ): Promise<Transaction> {
    return await this.transactionsService.verifyTransaction(query);
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async paymentWebhookHandler(
    @Body() dto: PaystackWebhookDto,
    @Headers() headers = {},
  ) {
    const result = await this.transactionsService.handlePaystackWebhook(
      dto,
      `${headers[PAYSTACK_WEBHOOK_SIGNATURE_KEY]}`,
    );

    if (!result) {
      throw new BadRequestException();
    }
  }

  @Get()
  async findTransactions() {
    return await this.transactionsService.findMany();
  }
}
