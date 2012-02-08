var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

WishlistProvider = function(host, port, dbname, username, password) {
  var client = new Db(dbname, new Server(host, port, {auto_reconnect: true}, {}));
  this.db = client;
  client.open(function(err, p_client){
	  client.authenticate(username, password, function(err, p_client) {
		if (err) console.log(err);	  
	  });
  });
};

WishlistProvider.prototype.getCollection= function(callback) {
  this.db.collection('Wishlists', function(error, Wishlist_collection) {
    if( error ) callback(error);
    else callback(null, Wishlist_collection);
  });
};

WishlistProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, Wishlist_collection) {
      if( error ) callback(error)
      else {
        Wishlist_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


WishlistProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, Wishlist_collection) {
      if( error ) callback(error)
      else {
        Wishlist_collection.findOne({_id: Wishlist_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

WishlistProvider.prototype.save = function(Wishlists, callback) {
    this.getCollection(function(error, Wishlist_collection) {
      if( error ) callback(error)
      else {
        if( typeof(Wishlists.length)=="undefined")
          Wishlists = [Wishlists];

        for( var i =0;i< Wishlists.length;i++ ) {
          Wishlist = Wishlists[i];
          Wishlist.created_at = new Date();
        }

        Wishlist_collection.insert(Wishlists, function() {
          callback(null, Wishlists);
        });
      }
    });
};

exports.WishlistProvider = WishlistProvider;
