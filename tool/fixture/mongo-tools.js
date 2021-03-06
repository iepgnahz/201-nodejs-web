var glob = require('glob');
var async = require('async');
var fs = require('fs');
var path = require('path');
var _cachedTestData;

var fixtureModelMap = {
  'item':require('../../model/item'),
  'cart':require('../../model/cart'),
  'category':require('../../model/category'),
  'user':require('../../model/user')
};

function cacheData(done) {
  glob(__dirname + "/*.json", {}, (err, files) => {
    async.map(files, readFileData, function(err, datas) {
      _cachedTestData = datas;
      done(null, null);
    });
  })
}

function readFileData(file, callBack) {
  fs.readFile(file, 'utf8', function(err, content) {
    callBack(err, {
      name: path.basename(file, '.json'),
      content: JSON.parse(content)
    })
  });
}

function refreshMongo(mongoData, callBack) {
  var funList = [(done)=>{
    done(null,null);
  }];

  mongoData.forEach((item, key) => {
    funList.push(function(data, done) {
      var model = fixtureModelMap[this.name];
      model.remove(done);
    }.bind(item));

      funList.push(function(data, done) {
        var records = this.content;
        var model = fixtureModelMap[this.name];
        model.create(records, done);
      }.bind(item));
  });
  async.waterfall(funList, callBack);
}

function refresh(callBack) {
  if(!_cachedTestData) {
    cacheData(() => {
      refreshMongo(_cachedTestData, callBack);
    })
  } else {
    refreshMongo(_cachedTestData, callBack);
  }
}

module.exports = {
  refresh: refresh
};
