//DOM
const infoPartida = document.getElementById('info-partida');
const infoNavegador = document.getElementById('info-navegador');
const infoUrl = document.getElementById('info-url');
const botonEmpezar = document.getElementById('comenzar');
const botonBorrar = document.getElementById('borrar');
const nombre = document.getElementById('entrada-nombre');

//BOM
const navegador = navigator.userAgent;
const url = location.origin;

//Elementos logica
let puntos = 0;
let enJuego = false;
let estadoPartida;

//Codigo al iniciar pagina
window.onload = function() {
    ponerValoresInicialesInfo();

    //Evitar refrescar pagina
    document.addEventListener('submit', function(event){
        event.preventDefault();
    })

    //Empezar partida
    botonEmpezar.addEventListener('click', empezarPartida);

    //Borrar partida
    botonBorrar.addEventListener('click', borrarPartida);


}


function ponerValoresInicialesInfo(){
    infoPartida.textContent = 'No hay ninguna partida en juego actualmente';
    infoNavegador.textContent = navegador;
    infoUrl.textContent = url;
}

function empezarPartida(){

    //Iniciamos juego
    if (empezarValido()){
        //Cambiamos estado
        actualizarPuntuaciónVista();
        //Cookie para guardar el nombre de jugador
        document.cookie = `name=${nombre.value}; expires=Thu, 14 Nov 2025 15:30:00 GMT;`;
        //Abrimos la nueva ventana
        window.open('juego.html', 'Juego de las parejas', 'width=800,height=800');
    } else{
        alert('Tienes que introducir un nombre');
    }
}

//Comprobacion de nombre
function empezarValido(){
    if(document.getElementById('entrada-nombre').value.length > 0){
        enJuego = true;
        estadoPartida = 'En juego';
        return true;
    }
    return false;
}

//Abrimos un canal compartido con el juego
const canal = new BroadcastChannel('canal');
//Funciona para recibir los datos del canal
canal.onmessage = (event) => {
    if (event.data && event.data.puntos) {
         puntos = event.data.puntos;
         actualizarPuntuaciónVista();
    }
};

//Funcion para actulizar los datos de la partida
function actualizarPuntuaciónVista(){
    infoPartida.textContent = `Jugador: ${nombre.value}, Puntos: ${puntos}, Estado partida ${estadoPartida}`;
}



function borrarPartida(){
    console.log('borrando')
}