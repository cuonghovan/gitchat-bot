const appRouter = function(app) {
    app.get("/", function(req, res) {
        res.status(200).send("Welcome to our restful API");
    });

    app.post("/webhook", function(req, res) {
        res.send(req);
    });
};

module.exports = appRouter;
