// app/Services/UsersService.ts

import User from "#models/user"

export default class UsersService {
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
   * Retorna todos os usuários.
   */
  public async listUsers(): Promise<User[]> {
    return await User.all()
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
  public async updateUser(id: number, payload: Partial<{ fullName: string; email: string; role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER' }>): Promise<User> {
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
