var request = require("request");

var url = "http://worldcup.sfg.io/matches/today"

var matches, callback;

module.exports = function(url, json, callback) {

  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
          // console.log(body) // Print the json response
          matches = body;
          callback();
      }
  })
}


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
// })
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
