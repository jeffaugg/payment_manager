import ProductNotFoundException from '#exceptions/product_not_found_exception'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import PurchaseService, { PurchasePayload } from '#services/purchase_service'
import { test } from '@japa/runner'

test.group('PurchaseService Unit Tests', (group) => {
  test('validateProducts throws ProductNotFoundException if a product is missing', async ({ assert }) => {
    const service = new PurchaseService()
    const payload: PurchasePayload = {
      items: [
        { productId: 1, quantity: 2 },
        { productId: 9999, quantity: 1 }
      ],
      payment: {
        name: 'Test Payment',
        email: 'test@example.com',
        cardNumber: '5569000000006063',
        cvv: '010'
      }
    }

    // Monkey patch Product.query to simulate that only product 1 exists.
    const originalProductQuery = Product.query
    Product.query = () => ({
      whereIn: async () => {
        return [{ id: 1, amount: 1500 }]
      }
    }) as any

    try {
      await service.processPurchase(payload)
      assert.fail('Expected ProductNotFoundException to be thrown')
    } catch (error: any) {
      assert.instanceOf(error, ProductNotFoundException)
    } finally {
      Product.query = originalProductQuery
    }
  })

  test('processPurchase returns success when payment and transaction succeed', async ({ assert }) => {
    const service = new PurchaseService()
    const payload: PurchasePayload = {
      items: [
        { productId: 1, quantity: 2 }
      ],
      payment: {
        name: 'Test Payment',
        email: 'test@example.com',
        cardNumber: '5569000000006063',
        cvv: '010'
      }
    }

    // Stub Product.query to return a valid product.
    const originalProductQuery = Product.query
    Product.query = () => ({
      whereIn: async () => {
        return [{ id: 1, amount: 1500 }]
      }
    }) as any

    // Stub ClientService.getOrCreateClient to return a fixed clientId.
    const originalGetOrCreateClient = service['clientService'].getOrCreateClient
    service['clientService'].getOrCreateClient = async () => 10

    // Stub PaymentService.processPayment to simulate a successful payment.
    const originalProcessPayment = service['paymentService'].processPayment
    service['paymentService'].processPayment = async () => ({
      success: true,
      gatewayRecordId: 2,
      externalId: 'ext-123',
      message: ''
    })

    // Stub Transaction.create to simulate transaction creation.
    const originalTransactionCreate = Transaction.create
    Transaction.create = async (data: any) => ({ id: 100, ...data })

    // Stub TransactionProduct.create to do nothing.
    const originalTransactionProductCreate = TransactionProduct.create
    TransactionProduct.create = async (data: any) => data

    const result = await service.processPurchase(payload)
    assert.isTrue(result.success)
    assert.isDefined(result.transaction)
    assert.equal(result.transaction!.id, 100)

    // Restore original functions.
    Product.query = originalProductQuery
    service['clientService'].getOrCreateClient = originalGetOrCreateClient
    service['paymentService'].processPayment = originalProcessPayment
    Transaction.create = originalTransactionCreate
    TransactionProduct.create = originalTransactionProductCreate
  })

  test('refundPurchase throws error when transaction is not found', async ({ assert }) => {
    const service = new PurchaseService()

    try {
      await service.refundPurchase(9999)
      assert.fail('Expected error for missing transaction')
    } catch (error: any) {
      assert.equal(error.message, 'Transaction with ID 9999 not found')
    }
  })
})
