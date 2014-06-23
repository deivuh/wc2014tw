var get_matches = require('./matches');
var twitter = require('./twitter');

var db = require('./database');
var country_list = require('./country_list.json');

// console.log(country_list[0]);

var today_matches;
var teams = [];

// Get today matches
get_matches(function (matches) {
  today_matches = matches;

  console.log(today_matches);


  // Get teams from matches
  for (var i in today_matches) {
    var home_team = today_matches[i].home_team;
    var away_team = today_matches[i].away_team;


    teams.push(home_team);
    teams.push(away_team);
  }

  console.log("team size %s", teams.length)

  // Search stream for each team's hashflag
  // for (var i in teams) {

  var teams_hts = [];

  for (var i in teams) {
    team_ht = "#" + teams[i].code;
    teams_hts.push(team_ht);
  }

    console.log("team hts %s", teams_hts);



    twitter.stream('filter', {track:teams_hts.toString()}, function(stream) {
        stream.on('data', function(data) {
            // console.log(util.inspect(data));
            // console.log('%s ----- %s', team_ht, data.user.location);
            console.log(data.text);
        });
        // Disconnect stream after five seconds
        // setTimeout(stream.destroy, 5000);
    });




  // }

});



// for (team in teams) {
//   twitter.stream('filter', {track:"#{0}"}, function(stream) {
//       stream.on('data', function(data) {
//           // console.log(util.inspect(data));
//           console.log('#GER ----- ' + data.user.location);
//       });
//       // Disconnect stream after five seconds
//       // setTimeout(stream.destroy, 5000);
//   });
//
// }

//
// twitter.stream('filter', {track:'#ARG'}, function(stream) {
//     stream.on('data', function(data) {
//         // console.log(util.inspect(data));
//         console.log('#ARG ----- ' + data.user.location);
//     });
//     // Disconnect stream after five seconds
//     // setTimeout(stream.destroy, 5000);
// });
