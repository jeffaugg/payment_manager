import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customMessages = new SimpleMessagesProvider({
  'client.name.required': 'O nome do cliente é obrigatório.',
  'client.name.minLength': 'O nome do cliente deve ter no mínimo 3 caracteres.',
  'client.email.required': 'O email do cliente é obrigatório.',
  'client.email.email': 'Por favor, informe um email válido para o cliente.',
  'items.required': 'A lista de itens é obrigatória.',
  'items.array': 'Os itens devem ser um array.',
  'items.*.productId.required': 'O ID do produto é obrigatório para cada item.',
  'items.*.productId.number': 'O ID do produto deve ser um número.',
  'items.*.quantity.required': 'A quantidade é obrigatória para cada item.',
  'items.*.quantity.number': 'A quantidade deve ser um número.',
  'items.*.quantity.positive': 'A quantidade deve ser maior que zero.',
  'payment.name.required': 'O nome do comprador é obrigatório.',
  'payment.name.minLength': 'O nome do comprador deve ter no mínimo 3 caracteres.',
  'payment.email.required': 'O email do comprador é obrigatório.',
  'payment.email.email': 'Por favor, informe um email válido para o comprador.',
  'payment.cardNumber.required': 'O número do cartão é obrigatório.',
  'payment.cardNumber.string': 'O número do cartão deve ser uma string.',
  'payment.cardNumber.length': 'O número do cartão deve ter 16 dígitos.',
  'payment.cvv.required': 'O CVV é obrigatório.',
  'payment.cvv.string': 'O CVV deve ser uma string.',
  'payment.cvv.minLength': 'O CVV deve ter no mínimo 3 dígitos.',
  'payment.cvv.maxLength': 'O CVV deve ter no máximo 4 dígitos.',
})

vine.messagesProvider = customMessages

export const purchaseValidator = vine.compile(
  vine.object({
    items: vine.array(
      vine.object({
        productId: vine.number(),
        quantity: vine.number().positive(),
      })
    ),
    payment: vine.object({
      name: vine.string().trim().minLength(3),
      email: vine.string().trim().email(),
      cardNumber: vine.string().trim().fixedLength(16),
      cvv: vine.string().trim().minLength(3).maxLength(4),
    }),
  })
)
