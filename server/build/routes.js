"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const User_1 = require("./model/User");
const Kerdoiv_1 = require("./model/Kerdoiv");
const Kerdes_1 = require("./model/Kerdes");
function getUserId(req) {
    let user = req.user;
    return user._id;
}
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        res.status(200).send("Hello World!");
    });
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send("A felhasználó nem található.");
                    return;
                }
                req.login(user, (err) => {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    else {
                        res.status(200).send(user);
                        return;
                    }
                });
            }
            return;
        })(req, res, next);
    });
    router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const user = new User_1.User({ "username": username, "password": password });
        let userExist = yield User_1.User.findOne({ "username": username }).then(user => user !== null).catch(err => false);
        console.log(userExist);
        if (!userExist) {
            user.save().then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(200).send("A felhsználó már létezik.");
        }
        //res.status(418).send("Testing tea...")
    }));
    router.get('/logout', (req, res, next) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    res.status(500).send(error);
                }
                res.status(200).send("Sikeres kijelentkezés.");
            });
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });
    router.get('/isUserLoggedIn', (req, res) => {
        res.status(200).send(req.isAuthenticated());
    });
    //returns all public kerdoiv
    router.get('/getAllKerdoiv', (req, res) => {
        Kerdoiv_1.Kerdoiv.find({ nyilvanos: true }).then((kerdoivek) => __awaiter(void 0, void 0, void 0, function* () {
            let users = [];
            for (let kerdoiv of kerdoivek) {
                let user = yield User_1.User.findOne({ _id: kerdoiv["userid"] });
                users.push(user ? user["username"] : null);
            }
            res.status(200).send({ kerdoivek: kerdoivek, users: users });
        })).catch(error => {
            res.status(500).send("Hiba történt a kérdőívek lekérdezése során.");
            console.error(error);
        });
    });
    router.get('/getSelfKerdoivek', (req, res) => {
        if (req.isAuthenticated()) {
            let userid = getUserId(req);
            Kerdoiv_1.Kerdoiv.find({ userid: userid }).then(kerdoivek => {
                res.status(200).send({ kerdoivek: kerdoivek });
            }).catch(error => {
                res.status(500).send("Hiba történt a saját kérdőívek lekérdezése során.");
            });
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });
    //returns kerdoiv and kerdes
    router.post('/getKerdoiv', (req, res) => {
        Kerdoiv_1.Kerdoiv.findById(req.body.kerdoid).then(kerdoiv => {
            if (kerdoiv === null) {
                res.status(400).send("A kérdőív nem található.");
                return;
            }
            if (!req.body.doGetKerdes) {
                res.status(200).send({ kerdoiv: kerdoiv, kerdesek: null });
                return;
            }
            Kerdes_1.Kerdes.find({ kerdoid: kerdoiv._id }).then(kerdesek => {
                res.status(200).send({ kerdoiv: kerdoiv, kerdesek: kerdesek });
            });
        });
    });
    router.post('/addKerdoiv', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const nev = req.body.nev;
            const nyilvanos = req.body.nyilvanos;
            const userid = getUserId(req);
            const kerdoivobj = new Kerdoiv_1.Kerdoiv({ "userid": userid, "nev": nev, "nyilvanos": nyilvanos });
            kerdoivobj.save().then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    }));
    router.post('/modKerdoiv', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const nev = req.body.nev;
            const nyilvanos = req.body.nyilvanos;
            Kerdoiv_1.Kerdoiv.findByIdAndUpdate(req.body.kerdoid, { "nev": nev, "nyilvanos": nyilvanos }).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    }));
    router.post('/delKerdoiv', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            Kerdoiv_1.Kerdoiv.findByIdAndDelete(req.body.kerdoid).then((_) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    //del datas
                    const kerdesek = yield Kerdes_1.Kerdes.find({ kerdoiv: req.body.kerdoid });
                    if (kerdesek) {
                        for (const kerdes of kerdesek) {
                            yield Kerdes_1.KerdesAdat.deleteMany({ kredesid: kerdes._id });
                        }
                    }
                    //del kerdesek
                    Kerdes_1.Kerdes.deleteMany({ kerdoid: req.body.kerdoid }).then(data => {
                        res.status(200).send(data);
                    }).catch(error => {
                        res.status(500).send(error);
                    });
                }
                catch (error) {
                    res.status(500).send(error);
                }
            })).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    }));
    router.post('/addKerdes', (req, res) => {
        if (req.isAuthenticated()) {
            Kerdoiv_1.Kerdoiv.findById(req.body.kerdoid).then((kerdoiv) => __awaiter(void 0, void 0, void 0, function* () {
                if (kerdoiv === null) {
                    res.status(400).send("A kérdőív nem található.");
                    return;
                }
                else if (kerdoiv.userid.toString() !== getUserId(req)) {
                    res.status(400).send("Illetéktelen behatoló.");
                    return;
                }
                const kerdes = req.body.kerdes;
                const type = req.body.type;
                const valaszok = req.body.valaszok;
                const kerdesobj = new Kerdes_1.Kerdes({ "kerdoid": kerdoiv._id, "kerdes": kerdes, "type": type, "valaszok": valaszok });
                kerdesobj.save().then(data => {
                    res.status(200).send(data);
                }).catch(error => {
                    res.status(500).send(error);
                });
            })).catch(err => res.status(500).send(err));
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });
    router.post('/modKerdes', (req, res) => {
        if (req.isAuthenticated()) {
            /*if(kerdoiv===null){
                res.status(400).send("A kérdőív nem található.");
                return;
            } else if(kerdoiv.userid.toString()!==getUserId(req)) {
                res.status(400).send("Illetéktelen behatoló.");
                return;
            }*/
            const kerdesid = req.body.kerdesid;
            const kerdes = req.body.kerdes;
            const type = req.body.type;
            const valaszok = req.body.valaszok;
            Kerdes_1.Kerdes.findByIdAndUpdate(kerdesid, { "kerdes": kerdes, "type": type, "valaszok": valaszok }).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });
    router.post('/delKerdes', (req, res) => {
        if (req.isAuthenticated()) {
            /*if(kerdoiv===null){
                res.status(400).send("A kérdőív nem található.");
                return;
            } else if(kerdoiv.userid.toString()!==getUserId(req)) {
                res.status(400).send("Illetéktelen behatoló.");
                return;
            }*/
            const kerdesid = req.body.kerdesid;
            Kerdes_1.Kerdes.findByIdAndDelete(kerdesid).then(_ => {
                Kerdes_1.KerdesAdat.deleteMany({ "kerdesid": kerdesid }).then(data => {
                    res.status(200).send(data);
                }).catch(error => {
                    res.status(500).send(error);
                });
            }).catch(error => {
                res.status(500).send(error);
            });
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });
    router.post('/sendKitoltes', (req, res) => {
        let userid = req.isAuthenticated() ? getUserId(req) : undefined;
        Kerdoiv_1.Kerdoiv.findById(req.body.kerdoid).then((kerdoiv) => __awaiter(void 0, void 0, void 0, function* () {
            if (kerdoiv === null) {
                res.status(400).send("A kérdőív nem található.");
                return;
            }
            const valaszok = JSON.parse(req.body.valaszok);
            try {
                for (let kerdesid in valaszok) {
                    const kerdesobj = new Kerdes_1.KerdesAdat({ "kerdesid": kerdesid, "valasz": valaszok[kerdesid], userid: userid });
                    yield kerdesobj.save();
                }
                res.status(200).send();
            }
            catch (error) {
                res.status(500).send(error);
            }
            ;
        })).catch(err => res.status(500).send(err));
    });
    router.post('/getKerdesAdatok', (req, res) => {
        if (req.isAuthenticated()) {
            let userid = getUserId(req);
            Kerdoiv_1.Kerdoiv.findById(req.body.kerdoid).then((kerdoiv) => __awaiter(void 0, void 0, void 0, function* () {
                if (kerdoiv === null) {
                    res.status(400).send("A kérdőív nem található.");
                    return;
                }
                let valaszok = {};
                let kerdeskerdesek = {};
                Kerdes_1.Kerdes.find({ kerdoid: kerdoiv._id }).then((kerdesek) => __awaiter(void 0, void 0, void 0, function* () {
                    for (let kerdes of kerdesek) {
                        let adatok = yield Kerdes_1.KerdesAdat.find({ kerdesid: kerdes._id, userid: userid });
                        valaszok[kerdes._id.toString()] = [];
                        kerdeskerdesek[kerdes._id.toString()] = kerdes["kerdes"];
                        for (let adat of adatok) {
                            valaszok[kerdes._id.toString()].push(adat["valasz"]);
                        }
                    }
                    res.status(200).send({ valaszok: JSON.stringify(valaszok), kerdesek: kerdeskerdesek });
                })).catch(error => {
                    res.status(500).send(error);
                });
            })).catch(err => res.status(500).send(err));
        }
        else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });
    return router;
};
exports.configureRoutes = configureRoutes;
