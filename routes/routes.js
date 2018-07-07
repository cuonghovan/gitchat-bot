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
    const message = `TO ALL >>>
    [info][title]framgia/FunJapanRenewal#fbc0fcd7b306a1f6a8a9f0cfc25422b6d811c655 SUCCESS[/title]Branch: develop
    Author: KhanhLD
    Message: Merge pull request #1205 from Taipt-Framgia/fix-some-bug-21
    
    Fix bug comment
    http://ci-reports.framgia.vn/repositories/framgia/FunJapanRenewal/builds/5511/violations/[/info]`;

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
