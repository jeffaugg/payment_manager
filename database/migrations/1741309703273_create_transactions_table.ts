import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('CASCADE')
      table
        .integer('gateway_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('gateways')
        .onDelete('SET NULL')
      table.string('external_id').nullable()
      table.string('status').notNullable()
      table.integer('amount').notNullable()
      table.string('card_last_numbers').nullable()
      table.integer('product_id').unsigned().nullable()
      table.integer('quantity').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
