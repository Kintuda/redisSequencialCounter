const Redis = require('ioredis')
const { REDIS_HOST, REDIS_PORT, REDIS_RETRY } = process.env

module.exports = () => {
  const config = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    retryStrategy: REDIS_RETRY
  }
  return new Redis(config)
}