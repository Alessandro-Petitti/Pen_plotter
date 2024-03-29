"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utilities {
    static round(num) {
        return Math.round(num * 100) / 100;
    }
    static size(arr, all) {
        let size = 0;
        for (let x = 0, xl = arr.length; x < xl; x++) {
            for (let y = 0, yl = arr[x].length; y < yl; y++) {
                if (all)
                    size++;
                else if (arr[x][y].intensity < 765 && !arr[x][y].be)
                    size++;
            }
        }
        return size;
    }
    static centerDistance(newPixel) {
        return {
            x: newPixel[0][0].x + ((newPixel[newPixel.length - 1][newPixel[newPixel.length - 1].length - 1].x - newPixel[0][0].x) / 2),
            y: newPixel[0][0].y + ((newPixel[newPixel.length - 1][newPixel[newPixel.length - 1].length - 1].y - newPixel[0][0].y) / 2)
        };
    }
    static distanceIsOne(oldPixel, newPixel) {
        let diameter = oldPixel.length + 1, oldPixelDist = this.centerDistance(oldPixel), newPixelDist = this.centerDistance(newPixel), distX = newPixelDist.x - oldPixelDist.x, distY = newPixelDist.y - oldPixelDist.y;
        return (-diameter <= distY && distY <= diameter) && (-diameter <= distX && distX <= diameter);
    }
    static appliedAllPixel(arr, cb) {
        try {
            for (let iRow = 0, rl = arr.length; iRow < rl; iRow++) {
                if (arr[iRow].length === 1) {
                    cb(arr[iRow][0], iRow);
                }
                for (let iColumn = 0, cl = arr[iRow].length - 1; iColumn < cl; iColumn++) {
                    cb(arr[iRow][iColumn], iRow, iColumn);
                }
            }
        }
        catch (error) {
            throw new Error("Something went wrong. :(");
        }
    }
    static nearest(oldPixel, newPixel1, newPixel2) {
        try {
            function nearestPoint(oldPoint, newPoint) {
                return Math.sqrt(Math.pow(newPoint.x - oldPoint.x, 2) + Math.pow(newPoint.y - oldPoint.y, 2));
            }
            if (!newPixel2) {
                return newPixel1;
            }
            else {
                let oldPixelDist = this.centerDistance(oldPixel);
                return nearestPoint(oldPixelDist, this.centerDistance(newPixel1)) < nearestPoint(oldPixelDist, this.centerDistance(newPixel2)) ? newPixel1 : newPixel2;
            }
        }
        catch (error) {
            throw new Error("Nearest");
        }
    }
    static resolveZ(pixels, whiteZ, blackZ) {
        function avgIntensity() {
            let l = pixels.length, intensity = 0;
            for (let r = 0; r < l; r++) {
                for (let c = 0; c < l; c++) {
                    intensity += pixels[r][c].intensity;
                }
            }
            return intensity / (l * l);
        }
        return (avgIntensity() * blackZ / -765) + blackZ;
    }
}
exports.default = Utilities;
