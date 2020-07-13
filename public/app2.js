//Formulario
const formularionuevo = document.querySelector('#formularionuevo');

const iv = document.querySelector('#iv');

const myImage = document.querySelector('#myImage');

const formularioVoz = document.querySelector('#formularioVoz');
const elementoVideo = document.querySelector('#audio');

const formularioLimpiar = document.querySelector('#formularioLimpiar');

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


formularioLimpiar.addEventListener('submit', (event) => {
    event.preventDefault();
    //const formData = new FormData(event.currentTarget);
    //renderImage(formData);
    //let data;
    fetch('/limpiar', {
        method: 'POST'
    })
    iv.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAI3SURBVGhD7Zc/SFVRAIdfFCFhUIOhDjaICE1FSP7JzcFFcAlpc3BxMhojgiAQKgRBBBEXERIhaHIw2pSWJhF0aXBys5ISLLG+39UTV++53nt91+e5j/PBh+/cp97z8e45796Sx+NJ5GYVeA1Lf6vASfw/2C6gvzASUkSG0Ye4hA9xDadDavDG4ctEnAy5h59wHzWfTRzBSxiHcyHtuIuaxx/8cfRaTmAczoWsoeYwg7WoT6EPTVwn2nAqpBV1/i28qgMhRlHvjQWjKE6FdKHOvxKMjjOIem82GEU5U0gbPjh8mSv1eIA/sVEHQrxDze15MIqSOUQR33EdtT3mzQfUHLRW+vEhanI6pnXShDYyhZgI83tvMG/q0Cz4sHs4gHGkDglHLOJv1D7fgXmjh6OnqO+SzziFd/A0UoWEI+bwMr48Gp/XJZaVxBBbhND2uIo6/lYHQmjvb8FbwagynBoSF2G4i+YSe4KvUZfDN9TfbGADVoLYkKQIg7nETqotVD8rFWMNSRshdIkt4Xt8hr2onUd3rV9Q/0Pr6LxjrCFpI5I4GaP7pPsWr2O5WEPyiDCEY+L8iuVu49aQvCIMilnAjxb1SemcumV/gWc9rzUkz4gkruArNA9Ry3gbs2INuQi6UU+COr/W6GPMgjMhQpfgPJp56Ja9J6Xj6EyIQc8eO2jmk0WnQkQz6rvJtkHYNJuGcyFZcWqNlIMPcQ0f4hrVHfKogE5jJKTIBiG61S66Q+jxeKqfUukfSeftN1I2v2YAAAAASUVORK5CYII=')
    document.getElementById('mensajeSubida').innerHTML = '';
    //Agrega la clase de la letra
    document.getElementById('clas').innerHTML = '';
    //agrega el procentaje de la letra
    document.getElementById('sc').innerHTML = '';
    //Agregar la letra de resultado
    document.getElementById('resultado').innerHTML = '';
    document.getElementById('myImage').value = null;



});