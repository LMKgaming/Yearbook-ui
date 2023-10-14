const toObject = (keys, values) => {
    const obj = {};

    keys.forEach((element, index) => {
        obj[element] = values[index];
    });

    return obj;
};

const formatSheetData = (data) => {
    let arr = []
    const keys = data.shift()
    for (const item of data) {
        arr.push(toObject(keys, item))
    }
    return arr
};

export default formatSheetData;
