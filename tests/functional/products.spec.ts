import { test } from '@japa/runner'

let createdProductId: number
let authToken: string

test.group('Products Endpoints', () => {
  test('should login and obtain token', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'adm@email.com',
      password: 'adm123'
    })
    response.assertStatus(200)
    authToken = response.body().value
    assert.exists(authToken, 'O token deve existir')
  })


  test('should create a product successfully', async ({ client, assert }) => {
    const response = await client.post('/products').json({
      name: 'Produto Teste',
      amount: 1500
    }).header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(201)
    createdProductId = response.body().product.id
    assert.isDefined(createdProductId, 'O produto deve ter um ID')
    response.assertBodyContains({
      message: 'Produto criado com sucesso!'
    })
  })

  test('should list all products', async ({ client, assert }) => {
    const response = await client.get('/products').header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    assert.isArray(response.body().products, 'Deve retornar um array de produtos')
  })

  test('should show product details', async ({ client, assert }) => {
    const response = await client.get(`/products/${createdProductId}`).header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    assert.equal(response.body().product.id, createdProductId)
  })

  test('should update a product successfully', async ({ client, assert }) => {
    const response = await client.put(`/products/${createdProductId}`).json({
      name: 'Produto Atualizado',
      amount: 2000
    }).header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    assert.equal(response.body().product.name, 'Produto Atualizado')
    response.assertBodyContains({
      message: 'Produto atualizado com sucesso.'
    })
  })

  test('should delete a product successfully', async ({ client }) => {
    const response = await client.delete(`/products/${createdProductId}`).header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
  })
})
