"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Line {
    constructor(axes, invest, comment) {
        this._sign = {
            x: "-",
            y: "-"
        };
        this._axes = axes;
        this._sign.x = (invest.x && "-") || "";
        this._sign.y = (invest.y && "-") || "";
        this._comment = comment || undefined;
    }
    get comment() {
        return this._comment;
    }
    set comment(v) {
        this._comment = v;
    }
    get axes() {
        return this._axes;
    }
    code(percentage) {
        let x = (this._axes.x && ` X${this._sign.x}${this._axes.x.toFixed(4)}`) || "";
        let y = (this._axes.y && ` Y${this._sign.y}${this._axes.y.toFixed(4)}`) || "";
        let z = (this._axes.m && " " + this._axes.m) ||
            (this._axes.z &&
                ` Z${this._axes.z.safe ? this._axes.z.val : (this._axes.z.val * percentage).toFixed(4)}`) ||
            "";
        let f = (this._axes.f && ` F${this._axes.f}`) || "";
        let comment = (this._comment && ` ;${this._comment}`) || "";
        return "G01" + x + y + z + f + comment;
    }
}
exports.default = Line;
