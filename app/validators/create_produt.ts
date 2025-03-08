import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customMessages = new SimpleMessagesProvider({
  'name.required': 'O nome do produto é obrigatório.',
  'name.minLength': 'O nome do produto deve ter no mínimo 3 caracteres.',
  'amount.required': 'O valor do produto é obrigatório.',
  'amount.number': 'O valor do produto deve ser um número.',
  'amount.positive': 'O valor do produto deve ser positivo.',
})

vine.messagesProvider = customMessages

/**
 * Validador para criação de produto.
 *
 * Este esquema valida:
 * - name: obrigatório, string, com no mínimo 3 caracteres.
 * - amount: obrigatório, numérico e positivo.
 */
export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    amount: vine.number().positive(),
  })
)
