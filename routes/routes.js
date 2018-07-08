const request = require('request');
const keys = require('./../configs/keys');

const appRouter = function(app) {
    app.get("/", function(req, res) {
        res.status(200).send("Welcome to our Github Chatbot");
    });

    app.post('/webhook/:roomid/:mergeUserid/pullrequests', function(req, res) {
        sendMessageToChatwork(req.params.roomid, req.params.mergeUserid, req.body);
        res.status(200).send('ok');
    });
};

function sendMessageToChatwork(roomid, mergeUserid, payload) {
    const pullRequest = payload.pull_request;
    const repository = payload.repository;
    
    if (pullRequest.state === 'open' || pullRequest.merged) {
        var message = '';

        if (pullRequest.state === 'open') {
            message = `[To:${mergeUserid}][info][title]${repository.full_name} :D[/title]Branch: ${pullRequest.base.ref}%0D%0AMessage: New pull request #${pullRequest.number} from ${pullRequest.head.repo.full_name}%0D%0APR title: ${pullRequest.title}[/info]`;
        } else {
            message = `TO ALL >>>[info][title]${repository.full_name} (dance)[/title]Branch: ${pullRequest.base.ref}%0D%0AAuthor: ${pullRequest.merged_by.login}%0D%0AMessage: Merged pull request #${pullRequest.number} from ${pullRequest.head.repo.full_name}%0D%0APR title: ${pullRequest.title}[/info]`;
        }
    
        const clientServerOptions = {
            uri: `https://api.chatwork.com/v2/rooms/${roomid}/messages`,
            body: `body=${message}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-ChatWorkToken': keys.CHATWORK_TOKEN
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
