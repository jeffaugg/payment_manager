import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import Gateway from './gateway.js'
import Product from './product.js'


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
  
  @column()
  declare productId: number
  
  @column()
  declare quantity: number
  
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
}
