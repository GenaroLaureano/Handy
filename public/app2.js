//Formulario
const formularionuevo = document.querySelector('#formularionuevo');

const iv = document.querySelector('#iv');

const myImage = document.querySelector('#myImage');

const formularioVoz = document.querySelector('#formularioVoz');
const elementoVideo = document.getElementById('source');


function renderImage(formData) {
    const file = formData.get('myImage');
    const image = URL.createObjectURL(file);
    iv.setAttribute('src', image);
}

myImage.addEventListener('change', (event) => {
    event.preventDefault();
    const formData = new FormData(formularionuevo);
    renderImage(formData);
})

formularionuevo.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    renderImage(formData);
    //let data;
    fetch('/upload', {
        method: 'POST',
        body: formData,
    }).then((res) => {
        return res.json();
    }).then((data) => {
        cargar(data);
    });

});

function cargar(data) {
    //Agrega el mensaje de que el archivo a sio subido correctamente
    document.getElementById('mensajeSubida').innerHTML = data.msg;
    //Agrega la clase de la letra
    document.getElementById('clas').innerHTML = data.clas;
    //agrega el procentaje de la letra
    document.getElementById('sc').innerHTML = Number(data.sc) * 100;
    //Agregar la letra de resultado
    document.getElementById('resultado').innerHTML = data.letra;
}


function renderFrase(formData) {
    const frase = formData.get('chido');
    //const fraseFinal = URL.createObjectURL(frase);
    // console.log(frase);
}

formularioVoz.addEventListener('submit', (event) => {
    event.preventDefault();

    const t = document.getElementById('chido').value;
    //const formData = new FormData(formularioVoz);
    // renderFrase(formData);
    //console.log('data-----', formData);
    const data = { t };
    fetch('/voz', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            return res.json();
        }).then((data) => {
            console.log('avert');
            cargarVoz(data);
        });


});

function cargarVoz(data) {

    //var elemento = document.createElement('source').setAttribute('src', data.file);
    // var elemento = document.getElementById('source');
    // document.getElementById('audio').removeChild(elemento);
    /*
    document.getElementById('source').setAttribute('src', `"${data.file}"`);*/

    // document.getElementById('source2').innerHTML = data.file;
    //elementoVideo.setAttribute('src', data.file);
    console.log(elementoVideo);
    elementoVideo.setAttribute('src', data.file);
    console.log(elementoVideo);
}