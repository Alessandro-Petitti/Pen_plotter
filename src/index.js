

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
//definizione delle variabili 
let ww=0,wh=0;
let button, input, valore_utente, pagina,titolo;

//let img= documet.createElement("img");

function inizializza_prima_pagina(){ //crea gli elementi della prima pagina e li mostra

  button.show();
  input.show();
  //input = createInput('Un cane che guida una astronave');
  //input.position(0,0)
 // button = createButton('Genera immagine');
 // button.position(input.x + input.width, 65);
 // button.mousePressed(verifica_risposta());
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
  pagina.output_img=1;
}


function setup() {
  //inizializza le variabili di openai
  
  pagina = new pagine();
  console.log(pagina.input_prompt);
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
  //setup per la prima pagina: input_box, bottone di invio, titolo "inserisci il tuo propmt"
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
    
    //controllo che l'invio sia stato premuto, nascondere i bottoni e far partire la II pagina

    //in qualche momento, quando ha finito input_prompt = 0 => si fa in verifica_risposta
  }


}


function posizionamento_elementi_schermo(){ 
  if (pagina.inizializzazione==0){
    createCanvas(windowWidth,windowHeight);
    textFont("Arial");
    


    //inserisci qui il cra input e crea button
    input = createInput('Un cane che guida una astronave');
    input.position(50,50);


    button = createButton('Genera immagine');

    button.position(input.x + input.width, 50);

    button.mousePressed(verifica_risposta);
    
    input.hide();
    
    button.hide();
    
    console.log("siamo dentro posiziona elementi");
   
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
    button.position(input.x + input.width, 65);
    input.position(0,0);
    }
}

/*const server = app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
*/
window.setup = setup;
window.draw = draw;