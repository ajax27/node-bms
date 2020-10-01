'use strict';

const debug = require('debug');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const paginate = require('express-paginate');
const session = require('express-session');
const routerRegister = require('./routers/router.register');

const app = express();

// view engine setup
nunjucks.configure(
  ['views', 'views/cataloguedm', 'views/cataloguedm/partials'],
  {
    autoescape: true,
    express: app,
  }
);

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//app.use(favicon(__dirname + '/public/favicon.ico));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Pagination Middleware
app.use(paginate.middleware(9, 20));

// sessions
app.use(
  session({
    secret: '27051ef2-a877-4f66-b82c-9h34h3b8kd92',
    proxy: true,
    resave: true,
    saveUninitialized: true,
  })
);

//Make the cart parameters available to the templates
//app.use(contextProcessor.localContext);

// Register the Routers
routerRegister(app);

// catch 404s and send to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// dev error handler
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.set('port', process.env.PORT || 3300);

const server = app.listen(app.get('port'), () => {
  debug(`Node App listening at ${server.address().PORT}`);
});
