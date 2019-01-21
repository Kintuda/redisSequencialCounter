const Redis = require('ioredis')
const env = process.env

module.exports = () => {
  try {
    const config = {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      retryStrategy: env.REDIS_RETRY
    }
    return new Redis(config)
  } catch (error) {
    console.log(error);
    throw error
  }

}