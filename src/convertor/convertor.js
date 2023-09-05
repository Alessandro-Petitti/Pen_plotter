"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ImageToBuffer = exports.convert = void 0;
var img2gcode = require("@tutagomes/img2gcode");
var convert = function (image) { return (new Promise(function (resolve, reject) {
    var img = (0, exports.base64ImageToBuffer)(image);
    img2gcode
        .start({
        // It is mm
        toolDiameter: 0.04,
        scaleAxes: 29,
        deepStep: -1,
        whiteZ: 0,
        blackZ: -2,
        safeZ: 2,
        laser: {
            commandPowerOn: 'Z0',
            commandPowerOff: 'Z-3'
        },
        invest: {
            y: false,
            x: false
        },
        // gcodeFile: 'output', // Name of gcode output file. Must be provided for Buffered Image.
        image: img // Or Buffer from base64 -> https://github.com/oliver-moran/jimp/issues/231
    })
        .on("error", function (data) {
        resolve({
            success: false,
            error: data
        });
    })
        .then(function (data) {
        resolve({
            success: true,
            data: data
        });
    });
})); };
exports.convert = convert;
var base64ImageToBuffer = function (base64String) {
    var base64clean = base64String.split(",");
    var bufferBase64 = Buffer.from(base64clean[1], 'base64');
    return bufferBase64;
};
exports.base64ImageToBuffer = base64ImageToBuffer;
