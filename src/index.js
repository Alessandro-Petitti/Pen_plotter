//node_modules/.bin/webpack
//npx serve

//definizione delle variabili globali per tutto il file
let ww = 0,
    wh = 0;
let button,
  input,
  valore_utente,
  pagina,
  title,
  pic,
  url_response; // aggiungi le variabili che dice che non sono definite: url_response and response
let verifica_chiamata = false; //serve per verificare che la chiamata sia stata fatta all'api
let spinnerSize = 192;
let spinnerSpeed = 10;
let spinnerColor;

// crea le variabili di stato per le varie pagine da mostrare
class pagine {
  constructor() {
    this.inizializzazione = 0;
    this.input_prompt = 1;
    this.loading = 0;
    this.output_img = 0;
    this.immagine_stampata = 0;
    this.load_completo = 0;
  }
}
//inizializza tutti gli elementi e controlla anche che la grandezza della pagina non sia stata modificata
function posizionamento_elementi_schermo() {
  if (pagina.inizializzazione == 0) {
    createCanvas(windowWidth, windowHeight);
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
      pic.center();
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
  pagina.loading = 0;
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
    //frameCount%60== 0 && timer >0){
    pagina.output_img = 1;
  }
}

import { Configuration, OpenAIApi } from "openai"; // importa openai
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
//call the api
async function starter(number_image, User_prompt) {
  try {
    const response = await openai.createImage({
      prompt: User_prompt,
      n: number_image,
      size: "256x256",
      response_format: "url",
    });
    console.log("chiamata fatta correttamente");
    url_response = response.data.data[0].url;
    console.log("url salvato");
    console.log(url_response);
    pagina.load_completo = 1;
  } catch (error) {
    console.log("I got an error");
    console.log(error);
  }
}

function create_gcode(input) {
  $.ajax({
    type: "POST",
    url: "image_to_gcode.py",
    data: { param: input },
   //success: callbackFunc,
  });
}

/*function callbackFunc(response) {
  // do something with the response
  console.log(response);
}*/

function inizializza_prima_pagina() {
  //mostra gli elementi della prima pagina
  button.show();
  input.show();
}

function verifica_risposta() {
  //nasconde l'imput box e cambia pagina
  pagina.input_prompt = 0;
  valore_utente = input.value();
  pagina.loading = 1;
  input.hide();
  button.hide();
}

function mostra_immagine(url) {
  pic = createImg(url, "immagine non caricata");
  image(pic);
  save(pic, 'myImage.png');
  //pic.save("photo", "png");
  pagina.immagine_stampata = 1;
}

function save_photo(photo){
  console.log("dentro la function");
  
 //save('pic.png');
  
}


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
    if (pagina.output_img == 0) {
      show_loading();
    } else if (pagina.immagine_stampata == 0) {
      if (pagina.load_completo == 1) {
        mostra_immagine(url_response);
        pic.center();
        save_photo(pic);
      }
    }
  } else {
    //pagina iniziale, con input e bottone
    inizializza_prima_pagina();
  }
}

window.setup = setup;
window.draw = draw;
