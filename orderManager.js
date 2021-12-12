'use strict';
const AWS = require('aws-sdk');
const {v4: uuidv4} = require('uuid');

const dynamo = new AWS.DynamoDB.DocumentClient();
const kinesis = new AWS.Kinesis();
const TABLE_NAME = process.env.orderTableName;
const STREAM_NAME = process.env.orderStreamName;

module.exports.createOrder = body => {
    const order = {
        orderId: uuidv4(),
        name: body.name,
        address: body.address,
        productId: body.productId,
        quantity: body.quantity,
        orderDate: Date.now(),
        eventType: 'order_placed'
    }

    return order;
}

module.exports.placeOrder = (order) => {
    // save order to dynamody
    return saveNewOrder(order).then(() => {
        return placeOrderToStream(order);
    })
    // put order to stream
}

function saveNewOrder(order) {
    const params = {
        TableName: TABLE_NAME,
        Item: order
    }

    return dynamo.put(params).promise();
}

function placeOrderToStream(order) {
    const params = {
        Data: JSON.stringify(order),
        PartitionKey: order.orderId,
        StreamName: STREAM_NAME
    }

    return kinesis.putRecord(params).promise();
}