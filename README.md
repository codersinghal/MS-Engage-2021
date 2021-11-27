# MS-Engage-2021

# SchedPut
This project is developed as a solution to MS Engage 2021 Challenge.This web app is a simple and efficient tool to organize and manage your individual as well as team schedules.
It serves the purpose of scheduling,reminding and rotating responsibilties among members of a team.This web app is built to provide limited but robust features.
## Features
* User Signup and Login.
* User can create a team and be its admin.
* Users can join a team using team joining code.
* Admin of a team can create,update and delete schedules for that team.
* Non-admin members of a team can only view the schedules for that team.
* Admin can specially mention a team member for a particuler schedule.
* Members of a team get instantly notified (on Slack) on creation or updation of any schedule.
* Members of a team get reminded of the schedule(on Slack) 1 day before its start.
* Simple and descriptive UI.
* Agenda view to view all events of a team at one place
## Tech Stack
<p align ="center">
  <code><img src="https://img.icons8.com/windows/64/26e07f/node-js.png" width="5%"/></code>
  <code><img src="https://img.icons8.com/color/48/000000/react-native.png" width="5%" /></code>
  <code><img src="https://img.icons8.com/color/50/000000/mongodb.png"/></code>
  <code><img src="https://img.icons8.com/color/48/000000/amazon-web-services.png"/></code>
  <code><img src="https://img.icons8.com/color/64/000000/git.png" width="5%"/></code>
  <code><img src="https://img.icons8.com/color/48/000000/slack-new.png"/></code>
</p>

* NodeJS
* ReactJS
* MongoDB
* AWS
* Slack API

## Architecture
<br>
<br>


![image](https://drive.google.com/uc?export=view&id=1vIn8cVNL_BkJueFSn5TdGSbXS9zaPfE7)

This app is developed with keeping scalability and design principles in mind.Three-Tier archtecture is used, NodeJs for server side,ReactJS for client side and MongoDB as database.
<br>

* Restful architecture is used at server side with JWT authentication.
* Client makes API requests to server and server then contacts with DB and AWS Queue.
* Whenever a schedule is created/updated/deleted, a message is pushed into AWS Queue, which then triggers a custom AWS lambda function.
* The job of this AWS function is to post the current Queue message to Slack API.
* Messages are also pushed to the Queue everyday at 11:59 PM notifying for the schedules starting within 24 hrs.This is done by running a cron job scheduled to run at 11:59 PM everyday.

## Slack Integration
For getting notified of your schedules on Slack, you have to go through following steps:
* When creating a new team, you will be asked to enter **Slack Channel Name** and **Slack Token** for that team.
* You need to have a workspace in your Slack, if not create a new workspace.
* In this workspace create a new channel(this channel name is asked while creating team).
* If you dont have already a Slack app in this workspace with incoming webhooks, [follow this](https://slack.com/intl/en-in/help/articles/115005265063-Incoming-webhooks-for-Slack) to setup incoming webhooks. Else just simply go to the already present app and add channel name in **ADD CHANNEL**
* Now you have a Slack app with incoming webhooks added to channel you want to get notified in.
* Go to [Your Apps](https://api.slack.com/apps), and open app that you have used to setup webhooks.
* go to **Add Features And functionality** -> **Permissions** -> get Bot user Auth Token (**xoxb-*****) and if you dont have **chat:write** scope enabled in **Bot Token Scopes** then add it and reinstall the app.
* Now use this Token and Channel Name while creating the team.
* The other members of this team can join Slack channel. 

## How to run locally and deploy this app

**For running locally**:

* Clone this repository.
* Set up your MongoDB and put your mongo uri in .env file
* You also need to set your aws credentials in .env file (for security reasons they can't be uploaded to version control)
* To run the server 
 > npm i
 > 
 > npm start
* To run the client
> cd frontend
> 
> npm i
> 
> npm start

<br>

**For deployment**:

* You need to set the environment variables present in .env file, on the platform you are deploying to(heroku in my case).
* Also change the base url in axios client present in frontend/src/services/other_services.js and frontend/src/services/auth_services.js
