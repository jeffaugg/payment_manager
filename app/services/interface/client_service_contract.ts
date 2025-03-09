export abstract class ClientServiceContract {
  /**
   * Busca um cliente pelo email. Se não existir, cria o cliente.
   * Retorna o ID do cliente.
   */
  abstract getOrCreateClient(clientData: { name: string; email: string }): Promise<number>
}
