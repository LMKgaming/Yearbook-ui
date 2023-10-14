const createRandomArray = (arr = [], maxLength = arr.length) => {
    let data = [...arr]
    let newArr = []
    while (newArr.length !== maxLength && !!data.length) {
        let randomNum = Math.floor(Math.random() * (data.length - 1))
        newArr.push(data[randomNum])
        data.splice(randomNum, 1)
    }
    return newArr
}

export default createRandomArray