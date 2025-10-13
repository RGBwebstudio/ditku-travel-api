import * as bcrypt from 'bcrypt'
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm'
import { Genders, Roles, UserType } from 'src/common/enums/user.enum'
import { Cart } from 'src/cart/entities/cart.entity'
import { Order } from 'src/order/entities/order.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_name: string

  @Column({ default: '' })
  second_name: string

  @Column({ default: '' })
  middle_name: string

  @Column()
  birth_date: Date

  @Column({
    type: 'enum',
    enum: Genders,
    default: Genders.MALE
  })
  gender: Genders

  @Column()
  phone: string

  @Column()
  email: string

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.GUEST
  })
  type: UserType

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER
  })
  role: Roles

  @Column({ default: false })
  verified_email: boolean

  @Column({ default: 0 })
  verify_email_code: number

  @Column({ default: false })
  verified_phone: boolean

  @Column({ default: 0 })
  verify_phone_code: number

  @OneToMany(() => Cart, (cart: Cart) => cart.user_id)
  @JoinColumn({ name: 'cart_id' })
  cart_ids: Cart[]

  @OneToMany(() => Cart, (cart: Cart) => cart.user_id)
  @JoinColumn({ name: 'order_id' })
  order_ids: Order[]

  @OneToMany(() => Order, (order: Order) => order.user_id)
  @JoinColumn({ name: 'user_id' })
  order: Order[]

  @Column({ default: '' })
  verification_code: string

  @Column({ type: 'varchar', length: 6, nullable: true })
  auth_code: string

  @Column()
  password: string

  @BeforeInsert()
  hashPasswordBeforeInsert() {
    const salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
  }

  @BeforeUpdate()
  hashPasswordBeforeUpdate() {
    if (this.password) {
      const salt = bcrypt.genSaltSync(10)
      this.password = bcrypt.hashSync(this.password, salt)
    }
  }

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date
}
