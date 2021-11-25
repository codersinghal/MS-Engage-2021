const axios=require('axios')

exports.handler = async (event) => {
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    // parse and process queue message
    const jsonObj=JSON.parse(event.Records[0].body)
    console.log(jsonObj)
    let title=jsonObj.title;
    let desc=jsonObj.desc;
    let startTime=new Date(jsonObj.start);
    startTime=Math.round(startTime.getTime()/1000)
    let specialMention=jsonObj.specialMention;
    if(!title)
    title='NA'
    if(!desc)
    desc='NA'
    if(!startTime)
    startTime='NA'
    if(!specialMention)
    {
    specialMention='NA';
    }
    // make request to Slack API to post message
    const url = 'https://slack.com/api/chat.postMessage';
    const res = await axios.post(url, {
        channel: jsonObj.slackChannel,
         blocks: [
    {
      type: 'section',
      text: { type: 'mrkdwn', text: '*Event* '+'*'+jsonObj.status+'* !' },
      fields: [
        { type: 'mrkdwn', text: '*Title*\n*Description*\n*Starts At*\n*Special Mention*' },
        { type: 'mrkdwn', text: title+'\n'+desc+'\n'+"<!date^"+startTime+"^{date} at {time}|NA>"+'\n'+specialMention },
      ]
    }]
    }, { headers: { authorization: `Bearer ${jsonObj.slackToken}` } });

  console.log('Done', res.data);
  return response;
};
