"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("./utilities");
class Analyze {
    static getFirstPixel(image, _pixel, oldPixelBlack) {
        try {
            if (oldPixelBlack) {
                return utilities_1.default.nearest(oldPixelBlack, utilities_1.default.nearest(oldPixelBlack, this.getFirstPixelUpWidth(image, _pixel), this.getFirstPixelBottomWidth(image, _pixel)), utilities_1.default.nearest(oldPixelBlack, this.getFirstPixelBottomHeight(image, _pixel), this.getFirstPixelUpHeight(image, _pixel)));
            }
            else {
                return this.getFirstPixelUpWidth(image, _pixel);
            }
        }
        catch (error) {
            throw new Error("Something went wrong :(. \nPlease try other measures to 'tool Diameter' or 'scaleAxes'.");
        }
    }
    static getFirstPixelUpWidth(image, _pixel) {
        for (let x = 0, xl = image.pixels.length; x < xl; x++) {
            for (let y = 0, yl = image.pixels[x].length; y < yl; y++) {
                let lFor = this.lookFor(image, _pixel, x, y);
                if (lFor)
                    return lFor;
            }
        }
    }
    static getFirstPixelUpHeight(image, _pixel) {
        for (let y = 0; y < image.pixels[y].length - 1; y++) {
            for (let x = 0, xl = image.pixels.length - 1; x < xl; x++) {
                let lFor = this.lookFor(image, _pixel, x, y);
                if (lFor)
                    return lFor;
            }
        }
    }
    static getFirstPixelBottomWidth(image, _pixel) {
        for (let x = image.pixels.length - 1; x >= 0; x--) {
            for (let y = image.pixels[x].length - 1; y >= 0; y--) {
                let lFor = this.lookFor(image, _pixel, x, y);
                if (lFor)
                    return lFor;
            }
        }
    }
    static getFirstPixelBottomHeight(image, _pixel) {
        for (let y = image.pixels[image.pixels.length - 1].length - 1; y >= 0; y--) {
            for (let x = image.pixels.length - 1; x >= 0; x--) {
                let lFor = this.lookFor(image, _pixel, x, y);
                if (lFor)
                    return lFor;
            }
        }
    }
    static lookFor(image, _pixel, x, y) {
        let pixels = [], diameter = _pixel.diameter < 1 ? 1 : Math.round(_pixel.diameter), diameterX2 = diameter + diameter / 2;
        if (x + diameter <= image.width &&
            y + diameter <= image.height &&
            image.pixels[x][y].intensity < 765) {
            for (let x2 = 0, pd = diameter; x2 < pd; x2++) {
                let row = [];
                for (let countBlack = 0, y2 = 0; y2 < pd; y2++) {
                    let p = image.pixels[x + x2 < image.height ? x + x2 : image.height][y + y2 < image.width ? y + y2 : image.width];
                    if (p.intensity < 765) {
                        if (countBlack > diameterX2 || !p.be) {
                            countBlack++;
                            row.push(p);
                        }
                    }
                }
                pixels.push(row);
            }
            return utilities_1.default.size(pixels, true) === diameter * diameter ? pixels : false;
        }
    }
    static nextBlackToMove(oldPixelBlack, image, _pixel) {
        let arrLootAt = this.lootAtBlackPixel(oldPixelBlack, image, _pixel.diameter);
        let diameter = _pixel.diameter < 1 ? 1 : Math.round(_pixel.diameter);
        for (let x = 0, l = arrLootAt.length - 1; x < l; x++) {
            for (let y = 0; y < l; y++) {
                if (arrLootAt[x][y] && arrLootAt[x][y].intensity < 765) {
                    let pixelBir = [];
                    for (let x2 = 0; x2 < diameter; x2++) {
                        let rowBit = [];
                        for (let y2 = 0; y2 < diameter; y2++) {
                            if (x + x2 <= l && y + y2 <= l) {
                                let p = arrLootAt[x + x2][y + y2];
                                if (!p || p.intensity === 765 || p.be) {
                                    x2 = diameter;
                                    y2 = diameter;
                                    break;
                                }
                                else {
                                    rowBit.push(p);
                                }
                            }
                        }
                        pixelBir.push(rowBit);
                    }
                    if (utilities_1.default.size(pixelBir, true) === diameter * diameter) {
                        return pixelBir;
                    }
                }
            }
        }
        return this.getFirstPixel(image, _pixel, oldPixelBlack);
    }
    static lootAtBlackPixel(oldPixelBlack, image, diameter) {
        try {
            let arr = [];
            for (let x = 0, xl = oldPixelBlack.length; x < xl; x++) {
                for (let y = 0, yl = oldPixelBlack[x].length; y < yl; y++) {
                    for (let x2 = -diameter, d = diameter + diameter; x2 <= d; x2++) {
                        let val_x = Math.floor(oldPixelBlack[x][y].x + x2);
                        let row = [];
                        for (let y2 = -diameter, d = diameter + diameter; y2 <= d; y2++) {
                            let val_y = Math.floor(oldPixelBlack[x][y].y + y2);
                            if (val_x < 0 || val_x >= image.height || val_y < 0 || val_y >= image.width) {
                                row.push(void 0);
                            }
                            else {
                                row.push(image.pixels[val_x][val_y]);
                            }
                        }
                        arr.push(row);
                    }
                    return arr;
                }
            }
        }
        catch (error) {
            throw new Error("Something went wrong :(. \nPlease try other measures to 'tool Diameter' or 'scaleAxes'.");
        }
    }
}
exports.default = Analyze;
