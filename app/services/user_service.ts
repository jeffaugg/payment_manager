// app/Services/UsersService.ts

import User from '#models/user'
import UserServiceContract from './interface/user_service_contract.js'

export default class UsersService implements UserServiceContract {
  /**
   * Cria um novo usuário.
   * @param payload Os dados validados para criação do usuário.
   * @returns O usuário criado.
   */
  public async createUser(payload: {
    fullName?: string
    email: string
    password: string
    role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
  }): Promise<User> {
    const user = await User.create(payload)
    return user
  }

  /**
   * Retorna os usuários com paginação e filtro por role.
   */
  public async listUsers(options: {
    page?: number
    limit?: number
    role?: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
  }): Promise<any> {
    const { page = 1, limit = 10, role } = options
    const query = User.query()

    if (role) {
      query.where('role', role)
    }

    return await query.paginate(page, limit)
  }

  /**
   * Busca um usuário pelo id.
   * @param id O id do usuário.
   */
  public async getUser(id: number): Promise<User> {
    return await User.findOrFail(id)
  }

  /**
   * Atualiza os dados de um usuário.
   * @param id O id do usuário a ser atualizado.
   * @param payload Os dados a serem atualizados.
   */
  public async updateUser(
    id: number,
    payload: Partial<{
      fullName: string
      email: string
      role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
    }>
  ): Promise<User> {
    const user = await User.findOrFail(id)
    user.merge(payload)
    await user.save()
    return user
  }

  /**
   * Remove um usuário.
   * @param id O id do usuário a ser removido.
   */
  public async deleteUser(id: number): Promise<void> {
    const user = await User.findOrFail(id)
    await user.delete()
  }
}
