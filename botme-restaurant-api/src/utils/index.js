"use strict";
exports.__esModule = true;
exports.applyRoutes = exports.applyMiddleware = void 0;
var applyMiddleware = function (middlewareWrappers, router) {
    for (var _i = 0, middlewareWrappers_1 = middlewareWrappers; _i < middlewareWrappers_1.length; _i++) {
        var wrapper = middlewareWrappers_1[_i];
        wrapper(router);
    }
};
exports.applyMiddleware = applyMiddleware;
var applyRoutes = function (routes, router) {
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var route = routes_1[_i];
        var method = route.method, path = route.path, handler = route.handler;
        router[method](path, handler);
    }
};
exports.applyRoutes = applyRoutes;
