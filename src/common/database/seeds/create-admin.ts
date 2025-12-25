import { DataSource } from 'typeorm'
import { User } from '../../../modules/user/entities/user.entity'
import { Roles, Genders } from '../../enums/user.enum'
import configuration from '../../../../config/configuration'
import * as dotenv from 'dotenv'

dotenv.config()

const config = configuration()

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOSTING,
  port: parseInt(process.env.DB_POST || '5432'),
  username: process.env.DB_LOGIN,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: false,
})

async function createAdmin() {
  try {
    await dataSource.initialize()
    console.log('Data Source has been initialized!')

    const userRepository = dataSource.getRepository(User)

    const existingAdmin = await userRepository.findOne({
      where: { email: 'a@a.com' },
    })

    if (existingAdmin) {
      console.log('Admin user already exists.')
      return
    }

    const admin = new User()
    admin.first_name = 'Admin'
    admin.second_name = 'User'
    admin.middle_name = ''
    admin.birth_date = new Date()
    admin.gender = Genders.MALE
    admin.phone = '+000000000000'
    admin.email = 'a@a.com'
    admin.password = '11111111' // Will be hashed by @BeforeInsert
    admin.role = Roles.ADMIN

    await userRepository.save(admin)
    console.log('Admin user created successfully!')
  } catch (err) {
    console.error('Error during Data Source initialization', err)
  } finally {
    await dataSource.destroy()
  }
}

createAdmin()
