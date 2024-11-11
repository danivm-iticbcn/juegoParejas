//Constsantes
const MAX_PAREJAS = 20;
const parejasContainer = document.getElementById('parejas-container');
const puntosContainer = document.getElementById('puntos');
const mejorPuntuacionContainer = document.getElementById('mayor-puntuacion');

//Conseguir el nombre a traves de la cookie
let nombre = document.cookie.split(';')[0];
nombre = nombre.split('=')[1];

//Array con las parejas
let letras = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I', 'J', 'J'];
//Ordenamos random
letras = letras.sort(() => Math.random() - 0.5);
//Elementos para logica
let letrasInsertadas = [];
let cartasLevantadasJugada = 0;
let primeraCarta = "";
let primeraCartaId = "";
let puntos = parseInt(localStorage.getItem('puntos'));
let parejasCorrectas = 0;
let enJuego = true;
let mejorPuntuacion = parseInt(localStorage.getItem('mejorPuntuacion'));

//Mostramos el nombre del jugador
document.getElementById('jugador').textContent = nombre;

if (mejorPuntuacion > 0){
    mejorPuntuacionContainer.textContent = `Jugador: ${nombre} - PUNTOS: ${mejorPuntuacion} puntos`;
}

//Creamos los divs de cada pareja
for (i=0; i<MAX_PAREJAS; i++){
    //Creamos y incorporamos div
    let pareja = document.createElement('div');
    pareja.className = 'pareja'; 
    letrasInsertadas.includes(letras[i]) ? pareja.id = `${letras[i]}2` : pareja.id = `${letras[i]}`;
    pareja.textContent = letras[i];
    //Insertamos letra
    letrasInsertadas.push(letras[i]);
    parejasContainer.append(pareja);
}

//Event listener parejas
function escucharParejas(){}
let parejas = document.querySelectorAll('.pareja');
parejas.forEach(function(element){
    element.addEventListener('click', function(){
        //Comprobacion para cuando cambiamos el  className
        if (this.className == 'pareja'){
            jugarPareja(this.id, this.textContent);
        }
    })
})

//Funcion que se lanza al clickar una pareja
function jugarPareja(id, letra){
    cartasLevantadasJugada++;
    mostrarCarta(id)
    if (cartasLevantadasJugada == 1){
        primeraCarta = letra;
        primeraCartaId = id;
    } else{
        bloquearActivarParejas('desactivar');
        if (letra == primeraCarta){
            setTimeout(() => {
                parejaCorrecta(primeraCartaId, id);
                actulizarDatos();
                bloquearActivarParejas('activar');
            }, 500);
        }else{
            puntos <= 3 ? puntos = 0 : puntos -= 3;
            ocultarCartas(primeraCartaId);
            ocultarCartas(id);
            actulizarDatos();
            bloquearActivarParejas('activar');
        }
        
    }
}

function bloquearActivarParejas(accion){
    if (accion == "desactivar"){
        parejas = document.querySelectorAll('.pareja')
        parejas.forEach((element) => {
            element.className = 'parejaFake';
        })
    } else{
        parejas = document.querySelectorAll('.parejaFake')
        parejas.forEach((element) => {
            element.className = 'pareja';
        })
    }
}

//Funcion para verificar que la pareja es correcta
function parejaCorrecta(primeraCartaId, id){
    let carta1 = document.getElementById(id)
    aceptarCarta(carta1);
    let carta2 = document.getElementById(primeraCartaId)
    aceptarCarta(carta2);
    cartasLevantadasJugada = 0;
    puntos += 10;
    parejasCorrectas++;
    if (parejasCorrectas == MAX_PAREJAS/2){
        lanzarGanar();
    }
}

//Treiem la carta de la clase per que no sigui jugable
function aceptarCarta(carta){
    carta.classList.remove('pareja');
    carta.style.cssText = '';
    carta.className = 'parejaAcertada';
}

//Funcion para ocultar las cartas cuando son incorrectasl
function ocultarCartas(id){
    cartasLevantadasJugada = 0;
    let carta = document.getElementById(id);
    setTimeout(() => {
        //Devolvemos la carta al tipo de carta inicial
        carta.classList.remove('parejaEnJuego');
        carta.style.transitionDuration = '0.5s';
        carta.style.transform = 'rotateY(360deg)';
        carta.style.cssText = '';
        carta.className = 'pareja';
    }, 1000);
}

//Funcion para mostrar una carta
function mostrarCarta(id){
    let carta = document.getElementById(id);
    carta.style.transform = 'rotateY(360deg)';
    carta.classList.remove('pareja');
    carta.className = 'parejaEnJuego';
}

//Abrimos canal de broadcast
const canal = new BroadcastChannel('canal');

//Funcion para actualizar datos
function actulizarDatos(){
    puntosContainer.textContent = 'Puntos: ' + puntos;
    canal.postMessage({ puntos }); //Enviamos los puntos por el canal
}


//Funcion para lanzar instruciones
document.getElementById('instruciones').addEventListener('click', function(){
    window.open('instruciones.html', 'Instruciones', 'width=400,height=500');
})


function lanzarGanar(){
    comprobarMejorPuntuacion();
    enJuego = false;
    canal.postMessage({ enJuego, mejorPuntuacion });
    window.location.assign('../final.html');
}

function comprobarMejorPuntuacion(){
    if (puntos > mejorPuntuacion){
        mejorPuntuacion =puntos;
    }
}