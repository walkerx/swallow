'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var uuid = require('uuid');

function TimerManager(){
  this.idle = true;
  this.listeners = [];
  this.timers = {};
}

/**
  Create a new timer (setTimeout).

  Expired timers are automatically cleared

  @param {String} name - Name of a timer key. Used only for debugging.
  @param {Number} delay - delay of timeout
  @param {Function} fn - Function to execute after delay
  @returns {Number} id - The timer id. Used to clear the timer
*/
TimerManager.prototype.set = function(name, delay, fn){
  var id = uuid.v4();
  var now = Date.now();
  var timer = setTimeout(function (timerInstance, timeoutId) {
    timerInstance.clear(timeoutId);
    fn();
  }, delay, this, id);

  this.timers[id] = {
    name: name,
    created: now,
    timer: timer
  };

  this.idle = false;
  return id;
};

/**
  Clear a timer (clearTimeout).

  Queued listeners are executed if there are no
  remaining timers
*/
TimerManager.prototype.clear = function(id){
  var timers = this.timers;
  var timer = timers[id];
  if(!timer) {
    return;
  }
  clearTimeout(timer.timer);
  delete timers[id];
  if(!this.idle && (_.size(timers) === 0)){
    while(this.listeners.length){
      this.listeners.pop()();
    }
    this.idle = true;
  }
};

TimerManager.prototype.clearAll = function(){
  var _this = this;
  _.each(this.timers, function(timer, id){
    _this.clear(id);
  });
};

/**
 * Returns a promise that resolves when there are no active timers.
*/
TimerManager.prototype.whenIdle = function() {
  var _this = this;
  return new Promise(function(resolve){
    if(_this.idle) {
      resolve();
    } else{
      _this.listeners.unshift(resolve);
    }
  });
};

module.exports = TimerManager;
