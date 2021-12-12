'use strict';
const orderManager = require('./orderManager');

module.exports.welcome = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Wecome to Serveless',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.createOrder = async (event) => {

  const body = JSON.parse(event.body);
  const order = orderManager.createOrder();

  return orderManager.placeOrder(order).then(() => {
    return createResponse(200, order);
  }).catch(err => {
    return createResponse(400, err);
  });
};

function createResponse(statusCode, message) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };

  return response;
}
