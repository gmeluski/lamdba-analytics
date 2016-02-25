var google = require("googleapis")
var credentials = require("./lambda-analytics-620a66a21c58.json")
var VIEW_ID = "ga:111710030";

exports.handler = function (e, context) {
  var jwtClient = new google.auth.JWT(credentials.client_email, null,
    credentials.private_key,["https://www.googleapis.com/auth/analytics.readonly"],
    null)


  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log(err)
      return
    }

    var analytics = google.analytics("v3")
    queryData(analytics)

  })

  function queryData(analytics) {
    analytics.data.ga.get({
      "auth": jwtClient,
      "ids": VIEW_ID,
      "metrics": "ga:uniquePageviews",
      "dimensions": "ga:pagePath",
      "start-date": "30daysAgo",
      "end-date": "yesterday",
      "sort": "-ga:uniquePageviews",
      "max-results": 10,
    }, function (err, response) {
      if (err) {
        console.log(err)
        return
      }

      console.log(JSON.stringify(response, null, 4))
      return context.done(null, response)
    })
  }

};
