const request = require('request');
const keys = require('./../configs/keys');

const appRouter = function(app) {
    app.get("/", function(req, res) {
        res.status(200).send("Welcome to our Github Chatbot");
    });

    app.post('/webhook/:roomid/:mergeUserid/pullrequests', function(req, res) {
        const userAgent = req.headers['user-agent'];

        if (userAgent == 'Bitbucket-Webhooks/2.0') {
            console.log(req.body.pullrequest)
            sendFromBitbucket(req.params.roomid, req.params.mergeUserid, req.body);
        } else {
            sendFromGithub(req.params.roomid, req.params.mergeUserid, req.body);
        }

        res.status(200).send('ok');
    });
};

function sendFromBitbucket(roomid, mergeUserid, payload) {
    const pullRequest = payload.pullrequest;
    const repository = payload.repository;
    
    if (pullRequest.state === 'OPEN' || pullRequest.state === 'MERGED') {
        var message = '';

        if (pullRequest.state === 'OPEN') {
            message = `[To:${mergeUserid}][info][title]${repository.full_name} (*)[/title]Branch: ${pullRequest.destination.branch.name}%0D%0AAuthor: ${pullRequest.author.username}%0D%0AMessage: New pull request #${pullRequest.id} from ${pullRequest.source.repository.full_name}%0D%0ATitle: ${pullRequest.title}[/info]`;
        } else {
            message = `TO ALL >>>[info][title]${repository.full_name} (dance)[/title]Branch: ${pullRequest.destination.branch.name}%0D%0AAuthor: ${pullRequest.author.username}%0D%0AMessage: Merged pull request #${pullRequest.id} from ${pullRequest.source.repository.full_name}%0D%0ATitle: ${pullRequest.title}[/info]`;
        }
        
        sendToChatwork(roomid, message);
    }

    return;
}

function sendFromGithub(roomid, mergeUserid, payload) {
    const pullRequest = payload.pull_request;
    const repository = payload.repository;
    
    if (pullRequest.state === 'open' || pullRequest.merged) {
        var message = '';

        if (pullRequest.state === 'open') {
            message = `[To:${mergeUserid}][info][title]${repository.full_name} (*)[/title]Branch: ${pullRequest.base.ref}%0D%0AMessage: New pull request #${pullRequest.number} from ${pullRequest.head.repo.full_name}%0D%0ATitle: ${pullRequest.title}[/info]`;
        } else {
            message = `TO ALL >>>[info][title]${repository.full_name} (dance)[/title]Branch: ${pullRequest.base.ref}%0D%0AAuthor: ${pullRequest.merged_by.login}%0D%0AMessage: Merged pull request #${pullRequest.number} from ${pullRequest.head.repo.full_name}%0D%0ATitle: ${pullRequest.title}[/info]`;
        }
        
        sendToChatwork(roomid, message);
    }

    return;
}

function sendToChatwork(roomid, message) {
    const clientServerOptions = {
        uri: `https://api.chatwork.com/v2/rooms/${roomid}/messages`,
        body: `body=${message}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ChatWorkToken': process.env.CHATWORK_TOKEN || keys.CHATWORK_TOKEN
        }
    }

    request(clientServerOptions, function (error, response) {
        console.log(error,response.body);
        return;
    });
}

module.exports = appRouter;
