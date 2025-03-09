import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const customMessages = new SimpleMessagesProvider({
  'fullName.minLength': 'O nome completo deve ter no mínimo 3 caracteres.',
  'email.required': 'O email é obrigatório.',
  'email.email': 'Por favor, informe um email válido.',
  'email.unique': 'O email informado já está em uso.',
  'password.required': 'A senha é obrigatória.',
  'password.minLength': 'A senha deve conter no mínimo 6 caracteres.',
  'role.enum': 'A role deve ser ADMIN, MANAGER, FINANCE ou USER.',
})

vine.messagesProvider = customMessages

/**
 * Validador para criação de usuário usando VineJS.
 *
 * Esse esquema valida:
 * - fullName: opcional, se fornecido, deve ser uma string com pelo menos 3 caracteres.
 * - email: obrigatório, deve ser um email válido e único na tabela "users".
 * - password: obrigatório, com no mínimo 6 caracteres.
 * - role: obrigatório, deve ser um dos valores: ADMIN, MANAGER, FINANCE ou USER.
 */
export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine.string().minLength(6),
    role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']),
  })
)
