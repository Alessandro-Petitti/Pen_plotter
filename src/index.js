import { Configuration, OpenAIApi } from "openai"; // importa openai
const configuration = new Configuration
  ({
   apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
//call the api
async function starter(number_image, User_prompt)
{
  try
  {
  const response = await openai.createImage({
    prompt: User_prompt,
    n: number_image,
    size:"256x256",
    response_format: url,
  });
  } catch(error){
    console.log("I got an error");
    console.log(error);
  }
  const url_response = [];
  for (let i = 0; i<number_image; i++)
  {
    url_response[i] = response.data[i].text;
  }
  console.log("gli url sono stati correttamente salvati");
}


class pagine{// crea le variabili di stato per le varie pagine da mostrare
  constructor(){ 
    this.inizializzazione= 0;
    this.input_prompt=1;
    this.loading = 0;
    this.output_img = 0;
  }
}
//definizione delle variabili globali per tutto il file 
let ww=0,wh=0;
let button, input, valore_utente, pagina,title;
let spinnerSize = 192;
let spinnerSpeed = 10;
let spinnerColor;
let timer = 5; // n di secondi per la ruota di caricamento

function inizializza_prima_pagina(){ 
  //mostra gli elementi della prima pagina
  button.show();
  input.show();
}

function verifica_risposta(){
  //nasconde l'imput box e cambia pagina 
  pagina.input_prompt= 0;
  valore_utente = input.value();
  pagina.loading = 1;
  input.hide();
  button.hide();
}

function show_loading(){
  //in questa funzione si genera una rotella di caricamento per dare tempo alle immagini di caricarsi
  pagina.loading= 0;
  let step = frameCount % (spinnerSpeed * 7.25);
      let angle = map(step, 0, spinnerSpeed * 7.25, 0, TWO_PI);
      push();
      translate(width / 2, height / 2);
      rotate(angle);
      noFill();
      stroke(spinnerColor);
      strokeWeight(spinnerSize / 10);
      strokeCap(SQUARE);
      arc(0, 0, spinnerSize - (spinnerSize / 20), spinnerSize - (spinnerSize / 20), 0, PI + HALF_PI, OPEN);
      pop();
      if(frameCount%60== 0 && timer >0){
        timer --;
      }
      if(timer ==0){
        pagina.output_img=1;
      }
  //pagina.output_img=1;
}


function setup() {
  //crea le pagine
  pagina = new pagine();
  //definisce il colore della loading spinner
  spinnerColor = color(33, 150, 243);
}


function draw() {
  background('rgba(217,220,229,255)');
  posizionamento_elementi_schermo();
  
  if (pagina.input_prompt == 0)
  {
    if (pagina.output_img == 0)
    {
      show_loading();
      
    }
    else 
    {//stampa a video le immagini, più immagini da un url fornito dall'api, in seguito si potrà scegliere quale delle 4/n usare.

      /*for (let i = 0; i<=number_image; i++)
      {
          img.src = url_response[i];
      }*/
    }
  }
  else
  {//pagina iniziale, con input e bottone
    inizializza_prima_pagina();
  }


}


function posizionamento_elementi_schermo(){ 
  if (pagina.inizializzazione==0){
    createCanvas(windowWidth,windowHeight);
    textFont("Arial");
    //inserisci qui il cra input e crea button
    input = createInput('Un cane che guida una astronave');
    input.position(0,0);
    button = createButton('Genera immagine');
    button.position(1000, 1000);
    button.mousePressed(verifica_risposta);
    input.hide();
    button.hide();
    title=createElement('h1','Pen plotter project');
    pagina.inizializzazione=1;
  }
  if(!(windowWidth==ww)||!(windowHeight==wh)){
    ww=windowWidth;
    wh=windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    title.position(0,0);
    title.style('font-size', round(windowHeight/16) + 'px');
    title.center('horizontal');
    input.position(875,600);
    input.style('paddig', 12+'px');
    button.position(input.x + input.width, input.y);
    }
}


window.setup = setup;
window.draw = draw;