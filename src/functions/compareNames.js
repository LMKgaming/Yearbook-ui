const compareNames = (a, b) => {
    let aArr = a
        .split(' ')
        .reverse()
        .map((p) => p.split(''));
    let bArr = b
        .split(' ')
        .reverse()
        .map((p) => p.split(''));
    let length = aArr.length > bArr.length ? bArr.length : aArr.length;
    for (let i = 0; i < length; i++) {
        let subLength = aArr[i].length < bArr[i].length ? bArr[i].length : aArr[i].length;
        for (let j = 0; j < subLength; j++) {
            if (!aArr[i][j] && bArr[i][j]) return -1
            else if(!bArr[i][j] && aArr[i][j]) return 1
            let val = aArr[i][j].localeCompare(bArr[i][j]);
            if (val === 0) continue;
            return val;
        }
    }
    return 0;
};

export default compareNames;
