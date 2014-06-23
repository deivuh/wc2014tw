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

  // console.log("team size %s", teams.length)

  // Search stream for each team's hashflag
  // for (var i in teams) {

  var teams_hts = [];

  for (var i in teams) {
    team_ht = "#" + teams[i].code;
    teams_hts.push(team_ht);
  }

  console.log("team hts %s", teams_hts);

  // Database collection
  var collection = db.get('tweetcollection');

  twitter.stream('filter', {track:teams_hts.toString()}, function(stream) {
      stream.on('data', function(data) {
          // console.log(util.inspect(data));
          // console.log('%s ----- %s', team_ht, data.user.location);

          // console.log("Tweet data %j", data);

          // --------Compare twitter user location to country
          var country_code;

          for (var i in country_list) {
            // By 'official' name
            if(data.user.location.indexOf(country_list[i].name) > -1) {
              // console.log(country_list[i].cca3+  " by name");
              country_code = country_list[i].cca3;
            } else if(country_list[i].nativeName.length > 3) {
              // By native name
              if(data.user.location.indexOf(country_list[i].nativeName) > -1) {
                // console.log(country_list[i].cca3 + " by native");
                country_code = country_list[i].cca3;
              } else if(country_list[i].capital.length > 3) {
                // By capital
                if(data.user.location.indexOf(country_list[i].capital) > -1) {
                  // console.log(country_list[i].cca3 + " by capital");
                  country_code = country_list[i].cca3;
                } else {
                  // By alternate spelling
                  for (var j in country_list[i].altSpellings) {
                    if(country_list[i].altSpellings[j].length > 3) {

                      if(data.user.location.indexOf(country_list[i].altSpellings[j]) > -1) {
                        // console.log(country_list[i].cca + " by alt spelling " + country_list[i].altSpellings[j]);
                        country_code = country_list[i].cca3;
                      }
                    }
                  }
                  // If none
                  country_code = "";
                }
              }
            }
          }

          // ----------Finish location comparison

          for (var i in teams_hts) {
            // console.log("%s HT: %s %d", data.text, teams_hts[i], data.text.indexOf(teams_hts[i]) > -1)
            if(data.text.indexOf(teams_hts[i]) > -1) {

              collection.insert({
                "content" : data.text,
                "user" : data.user.screen_name,
                "location" : data.user.location,
                "country" : country_code,
                "team" : teams_hts[i].substring(1)
              }, function (err, doc) {
                if (err){
                  console.log("Problem adding tweet");
                }
                else {
                  // console.log("Added %s", teams_hts[i]);
                  // console.log(doc);
                }
              });

            }
          }


// UC
          // console.log(data.text);
          //

      });
      // Disconnect stream after five seconds
      // setTimeout(stream.destroy, 5000);
  });




  // }

});





var get_matche


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
