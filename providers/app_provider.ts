import ClientService from '#services/client_service'
import { ClientServiceContract } from '#services/interface/client_service_contract'
import PaymentServiceContract from '#services/interface/payment_service_contract'
import ProductServiceContract from '#services/interface/product_service_contract'
import { PurchaseServiceContract } from '#services/interface/punchase_service_contracts'
import UserServiceContract from '#services/interface/user_service_contract'
import PaymentService from '#services/payment_service'
import ProductService from '#services/product_service'
import PurchaseService from '#services/purchase_service'
import UsersService from '#services/user_service'
import type { ApplicationService } from '@adonisjs/core/types'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.bindValue(ClientServiceContract, new ClientService())
    this.app.container.bindValue(PaymentServiceContract, new PaymentService())
    this.app.container.bindValue(ProductServiceContract, new ProductService())
    this.app.container.bind(PurchaseServiceContract, async (container) => {
      return new PurchaseService(
        await container.make(ClientServiceContract),
        await container.make(PaymentServiceContract)
      )
    })
    this.app.container.bindValue(UserServiceContract, new UsersService())
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
