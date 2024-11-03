"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dbconnection_1 = require("./dbconnection");
var app = (0, express_1.default)();
// Allow any method from any host and log requests
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, DELETE");
    if ("OPTIONS" === req.method) {
        res.sendStatus(200);
    }
    else {
        console.log("".concat(req.ip, " ").concat(req.method, " ").concat(req.url));
        next();
    }
});
// Handle POST requests that come in formatted as JSON
app.use(express_1.default.json());
// A default hello word route
app.get("/", function (req, res) {
    res.send({ hello: "world" });
});
// start our server on port 4201
app.listen(4201, "127.0.0.1", function () {
    console.log("Server now listening lon 4201");
});
dbconnection_1.client
    .connect()
    .then(function () { return console.log("Connected to PostgreSQL"); })
    .catch(function (err) { return console.error("Connection error", err.stack); });
