/**
 * Created by seonaid on 15-03-02.
 */

var fs        = require("fs");
var path      = require("path");
//var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var Sequelize = require('sequelize')
    , sequelize = new Sequelize('usethis', 'seonaid', 'arbitrary',{
        host: 'localhost',
        dialect: "postgres",
        port: 5432,
    });

// var sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');
// This is another option: do it with uri. I will try this later, since I know the earlier stuff works.

var db        = {};

sequelize
    .authenticate()
    .complete(function(err){
        if(!!err){
            console.log('Unable to connect to database', err)
        }
        else {
            console.log('Connection established')
        }
    })

// use fs to loop through all the model definition files
fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });


// The Object.keys() method returns an array of a given object's own enumerable properties,
// in the same order as that provided by a for...in loop (the difference being that a for-in
// loop enumerates properties in the prototype chain as well). so this runs Object.keys on the db object
// and creates all the associations among the tables

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db); // associate was added as a classMethod on each model that has associations
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;



module.exports = db;