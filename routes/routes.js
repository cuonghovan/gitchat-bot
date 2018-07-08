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
    const pullRequest = payload.pull_request;
    const repository = payload.repository;

    if (pullRequest.merged) {
        const message = 
        `TO ALL >>>[info][title]${repository.full_name}[/title]Branch: ${pullRequest.base.ref}%0D%0AAuthor: ${pullRequest.merged_by.login}%0D%0AMessage: Merge pull request #${pullRequest.number} from ${pullRequest.head.repo.full_name}%0D%0APR title: ${pullRequest.title}[/info]`;
    
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

    return;
}

module.exports = appRouter;
