const { transactionIncrement } = require('./index')

//testing
async function testLoad(id) {
    try {
        let paralelCalling = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        return await Promise.all(paralelCalling.map(test => transactionIncrement(`teste${id}`, 1, 50)))
    } catch (error) {
        console.log(`Error, ${error}`)
    }
}

let array = []
testLoad(1).then(res => console.log(res))
testLoad(1).then(res => console.log(res))
testLoad(1).then(res => console.log(res))
testLoad(1).then(res => console.log(res))
testLoad(1).then(res => console.log(res))
testLoad(1).then(res => console.log(res))
testLoad(1).then(res => console.log(res))
testLoad(1).then(res => console.log(res))
