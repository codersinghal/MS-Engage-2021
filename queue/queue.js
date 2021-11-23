var path = require('path');

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region we will be using
AWS.config.update({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
// Create SQS service client
const sqs = new AWS.SQS();
// Replace with your account id and the queue name you setup
const accountId = process.env.accountId;
const queueName = 'ScheduleBotCallbackQueue';
// Setup the sendMessage parameter object

const QueueUrl=`https://sqs.us-east-1.amazonaws.com/`+accountId+`/ScheduleBotCallbackQueue`
exports.addMessageToQueue = async (messages) =>{
  await Promise.all(messages.map(async (message) => {
    let params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: QueueUrl,
      DelaySeconds: 0
    }
    let data = await sqs.sendMessage(params).promise().catch(err => {
      console.log(err)
    });
    console.log('Message added successfully')
  }));
}
