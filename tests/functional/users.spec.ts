import User from '#models/user'
import { test } from '@japa/runner'

let authToken: string
let createdUserId: number

test.group('Users Endpoints', (group) => {
  test('should login and obtain token', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'adm@email.com',
      password: 'adm123',
    })
    response.assertStatus(200)
    authToken = response.body().value
    assert.exists(authToken, 'O token deve existir')
  })

  group.teardown(async () => {
    if (createdUserId) {
      await User.query().where('id', createdUserId).delete()
    }
  })

  test('POST /user - should create a new user', async ({ client, assert }) => {
    const payload = {
      fullName: 'Test User',
      email: 'test.user@example.com',
      password: 'senhaSegura123',
      role: 'USER',
    }

    const response = await client
      .post('/user')
      .json(payload)
      .header('Authorization', `Bearer ${authToken}`)

    response.assertStatus(201)
    createdUserId = response.body().user.id
    assert.isDefined(createdUserId, 'O usuário deve ter um ID')
    response.assertBodyContains({
      message: 'Usuário criado com sucesso!',
    })
  })

  test('GET /user - should list all users', async ({ client, assert }) => {
    const response = await client.get('/user').header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    assert.isArray(response.body().users, 'Deve retornar um array de usuários')
  })

  test('GET /user/{id} - should show user details', async ({ client, assert }) => {
    const response = await client
      .get(`/user/${createdUserId}`)
      .header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    assert.equal(response.body().user.id, createdUserId)
  })

  test('PUT /user/{id} - should update a user', async ({ client, assert }) => {
    const payload = {
      fullName: 'User Updated',
      email: 'user.updated@example.com',
      role: 'USER',
    }
    const response = await client
      .put(`/user/${createdUserId}`)
      .json(payload)
      .header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    assert.equal(response.body().user.fullName, 'User Updated')
    response.assertBodyContains({
      message: 'Usuário atualizado com sucesso.',
    })
  })

  test('DELETE /user/{id} - should delete a user', async ({ client }) => {
    const response = await client
      .delete(`/user/${createdUserId}`)
      .header('Authorization', `Bearer ${authToken}`)
    response.assertStatus(200)
    response.assertBodyContains({
      message: 'Usuário removido com sucesso.',
    })
  })
})
