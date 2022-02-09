"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camelize = exports.Snakelize = void 0;
const lodash_1 = require("lodash");
const IsArray = (e) => Array.isArray(e);
const IsObject = (e) => e === Object(e) && !IsArray(e) && typeof e !== "function";
const ToSnakeCase = (s) => s.replace(/([A-Z])/g, "_$1").toLowerCase();
const Snakelize = (e) => {
    if (IsObject(e)) {
        const snakeCaseObject = {};
        Object.keys(e).forEach((key) => {
            snakeCaseObject[ToSnakeCase(key)] = Snakelize(e[key]);
        });
        return snakeCaseObject;
    }
    else if (IsArray(e)) {
        return e.map((child) => Snakelize(child));
    }
    return e;
};
exports.Snakelize = Snakelize;
const Camelize = (e) => {
    if (IsObject(e)) {
        const snakeCaseObject = {};
        Object.keys(e).forEach((key) => {
            snakeCaseObject[(0, lodash_1.camelCase)(key)] = Camelize(e[key]);
        });
        return snakeCaseObject;
    }
    else if (IsArray(e)) {
        return e.map((child) => Camelize(child));
    }
    return e;
};
exports.Camelize = Camelize;
