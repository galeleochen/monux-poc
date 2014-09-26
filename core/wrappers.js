var _ = require('lodash');
var async = require('async');
var logger = require('logmore')('monux');


/*
 * There are 3 kind of services
 *  - static services : they generate data which will be valid as long as the application runs
 *  - on demand services : they generate data which will be computed each time a user loads the page
 *  - stream services : they generate and push data to all connected users periodically
 */


function Service(name, service) {
  this.name = name;
  this.service = service;
}

Service.prototype.run = function (cb) {
  var _this = this;
  this.service(function (err, data) {
    if (err) {
      _this.handleError(err);
    }
    cb(err ? null : data);
  });
};

Service.prototype.handleError = function (err) {
  logger.warn('Service ' + this.name + ' raised an error', err);
};


var staticServices = [];
exports.staticData = null;

exports.createStaticService = function (name, service) {
  staticServices.push(new Service(name, service));
};

exports.collectStaticServicesData = function (cb) {
  collectData(staticServices, cb);
};


var onDemandServices = [];

exports.createOnDemandService = function (name, service) {
  onDemandServices.push(new Service(name, service));
};

exports.collectOnDemandServicesData = function (cb) {
  collectData(onDemandServices, cb);
};


var streamServices = [];

exports.createStreamService = function (name, service) {
  streamServices.push(new Service(name, service));
};

exports.collectStreamServicesData = function (cb) {
  collectData(streamServices, cb);
};


function collectData(services, cb) {
  var data = {};
  var tasks = [];
  _.forEach(services, function (service) {
    tasks.push(function (done) {
      service.run(function (res) {
        data[service.name] = res;
        done();
      });
    });
  });
  async.parallel(tasks, function () {
    cb(data);
  });
}
