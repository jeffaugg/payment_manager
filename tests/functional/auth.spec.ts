import { test } from '@japa/runner'

test.group('Auth Endpoints', () => {
  test('should login successfully with valid credentials', async ({ client, assert }) => {
    const response = await client.post('/login').json({
      email: 'adm@email.com',
      password: 'adm123',
    })

    response.assertStatus(200)
    response.assertBodyContains({
      type: 'auth_token'
    })
    assert.exists(response.body().value, 'O token de acesso deve existir')
  })

  test('should return 401 for invalid credentials', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'usuario@example.com',
      password: 'senhaIncorreta',
    })
    response.assertStatus(401)
    response.assertBodyContains({
      message: 'Credenciais inválidas'
    })
  })
})
