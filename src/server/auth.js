module.exports = {
    init(app, session) {
        app.use(session({
            secret: 'spotify är sh1t, snoppify är bra!',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false
            }
        }));

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "http://localhost:3333");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });

        /////////// ENDPOINTS

        app.post("/new-user", (req, res) => {
            if (!req.body.username) {
                res.sendStatus(400);
            }
            else {
                req.session.username = req.body.username;
                req.session.ip = req.ip;

                console.log("New session:", req.session);

                res.send({
                    username: req.body.username,
                })
            }
        });

        app.get("/auth", (req, res) => {
            if (req.session && req.session.username) {
                res.send({ username: req.session.username });
            }
            else {
                res.sendStatus(403);
            }
        })
    },
};