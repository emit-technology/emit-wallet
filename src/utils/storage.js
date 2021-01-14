"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Storage = /** @class */ (function () {
    function Storage() {
        this.getItem = function (key) {
            var rest = localStorage.getItem(key);
            if (rest) {
                try {
                    return JSON.parse(rest);
                }
                catch (e) {
                    return rest;
                }
            }
            return rest;
        };
        this.setItem = function (key, value) {
            var v = typeof value === "object" ? JSON.stringify(value) : value;
            localStorage.setItem(key, v);
        };
        this.removeItem = function (key) {
            localStorage.removeItem(key);
        };
        this.clear = function () {
            localStorage.clear();
        };
    }
    return Storage;
}());
var selfStorage = new Storage();
exports.default = selfStorage;
