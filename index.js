require('dotenv').config()
const redisDatabase = require('./db/connection')
let env = process.env
let redis

async function transactionIncrement(key,id, retries) {
  try {
    await redis.watch(key)
    let result = await redis.multi()
                  .incr(key)
                  .get(key)
                  .exec()

    if(result === null){
      console.log(`Value changed while incrementing`)
      return await transactionIncrement(id,retries-1)
    }

    if(retries === 0){
      throw new Error('Reached the max number of retries')
    }
                       
    return result[0][1]
  } catch (error) {
    console.log(`Error while incrementing key ${error}`)
    throw error
  }
}

async function connect() {
  try {
    redis = redisDatabase()
  } catch (error) {
    console.log('Error while connecting into instance of REDIS database')
    throw error
  }
}

//testing
async function testLoad(id) {
  try {
    await connect()
    let paralelCalling = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0]
    return await Promise.all(paralelCalling.map(test=> transactionIncrement(`teste${id}`, 1, 50)))
  } catch (error) {
    console.log(`Error, ${error}`)
  }
}

let array = []
testLoad(1).then(res=>console.log(res))
testLoad(1).then(res=>console.log(res))
testLoad(1).then(res=>console.log(res))
testLoad(1).then(res=>console.log(res))
testLoad(1).then(res=>console.log(res))
testLoad(1).then(res=>console.log(res))
testLoad(1).then(res=>console.log(res))
testLoad(1).then(res=>console.log(res))



