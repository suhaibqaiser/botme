const Entity = require("../models/entity")

var success = {
    timestamp: Date(),
    error: false,
    payload: null
};

var failure = {
    timestamp: Date(),
    error: true,
    payload: null
};

exports.entity_list = function (req, res) {
    Entity.find({}, function (err, entities) {
        if (err) {
            failure.payload = err;
            res.status(403).send(failure);
        }

        success.payload = entities;
        res.status(200).send(success);
    });
};

// Display Client create form on POST.
exports.entity_create = function (req, res, next) {
    var entity = new Entity(req.body);

    entity.save(function (err) {
        if (err) {
            failure.payload = { err };
            return res.status(403).send(failure);
        }

        success.payload = { entity }
        res.status(200).send(success);
    });
}
