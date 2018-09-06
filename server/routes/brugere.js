const bruger_service = require('../services/brugere.js');

function ValidateEmail(mail) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
}

module.exports = (app) => {

    //henter alle bruger
    app.get('/', (req, res) => {

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
    app.post('/', (req, res) => {
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

            bruger_service.opret_en(req.body.bruger_email, kodeord)
                .then(result => {
                    res.redirect('/index');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/index');
                });

        }
    });

    app.get('/findFindFiskePind/:email', (req, res) => {

        let bruger_email = req.params.email;

        bruger_service.find_uniq(bruger_email).then(result => {
            console.log(result);

            res.send(result);

        }).catch(err => {
            console.log(err);
            res(err);
        })

    });


}