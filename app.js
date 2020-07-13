//REQUIRES
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const upload2 = multer({ dest: 'public/uploads/' });

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');
const fileUpload = require('express-fileupload')

const bodyParser = require('body-parser');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

//LAS CLAVES PARA IBM
const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: '__r3oIDnHkJ1PlQXpohytPIZAUfHhOVCRch07PitwsSw',
    }),
    url: 'https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/07f6b287-17d9-44a6-ba54-509083ec48f2',
});

//INICIAR EXPRESS
//const app = express();





//IBM CREDENTIAL
var visualRecognition = new VisualRecognitionV3({
    version: '2019-05-29',
    iam_apikey: 'S1AKLlXJfxam-kvzqgUosSMFu4PzGerUNqdvI8CmpVDH'
});

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

//CHECK FILE TYPE
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Solo Imagenes!');
    }
}
// INIT APP
const app = express();

// EJS
app.set('view engine', 'ejs');




// Public Folder
app.use(express.static('./public'));

//RENDERIZAMOS LA PÁGINA
app.get('/', (req, res) => res.render('index'));

var x;
var palabra = '';

app.post('/limpiar', upload2.single('myImage'), (req, res) => {
    /*upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            res.render('index', {});
        }
    });*/
    palabra = '';
});

//CUANDO SE HAGA UNA PETICÓN A UPLOAD
app.post('/upload', (req, res) => {
    var band = true;
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: Ningun Archivo Seleccionado!'
                });
            } else {
                var images_file = fs.createReadStream(`./public/uploads/${req.file.filename}`);

                var classifier_ids = ["Abecedario_1871629669"];

                var params = {
                    images_file: images_file,
                    classifier_ids: classifier_ids,
                    owners: 'IBM,me'
                };

                visualRecognition.classify(params, function(err, response) {

                    if (err)
                        console.log(err);
                    else {
                        var band = true;
                        x = response;
                        var whatClass = JSON.stringify(x.images[0].classifiers[0].classes[0].class, null, 2);
                        var score = JSON.stringify(x.images[0].classifiers[0].classes[0].score, null, 2);
                        var type_hierarchy = JSON.stringify(x.images[0].classifiers[0].classes[0].type_hierarchy, null, 2);

                        if (band) {
                            palabra += whatClass.charAt(1);
                            band = false;
                        }
                        console.log(palabra);

                    }
                    // res.json({ username: 'Flavio' })

                    res.json({
                        msg: 'Archivo subido Correctamente!',
                        file: `uploads/${req.file.filename}`,
                        clas: whatClass,
                        sc: score,
                        th: type_hierarchy,
                        resultado: `La palabra es: ${palabra}`,
                        letra: palabra
                    });

                    /* res.render('index', {
                         msg: 'Archivo subido Correctamente!',
                         file: `uploads/${req.file.filename}`,
                         clas: whatClass,
                         sc: score,
                         th: type_hierarchy,
                         resultado: `La palabra es: ${palabra}`
                     });*/
                });
            }
        }
    });

});



//codigo de voz-------------

//USAR MODULO BODYPARSE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '1mb' }));

//AGINAR LA ENGINE CON LA QUE TRABAJARA
//app.set('view engine', 'ejs');

//app.use(express.static('./public'));
//CUANDO CARGUE LA PAGINA MOSTARR INDEX
/*app.get('/', (req, res) => {
    res.render('index');
});*/

//CUANDO OPRIMAN EL BOTON HACER UNA PETICIÓN
app.post('/voz', (req, res) => {


    const nombre = req.body.t;
    console.log(nombre);
    const fecha = new Date();
    const hora_actual = fecha.getMilliseconds();

    const hola = {
        text: nombre,
        voice: 'es-LA_SofiaVoice', // Optional voice
        accept: 'audio/wav'
    }

    textToSpeech
        .synthesize(hola)
        .then(response => {
            const audio = response.result;
            return textToSpeech.repairWavHeaderStream(audio);
        })
        .then(repairedFile => {

            fs.writeFileSync(`./public/music/audio${hora_actual,nombre[0]}.wav`, repairedFile);
            console.log('audio.wav se creo correctamente');

            //res.render('index', { file: `music/audio${hora_actual,nombre[0]}.wav`, });

            res.json({
                file: `music/audio${hora_actual,nombre[0]}.wav`
            });

        })
        .catch(err => {
            console.log(err);
        });

});

//EL PUERTO EN EL QUE SERÁ ESCUCHADO
const port = 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));