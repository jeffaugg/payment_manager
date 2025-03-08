import Client from "#models/client";

export default class ClientService {
  /**
   * Busca um cliente pelo email. Se não existir, cria o cliente.
   * Retorna o ID do cliente.
   */
  public async getOrCreateClient(clientData: { name: string; email: string }): Promise<number> {
    let client = await Client.findBy('email', clientData.email)
    if (!client) {
      client = await Client.create(clientData)
    }
    console.log(client.id)
    return client.id
  }
}
