//node_modules/.bin/webpack
//npx serve

/*var img2gcode = require("img2gcode");
const path = require("path");
const ProgressBar = require("progress");
var bar = new ProgressBar("Analyze: [:bar] :percent :etas", {
  complete: "#",
  incomplete: ".",
  width: 60,
  total: 100
});
const immagine = "test.png";*/

//definizione delle variabili globali per tutto il file
let ww = 0,
    wh = 0;
let button,
  input,
  valore_utente,
  pagina,
  title,
  pic,
  launched = false,
  url_response; // aggiungi le variabili che dice che non sono definite: url_response and response
let verifica_chiamata = false; //serve per verificare che la chiamata sia stata fatta all'api
let spinnerSize = 192;
let spinnerSpeed = 10;
let spinnerColor;
let canva;

// crea le variabili di stato per le varie pagine da mostrare
class pagine {
  constructor() {
    this.inizializzazione = 0;
    this.input_prompt = 1;
    //this.loading = 0; in realtà non serve
    this.output_img = 0;
    this.immagine_stampata = 0;
    this.load_completo = 0;
  }
}
//inizializza tutti gli elementi e controlla anche che la grandezza della pagina non sia stata modificata
function posizionamento_elementi_schermo() {
  if (pagina.inizializzazione == 0) {
    canva = createCanvas(windowWidth, windowHeight);
    textFont("Arial");
    //inserisci qui il cra input e crea button
    input = createInput("panda outline from far away");
    input.position(0, 0);
    button = createButton("Genera immagine");
    button.position(1000, 1000);
    button.mousePressed(verifica_risposta);
    input.hide();
    button.hide();
    title = createElement("h1", "Pen plotter project");
    pagina.inizializzazione = 1;
  }
  if (!(windowWidth == ww) || !(windowHeight == wh)) {
    ww = windowWidth;
    wh = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    title.position(0, 0);
    title.style("font-size", round(windowHeight / 16) + "px");
    title.center("horizontal");
    input.center("horizontal");
    input.position(input.x, 320);
    // modificare qui la posizione, capire perché entra in questo if
    button.position(input.x + input.width + 50, input.y);
    if (pagina.immagine_stampata == 1) {
      //pic.show;
      //pic.center();
    }
  }
}

function show_loading() {
  //chiamata all'api:
  if (verifica_chiamata == false) {
    starter(1, valore_utente);
    verifica_chiamata = true;
  }
  //in questa funzione si genera una rotella di caricamento per dare tempo alle immagini di caricarsi
  let step = frameCount % (spinnerSpeed * 7.25);
  let angle = map(step, 0, spinnerSpeed * 7.25, 0, TWO_PI);
  push();
  translate(width / 2, height / 2);
  rotate(angle);
  noFill();
  stroke(spinnerColor);
  strokeWeight(spinnerSize / 10);
  strokeCap(SQUARE);
  arc(
    0,
    0,
    spinnerSize - spinnerSize / 20,
    spinnerSize - spinnerSize / 20,
    0,
    PI + HALF_PI,
    OPEN
  );
  pop();
  
  if (pagina.load_completo == 1) {
    pagina.output_img = 1;
  }
}

import { Configuration, OpenAIApi } from "openai"; // importa openai
const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);
//call the api
async function starter(number_image, User_prompt) {
  try {
    const response = await openai.createImage({
      prompt: User_prompt,
      n: number_image,
      size: "256x256",
      response_format: "b64_json",
    });
    console.log("chiamata fatta correttamente");
    url_response = response.data.data[0].b64_json;
    console.log("immagine salvata");

    //carica l'immagine da una stringa di b64json
    pagina.load_completo = 1;
  } catch (error) {
    //console.log(error);
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }  
  }
}



function inizializza_prima_pagina() {
  //mostra gli elementi della prima pagina
  button.show();
  input.show();
}

function verifica_risposta() {
  //nasconde l'input box e cambia pagina
  pagina.input_prompt = 0;
  valore_utente = input.value();
  //pagina.loading = 1; in realtà non serve
  input.hide();
  button.hide();
}

function mostra_immagine(url) {
var a = document.createElement("a"); //Create <a>
a.href = "data:image/png;base64," + url;
let name_image = "Image.png"; 
a.download = (name_image);
a.click(); //Downloaded file
pagina.immagine_stampata = 1;
}

/*
const options = {
  // It is mm
  toolDiameter: 1,
  sensitivity: 0.9, // intensity sensitivity
  // scaleAxes: 128, // default: image.height equal mm
  feedrate: { work: 1200, idle: 3000 }, // Only the corresponding line is added.
  deepStep: -1, // default: -1
  whiteZ: 0, // default: 0
  blackZ: -0.01,
  safeZ: 1,
  info: "emitter", // ["none" | "console" | "emitter"] default: "none"
  gcodeFile: 'fine.gcode',
  image: immagine
};

function imgToGCode(options) {
  return new Promise(function(resolve, reject) {
    img2gcode
    .start(options)
    .on("log", str => console.log(str))
    .on("tick", data => bar.update(data))
    .on("error", reject)
    .on("complete", data => {
      // console.log(data.config);
      // console.log(data.dirgcode);
      console.log("complete");
    })
    .then(data => {
      // console.log(data.config);
      console.log(data.dirgcode);
      console.log(data.gcode)
      resolve(data);
    });
});
}
console.time("img2gcode");
imgToGCode(options).then(() => {
  console.timeEnd("img2gcode");
});
*/


function setup() {
  //crea le pagine
  pagina = new pagine();
  //definisce il colore della loading spinner
  spinnerColor = color(33, 150, 243);
}

function draw() {
  background("rgba(217,220,229,255)");
  posizionamento_elementi_schermo();
  if (pagina.input_prompt == 0) {
    show_loading();
    if (!launched){
      aleale();
      

      /*console.time("img2gcode");
      imgToGCode(options).then(() => {
        console.timeEnd("img2gcode");
      });*/
    launched = true;
    }
      if (pagina.immagine_stampata == 0) 
      {
        if (pagina.load_completo == 1)
        {
          mostra_immagine(url_response);
        }
    }
  } else {
    //pagina iniziale, con input e bottone
    inizializza_prima_pagina();
  }
}


window.setup = setup;
window.draw = draw;
