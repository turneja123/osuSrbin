module.exports.getBeatmap_Id = function (url) {
    let strings = url.split("/");
    if (strings[strings.length - 1] != "") {
        return strings[strings.length - 1];
    } else {
        return strings[strings.length - 2];
    }
}

module.exports.twoDecimals = function (str) {
    str = str.toString();
    let arr = str.split(".");
    let ret = arr[0];
    if (arr[1].length != 0) {
        ret += '.';
    }
    for (let i = 0; i < Math.min(2, arr[1].length); i++) {
        ret += arr[1][i];
    }
    return ret;
}

module.exports.craftAccuracy = function (str) {
    str = str.toString();
    let ret = "";
    if (str === "1") {
        ret = "100.00%";
    } else {
        ret = str[2] + str[3] + '.' + str[4] + str[5] + '%';
    }
    return ret;
}

module.exports.numberBeautify = function (str) {
    str = str.toString();
    let temp = "";
    for (let i = str.length - 1, j = 0; i >= 0; i--, j++) {
        if (j % 3 === 0 && j !== 0) {
            temp += ',';
        }
        temp += str[i];
    }
    let ret = "";
    for (let i = temp.length - 1; i >= 0; i--) {
        ret += temp[i];
    }
    return ret;
}

module.exports.craftMods = function (arr) {
    let ret = "**+";
    for (let elem of arr) {
        ret += elem;
    }
    ret += "**";
    if (ret === "**+**") {
        return "";
    }
    return ret;
}