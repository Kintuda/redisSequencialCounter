const redisDatabase = require('./connection')

const transactionIncrement = async (key, id, retries) => {
  try {
    redis = redisDatabase()
    await redis.watch(key)
    let result = await redis.multi()
      .incr(key)
      .get(key)
      .exec()

    if (result === null) {
      console.log(`Value changed while incrementing`)
      return await transactionIncrement(id, retries - 1)
    }

    if (retries === 0) {
      throw new Error('Reached the max number of retries')
    }

    return result[0][1]
  } catch (error) {
    console.log(`Error while incrementing key ${error}`)
    throw error
  }
}

