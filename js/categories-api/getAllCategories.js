'use strict';
const success = require('./responses').multiCategorySuccess;
const fail = require('./responses').CategoriesFail;

module.exports.getAllCategories = (ddb, event, context, callback) => {

    // If there are query parameters, something was probably misused
    if(event.queryStringParameters) {
        console.log(event);
        return fail(500, 'getAllCategories: Extra parameters', callback)
    }

    var params = {
        TableName: 'categories'
    };

    var items = [];

    // scan loop in case of multiple pages of results
    var scanExecute = function (callback) {
        ddb.scan(params, function (err, data) {
            if (err)
                return fail(500, 'getAllCategories failed. Error: ' + err, callback);
            else {
                console.log(data);

                items = items.concat(data.Items);

                if (data.LastEvaluatedKey) {
                    params.ExclusiveStartKey = result.LastEvaluatedKey;
                    scanExecute(callback);
                }
                else
                    return success(200, items, callback);
            }
        })
    };
    scanExecute(callback);
};