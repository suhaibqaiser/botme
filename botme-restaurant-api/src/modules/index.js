"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var router_1 = require("./restaurant/router");
var router_2 = require("./customer/router");
var router_3 = require("./table/router");
var router_4 = require("./reservation/router");
var router_5 = require("./category/router");
var router_6 = require("./product/router");
var router_7 = require("./menu/router");
var router_8 = require("./order/router");
exports["default"] = __spreadArrays(router_2["default"], router_1["default"], router_3["default"], router_4["default"], router_5["default"], router_6["default"], router_7["default"], router_8["default"]);
