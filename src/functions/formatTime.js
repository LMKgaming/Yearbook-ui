const processView = (time = 0, lengthRequire = 2) => {
    if (time.toString().length < lengthRequire) return `0` + processView(time, lengthRequire - 1);
    return time.toString();
};

const formatTime = (second = 0, type = 'default', showZeroMultiply = false, defaultMinLen = 2) => {
    let currentTime = second;
    let result = [];
    let typeChoose = type === 'default' ? 'hh:mm:ss' : type;
    let arrTimeType = typeChoose.split(':');
    while (arrTimeType.length) {
        result.push(processView(Math.floor(currentTime / 60 ** (arrTimeType.length - 1)), arrTimeType[0].length));
        currentTime -= Math.floor(currentTime / 60 ** (arrTimeType.length - 1)) * 60 ** (arrTimeType.length - 1);
        arrTimeType.shift();
    }
    if (!showZeroMultiply) {
        while (result.length > defaultMinLen) {
            if (+result[0] !== 0) break 
            result.shift()
        }
    }
    return result.join(':');
};

export default formatTime;
