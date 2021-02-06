const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {

  const startTime = timeInMs()
  const response = await axios.get(url);

  // TODO: Use these variables to record metric values
  // TODO: Record time it took to get a response
  // TODO: Record if a response was successful or not
  let endTime = timeInMs();
  let requestWasSuccessful = response.status === 200;
  
  // Example of how to write a single data point
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Latency', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Milliseconds',
        Value: endTime - startTime // Total value
      },
      {
        MetricName: 'Successful', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Count',
        Value: requestWasSuccessful
      }
    ],
    Namespace: 'Udacity/Serveless'
  }).promise()
}

function timeInMs() {
  return new Date().getTime()
}
