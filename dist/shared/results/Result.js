"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
class Result {
    constructor() {
        this.toJSON = () => (0, Utils_1.Snakelize)(this);
    }
}
exports.default = Result;
