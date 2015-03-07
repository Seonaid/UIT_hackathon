/**
 * Created by seonaid on 15-03-06.
 */

"use strict"

// check whether the Postgres Timestamp without time zone is an issue.
// probably need to do *something* about time zones, but I don't know what yet.

module.exports = function(sequelize, DataTypes){
    var Story = sequelize.define("Story", {
        title: {type: DataTypes.STRING, allowNull: false},
        body: {type: DataTypes.BLOB, allowNull:false},
        category: DataTypes.STRING,
        emotion: DataTypes.STRING,
        connects: DataTypes.INTEGER
    });

    return Story;
};