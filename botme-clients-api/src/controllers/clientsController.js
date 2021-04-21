var Client = require('../models/clients');
var Session = require('../models/sessions');
var queue = require('../utils/queue');
var async = require('async');
const { v4: uuidv4 } = require('uuid');
var crypto = require('crypto');

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


// Display list of all Clients.
exports.client_list = function (req, res) {
    Client.find({}, function (err, clients) {
        if (err) {
            failure.payload = err;
            res.status(403).send(failure);
        }

        success.payload = clients;
        res.status(200).send(success);
    });
};

// Display detail page for a specific Client.
exports.client_detail = function (req, res, next) {
    if (!req.body.clientID) {
        failure.payload = { message: 'clientID not found' };
        return res.status(404).send(failure);
    }

    async.parallel({
        client: function (callback) {
            Client.findOne({ clientID: req.body.clientID })
                .exec(callback)
        },
    }, function (err, results) {
        if (err) {
            failure.payload = { err };
            return res.status(403).send(failure);
        }

        if (results.client == null) {
            failure.payload = { message: 'Client not found' };
            return res.status(404).send(failure);
        }

        success.payload = { clients: results.client }
        res.status(200).send(success);
    });

};

// Display Client create form on POST.
exports.client_register = function (req, res, next) {
    if (!req.body.clientDeviceId) {
        failure.payload = { message: 'clientDeviceId not found' };
        return res.status(404).send(failure);
    }

    Client.exists({ clientDeviceId: req.body.clientDeviceId }, function (err, extStatus) {
        if (err) {
            failure.payload = { err };
            return res.status(403).send(failure);
        }

        if (extStatus) {
            failure.payload = { message: 'Client already exists' };
            return res.status(403).send(failure);
        } else {
            var clientID = uuidv4();
            var hash = crypto.createHash('sha256');
            var clientSecret = hash.update(req.body.clientDeviceId).digest('hex');

            var client = new Client(
                {
                    clientDeviceId: req.body.clientDeviceId,
                    clientID: clientID,
                    clientSecret: clientSecret,
                    clientCreated: Date(),
                    clientUpdated: null,
                    clientActive: req.body.clientActive,
                    clientComment: req.body.clientComment
                });

            client.save(function (err) {
                if (err) {
                    failure.payload = { err };
                    return res.status(403).send(failure);
                }

                success.payload = { client }
                res.status(200).send(success);
            });
        }
    });
};

// Authenticate client and provide token at successfull auth
exports.client_auth = function (req, res) {
    if (!req.body.clientID || !req.body.clientSecret) {
        failure.payload = { message: 'clientID or clientSecret not found' };
        return res.status(404).send(failure);
    }

    var clientID = req.body.clientID
    var clientSecret = req.body.clientSecret

    Client.findOne({ clientID: clientID, clientSecret: clientSecret, clientActive: true }, function (err, clients) {
        if (err) {
            failure.payload = { err };
            return res.status(403).send(failure);
        }

        if (clients == null) {
            failure.payload = { message: 'Client ID or secret incorrect' };
            return res.status(403).send(failure);
        } else {
            var hash = crypto.createHash('sha256');
            var clientToken = hash.update(Date()).digest('base64');
            const updateQuery = {};
            updateQuery.clientID = clientID
            updateQuery.clientToken = clientToken
            updateQuery.sessionCreated = Date()
            updateQuery.sessionUpdated = null
            updateQuery.sessionActive = true

            Session.findOneAndUpdate({ clientID: req.body.clientID }, updateQuery, { upsert: true, new: true }, function (err, client) {
                if (err) {
                    failure.payload = { err };
                    return res.status(403).send(failure);
                }

                success.payload = { authToken: clientToken }
                return res.status(200).send(success);
            });
        }
    })
}

exports.client_update = function (req, res) {
    if (!req.body.clientID) {
        failure.payload = { message: 'clientID not found' };
        return res.status(404).send(failure);
    }

    async.parallel({
        client: function (callback) {
            const updateQuery = {}

            updateQuery.clientDeviceId = req.body.clientDeviceId
            updateQuery.clientSecret = req.body.clientSecret
            updateQuery.clientUpdated = Date()
            updateQuery.clientActive = req.body.clientActive
            updateQuery.clientComment = req.body.clientComment

            Client.findOneAndUpdate({ clientID: req.body.clientID }, updateQuery, { new: true })
                .exec(callback)
        }
    }, function (err, results) {
        if (err) {
            failure.payload = { err };
            return res.status(403).send(failure);
        }

        if (results.client == null) {
            failure.payload = { message: 'Client not found' };
            return res.status(404).send(failure);
        }

        success.payload = { clients: results.client }
        res.status(200).send(success);
    });
}

exports.client_heartbeat = function (req, res) {
    if (!req.body.clientID) {
        failure.payload = { message: 'clientID not found' };
        return res.status(404).send(failure);
    }

    Client.findOne({ clientID: req.body.clientID }, function (err, clients) {
        if (err) {
            failure.payload = { err };
            return res.status(403).send(failure);
        }

        if (clients == null) {
            failure.payload = { message: 'Client not found' };
            return res.status(404).send(failure);
        } else {
            const updateQuery = {};
            updateQuery.sessionUpdated = Date();
            updateQuery.sessionActive = true;

            Session.findOneAndUpdate({ clientID: req.body.clientID }, updateQuery, { new: true }, function (err, client) {
                if (err) {
                    failure.payload = { err };
                    return res.status(403).send(failure);
                }

                success.payload = { message: 'Session alive' }
                return res.status(200).send(success);
            });
        }
    })
}

exports.client_command = async function (req, res) {
    if (!req.body.clientID) {
        failure.payload = { message: 'clientID not found' };
        return res.status(404).send(failure);
    }

    var queueResponse = await queue.queueMessage(req.body.clientID, req.body.command);

    if (queueResponse.status == 200) {
        success.payload = 'Message queued successfully: ' + queueResponse.message;
        res.status(200).send(success);
    } else {
        failure.payload = queueResponse.message;
        res.status(403).send(failure);
    }
}
