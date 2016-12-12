var util = require("util");

var AbstractError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this)
  this.message = msg || 'Error'
};

util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'Abstract Error';

var ParamsError = function (msg) {
  ParamsError.super_.call(this, msg, this.constructor)
};
util.inherits(ParamsError, AbstractError);
ParamsError.prototype.name = 'Params Error';

var DatabaseError = function (msg) {
  DatabaseError.super_.call(this, msg, this.constructor)
};
util.inherits(DatabaseError, AbstractError);
DatabaseError.prototype.message = 'Database Error';

var UserNotFoundError = function (msg) {
  UserNotFoundError.super_.call(this, msg, this.constructor)
};
util.inherits(UserNotFoundError, AbstractError);
UserNotFoundError.prototype.message = 'UserNotFound Error';

function ServiceErrors() {}
ServiceErrors.ParamsError = ParamsError;
ServiceErrors.DatabaseError = DatabaseError;
ServiceErrors.UserNotFoundError = UserNotFoundError;

module.exports = ServiceErrors;