const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const companyRouter = require('./routes/company');
const locationRouter = require('./routes/location');
const authRouter = require('./routes/auth');
const jobRouter = require('./routes/job');
const cvRouter = require('./routes/cv');
const applicationRouter = require('./routes/application');
const scheduleRouter = require('./routes/schedule');
const favouriteJobRouter = require('./routes/favouriteJob');
const userRouter = require('./routes/user');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Route init
app.use('/', indexRouter);
app.use('/location', locationRouter);
app.use('/company', companyRouter);
app.use('/api', authRouter);
app.use('/jobs', jobRouter);
app.use('/cv', cvRouter);
app.use('/application', applicationRouter);
app.use('/schedule', scheduleRouter);
app.use('/favourite', favouriteJobRouter);
app.use('/user', userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({ error: err });
});

module.exports = app;
