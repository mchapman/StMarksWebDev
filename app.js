
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

app.get('/', function(req, res){
    WishlistProvider.findAll( function(error,docs){
        res.render('index.jade', { locals: {
            title: 'All Wishes',
            Wishlist: docs
            }
        });
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


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

