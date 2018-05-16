'use strict';
const success = require('./responses').multiPostSuccess;
const fail = require('./responses').postsFail;

module.exports.getPostsBySearch = (esClient, event, context, callback) => {
    var search, user, tags;

    // pull search key(s) and user from the query string
    if(event.queryStringParameters) {
        search = event.queryStringParameters.search;
        user = event.queryStringParameters.user;
        tags = event.queryStringParameters.tags;
        console.log("Search string: " + search);
        console.log("User string: " + user);
        console.log("Tags: " + tags);
    }

    // // todo: users not implemented yet
    // user = null;

    // if(search || user) {
        // todo: look up user first if 'user' field is defined, early exit if not resolved

        // use + as AND operator when passing strings, of the form:
        // /posts?search=key1+key2+...
        // var keyArr = search.split(/[ +]/);
        // console.log(keyArr);

        // var numKeys = 0;
        // var attVals = {};
        // var filter = "";

        // NOTE: dynamoDB is case sensitive. Possible solutions: redundant all lowercase searchable data
        // Or, incorporate the elasticsearch framework.

        // todo: currently only searches content, should optionally search title as well

        // dynamically build a filter expression along with attribute values from provided search keys
        // for(var i=0; i < keyArr.length; ++i){
        //     if(keyArr[i]){
        //         var attKey = ":word" + i;
        //         attVals[attKey] = keyArr[i];
        //         if(numKeys > 0)
        //             filter += " AND ";
        //         filter += "contains (#content, " + attKey + ")";
        //         numKeys++;
        //     }
        // }

        // console.log("number of search keys:" + numKeys);

        // if(numKeys > 0) {
        //     console.log(JSON.stringify(attVals));
        //     console.log(filter);

        //     var params = {
        //         TableName: 'posts',
        //         FilterExpression: filter,
        //         ExpressionAttributeNames: {
        //             "#content": "content"
        //         },
        //         ExpressionAttributeValues: attVals
        //     };

        //     console.log(params);

        //     var items = [];

        //     // scan loop in case of multiple pages of results
        //     var scanExecute = function (callback) {
        //         ddb.scan(params, function (err, data) {
        //             if (err)
        //                 return fail(500, 'getPostsBySearch failed. Error: ' + err, callback);
        //             else {
        //                 console.log(data);

        //                 items = items.concat(data.Items);

        //                 if (data.LastEvaluatedKey) {
        //                     params.ExclusiveStartKey = result.LastEvaluatedKey;
        //                     scanExecute(callback);
        //                 }
        //                 else
        //                     return success(200, items, callback);
        //             }
        //         })
        //     };
        //     scanExecute(callback);
        // }
        // // if no search keys were found after string parse, abort scan with error
        // else
        //     return fail(500, 'getPostsBySearch failed. Error: Bad search key(s) provided', callback);
    // }
    // // missing parameters
    // else
    //     return fail(500, 'getPostsBySearch failed. Error: No user or search parameters specified', callback);


    var filter = {
        query: {
            bool: {
                
            },
        }
    }
    if(search !== undefined) {
        console.log('search: ' + search);
        filter.query.bool.should = [
            {
                match: {
                    title: search
                }
            }, 
            {
                match : {
                    content: search
                }
            }
        ]
    }
    if(user !== undefined) {
        filter.query.bool.must = [{
            match: {
                userId: user
            }
        }];
    }
    if(tags !== undefined) {
        if(filter.query.bool.should === undefined) {
            filter.query.bool.should = [];
        }
        filter.query.bool.should.add({
            match: {
                tag: tags
            }
        });
    }
    console.log(filter);

    esClient.search({
        index: 'posts',
        body: filter
    }, function(error, data) {
        if(error) {
            console.log('error: ' + JSON.stringify(error));
            fail(400, error, callback);
        } else {
            console.log('data: ' + JSON.stringify(data));
            success(200, data, callback);
        }
    });
};