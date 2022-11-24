import { ShopPDataSource } from '../data';
import { Customer } from '../entities/customer';
import { OrderProduct } from '../entities/orderProduct';
import { Order } from '../entities/order';
import { Payment } from '../entities/payment';
import { Product } from '../entities/product';
import { Shop } from '../entities/shop';
import { ShoppingUnit } from '../entities/shoppingUnit';
import { Voucher } from '../entities/voucher';
import Response from '../utils/response';
import {
  DeliveryStatusEnum,
  HttpStatusCode,
  StatusEnum,
} from '../utils/shopp.enum';
import { In } from 'typeorm';
import { OrderRequest } from '../interfaces/order';

const orderReposity = ShopPDataSource.getRepository(Order);
const shopReposity = ShopPDataSource.getRepository(Shop);
const paymentReposity = ShopPDataSource.getRepository(Payment);
const shoppingUnitReposity = ShopPDataSource.getRepository(ShoppingUnit);
const voucherReposity = ShopPDataSource.getRepository(Voucher);
const productRepository = ShopPDataSource.getRepository(Product);
const orderProductRepository = ShopPDataSource.getRepository(OrderProduct);

export default class orderModel {
  static async viewOrderForCustomer(customer: Customer) {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      where: [
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CHECKING,
        },
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CONFIRMED,
        },
        {
          customer: { id: customer.id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.PACKAGING,
        },
      ],
    });
    return order ? order : false;
  }

  static async viewOrderForShop(shop: Shop) {
    const findOrderProduct = await orderProductRepository.find({
      relations: {
        product: { shop: true },
        orderNumber: true,
      },
      select: {
        id: true,
      },
      where: {
        product: { shop: { id: shop.id } },
      },
    });
    //return findOrderProduct ? findOrderProduct : false;
    const length = findOrderProduct.length;
    let order: Order[] = [];
    for (let i = 0; i < length; i++) {
      let findOrder = await orderReposity.findOne({
        relations: {
          payment: true,
          shoppingUnit: true,
          voucher: true,
          customer: true,
          orderProducts: true,
        },
        where: {
          // id: In([...findOrderProduct]),
          orderProducts: { id: findOrderProduct[i].id },
          status: StatusEnum.ACTIVE,
          deliveryStatus: DeliveryStatusEnum.CHECKING,
        },
      });
      if (findOrder != null) {
        order.push(findOrder);
      }
    }
    return order ? order : false;
  }

  static async viewOrderDeliver() {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        customer: {
          name: true,
        },
        payment: {
          name: true,
        },
        estimateDeliveryTime: true,
        shoppingUnit: {
          name: true,
        },
        totalBill: true,
        transportFee: true,
        voucher: {
          title: true,
        },
        totalPayment: true,
        status: true,
      },
      where: {
        status: StatusEnum.ACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERING,
      },
    });
    return order ? order : false;
  }

  static async viewHistory() {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        customer: {
          name: true,
        },
        payment: {
          name: true,
        },
        estimateDeliveryTime: true,
        shoppingUnit: {
          name: true,
        },
        totalBill: true,
        transportFee: true,
        voucher: {
          title: true,
        },
        totalPayment: true,
        status: true,
      },
      where: {
        status: StatusEnum.INACTIVE,
        deliveryStatus: DeliveryStatusEnum.DELIVERED,
      },
    });
    return order ? order : false;
  }

  static async viewCancelOrder() {
    const order = await orderReposity.find({
      relations: {
        payment: true,
        shoppingUnit: true,
        voucher: true,
        customer: true,
      },
      select: {
        id: true,
        createdAt: true,
        deliveryStatus: true,
        address: true,
        customer: {
          name: true,
        },
        payment: {
          name: true,
        },
        estimateDeliveryTime: true,
        shoppingUnit: {
          name: true,
        },
        totalBill: true,
        transportFee: true,
        voucher: {
          title: true,
        },
        totalPayment: true,
        status: true,
      },
      where: {
        status: StatusEnum.INACTIVE,
        deliveryStatus: DeliveryStatusEnum.CANCELLED,
      },
    });
    return order ? order : false;
  }

  static async postNew(
    address: string,
    paymentId: number,
    orders: OrderRequest[],
    customer: Customer
  ) {
    //check payment
    const payment = await paymentReposity.findOne({
      where: {
        id: paymentId,
      },
    });
    if (payment == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Payment not exist.');
    }

    //For loop ORDER
    const orderArr: Order[] = [];
    for (let i = 0; i < orders.length; i++) {
      let totalBill = orders[i].totalBill;
      //check shopping unit
      const shoppingUnit = await shoppingUnitReposity.findOne({
        where: {
          id: orders[i].shoppingUnitId,
        },
      });
      if (shoppingUnit == null) {
        return new Response(
          HttpStatusCode.BAD_REQUEST,
          'Shopping unit not exist.'
        );
      }
      //check valid shop
      const shop = await shopReposity.findOne({
        where: {
          id: orders[i].shopId,
        },
      });
      if (shop == null) {
        return new Response(HttpStatusCode.BAD_REQUEST, 'Shop not exist.');
      }
      let findOrder = new Order();

      //check voucher
      let voucher = null;
      if (orders[i].voucherId == null) {
        voucher = null;
      } else {
        voucher = await voucherReposity.find({
          where: {
            id: orders[i].voucherId,
          },
        });
        if (voucher == null) {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Voucher not exist.');
        } else {
          (findOrder.deliveryStatus = DeliveryStatusEnum.CHECKING),
            (findOrder.address = address),
            (findOrder.estimateDeliveryTime = orders[i].estimateDeliveryTime),
            (findOrder.status = StatusEnum.ACTIVE),
            (findOrder.totalBill = orders[i].totalBill),
            (findOrder.transportFee = orders[i].transportFee),
            (findOrder.totalPayment =
              +orders[i].totalBill + +orders[i].transportFee),
            (findOrder.payment = payment),
            (findOrder.shoppingUnit = shoppingUnit),
            (findOrder.voucher = voucher),
            (findOrder.shop = shop),
            (findOrder.customer = customer);

          let orderProductArr: OrderProduct[] = [];
          const orderProduct = orders[i].orderProducts;
          //For loop ORDER PRODUCT
          for (let j = 0; j < orderProduct.length; j++) {
            let orderProductEntity = new OrderProduct();
            const product = await productRepository.findOne({
              where: {
                id: orderProduct[j].productId,
              },
            });
            if (product == null) {
              return new Response(
                HttpStatusCode.BAD_REQUEST,
                'Product not exist.'
              );
            } else {
              (orderProductEntity.additionalInfo =
                orderProduct[j].additionalInfo),
                (orderProductEntity.price = orderProduct[j].price),
                (orderProductEntity.quantity = orderProduct[j].quantity),
                (orderProductEntity.product = product),
                (totalBill -= orderProduct[j].price * orderProduct[j].quantity);
              orderProductArr.push(orderProductEntity);
            }
          }
          if (totalBill != 0) {
            return new Response(HttpStatusCode.BAD_REQUEST, 'Invalid invoice.');
          }
          findOrder.orderProducts = orderProductArr;
          orderArr.push(findOrder);
        }
      }
    }
    const order: Order[] = await orderReposity.save(orderArr);

    return new Response(
      HttpStatusCode.CREATED,
      'Create new order successfully!',
      order
    );
  }

  static async editDeliveryStatus(
    id: string,
    deliveryStatus: DeliveryStatusEnum
  ) {
    const order = await orderReposity.findOne({
      where: {
        id: id,
      },
    });
    if (order != null && deliveryStatus <= order.deliveryStatus) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'Cannot change status backward'
      );
    } else {
      if (deliveryStatus == DeliveryStatusEnum.DELIVERED) {
        const order = await orderReposity.update(
          { id: id },
          { deliveryStatus: deliveryStatus, status: StatusEnum.INACTIVE }
        );
        if (order.affected == 1) {
          return new Response(HttpStatusCode.OK, 'Done!');
        } else {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
        }
      } else {
        const order = await orderReposity.update(
          { id: id },
          { deliveryStatus: deliveryStatus, status: StatusEnum.ACTIVE }
        );
        if (order.affected == 1) {
          return new Response(HttpStatusCode.OK, 'Done!');
        } else {
          return new Response(HttpStatusCode.BAD_REQUEST, 'Not Done!');
        }
      }
    }
  }

  static async cancelOrder(id: string) {
    const order = await orderReposity.findOne({
      where: {
        id: id,
      },
    });
    if (order == null) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order not exist.');
    }
    if (
      order.deliveryStatus == DeliveryStatusEnum.PACKAGING ||
      order.deliveryStatus == DeliveryStatusEnum.DELIVERING
    ) {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Order can not cancel');
    }

    const result = await orderReposity.update(
      {
        id: id,
      },

      {
        deliveryStatus: DeliveryStatusEnum.CANCELLED,
        status: StatusEnum.INACTIVE,
      }
    );
    if (result.affected == 1) {
      return new Response(HttpStatusCode.OK, 'Cancel order successfully!');
    } else {
      return new Response(HttpStatusCode.BAD_REQUEST, 'Cancel order failed!');
    }
  }

  // static async returnOrder(id: string){
  //     const now = new Date();

  // }
}
