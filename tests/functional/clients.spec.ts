import Client from '#models/client'
import { test } from '@japa/runner'

let authToken: string
let clientRecord: Client

test.group('Clients Endpoints', (group) => {

  test('should login and obtain token', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'adm@email.com',
      password: 'adm123'
    })
    response.assertStatus(200)
    authToken = response.body().value
    assert.exists(authToken, 'O token deve existir')
  })

  group.setup(async () => {
    // Cria um registro de cliente para os testes
    clientRecord = await Client.create({
      name: 'Cliente Teste',
      email: 'cliente1234@example.com',
    })
  })

  group.teardown(async () => {
    // Remove o registro de cliente após os testes
    await clientRecord.delete()
  })

  group.teardown(async () => {
  })

  test('GET /clients - should list all clients', async ({ client, assert }) => {
    const response = await client.get('/clients').header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    response.assertBodyContains({
      clients: [
        { id: clientRecord.id, name: clientRecord.name, email: clientRecord.email }
      ]
    })
    assert.isArray(response.body().clients, 'Deve retornar um array de clientes')
  })

  test('GET /clients/{id} - should show client details with transactions', async ({ client, assert }) => {
    const response = await client.get(`/clients/${clientRecord.id}`).header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    response.assertBodyContains({
      client: {
        id: clientRecord.id,
        name: clientRecord.name,
        email: clientRecord.email,
      }
    })
    // Verifica se a propriedade "transactions" foi carregada (pode estar vazia)
    assert.exists(response.body().client.transactions, 'O cliente deve possuir a propriedade transactions')
  })
})
