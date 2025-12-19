import * as bcrypt from 'bcrypt'
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm'
import { Genders, Roles } from 'src/common/enums/user.enum'

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
    enum: Roles,
    default: Roles.USER
  })
  role: Roles

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
