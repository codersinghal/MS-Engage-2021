var path = require('path');
// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
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

const QueueUrl=`https://sqs.us-east-1.amazonaws.com/`+accountId+`/ScheduleBotCallbackQueue`

// add messages to aws-sqs
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
