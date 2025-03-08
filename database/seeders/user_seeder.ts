import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      "fullName": "admFullName",
      "email": "adm@email.com",
      "password": "adm123",
      "role": "ADMIN"
    }
    )
  }
}
