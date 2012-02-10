
/**
 * Module dependencies
 */

var express = require('express');
var WishlistProvider = require('./wishlist-mongodb').WishlistProvider;

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//var WishlistProvider= new WishlistProvider('localhost',27017);
var WishlistProvider= new WishlistProvider('staff.mongohq.com', 10022, 'stmarks', 'stmarks', 'stmarks');

app.get('/', function(req, res) {
    res.render('readme.jade', { locals: {
        title: 'Introduction'
    }
    });
});

app.get('/user/all/:debug?', function(req, res){
    var debug = (req.params.debug === 'debug')
    WishlistProvider.find({}, debug, function(error,docs){
        res.render('index.jade', { locals: {
            title: 'All Wishes',
            Wishlist: docs
            }
        });
    })
});

app.get('/user/:name.:format?/:debug?', function(req, res){
    var userName = req.params.name
    var debug = (req.params.debug === 'debug')
    WishlistProvider.find( {wisher: userName}, debug ,function(error,docs){
        if (req.params.format === 'json') {
            res.send(docs);
        } else {
            res.render('index.jade', { locals: {
                title: 'Wishes for '+userName,
                Wishlist: docs
            }
            });
        }
    })

});

app.get('/wish/new', function(req, res) {
    res.render('wish_new.jade', { locals: {
        title: 'New Wish'
        }
    });
});

app.post('/wish/new', function(req, res){
    WishlistProvider.save({
        wisher: req.param('wisher'),
        description: req.param('description'),
        url: req.param('url'),
        imgUrl: req.param('imgUrl'),
        price: req.param('price')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.get('/wish/:id/remove', function(req,res) {
    WishlistProvider.remove(req.params.id, req.param('reason'), function( error, docs) {
        res.send(req.params.id + ' succesfully removed')
    });
});

var port;
if (app.settings.env === 'development') {
    port = 3000;
} else {
    port = process.env.PORT;
}

app.listen(port);
console.log("Express server listening on port %d in %s mode", port, app.settings.env);


