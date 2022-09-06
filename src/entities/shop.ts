import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from "typeorm";
  
  import { Length, IsNotEmpty } from "class-validator";
 // import { LocalFile } from "./localFile";
  import { User } from "./user";

  @Entity()
  export class Shop {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  @Length(1, 60)
  @IsNotEmpty()
  name: string;

//   @OneToOne(() => LocalFile)
//   @JoinColumn()
//   avata: LocalFile[]

  @Column()
  avatar: number;

  @OneToOne(() => User, (user) => user.shop)
  @JoinColumn({name: 'user'})
  user: User;
 

  @Column()
  @Length(4, 60)
  email: string;

  @Column()
  @Length(10)
  phone: string;

  @Column()
  @IsNotEmpty()
  placeOfReceipt: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  star: number;

  @Column({ default: 0 })
  followers: number;


  }
