import { HttpStatusCode, VoucherTypeEnum } from './../utils/shopp.enum';
import { Response, Request } from 'express';
import VoucherModel from '../models/voucher';
import { ControllerService } from '../utils/decorators';
import { Validator } from 'class-validator';
import ConvertDate from '../utils/convertDate';

export default class VoucherMiddleware {
  @ControllerService()
  static async listAll(req: Request, res: Response) {
    const result = await VoucherModel.listAll();
    if (result) res.status(HttpStatusCode.OK).send({ data: result });
    else
      res.status(HttpStatusCode.OK).send({ message: 'No vouchers available' });
  }

  @ControllerService()
  static async getOneById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await VoucherModel.getOneById(id);
    if (result) res.status(HttpStatusCode.OK).send({ data: result });
    else res.status(HttpStatusCode.OK).send({ message: 'Unavailable voucher' });
  }

  @ControllerService({
    body: [
      {
        name: 'title',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'type',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'MONEY' &&
            value.toUpperCase() !== 'FREESHIP' &&
            value.toUpperCase() !== 'PERCENT'
          )
            return `${propName} is invalid. Only MONEY, FREESHIP OR PERCENT!`;
          return null;
        },
      },
      {
        name: 'amount',
        type: String,
        validator: (propName: string, value: string) => {
          const number = Number(value);
          if (!number) return `${propName} must be a number`;
          return null;
        },
      },
      {
        name: 'mfgDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'expDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
    ],
  })
  static async editVoucher(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    const mfgDate = new Date(ConvertDate(data.mfgDate));
    const expDate = new Date(ConvertDate(data.expDate));
    if (mfgDate > expDate) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'mfgDate must be smaller than expDate!' });
      return;
    }
    const result = await VoucherModel.editVoucher(
      id,
      data.title,
      data.type,
      data.amount,
      data.condition,
      mfgDate,
      expDate
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService({
    body: [
      {
        name: 'title',
        type: String,
        validator: (propName: string, value: string) => {
          if (value.length == 0) return `${propName} must be filled in`;
          return null;
        },
      },
      {
        name: 'type',
        type: String,
        validator: (propName: string, value: string) => {
          if (
            value.toUpperCase() !== 'MONEY' &&
            value.toUpperCase() !== 'FREESHIP' &&
            value.toUpperCase() !== 'PERCENT'
          )
            return `${propName} is invalid. Only MONEY, FREESHIP OR PERCENT!`;
          return null;
        },
      },
      {
        name: 'amount',
        type: String,
        validator: (propName: string, value: string) => {
          const number = Number(value);
          if (!number) return `${propName} must be a number`;
          return null;
        },
      },
      {
        name: 'mfgDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
      {
        name: 'expDate',
        type: String,
        validator: (propName: string, value: string) => {
          if (!Date.parse(ConvertDate(value))) return `${propName} is invalid`;
          return null;
        },
      },
    ],
  })
  static async newVoucher(req: Request, res: Response) {
    const data = req.body;
    const mfgDate = new Date(ConvertDate(data.mfgDate));
    const expDate = new Date(ConvertDate(data.expDate));
    if (mfgDate > expDate) {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .send({ message: 'mfgDate must be smaller than expDate!' });
      return;
    }
    const result = await VoucherModel.newVoucher(
      data.title,
      data.type,
      data.createdBy,
      data.amount,
      data.condition,
      mfgDate,
      expDate
    );
    res.status(result.getCode()).send({ message: result.getMessage() });
  }

  @ControllerService()
  static async deleteVoucher(req: Request, res: Response) {
    const id = req.params.id
    const result = await VoucherModel.deleteVoucher(id)
    res.status(result.getCode()).send({message: result.getMessage})
  }
}
