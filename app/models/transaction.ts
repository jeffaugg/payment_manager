import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import Gateway from './gateway.js'
import Product from './product.js'
import TransactionProduct from './transaction_product.js'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare gatewayId: number

  @column()
  declare external_id: string

  @column()
  declare status: string

  @column()
  declare amount: number

  @column()
  declare card_last_numbers: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Client)
  public client!: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  public gateway!: BelongsTo<typeof Gateway>

  @belongsTo(() => Product)
  public product!: BelongsTo<typeof Product>

  @hasMany(() => TransactionProduct)
  public transactionProducts!: HasMany<typeof TransactionProduct>
}
