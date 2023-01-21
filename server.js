const user_exist = require('./controllers/auth')
const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const Student = require('./models/studentsModel');
const Prof = require('./models/profsModel');
const Modules = require('./models/modulesModel');
const Note = require('./models/notesModel');
const Demande = require('./models/demandesModel');
const {result} = require('lodash');
const pdfService = require('./services/pdf_services');
const app = express();


//define storage for the images

const storage = multer.diskStorage({
    //destination for files
    destination: function (request, file, callback) {
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

const port = process.env.PORT || 4040;
mongo_url = "mongodb+srv://ahmed:ahmed123@cluster0.i5myq.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongo_url)
    .then((res) => {
        app.listen(port);
    })
    .catch((err) => {
        console.log("UNE ERREUR S'EST PRODUITE LORS DE LA CONNECTION AVEC LA BD MONGO");
    })
// var users = [{email: "ahmed123@gmail.com", password: "123"}];
// console.log(user_exist(users[0]));
app.set("view engine", "ejs");
//app.set("views", "name of your views folder");

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use('/static1', express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
    res.render('create', {
        existe: true,
        existingEmail: false,
        email: "",
        pwd: "",
    });
})
app.get('/index', (req, res) => {
    res.render('index', {
        person: ourClient,
    });
})

app.get('/error', (req, res) => {
    res.render('error');
})


app.get('/create', (req, res) => {
    res.render('create', {
        existe: true,
        existingEmail: false,
        email: "",
        pwd: "",
    });
})

app.post('/index', (req, res) => {

    Student.find()
        .then((result) => {
            result.forEach(person => {
                if (req.body.email == person.email && req.body.password == person.password) {
                    global.ourClient = person;
                    // console.log(ourClient);
                    res.render('index', {
                        person: person,
                    });
                }
            });
            res.render('create', {
                existe: false,
                existingEmail: false,
                email: req.body.email,
                pwd: req.body.password,
            })
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/updateProfile', upload.single('image'), async (req, res) => {
    if (ourClient.role == "etudiant") {
        let user = req.body;
        Student.findByIdAndUpdate(user.userId,
            {
                nom: user.nom,
                prenom: user.prenom,
                filiere: user.filiere,
                image: req.file.filename,
                email: user.email,
                password: user.password

            },
            async (err, docs) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Updated User : ", docs);
                    const result = await Student.findById(user.userId);
                    res.render('index',
                        {
                            person: result,
                        });
                }
            })
    } else {
        let user = req.body;
        console.log(user);
        Prof.findByIdAndUpdate(user.userId,
            {
                nom: user.nom,
                prenom: user.prenom,
                departement: user.departement,
                image: await req.file.filename,
                classes: user.classes,
                email: user.email,
                password: user.password

            },
            async (err, docs) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Updated User : ", docs);
                    const result = await Student.findById(user.userId);
                    res.render('index',
                        {
                            person: result,
                        });
                }
            })
    }
})

