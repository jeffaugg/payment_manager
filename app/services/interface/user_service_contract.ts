import User from '#models/user'

// filepath: /home/jeffaugg/dev/payment_manager/app/services/interface/user_service_contract.ts

export default abstract class UserServiceContract {
  /**
   * Cria um novo usuário.
   * @param payload Os dados validados para criação do usuário.
   * @returns O usuário criado.
   */
  public abstract createUser(payload: {
    fullName?: string
    email: string
    password: string
    role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
  }): Promise<User>

  /**
   * Retorna os usuários com paginação e filtro por role.
   */
  public abstract listUsers(options: {
    page?: number
    limit?: number
    role?: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
  }): Promise<any>

  /**
   * Busca um usuário pelo id.
   * @param id O id do usuário.
   */
  public abstract getUser(id: number): Promise<User>

  /**
   * Atualiza os dados de um usuário.
   * @param id O id do usuário a ser atualizado.
   * @param payload Os dados a serem atualizados.
   */
  public abstract updateUser(
    id: number,
    payload: Partial<{
      fullName: string
      email: string
      role: 'ADMIN' | 'MANAGER' | 'FINANCE' | 'USER'
    }>
  ): Promise<User>

  /**
   * Remove um usuário.
   * @param id O id do usuário a ser removido.
   */
  public abstract deleteUser(id: number): Promise<void>
}
