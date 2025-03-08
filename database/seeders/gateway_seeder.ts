import Gateway from '#models/gateway'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Gateway.createMany([
      { name: 'Gateway1', isActive: true, priority: 1 },
      { name: 'Gateway2', isActive: true, priority: 2 },
    ])
  }
}
