import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)

      // Emite um novo token
      const accessToken = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days',
        name: 'login-token',
      })

      return response.ok({
        type: accessToken.type,
        value: accessToken.value!.release(),
        expiresAt: accessToken.expiresAt,
      })
    } catch (error) {
      return response.unauthorized({ message: 'Credenciais inválidas' })
    }
  }
}
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@example.com"
 *               password:
 *                 type: string
 *                 example: "minhaSenha123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   example: "auth_token"
 *                 value:
 *                   type: string
 *                   example: "oat_ABCDEF123456..."
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Credenciais inválidas.
 */