

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Dialogflow = require('dialogflow');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/chat', (req, res) => {
    console.log(req.body)
    const { message } = req.body;
    processMessage(message, res);
});


const projectId = process.env.PROJECT_ID; //https://dialogflow.com/docs/agents#settings
const sessionId = process.env.SESSION_ID;
const languageCode = 'en-US';

const config = {
    credentials: {
        private_key: process.env.PRIVATE_KEY,
        client_email: process.env.CLIENT_EMAIL,
    },
};

const sessionClient = new Dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const processMessage = async (message, res) => {
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode,
            },
        },
    };
    await sessionClient.detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult.fulfillmentMessages;
            return res.send(result)
        }).catch(err => {
            res.send(err)
        });
};

app.set('port', process.env.PORT || 4444);

const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
})