import S from 'fluent-json-schema'
import envSchema from 'env-schema'

const schema = S.object().prop(
  'LOG_LEVEL',
  S.string().enum(['debug', 'info', 'warn', 'error']).default('info')
)

export default envSchema({
  schema,
  dotenv: true
})
