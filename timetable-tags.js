/**
 * Autor Eugene Demchenko <demchenkoev@gmail.com>
 * Created on 12.12.17.
 * License BSD
 */

;(function(global) {

  function Time(params) {
    var me = this;
    var _hh, _mm, _ss;
    if (typeof params === 'string') {
      var splittedTime = params.split(':');
      _hh = parseInt(splittedTime[0], 10);
      _mm = parseInt(splittedTime[1], 10);
      _ss = parseInt(splittedTime[2], 10);
    }
    else {
      _hh = params.getHours();
      _mm = params.getMinutes();
      _ss = params.getSeconds();
    }

    me.hh = function () {
      return _hh;
    };
    me.mm = function () {
      return _mm;
    };
    me.ss = function () {
      return _ss;
    };

    me.totalSeconds = function () {
      return _hh * 3600 + _mm * 60 + _ss;
    };

    //is me == t
    me.eq = function (t) {
      return me.totalSeconds() == t.totalSeconds();
    };

    //is me > t
    me.g = function (t) {
      return me.totalSeconds() > t.totalSeconds();
    };

    //is me < t
    me.l = function (t) {
      return me.totalSeconds() < t.totalSeconds();
    };

    me.le = function (t) {
      return me.totalSeconds() <= t.totalSeconds();
    };

    me.ge = function (t) {
      return me.totalSeconds() >= t.totalSeconds();
    };

    me.inPeriod = function (from, to) {
      if (to.l(from)) {
        var beforeMidnight = me.inPeriod(from, new Time('24:00:00'));
        var afterMidnight = me.inPeriod(new Time('00:00:00'), to);
        return beforeMidnight || afterMidnight;
      }
      return me.g(from) && me.le(to);
    }
  }

  /*
    var tagsSettings = [
      //{ tag: "tag name",period: { from: 'MM-DD', to: 'MM-DD' }, daily: { from: 'hh:mm:ss', to: 'hh:mm:ss' }, order: <number> },
      { tag: 'morning',  period: { from: '01-01', to: '12-31' }, daily: { from: '05:00:00', to: '12:00:00' }, order: 2 },
      { tag: 'afternoon',period: { from: '01-01', to: '12-31' }, daily: { from: '12:00:00', to: '17:00:00' }, order: 2 },
      { tag: 'evening',  period: { from: '01-01', to: '12-31' }, daily: { from: '17:00:00', to: '21:00:00' }, order: 2 },
      { tag: 'night',    period: { from: '01-01', to: '12-31' }, daily: { from: '21:00:00', to: '23:59:59' }, order: 2 },
      { tag: 'night',    period: { from: '01-01', to: '12-31' }, daily: { from: '00:00:00', to: '04:59:59' }, order: 2 },
      { tag: 'christmas_night', period: { from: '12-25', to: '12-25' }, daily: { from: '21:00:00', to: '23:59:59' }, order: 1 },
      { tag: 'christmas_night', period: { from: '12-26', to: '12-26' }, daily: { from: '00:00:00', to: '04:59:59' }, order: 1 },
    ];
    var defaultRow = { tag: 'generic' };

    var tt = new TimetableTags(tagsSettings, defaultRow);
    console.log( tt.getActive() ); //return 'morning' or 'afternoon' or etc..
    console.log( tt.getForDate( new Date('2017-12-26T03:00:00')).tag ); //return 'christmas_night'
  */

  function TimetableTags(tagsSettings, defaultValue) {
    this.tagsSettings = tagsSettings;
    this.defaultValue = defaultValue;
  }

  TimetableTags.prototype._parsePeriod = function (period) {
    function t(year, from) {
      var splittedFrom = from.split('-');
      var result = new Date(year, parseInt(splittedFrom[0], 10) - 1, splittedFrom[1]);
      return result;
    }

    var year = (new Date()).getFullYear();
    var from = t(year, period.from);
    var to = t(year, period.to);
    to.setTime(to.getTime() + 86399000); //+24 hours

    if (to < from) {
      to.setFullYear(year + 1);
    }

    return {from: from, to: to};
  };


  TimetableTags.prototype.getAllForDate = function (date) {
    var arr = [];
    for (var i=0; i < this.tagsSettings.length; i++) {
      var ttRow = this.tagsSettings[i];
      var period = this._parsePeriod(ttRow.period);
      if (date > period.from && date < period.to) {
        var timeNow = new Time(date);
        var timeFrom = new Time(ttRow.daily.from);
        var timeTo = new Time(ttRow.daily.to);
        if (timeNow.inPeriod(timeFrom, timeTo)) {
          arr.push(ttRow);
        }
      }
    }
    return arr.sort(function(a, b) { return a.order - b.order; });
  };

  TimetableTags.prototype.getForDate = function (date, defaultValue) {
    if(arguments.length < 2) {
      defaultValue = this.defaultValue;
    }
    var results = this.getAllForDate(date);
    return results.length ? results[0] : defaultValue || null;
  };

  TimetableTags.prototype.getActive = function (defaultValue) {
    if(arguments.length === 0) {
      defaultValue = this.defaultValue;
    }
    return this.getForDate(new Date, defaultValue)
  };

  // EXPORT

  // Node and other CommonJS-like environments that support module.exports.
  if ( typeof module !== 'undefined' && module.exports ) {
    module.exports = TimetableTags

    //AMD.
  } else if ( typeof define == 'function' && define.amd ) {
    define( function () {
      return TimetableTags
    })

    //Browser.
  } else {
    global['TimetableTags'] = TimetableTags
  }

})(this);