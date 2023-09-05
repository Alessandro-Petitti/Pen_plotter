"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const utilities_1 = require("./utilities");
const analyze_1 = require("./analyze");
const line_1 = require("./line");
const file_1 = require("./file");
const path = require("path");
const Jimp = require("jimp/browser/lib/jimp");
const events_1 = require("events");
class Main extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this._typeInfo = "none";
        this._gCode = [];
        this._img = { height: 0, width: 0, pixels: [] };
        this._pixel = { diameter: 1, toMm: 1 };
        this._progress = 0;
    }
    tick(nro) {
        if (this._typeInfo === "console") {
            console.log(utilities_1.default.round(nro) + "%");
        }
        else if (this._typeInfo === "emitter") {
            this.emit("tick", nro);
        }
    }
    log(str) {
        if (this._typeInfo === "console") {
            console.log(str);
        }
        else if (this._typeInfo === "emitter") {
            this.emit("log", str);
        }
    }
    error(err) {
        let srt = typeof err === "string" ? new Error(err) : err;
        if (this._typeInfo === "emitter") {
            this.emit("error", srt);
        }
        else {
            throw srt;
        }
    }
    then(cb) {
        this._then = cb;
        return this;
    }
    isImg(extension) {
        return /\.(png|jpe{0,1}g|gif)/i.test(extension);
    }
    reSet() {
        this._gCode = [];
        this._img = { height: 0, width: 0, pixels: [] };
        this._pixel = { diameter: 1, toMm: 1 };
        this._progress = 0;
    }
    start(config) {
        this.reSet();
        if (Buffer.isBuffer(config.image) || this.isImg(path.extname(config.image))) {
            (config.toolDiameter && typeof config.toolDiameter === "number") ||
                this.error("ToolDiameter undefined or is't number.");
            (config.blackZ && typeof config.blackZ === "number") ||
                this.error("Black distance z undefined or is't number.");
            (config.safeZ && typeof config.safeZ === "number") ||
                this.error("Safe distance z undefined or is't number.");
            (config.image && (typeof config.image === "string" || Buffer.isBuffer(config.image))) ||
                this.error("Address undefined Image or is't string.");
            if (config.laser) {
                (typeof config.laser.commandPowerOn === "string" &&
                    typeof config.laser.commandPowerOff === "string") ||
                    this.error("Laser options are not string.");
            }
            config.sensitivity =
                config.sensitivity <= 1 && config.sensitivity >= 0 ? config.sensitivity : 0.95;
            config.deepStep = (typeof config.deepStep === "number" && config.deepStep) || -1;
            config.whiteZ = (typeof config.whiteZ === "number" && config.whiteZ) || 0;
            config.time = +new Date();
            if (config.invest) {
                config.invest.x = typeof config.invest.x === "boolean" ? config.invest.x : true;
                config.invest.y = typeof config.invest.y === "boolean" ? config.invest.y : true;
            }
            else {
                config.invest = { x: false, y: true };
            }
            if (config.feedrate) {
                config.feedrate.work =
                    (typeof config.feedrate.work === "number" && config.feedrate.work) || 0;
                config.feedrate.idle =
                    (typeof config.feedrate.idle === "number" && config.feedrate.idle) || 0;
            }
            else {
                config.feedrate = { work: NaN, idle: NaN };
            }
            this._typeInfo = (typeof config.info === "string" && config.info) || "none";
            if (Buffer.isBuffer(config.image)) {
                this.log("-> Loading image from Buffer: " + config.image);
            }
            else {
                this.log("-> Image from path: " + config.image);
            }
            const self = this;
            this.run(config)
                .then((result) => {
                if (typeof self._then === "function")
                    self._then({ dirGCode: result.dirGCode, config, gcode: result.gcode });
                if (self._typeInfo === "emitter")
                    self.emit("complete", { dirGCode: result.dirGCode, config, gcode: result.gcode });
            })
                .catch(err => self.error(err));
        }
        return this;
    }
    run(config) {
        let self = this;
        return new Promise((resolve, reject) => {
            self
                .loading(config)
                .then((config) => self.analyze(config, resolve))
                .catch(reject);
        });
    }
    analyze(config, fulfill) {
        try {
            //this.tick(0);
            let firstPixel = analyze_1.default.getFirstPixel(this._img, this._pixel);
            this.addPixel({ x: firstPixel[0][0].x, y: firstPixel[0][0].y, f: config.feedrate.idle }, config);
            let w = 0;
            while (w <= config.errBlackPixel) {
                //this.tick(this._progress / config.errBlackPixel);
                let nexPixels = analyze_1.default.nextBlackToMove(firstPixel, this._img, this._pixel);
                if (!nexPixels) {
                    //this.tick(1);
                    config.errBlackPixel = utilities_1.default.round((utilities_1.default.size(this._img.pixels) * 100) / config.errBlackPixel);
                    this.log("-> " + config.errBlackPixel + "% of black pixels unprocessed.");
                    this.log("-> Accommodating gcode...");
                    file_1.default.save(this._gCode, config).then((result) => {
                        this.log("-> Sava As: " + result.dirGCode);
                        fulfill(result);
                    });
                    console.log("file gicode non salvato");
                    break;
                }
                firstPixel = this.toGCode(firstPixel, nexPixels, config);
                w++;
            }
        }
        catch (error) {
            this.error("\nError processing image gcode, may be for settings.");
        }
    }
    loading(config) {
        let self = this;
        return new Promise((fulfill, reject) => {
            window.Jimp.read(config.image)
                .then(image => {
                self.log("-> Openping and reading...");
                self._img.height = image.bitmap.height;
                self._img.width = image.bitmap.width;
                self._pixel.toMm =
                    typeof config.scaleAxes !== "undefined" && config.scaleAxes !== self._img.height
                        ? (self._pixel.toMm = utilities_1.default.round(config.scaleAxes / self._img.height))
                        : 1;
                self._pixel.diameter = utilities_1.default.round(config.toolDiameter / self._pixel.toMm);
                let squareImg = self.getAllPixel(image, config);
                self._img.pixels = squareImg;
                self._img.height = squareImg.length;
                self._img.width = squareImg.length;
                config.errBlackPixel = utilities_1.default.size(self._img.pixels);
                config.imgSize =
                    "(" +
                        image.bitmap.height +
                        "," +
                        image.bitmap.width +
                        ")pixel to (" +
                        utilities_1.default.round(image.bitmap.height * self._pixel.toMm) +
                        "," +
                        utilities_1.default.round(image.bitmap.width * self._pixel.toMm) +
                        ")mm";
                fulfill(config);
            })
                .catch((err) => {
                reject(new Error("File not found.\n" + err.message));
            });
        });
    }
    toGCode(oldPixel, newPixel, config) {
        try {
            let pixelLast = newPixel[0][0], pixelFist = oldPixel[0][0];
            if (utilities_1.default.distanceIsOne(oldPixel, newPixel)) {
                this.addPixel({
                    x: pixelFist.x + (pixelLast.x - pixelFist.x),
                    y: pixelFist.y + (pixelLast.y - pixelFist.y),
                    z: {
                        val: utilities_1.default.resolveZ(newPixel, config.whiteZ, config.blackZ),
                        safe: false
                    },
                    m: config.laser ? config.laser.commandPowerOn : void 0
                }, config);
            }
            else {
                this.addPixel({
                    z: { val: config.safeZ, safe: true },
                    m: config.laser ? config.laser.commandPowerOff : void 0,
                    f: config.feedrate.idle
                }, config);
                this.addPixel({
                    x: pixelFist.x + (pixelLast.x - pixelFist.x),
                    y: pixelFist.y + (pixelLast.y - pixelFist.y),
                    z: { val: config.safeZ, safe: true },
                    m: config.laser ? config.laser.commandPowerOff : void 0,
                    f: config.feedrate.idle
                }, config);
                this.addPixel({
                    z: {
                        val: utilities_1.default.resolveZ(newPixel, config.whiteZ, config.blackZ),
                        safe: false
                    },
                    m: config.laser ? config.laser.commandPowerOn : void 0,
                    f: config.feedrate.work
                }, config);
            }
            utilities_1.default.appliedAllPixel(newPixel, (p) => {
                this._progress++;
                p.be = true;
            });
            return newPixel;
        }
        catch (error) {
            this.error("Pixels are not valid for this configuration.");
        }
    }
    addPixel(axes, config) {
        try {
            let sum = this._pixel.diameter / 2;
            let X = axes.x && (axes.x + sum) * this._pixel.toMm;
            let Y = axes.y && (axes.y + sum) * this._pixel.toMm;
            if (this._gCode.length === 0) {
                const comment = config.laser
                    ? `X0 Y0 ${config.laser.commandPowerOff} Line Init`
                    : `X0 Y0 Z${config.safeZ} Line Init`;
                this._gCode.push(new line_1.default({
                    x: 0,
                    y: 0,
                    z: { val: config.safeZ, safe: true },
                    m: config.laser ? config.laser.commandPowerOff : void 0
                }, config.invest, comment));
                this._gCode.push(new line_1.default({
                    x: X,
                    y: Y,
                    z: { val: config.safeZ, safe: true },
                    m: config.laser ? config.laser.commandPowerOff : void 0
                }, config.invest, config.laser ? "Laser off" : "With Z max "));
            }
            this._gCode.push(new line_1.default({ x: X, y: Y, z: axes.z, f: axes.f, m: axes.m }, config.invest));
        }
        catch (error) {
            this.error("Failed to build a line.");
        }
    }
    getAllPixel(image, config) {
        try {
            let self = this;
            function intensityFix(colour) {
                return (colour.r + colour.g + colour.b) * (colour.a > 1 ? colour.a / 100 : 1);
            }
            let newArray = [];
            for (let x = 0, xl = this._img.width; x < xl; x++) {
                let row = [];
                for (let y = 0, yl = this._img.height; y < yl; y++) {
                    let intensity = intensityFix(window.Jimp.intToRGBA(image.getPixelColour(x, y)));
                    row.push({
                        x,
                        y,
                        be: intensity >= 765 * config.sensitivity,
                        intensity: intensity < 765 * config.sensitivity ? intensity : 765
                    });
                }
                newArray.push(row);
            }
            return self.normalizeImg(newArray);
        }
        catch (error) {
            this.error("Error processing image.");
        }
    }
    normalizeImg(img) {
        try {
            let row = img.length - 1, column = img[img.length - 1].length - 1;
            function addRow(image) {
                for (let y = row; y < column; y++) {
                    let newRow = [];
                    for (let x = 0; x < column; x++) {
                        newRow.push({
                            x,
                            y,
                            be: true,
                            intensity: 765
                        });
                    }
                    image.push(newRow);
                }
                return image;
            }
            function addColumn(image) {
                for (let x = column; x < row; x++) {
                    for (let y = 0; y <= row; y++) {
                        image[y].push({
                            x,
                            y,
                            be: true,
                            intensity: 765
                        });
                    }
                }
                return image;
            }
            return row < column ? addRow(img) : addColumn(img);
        }
        catch (error) {
            this.error("Error processing image.");
        }
    }
}
exports.Main = Main;
