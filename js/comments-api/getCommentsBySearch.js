'use strict';

module.exports.getCommentsBySearch = (ddb, event, context, callback) => {
    var response = {
        statusCode: 500,
        body: JSON.stringify({
            statusCode: 500,
            message: 'endpoint not implemented yet'
        })
    }
    return callback(null, response);
}