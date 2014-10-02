var _ = require('lodash');

_.mixin({toFixed: toFixed});

function toFixed(value, num) {
  return parseFloat(value.toFixed(num));
}
