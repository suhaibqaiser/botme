"use strict";
exports.__esModule = true;
exports.handleCompression = exports.handleBodyRequestParsing = exports.handleCors = void 0;
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var compression_1 = require("compression");
var handleCors = function (router) {
    return router.use(cors_1["default"]({ credentials: true, origin: true }));
};
exports.handleCors = handleCors;
var handleBodyRequestParsing = function (router) {
    router.use(body_parser_1["default"].urlencoded({ extended: true }));
    router.use(body_parser_1["default"].json());
};
exports.handleBodyRequestParsing = handleBodyRequestParsing;
var handleCompression = function (router) {
    router.use(compression_1["default"]());
};
exports.handleCompression = handleCompression;
