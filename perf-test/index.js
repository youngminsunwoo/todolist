var request = require('request');
var benchrest = require('bench-rest');

var options = {
  limit: 20,     // concurrent connections
  iterations: 1000  // number of iterations to perform
};
var domain = 'http://localhost:9000';
var route = '/api/todos/';
var show_nfr = 41;
var create_nfr = 39;


request('http://localhost:9000/api/todos/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(JSON.parse(body)[0]._id);
    var mongoid = JSON.parse(body)[0]._id;

    var flow = domain + route +mongoid;
    benchrest(flow, options)
      .on('error', function (err, ctxName) {
        console.error('Failed in %s with err: ', ctxName, err);
      })
      .on('end', function (stats, errorCount) {
        console.log('\n\n##### SHOW ITEM - '+domain + route);
        console.log('Error count: ', errorCount);
        console.log('Stats', stats);
        var mean_score = stats.main.histogram.mean;
        var fs = require('fs-extra');
        var file = 'show-perf-score.csv';

        fs.outputFile(file, 'mean,max,mix\n'+  stats.main.histogram.mean +','
          + stats.main.histogram.max +','+ stats.main.histogram.min, function (err) {
          if (err) console.log(err);
        });
        if (mean_score > show_nfr){
          // process.exit(9999)
        }
      });

  } else {
    console.error('Failed to get mongoid');
  }
});

var flow = {
  main : [{
    post: domain + route,
    json : {
      title : 'Run perf-test',
      completed: false
    }
  }]
};

benchrest(flow, options)
  .on('error', function (err, ctxName) {
    console.error('Failed in %s with err: ', ctxName, err);
  })
  .on('end', function (stats, errorCount) {
    console.log('\n\n###### CREATE - '+domain + route);
    console.log('Error count: ', errorCount);
    console.log('Stats', stats);
    var mean_score = stats.main.histogram.mean;
    var fs = require('fs-extra');
    var file = 'create-perf-score.csv';

    fs.outputFile(file, 'mean,max,mix\n'+  stats.main.histogram.mean +','
      + stats.main.histogram.max +','+ stats.main.histogram.min, function (err) {
      if (err) console.log(err);
    });
    if (mean_score > create_nfr){
      // process.exit(9999)
    }
});
