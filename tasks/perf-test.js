var request = require('request');
var benchrest = require('bench-rest');
var grunt = require("grunt");
var Q = require('q');


// INFO ABOUT THE STATS
// stats.main.histogram.min - the minimum time any iteration took (milliseconds)
// stats.main.histogram.max - the maximum time any iteration took (milliseconds)
// stats.main.histogram.mean - the average time any iteration took (milliseconds)
// stats.main.histogram.p95 - the amount of time that 95% of all iterations completed within (milliseconds)

var options = {
  limit: 10,     // concurrent connections
  iterations: 1000  // number of iterations to perform
};
var si = {
  domain : 'http://localhost:9002',
  dir : './reports/server/perf/',
  route : '/api/todos/',
  nfr : 100
};
var production = {
  domain : 'http://localhost:80',
  dir : './reports/server/perf/',
  route : '/api/todos/',
  nfr : 32
};

var test_endpoint = function (flow, options) {
  var wait = Q.defer();

  benchrest(flow, options)
    .on('error', function (err, ctxName) {
      console.error('Failed in %s with err: ', ctxName, err);
    })
    .on('end', function (stats, errorCount) {
      console.log('\n\n###### ' +flow.filename +' - ' +flow.env.domain + flow.env.route);
      console.log('Error Count', errorCount);
      console.log('Stats', stats);
      var mean_score = stats.main.histogram.mean;
      var fs = require('fs-extra');
      var file = flow.env.dir + flow.filename + '-perf-score.csv';
      fs.outputFileSync(file, 'mean,max,mix,p95\n'+  stats.main.histogram.mean +','
        + stats.main.histogram.max +','+ stats.main.histogram.min +','+ stats.main.histogram.p95);
      if (mean_score > flow.env.nfr){
        console.error('NFR EXCEEDED - ' +mean_score +' > '+flow.env.nfr);
        wait.resolve(false);
      } else {
        wait.resolve(true);
      }
    });
  return wait.promise
};


module.exports = function () {
  grunt.task.registerTask('perf-test', 'Runs the performance tests against the target env', function(target) {
    if (target === undefined){
      grunt.log.error('Required param not set - use grunt perf-test\:\<target\>');
      process.exit(9999)
    } else {
      var done = this.async();
      var create, show;
      if (target === 'si') {

        create = {
          filename: 'create',
          env: si,
          main: [{
            post: si.domain + si.route,
            json: {
              title: 'Run perf-test',
              completed: false
            }
          }]
        };

        show = {
          filename: 'show',
          env: si,
          main: [{
            get: si.domain + si.route
          }]
        };
      } else if (target === 'production') {

      } else {
        grunt.log.error('Invalid target - ' + target)
        done();
      }

      grunt.log.ok("Perf tests running against " + target);
      grunt.log.ok("This may take some time .... ");

      var all_tests = [];

      // console.log(create)
      // console.log(show)
      request(show.env.domain + show.env.route, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          all_tests.push(test_endpoint(create, options));

          var mongoid = JSON.parse(body)[0]._id;
          show.main[0].get = si.domain + si.route + mongoid;
          all_tests.push(test_endpoint(show, options));


          Q.all(all_tests).then(function (data) {
            grunt.log.ok(data);
            if (data.indexOf(false) > -1){
              grunt.log.error('FAILURE - NFR NOT ACHIEVED');
              process.exit(9999)
            } else {
              grunt.log.ok('SUCCESS - All NFR ACHIEVED');
              return done();
            }
          });
        }
        else {
          grunt.log.error('FAILURE - COULD NOT GET MONGOID');
          process.exit(9999)        }
      });
    }
  });
};
