"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.editOrder = exports.addOrder = exports.findOrder = void 0;
var response_1 = require("../../utils/response");
var service_1 = require("./service");
var crypto_1 = require("crypto");
function findOrder(filter) {
    return __awaiter(this, void 0, void 0, function () {
        var response, queryParams, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = new response_1.restResponse();
                    queryParams = {
                        customer: undefined,
                        reservation: undefined,
                        orderId: undefined,
                        orderType: undefined,
                        orderStatus: undefined
                    };
                    if (filter.customer) {
                        queryParams.customer = filter.customer;
                    }
                    else {
                        delete queryParams.customer;
                    }
                    if (filter.reservation) {
                        queryParams.reservation = filter.reservation;
                    }
                    else {
                        delete queryParams.reservation;
                    }
                    if (filter.orderId) {
                        queryParams.orderId = filter.orderId;
                    }
                    else {
                        delete queryParams.orderId;
                    }
                    if (filter.type) {
                        queryParams.orderType = filter.type;
                    }
                    else {
                        delete queryParams.orderType;
                    }
                    if (filter.status) {
                        queryParams.orderStatus = filter.status;
                    }
                    else {
                        delete queryParams.orderStatus;
                    }
                    console.log(queryParams);
                    return [4 /*yield*/, service_1.getOrder(queryParams)];
                case 1:
                    result = _a.sent();
                    if (result.length != 0) {
                        response.payload = result;
                        response.status = "success";
                        return [2 /*return*/, response];
                    }
                    else {
                        response.payload = "order not found";
                        response.status = "error";
                        return [2 /*return*/, response];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.findOrder = findOrder;
function addOrder(order) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = new response_1.restResponse();
                    if (!order) {
                        response.payload = "order is required";
                        response.status = "error";
                        return [2 /*return*/, response];
                    }
                    order.orderId = crypto_1.randomUUID();
                    return [4 /*yield*/, service_1.createOrder(order)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        response.payload = result;
                        response.status = "success";
                        return [2 /*return*/, response];
                    }
                    else {
                        response.payload = "order not found";
                        response.status = "error";
                        return [2 /*return*/, response];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.addOrder = addOrder;
function editOrder(order) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = new response_1.restResponse();
                    if (!order) {
                        response.payload = "order is required";
                        response.status = "error";
                        return [2 /*return*/, response];
                    }
                    return [4 /*yield*/, service_1.updateOrder(order)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        response.payload = result;
                        response.status = "success";
                        return [2 /*return*/, response];
                    }
                    else {
                        response.payload = "order not found";
                        response.status = "error";
                        return [2 /*return*/, response];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.editOrder = editOrder;
