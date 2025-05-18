import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { User } from './model/User';
import { Kerdoiv } from './model/Kerdoiv';
import { Kerdes, KerdesAdat } from './model/Kerdes';
import { Types } from 'mongoose';

function getUserId(req: Request){
    let user: any=req.user;
    return user._id;
}

export const configureRoutes = (passport: PassportStatic, router: Router): Router=>{
    router.get('/', (req: Request, res: Response)=>{
        res.status(200).send("Hello World!");
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction)=>{
        passport.authenticate('local', (error: string | null, user: typeof User)=>{
            if(error){
                res.status(500).send(error);
            } else {
                if(!user){
                    res.status(400).send("A felhasználó nem található.");
                    return;
                }
                req.login(user, (err: string|null)=>{
                    if(err){
                        res.status(500).send(err);
                        return;
                    } else {
                        res.status(200).send(user);
                        return;
                    }
                });
            }
            return;
        })(req, res, next);
    });

    router.post('/register', async (req: Request, res: Response, next: NextFunction)=>{
        const username=req.body.username;
        const password=req.body.password;
        const user=new User({"username": username, "password": password});
        let userExist=await User.findOne({"username":username}).then(user=>user!==null).catch(err=>false);
        console.log(userExist);
        if(!userExist){
            user.save().then(data=>{
                res.status(200).send(data);
            }).catch(error=>{
                res.status(500).send(error);
            });
        } else {
            res.status(200).send("A felhsználó már létezik.")
        }
        //res.status(418).send("Testing tea...")
    });

    router.get('/logout', (req: Request, res: Response, next: NextFunction)=>{
        if(req.isAuthenticated()){
            req.logout((error)=>{
                if(error){
                    res.status(500).send(error);
                }
                res.status(200).send("Sikeres kijelentkezés.");
            });
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    router.get('/isUserLoggedIn', (req: Request, res: Response)=>{
        res.status(200).send(req.isAuthenticated());
    });

    //returns all public kerdoiv
    router.get('/getAllKerdoiv', (req: Request, res: Response)=>{
        Kerdoiv.find({nyilvanos: true}).then(async kerdoivek=>{
            let users=[];
            for(let kerdoiv of kerdoivek){
                let user=await User.findOne({_id: kerdoiv["userid"]});
                users.push(user?user["username"]:null);
            }
            res.status(200).send({kerdoivek: kerdoivek, users: users});
        }).catch(error=>{
            res.status(500).send("Hiba történt a kérdőívek lekérdezése során.");
            console.error(error);
        });
    });

    router.get('/getSelfKerdoivek', (req: Request, res: Response)=>{
       if(req.isAuthenticated()){
            let userid: any=getUserId(req);
            Kerdoiv.find({userid: userid}).then(kerdoivek=>{
                res.status(200).send({kerdoivek: kerdoivek});
            }).catch(error=>{
                res.status(500).send("Hiba történt a saját kérdőívek lekérdezése során.");
            })
            
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    //returns kerdoiv and kerdes
    router.post('/getKerdoiv', (req: Request, res: Response)=>{
        Kerdoiv.findById(req.body.kerdoid).then(kerdoiv=>{
            if(kerdoiv===null){
                res.status(400).send("A kérdőív nem található.");
                return;
            }
            if(!(req.body.doGetKerdes as boolean)){
                res.status(200).send({kerdoiv:kerdoiv, kerdesek: null});
                return;
            }
            Kerdes.find({kerdoid: kerdoiv._id}).then(kerdesek=>{
                res.status(200).send({kerdoiv: kerdoiv, kerdesek: kerdesek});
            });
        })
    });

    router.post('/addKerdoiv', async (req: Request, res: Response)=>{
        if(req.isAuthenticated()){
            const nev=req.body.nev;
            const nyilvanos: boolean=req.body.nyilvanos;
            const userid=getUserId(req);
            const kerdoivobj=new Kerdoiv({"userid": userid, "nev": nev, "nyilvanos": nyilvanos});
            kerdoivobj.save().then(data=>{
                res.status(200).send(data);
            }).catch(error=>{
                res.status(500).send(error);
            });
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    router.post('/modKerdoiv', async (req: Request, res: Response)=>{
        if(req.isAuthenticated()){
            const nev=req.body.nev;
            const nyilvanos: boolean=req.body.nyilvanos;
            Kerdoiv.findByIdAndUpdate(req.body.kerdoid, {"nev": nev, "nyilvanos": nyilvanos}).then(data=>{
                res.status(200).send(data);
            }).catch(error=>{
                res.status(500).send(error);
            });
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    router.post('/delKerdoiv', async (req: Request, res: Response)=>{
        if(req.isAuthenticated()){
            Kerdoiv.findByIdAndDelete(req.body.kerdoid).then(async _=>{
                try {
                    //del datas
                    const kerdesek = await Kerdes.find({ kerdoiv: req.body.kerdoid });
                    if (kerdesek) {
                        for (const kerdes of kerdesek) {
                            await KerdesAdat.deleteMany({ kredesid: kerdes._id });
                        }
                    }
                    //del kerdesek
                    Kerdes.deleteMany({kerdoid: req.body.kerdoid}).then(data=>{
                        res.status(200).send(data);
                    }).catch(error=>{
                        res.status(500).send(error);
                    });
                } catch(error){
                    res.status(500).send(error);
                }
            }).catch(error=>{
                res.status(500).send(error);
            });
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    router.post('/addKerdes', (req: Request, res: Response)=>{
        if(req.isAuthenticated()){
            Kerdoiv.findById(req.body.kerdoid).then(async kerdoiv=>{
                if(kerdoiv===null){
                    res.status(400).send("A kérdőív nem található.");
                    return;
                } else if(kerdoiv.userid.toString()!==getUserId(req)) {
                    res.status(400).send("Illetéktelen behatoló.");
                    return;
                }
                const kerdes=req.body.kerdes;
                const type=req.body.type;
                const valaszok=req.body.valaszok;
                const kerdesobj=new Kerdes({"kerdoid": kerdoiv._id, "kerdes": kerdes, "type": type, "valaszok": valaszok});
                kerdesobj.save().then(data=>{
                    res.status(200).send(data);
                }).catch(error=>{
                    res.status(500).send(error);
                });
            }).catch(err=>res.status(500).send(err));
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    router.post('/modKerdes', (req: Request, res: Response)=>{
        if(req.isAuthenticated()){
            /*if(kerdoiv===null){
                res.status(400).send("A kérdőív nem található.");
                return;
            } else if(kerdoiv.userid.toString()!==getUserId(req)) {
                res.status(400).send("Illetéktelen behatoló.");
                return;
            }*/
            const kerdesid=req.body.kerdesid;
            const kerdes=req.body.kerdes;
            const type=req.body.type;
            const valaszok=req.body.valaszok;
            Kerdes.findByIdAndUpdate(kerdesid, {"kerdes": kerdes, "type": type, "valaszok": valaszok}).then(data=>{
                res.status(200).send(data);
            }).catch(error=>{
                res.status(500).send(error);
            });
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    router.post('/delKerdes', (req: Request, res: Response)=>{
        if(req.isAuthenticated()){
            /*if(kerdoiv===null){
                res.status(400).send("A kérdőív nem található.");
                return;
            } else if(kerdoiv.userid.toString()!==getUserId(req)) {
                res.status(400).send("Illetéktelen behatoló.");
                return;
            }*/
            const kerdesid=req.body.kerdesid;
            Kerdes.findByIdAndDelete(kerdesid).then(_=>{
                KerdesAdat.deleteMany({"kerdesid":kerdesid}).then(data=>{
                    res.status(200).send(data);
                }).catch(error=>{
                    res.status(500).send(error);
                });
            }).catch(error=>{
                res.status(500).send(error);
            });
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });

    router.post('/sendKitoltes', (req: Request, res: Response)=>{
        let userid=req.isAuthenticated()?getUserId(req):undefined;
        Kerdoiv.findById(req.body.kerdoid).then(async kerdoiv=>{
            if(kerdoiv===null){
                res.status(400).send("A kérdőív nem található.");
                return;
            }
            const valaszok: { [kerdesid: string]: string[] }=JSON.parse(req.body.valaszok);
            try{
                for(let kerdesid in valaszok){
                    const kerdesobj=new KerdesAdat({"kerdesid": kerdesid, "valasz": valaszok[kerdesid], userid: userid});
                    await kerdesobj.save()
                }
                res.status(200).send();
            } catch(error){
                res.status(500).send(error);
            };
        }).catch(err=>res.status(500).send(err));
    });

    router.post('/getKerdesAdatok', (req: Request, res: Response)=>{
        if(req.isAuthenticated()){
            let userid=getUserId(req);
            Kerdoiv.findById(req.body.kerdoid).then(async kerdoiv=>{
                if(kerdoiv===null){
                    res.status(400).send("A kérdőív nem található.");
                    return;
                }
                let valaszok: { [kerdesid: string]: string[] }={};
                let kerdeskerdesek: { [kerdesid: string]: string }={};
                Kerdes.find({kerdoid: kerdoiv._id}).then(async kerdesek=>{
                    for(let kerdes of kerdesek){
                        let adatok=await KerdesAdat.find({kerdesid: kerdes._id, userid: userid});
                        valaszok[kerdes._id.toString()]=[];
                        kerdeskerdesek[kerdes._id.toString()]=kerdes["kerdes"];
                        for(let adat of adatok){
                            valaszok[kerdes._id.toString()].push(adat["valasz"]);
                        }
                    }
                    res.status(200).send({valaszok: JSON.stringify(valaszok), kerdesek: kerdeskerdesek});
                }).catch(error=>{
                    res.status(500).send(error);
                });
            }).catch(err=>res.status(500).send(err));
        } else {
            res.status(500).send("A felhasználó nincs bejelentkezve.");
        }
    });
    
    return router;
}

