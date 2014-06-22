var request = require('request');
// var http = require('http');

var url = "http://worldcup.sfg.io/matches/today"

var matches;
var EventEmitter = require('events').EventEmitter;
var matches_emitter = new EventEmitter();

module.exports = function(callback) {

  if (matches == undefined) {
    matches_emitter.on("matches-ready", function() {
      // console.log("emitter callback");
      callback(matches)

    });
  } else{
    // console.log("else callback");
    callback(matches);

  }
}

request({
      url: url,
      json: true
    }, function (error, response, body) {



    if (!error && response.statusCode === 200) {
          // console.log(body) // Print the json response

        matches = body;
        matches_emitter.emit("matches-ready");
        // console.log("matches ready");

    }

});





// http.get(url, function(res) {
//
//
//
//   matches = res;
//
// });



// request({
//     url: url,
//     json: true
// }, function (error, response, body) {
//
//     if (!error && response.statusCode === 200) {
//         // console.log(body) // Print the json response
//         matches = body;
//
//     }
// });
//
//
// var foo, callback;
// async.function(function(response) {
//     foo = "bar"
//     if (exists){
//         foo = "foobar";
//     }
//
//     if( typeof callback == 'function' ){
//         callback(foo);
//     }
// });
//
// module.exports = function(cb){
//     if(typeof foo != 'undefined'){
//         cb(foo); // If foo is already define, I don't wait.
//     } else {
//         callback = cb;
//     }
// }
//
//
// module.exports = matches;
