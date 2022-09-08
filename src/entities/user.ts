import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import bcrypt from 'bcryptjs';
import { UserRole } from './userRole';
import { StatusEnum } from '../utils/shopp.enum';
import { Shop } from './shop';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.ACTIVE,
  })
  status: StatusEnum;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  lockedAt: Date;

  @OneToMany(() => UserRole, userRole => userRole.user)
  roles: UserRole[];

  @OneToOne(() => Shop, shop => shop.user)
  shop: Shop;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
