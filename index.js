require('dotenv').config()
const redisDatabase = require('./db/connection')
let env = process.env
let redis
let circuitOpen = false

async function initialValue(id, retries){
  try {
    await redis.watch(`santander.${env.NODE_ENV}.${id}`)
    let data = await redis.get(`santander.${env.NODE_ENV}.${id}`)
    if(retries === 0){
      throw new Error('Erro ao definir NSU')
    }
    if(!data){
      console.log('From zero')
      let result = await redis.multi()
        .set(`santander.${env.NODE_ENV}.${id}`, 1)
        .exec()
      if(!result){
        return await initialValue(id, retries - 1)
      }
      return 1
    }else{
      console.log('Increment');
      return await transactionIncrement(id, retries)
    }
  } catch (error) {
    circuitOpen = true
    console.log(error)
    throw error
  }
}
async function transactionIncrement(id, retries) {
  try {
    // await redis.watch(`santander.${env.NODE_ENV}.${id}`)
    let result = await redis.multi()
                        .incr(`santander.${env.NODE_ENV}.${id}`)
                        .get(`santander.${env.NODE_ENV}.${id}`)
                        .exec()

    if(result === null){
      return await transactionIncrement(id,retries-1)
    }

    if(retries === 0){
      throw new Error(`Erro ao solicitar nsu`)
    }
                       
    return result[0][1]
  } catch (error) {
    circuitOpen = true
    throw error
  }
                      


}

function stringBuilder(id) {
  return `santander.${env.NODE_ENV}.${id}`
}

async function connect() {
  try {
    redis = redisDatabase()
  } catch (error) {
    circuitOpen = true
    console.log(error)
    throw error
  }
}

async function main(id) {
  try {
    await connect()
    // await redis.del(`santander.${env.NODE_ENV}.1`)
    // const data = await getData(1)
    // let data = await redis.get(`santander.${env.NODE_ENV}.${id}`)
    const string = stringBuilder(1)
    let testes = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0]
    // console.log(teste + ` TESTE ${id}`);
    return await Promise.all(testes.map(test=> initialValue(1, 50)))
    // console.log('done');
    // return teste
  } catch (error) {
    console.log(error);
  }
}
let array = []
main(1).then(res=>console.log(res))
main(2).then(res=>console.log(res))
main(3).then(res=>console.log(res))
main(4).then(res=>console.log(res))
main(5).then(res=>console.log(res))
main(6).then(res=>console.log(res))
main(7).then(res=>console.log(res))
main(8).then(res=>console.log(res))
// Promise.all(array).then(res=>console.log(res))



