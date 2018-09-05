const bruger_service = require('../services/brugere.js');
const bcrypt = require('bcrypt');

function ValidateEmail(mail) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
}

module.exports = (app) => {

    //henter alle bruger
    app.get('/admin/brugere', (req, res) => {

        (async () => {
            // standard data
            let alle_brugere = [];
            let en_bruger = {
                "bruger_id": 0,
                "bruger_email": ""
            };

            // udfør de asynkrone funktioner med en await kommando
            await bruger_service.hent_alle()
                .then(result => {
                    alle_brugere = result;
                });

            // send data til skabelonen
            res.render('pages/brugere', {
                "title": "Mine brugere",
                "alle_brugere": alle_brugere,
                "formtype": "opret",
                "en_bruger": en_bruger,
                "page": "brugere",
                "fejl_besked": "",
                "session": req.session

            });
        })();

    });

    //tag imod formular data og og indsæt bruger
    app.post('/admin/brugere', (req, res) => {
        let fejl_besked = [];
        // validering. 

        let bruger_email = req.body.bruger_email;
        let bruger_kodeord = req.body.bruger_kodeord;

        if (bruger_email == undefined || bruger_email == "" || !ValidateEmail(bruger_email)) {
            fejl_besked.push('Email mangler, eller er angivet forkert');
        }
        if (bruger_kodeord == undefined || bruger_kodeord == "") {
            fejl_besked.push('Du mangler at indtaste kodeord')
        }
        if (fejl_besked.length > 0) {
            (async () => {
                // standard data
                let alle_brugere = [];
                let en_bruger = {
                    "bruger_id": 0,
                    "bruger_email": ""
                };

                // udfør de asynkrone funktioner med en await kommando
                await bruger_service.hent_alle()
                    .then(result => {
                        alle_brugere = result;
                    });

                // send data til skabelonen
                res.render('pages/brugere', {
                    "title": "Mine brugere",
                    "alle_brugere": alle_brugere,
                    "formtype": "opret",
                    "en_bruger": en_bruger,
                    "page": "brugere",
                    "fejl_besked": fejl_besked.join('.'),
                    "session": req.session

                });
            })();

        } else {
            let kodeord = req.body.bruger_kodeord;
            bcrypt.hash(kodeord, 10, (err, hashed_kodeord) => {
                if (err) {
                    console.log(err);
                }

                bruger_service.opret_en(req.body.bruger_email, hashed_kodeord)
                    .then(result => {
                        res.redirect('/admin/brugere');
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/admin/brugere');
                    });
            });
        }

    });

    //forudfyld formularen med en brugere
    //når vi klikker på ret , link redirecter , async , data bliver lagt ned i variablen 
    app.get('/admin/brugere/ret/:bruger_id', (req, res) => {
        let id = req.params.bruger_id;
        //her siger vi hvis id ikke er et tal, skal den sende statuskode 400 (bad request)
        if (isNaN(id)) {
            res.redirect("/admin/brugere");
        } else {
            (async () => {

                try {
                    // standard data
                    let alle_brugere = [];
                    let en_bruger = {
                        "bruger_id": 0,
                        "bruger_email": ""
                    };

                    // udfør de asynkrone funktioner med en await kommando
                    await bruger_service.hent_alle()
                        .then(result => {
                            alle_brugere = result;
                        });
                    await bruger_service.hent_en(req.params.bruger_id)
                        .then(result => {
                            en_bruger = result;
                        });

                    // send data til skabelonen
                    res.render('pages/brugere', {
                        "title": "Mine brugere",
                        "alle_brugere": alle_brugere,
                        "formtype": "ret",
                        "en_bruger": en_bruger,
                        "page": "brugere",
                        "fejl_besked": "",
                        "session": req.session


                    });
                } catch (error) {
                    console.log(error);
                }
            })();
        }
    });

    //tag imod 1 og rediger formular og opdater databasen
    app.post('/admin/brugere/ret/:bruger_id', (req, res) => {
        //husk password
        let id = req.params.bruger_id;

        console.log(id);

        if (isNaN(id)) {
            res.redirect("/admin/brugere");
        } else {
            //vi opretter en variabel fejl_besked som er et tomt array
            let fejl_besked = [];
            // validering. 

            let bruger_email = req.body.bruger_email;
            let bruger_kodeord = req.body.bruger_kodeord;

            if (bruger_email == undefined || bruger_email == "" || !ValidateEmail(bruger_email)) {
                fejl_besked.push('Email mangler, eller er angivet forkert');
            }
            if (bruger_kodeord == undefined) {
                bruger_kodeord = "";
            }
            //hvis fejl_besked's længde er større end 0
            if (fejl_besked.length > 0) {
                (async () => {
                    // standard data
                    let alle_brugere = [];
                    let en_bruger = {
                        "bruger_id": 0,
                        "bruger_email": ""
                    };

                    // udfør de asynkrone funktioner med en await kommando
                    await bruger_service.hent_alle()
                        .then(result => {
                            alle_brugere = result;
                        });

                    // send data til skabelonen
                    res.render('pages/brugere', {
                        "title": "Mine brugere",
                        "alle_brugere": alle_brugere,
                        "formtype": "opret",
                        "en_bruger": en_bruger,
                        "page": "brugere",
                        "fejl_besked": fejl_besked.join('.'),
                        "session": req.session

                    });
                })();

            } else {
                bruger_service.ret_en(req.body.bruger_email, req.body.bruger_kodeord, req.params.bruger_id)
                    .then(result => {
                        res.redirect("/admin/brugere");
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect("/admin/brugere");
                    })
            }
        }
    });

    //slet
    app.get('/admin/brugere/slet/:bruger_id', (req, res) => {
        let bruger_id = req.params.bruger_id;


        if (isNaN(bruger_id)) {
            res.redirect("/admin/brugere");
        } else {
            bruger_service.slet_en(req.params.bruger_id)
                .then(result => {
                    res.redirect("/admin/brugere");
                })
                .catch(err => {
                    console.log(err);
                    res.redirect("/admin/brugere");
                })
        }

    });

}