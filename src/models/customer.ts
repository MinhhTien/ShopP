import { User } from './../entities/user';
import { Customer } from './../entities/customer';
import { validate } from 'class-validator';
import { ShopPDataSource } from '../data';
import { StatusEnum, GenderEnum } from '../utils/shopp.enum';

export default class CustomerModel {
  static async listAll() {
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const customers = await customerRepository.find({
      relations: {
        user: true,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        gender: true,
        dob: true,
        placeOfDelivery: true,
        // not need following shops
      },
      where: {
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return customers ? customers : false;
  }

  static async getOneById(customerId: string) {
    const customerRepository = ShopPDataSource.getRepository(Customer);

    const customer = await customerRepository.findOneOrFail({
      relations: {
        user: true,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        gender: true,
        dob: true,
        placeOfDelivery: true,
        followingShops: true,
      },
      where: {
        id: customerId,
        user: { status: StatusEnum.ACTIVE },
      },
    });
    return customer ? customer : false;
  }

  static async postNew(
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string,
    userId: number
  ) {
    // let customer = new Customer();
    // customer.name = name;
    // customer.gender = gender;
    // customer.dob = dob;
    // customer.placeOfDelivery = placeOfDelivery;
    const userRepository = ShopPDataSource.getRepository(User);
    const customerRepository = ShopPDataSource.getRepository(Customer);
    const customerList = customerRepository.find({
      where: {
        user: {
          id: userId,
          status: StatusEnum.ACTIVE
        }
      }
    })
    
    let user = userRepository.findOneOrFail({
      where: {
        id: userId,
        status: StatusEnum.ACTIVE,
      },
    });
    
    // customer.user = await user;

    
    let customer = await customerRepository.save({
      name,
      gender,
      dob,
      placeOfDelivery,
      user: await user,
    });
    return customer ? customer : false;
  }

  static async edit(
    id: string,
    name: string,
    gender: GenderEnum,
    dob: Date,
    placeOfDelivery: string
  ) {
    // find customer on database
    const customerRepository = ShopPDataSource.getRepository(Customer);
    // let customer: Customer | null = await customerRepository.findOne({
    //     where: {
    //       id: id,
    //       user: { status: StatusEnum.ACTIVE },
    //     },
    //   });
    // if (customer) {
    //   customer.id = id;
    //   customer.name = name;
    //   customer.gender = gender;
    //   customer.dob = dob;
    //   customer.placeOfDelivery = placeOfDelivery;
    const result = await customerRepository.update(
      {
        id,
        user: { status: StatusEnum.ACTIVE },
      },
      {
        name,
        gender,
        dob,
        placeOfDelivery,
      }
    );
    return result ? result : false;
  }
}
