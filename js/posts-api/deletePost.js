'use strict';
<<<<<<< Updated upstream
const success = require('./responses.js').deletePostSuccess;
const fail = require('./responses.js').postsFail;
=======
const deletePostSuccess = require('./responses').deletePostSuccess;
const deletePostFail = require('./responses.js').postsFail;
>>>>>>> Stashed changes

module.exports.deletePost = (ddb, event, context, callback) => {
    if (event.pathParameters !== null && event.pathParameters !== undefined) {
        if (event.pathParameters.postId !== undefined && 
            event.pathParameters.postId !== null && 
            event.pathParameters.postId !== "") {
            console.log("Received proxy: " + event.pathParameters.postId);
            var id = event.pathParameters.postId;
            var params = {
                TableName: "posts",
                Key: {
                    "postId" : id
                }
            };

            console.log("Attempting a conditional delete...");
    
<<<<<<< Updated upstream
    ddb.delete(params, function(err, data) {
        if(err)
            return fail(500, 'Delete Post failed. Error: ' + err, callback);
        else
            return success(callback);
    });
=======
            ddb.delete(params, function(err, data) {
                if(err)
                    return deletePostFail(500, 'Delete Post failed. Error: ' + err, callback);
                else
                    return deletePostSuccess(callback);
            });
        }
        else
            return deletePostFail(400, 'Delete Post failed.', callback);
    }
    else
        return deletePostFail(400, 'Delete Post failed.', callback);
>>>>>>> Stashed changes
}
