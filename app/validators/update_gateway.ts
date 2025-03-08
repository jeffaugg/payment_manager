import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customMessages = new SimpleMessagesProvider({
  'isActive.required': 'O status de ativação é obrigatório.',
  'isActive.boolean': 'O status de ativação deve ser verdadeiro ou falso.',
  'priority.required': 'A prioridade é obrigatória.',
  'priority.number': 'A prioridade deve ser um número.',
  'priority.positive': 'A prioridade deve ser um número positivo.',
})

vine.messagesProvider = customMessages

/**
 * Validador para atualização de gateway.
 * 
 * Este esquema valida:
 * - isActive: obrigatório, booleano.
 * - priority: obrigatório, numérico e positivo.
 */
export const updateGatewayValidator = vine.compile(
  vine.object({
    isActive: vine.boolean(),
    priority: vine.number().positive(),
  })
)
