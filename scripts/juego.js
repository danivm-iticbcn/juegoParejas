//Constsantes
const MAX_PAREJAS = 20;
const parejasContainer = document.getElementById('parejas-container');
const puntosContainer = document.getElementById('puntos');

//Local storage
let nombre = localStorage.getItem('nombre');

//Array con las parejas
let letras = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H', 'I', 'I', 'J', 'J'];
//Ordenamos random
letras = letras.sort(() => Math.random() - 0.5);
//Elementos para logica
let letrasInsertadas = [];
let cartasLevantadasJugada = 0;
let primeraCarta = "";
let primeraCartaId = "";
let puntos = 0;

//Mostramos el nombre del jugador
document.getElementById('jugador').textContent = nombre;

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
    girarCarta(id, letra)
    if (cartasLevantadasJugada == 1){
        primeraCarta = letra;
        primeraCartaId = id;
    } else{
        if (letra == primeraCarta){
            parejaCorrecta(primeraCartaId, id);
        }else{
            puntos <= 3 ? puntos = 0 : puntos -= 3;
            ocultarCartas(primeraCartaId);
            ocultarCartas(id)
        }
    }
    actulizarDatos()
}

//FALTA HACER
function parejaCorrecta(primeraCartaId, id){
    let carta1 = document.getElementById(id)
    aceptarCarta(carta1);
    let carta2 = document.getElementById(primeraCartaId)
    aceptarCarta(carta2);
    cartasLevantadasJugada = 0;
    puntos += 10;
}

//Treiem la carta de la clase per que no sigui jugable
function aceptarCarta(carta){
    carta.classList.remove('pareja');
    carta.style.cssText = '';
    carta.className = 'parejaAcertada';
}

//FALTA HACER
function ocultarCartas(id){
    cartasLevantadasJugada = 0;
    let carta = document.getElementById(id);
    setTimeout(() => {
        carta.style.backgroundColor = 'aqua';
        carta.style.transform = 'rotateY(360deg)';
        carta.style.cssText = '';   //Reiniciamos los elementos style
        carta.style.color = 'transparent';
    }, 1000);

}

//Funcion para girar una carta
function girarCarta(id, letra){
    let carta = document.getElementById(id);
    carta.style.backgroundColor = 'grey';
    carta.style.color = 'black';
    carta.style.transform = 'rotateY(360deg)';
}

//Abrimos canal de broadcast
const canal = new BroadcastChannel('canal');
//Funcion para enviar datos al canal
function enviarPuntuacion(puntos) {
    canal.postMessage({ puntos });
}
//Funcion para actualizar datos
function actulizarDatos(){
    puntosContainer.textContent = puntos;
    enviarPuntuacion(puntos);
}


//Funcion para lanzar instruciones
document.getElementById('instruciones').addEventListener('click', function(){
    window.open('instruciones.html', 'Instruciones', 'width=400,height=500');
})