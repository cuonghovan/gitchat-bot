const request = require('request');

const appRouter = function(app) {
    app.get("/", function(req, res) {
        res.status(200).send("Welcome to our restful API");
    });

    app.post('/webhook', function(req, res) {
        sendMessageToChatwork(req.body);
        res.status(200).send('ok');
    });
};

function sendMessageToChatwork(payload) {
    console.log('payload', payload)

    const message = `TO ALL >>>
    [info][title]${payload.pull_request.head.base.repo.full_name}[/title]Branch: ${payload.pull_request.base.ref}
    Author: ${payload.pull_request.head.user.login}
    Message: Merge pull request #${payload.pull_request.id} from ${payload.pull_request.head.repo.full_name}
    
    ${payload.pull_request.title}[/info]`;

    const clientServerOptions = {
        uri: 'https://api.chatwork.com/v2/rooms/57764352/messages',
        body: `body=${message}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ChatWorkToken': 'bbfa072b20cb0d91e7995c8f7bc6e633'
        }
    }

    request(clientServerOptions, function (error, response) {
        console.log(error,response.body);
        return;
    });
}

module.exports = appRouter;