app.post('/addStudent', upload.single('image'), (req, res) => {
    const student = new Student({
        nom: req.body.nom,
        prenom: req.body.prenom,
        filiere: req.body.filiere,
        email: req.body.email,
        password: req.body.password,
        image: req.file.filename,
    });

    let client = false;
    Student.find()
        .then((result) => {
            result.forEach(person => {
                if (student.email == person.email) {
                    res.render('create', {
                        existe: true,
                        existingEmail: true,
                        email: "",
                        pwd: "",
                    })
                    client = true;
                }
            });
            if (!client) {

                student.save()
                    .then((result1) => {
                        // upload(req1, res1, (err1) )
                        //     if (err) {
                        //         console.log(err);
                        //     } else {
                        //         console.log(req.file)
                        //     }

                        // });
                        global.ourClient = result1;
                        res.render('index', {
                            person: result1,
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
            // .catch(err => {
            //     console.log(err);
            // })
        })
})


app.get('/signinadmin', (req, res) => {
    res.render('signinadmin', {
        existe: true,
        email: "",
        pwd: "",
    });
})
app.post('/signinadmin', (req, res) => {
    admins = [
        {
            nom: "Ensaj",
            prenom: "Admin",
            image: "1661708690257ensajlogo.png",
            email: "admin@ensaj.com",
            password: "123",
            departement: "TRI",
            role: "Cordinateur"
        }
    ]

    admins.forEach(admin => {
        if (req.body.email == admin.email && req.body.password == admin.password) {
            global.ourClient = admin;
            //    res.render('index', {
            //     person: admin,
            //    });
            res.redirect('dash')
        }
        res.render('signinadmin', {
            existe: false,
            email: req.body.email,
            pwd: req.body.password,
        })
    });
})
app.get('/signinprof', (req, res) => {
    res.render('signinprof', {
        existe: true,
        email: "",
        pwd: "",
    });
})
app.post('/signinprof', (req, res) => {

    Prof.find()
        .then((result) => {
            result.forEach(prof => {
                if (req.body.email == prof.email && req.body.password == prof.password) {

                    global.ourClient = prof;
                    res.render('index', {
                        person: prof,
                    });
                }
            });
            res.render('signinprof', {
                existe: false,
                email: req.body.email,
                pwd: req.body.password,
            })
        })
        .catch(err => {
            console.log(err);
        })

})

app.get('/profs', async (req, res) => {
    if (ourClient.role == "Cordinateur") {
        await Prof.find()
            .then((result) => {
                global.ourProfs = result;
            })
            .catch(err => {
                console.log(err);
            })

        await Note.find()
            .then((result) => {
                global.ourStudentsScores = result;
            })
            .catch(err => {
                console.log(err);
            })

        await Student.find()
            .then(result => {
                global.iite1Students = 0;
                global.iite2Students = 0;
                global.isic1Students = 0;
                global.isic2Students = 0;
                result.forEach(student => {
                    if (student.filiere == "2ite1") {
                        global.iite1Students++;
                    } else if (student.filiere == "2ite2") {
                        global.iite2Students++;
                    } else if (student.filiere == "isic1") {
                        global.isic1Students++;
                    } else {
                        global.isic2Students++;
                    }
                });
            })
        res.render('profs', {
            profs: ourProfs,
            notes: ourStudentsScores,
            iite1Students: iite1Students,
            iite2Students: iite2Students,
            isic1Students: isic1Students,
            isic2Students: isic2Students
        })
    } else {
        res.render('error')
    }
})

app.get('/addprof', (req, res) => {
    if (ourClient.role == "Cordinateur") {
        res.render('addprof');
    } else {
        res.render('error')
    }
})

app.post('/addprof', (req, res) => {

    let classes = ""

    if (req.body.isic1 == "on") {
        classes = classes + " isic1 |"
    }
    if (req.body.isic2 == "on") {
        classes = classes + " isic2 |"
    }
    if (req.body._2ite1 == "on") {
        classes = classes + " 2ite1 |"
    }
    if (req.body._2ite2 == "on") {
        classes = classes + " 2ite2 |"
    }
    const prof = new Prof(
        {
            nom: req.body.nom,
            prenom: req.body.prenom,
            departement: req.body.departement,
            email: req.body.email,
            password: req.body.password,
            // image: req.body.image,
            classes: classes.slice(0, -1)
        }
    );
    prof.save()
        .then((result) => {
            console.log("Professeur added successfuly");
            Prof.find()
                .then(result => {
                    res.redirect("profs")
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.send("error");
        })
})

app.post('/update', (req, res) => {
    const id = req.body.profid;
    Prof.findById(id)
        .then(result => {
            res.render('index', {
                person: result
            })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/deleteprof', (req, res) => {
    const id = req.body.profid;
    Prof.findByIdAndDelete(id)
        .then(() => {
            Prof.find()
                .then((result) => {
                    res.redirect('profs');
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/etudiants', async (req, res) => {

    if (ourClient.role == "Cordinateur") {
        await Student.find()
            .then(result => {
                global.allStudents = result;
            })
            .catch(err => {
                console.log(err);
            })
        await Note.find()
            .then(result => {
                global.toutesLesnotes = result;
            })
            .catch(err => {
                console.log(err);
            })
        await Prof.find()
            .then(result => {
                global.allprofs = result;
            })
            .catch(err => {
                console.log(err);
            })
        console.log(allStudents);
        res.render('etudiants', {
            person: allStudents,
            marks: toutesLesnotes,
            profs: allprofs
        })
    } else {
        res.render('error')
    }

})


app.get('/modules', (req, res) => {

    if (ourClient.role == "Cordinateur") {
        Modules.find()
            .then((result) => {
                res.render('modules', {
                    modules: result
                });
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.get('/addmodule', (req, res) => {

    if (ourClient.role == "Cordinateur") {
        Prof.find()
            .then(result => {
                res.render('addmodule', {
                    profs: result
                });
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.post('/updatemodule', (req, res) => {
    const id = req.body.moduleid;
    Prof.find()
        .then(result => {
            global.profsnames = result;
        })
        .catch(err => {
            console.log("Cannot retreive teacher's names")
        })
    Modules.findById(id)
        .then(result => {
            res.render('updatemodule', {
                modules: result,
                profs: profsnames
            })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/update_module_selected', (req, res) => {

    let classes = ""

    if (req.body.isic1 == "on") {
        classes = classes + " isic1 |"
    }
    if (req.body.isic2 == "on") {
        classes = classes + " isic2 |"
    }
    if (req.body._2ite1 == "on") {
        classes = classes + " 2ite1 |"
    }
    if (req.body._2ite2 == "on") {
        classes = classes + " 2ite2 |"
    }

    let module = req.body;
    Modules.findByIdAndUpdate(module.moduleId,
        {
            nom: module.nom,
            professeur: module.professeur,
            description: module.description,
            classe: classes.slice(0, -1)
        },
        async (err, docs) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated User : ", docs);
                Modules.find()
                    .then(result => {
                        res.render('modules',
                            {
                                modules: result,
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
})

app.post('/deletemodule', (req, res) => {
    const id = req.body.moduleid;
    Modules.findByIdAndDelete(id)
        .then(() => {
            Modules.find()
                .then((result) => {
                    res.render('modules', {
                        modules: result
                    });
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.post('/addmodule', (req, res) => {

    let classes = ""

    if (req.body.isic1 == "on") {
        classes = classes + " isic1 |"
    }
    if (req.body.isic2 == "on") {
        classes = classes + " isic2 |"
    }
    if (req.body._2ite1 == "on") {
        classes = classes + " 2ite1 |"
    }
    if (req.body._2ite2 == "on") {
        classes = classes + " 2ite2 |"
    }
    const module = new Modules(
        {
            nom: req.body.nom,
            professeur: req.body.professeur,
            description: req.body.description,
            classe: classes.slice(0, -1)
        }
    );
    module.save()
        .then((result) => {
            console.log("Module added successfuly");
            Modules.find()
                .then(result => {
                    res.render("modules", {
                        modules: result
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.send("error");
        })
})

app.get('/notes', async (req, res) => {
    let listOfModules = []
    if (ourClient.role == "professeur") {

        await Modules.find()
            .then(result => {
                listOfModules = result;
                // console.log(listOfModules);
                global.modulesList = [];

                listOfModules.forEach(module => {
                    if (module.professeur == (ourClient.prenom + " " + ourClient.nom)) {
                        modulesList.push(module);
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })
        listOfMarks = [];
        Note.find()
            .then(result => {
                global.listOfMarks = result;
            })
            .catch(err => {
                console.log(err);
            })
        Student.find()
            .then(result => {
                res.render('notes', {
                    person: result,
                    modules: modulesList,
                    notes: listOfMarks,
                });
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.get('/notes', (req, res) => {
    if (ourClient.role == "professeur") {
        res.redirect('/notes');
    } else {
        res.render('error')
    }
})

app.post('/addmark', (req, res) => {
    if (ourClient.role == "professeur") {
        const id = req.body.studentid;
        const moduleName = req.body.nomModule;
        Student.findById(id)
            .then(result => {
                res.render('donnernote', {
                    person: result,
                    module: moduleName

                })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        res.render('error')
    }
})

app.post('/updatemark', (req, res) => {
    if (ourClient.role == "professeur") {
        const id = req.body.studentid;
        const moduleName = req.body.nomModule;
        const studentScore = req.body.note;
        Student.findById(id)
            .then(result => {
                res.render('modifiernote', {
                    person: result,
                    module: moduleName,
                    score: studentScore
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.post('/validatemark', (req, res) => {
    const note = new Note(
        {
            note: req.body.note,
            module: req.body.nameOfModule,
            professeur: ourClient.prenom + " " + ourClient.nom,
            etudiant: req.body.prenom + " " + req.body.nom,
        }
    );
    note.save()
        .then(result => {
            res.redirect('/notes')
        })
        .catch(err => {
            console.log(err)
        })

})


app.get('/consulternote', (req, res) => {
    if (ourClient.role = "etudiant") {
        let listOfValidMarks = [];
        Note.find()
            .then(result => {
                result.forEach(student => {
                    if (student.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        listOfValidMarks.push(student)
                    }
                });
                res.render('consulternote', {
                    listOfMarks: listOfValidMarks
                })
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        res.render('error')
    }
})

app.post('/demanderecorrection', (req, res) => {
    const id = req.body.notemoduleid;

    Note.findById(id)
        .then(result => {
            res.render('demandes', {
                validmodule: result,
                person: ourClient,
                recorrection: true
            })
        })
        .catch(err => {
            console.log(err)
        })
})


app.post('/demandevoircopie', (req, res) => {
    const id = req.body.notemoduleid;

    Note.findById(id)
        .then(result => {
            res.render('demandes', {
                validmodule: result,
                person: ourClient,
                recorrection: false
            })
        })
        .catch(err => {
            console.log(err)
        })
})

app.get('/demandes', (req, res) => {
    if (ourClient.role == "etudiant") {
        res.render('demandes', {
            validmodule: [],
            person: ourClient,
            recorrection: true
        })
    } else {
        res.render('error')
    }
})

app.post('/pdfdemande', (req, res, next) => {


    // Sauvegarder la demande
    const demande = new Demande(
        {
            type: req.body.type,
            etudiant: req.body.etudiant,
            professeur: req.body.professeur,
            module: req.body.module,
            message: req.body.message,
            etat: "en attente"
        }
    );
    demande.save()
        .then(result => {
            // alert("Demande envoyée avec succée!");
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfService.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                demande
            );
        })
        .catch(err => {
            console.log(err)
        })
});

app.get('/suivredemande', (req, res) => {
    if (ourClient.role == "etudiant") {
        let listOfDemandes = []
        Demande.find()
            .then(result => {
                result.forEach(demande => {
                    if (demande.etudiant == (ourClient.prenom + " " + ourClient.nom)) {
                        listOfDemandes.push(demande);
                    }
                });
                res.render('suivredemande', {
                    demandes: listOfDemandes
                })
            })
            .catch(err => {
                console.log(err);
            })
    } else {
        res.render('error')
    }
})

app.post('/deletedemande', (req, res) => {
    const id = req.body.demandeid;
    Demande.findByIdAndDelete(id)
        .then(() => {
            Demande.find()
                .then((result) => {
                    res.redirect('suivredemande');
                })
        })
        .catch(err => {
            console.log(err);
        })
})

app.get('/listedemandes', (req, res) => {
    if (ourClient.role == "professeur") {
        let listedesdemandes = [];
        Demande.find()
            .then(result => {
                result.forEach(demande => {
                    if (demande.professeur == (ourClient.prenom + " " + ourClient.nom)) {
                        listedesdemandes.push(demande);
                    }
                });
                res.render('listedemandes', {
                    demandes: listedesdemandes
                })
            })
            .catch(err => {
                console.log(err)
            })

    } else {
        res.render('error')
    }
})

app.post('/downloaddemande', (req, res) => {
    const id = req.body.demandeid;
    Demande.findById(id)
        .then(result => {
            // Generate a PDF
            const stream = res.writeHead(200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment;filename=invoice.pdf`,
            });
            pdfService.buildPDF(
                (chunk) => stream.write(chunk),
                () => stream.end(),
                result
            );
        })
})

app.post('/professeurdecision', (req, res) => {
    const id = req.body.demandeid;
    console.log(id)
    Demande.findByIdAndUpdate(id, {etat: req.body.decision},
        function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated demande : ", docs);
            }
        });
    res.redirect('listedemandes')
})

app.get('/dash', async (req, res) => {
    if (ourClient.role == "Cordinateur") {
        await Student.find()
            .then(result => {
                studentsNumber = result.length;
            })
            .catch(err => {
                console.log(err);
            })

        await Prof.find()
            .then(result => {
                profsNumber = result.length;
            })
            .catch(err => {
                console.log(err);
            })
        await Note.find()
            .then(result => {
                result.forEach(point => {
                    global.listdesnOtes = result;
                });
            })

        res.render('dash', {
            studentsNumber: studentsNumber,
            profsNumber: profsNumber,
            notes: listdesnOtes
        })
    } else {
        res.render('error')
    }
})
app.get('*', (req, res) => {
    res.redirect('error')
})
