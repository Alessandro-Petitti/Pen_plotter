//node_modules/.bin/webpack
//npx serve

//--------------------------------------import & config----------------------------------------------------------------

import * as img2gcode from "../src/src_module";
import { Configuration, OpenAIApi } from "openai";

//global variable
let ww = 0, //window width
  wh = 0, //window height
  button, //generate image
  input, //input box for prompt
  valore_utente, //store the prompt
  pagina, //destined to create the .pagine class
  title,
  url_response, //save the b64 string (responde of the api)
  spinnerColor,
  canva,
  list, // list of instructions
  stringa_gcode, //stores the full formatted gcode
  istruzioni_mostrate = 0, //check if final istruction are shown
  verifica_chiamata = false, //check if Api call was made
  spinnerSize = 192,
  spinnerSpeed = 10;

//creates the state variable to change pages
class pagine {
  constructor() {
    this.inizializzazione = 0;
    this.input_prompt = 1;
    this.output_img = 0;
    this.pic_downloaded = 0;
    this.load_completo = 0;
    this.show_instruction = 0;
  }
}

//--------------------------------------initializing----------------------------------------------------------------

//initialize first page, check if page dimension changed, adapt if so
function posizionamento_elementi_schermo() {
  if (pagina.inizializzazione == 0) {
    canva = createCanvas(windowWidth, windowHeight);
    textFont("Arial");
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
    button.position(input.x + input.width + 50, input.y);
  }
}

//----------------------------------------loading page----------------------------------------------------------

function show_loading() {
  //calls (once) the api, to get the image
  if (verifica_chiamata == false) {
    API_call(1, valore_utente);
    verifica_chiamata = true;
  }
  //shows a spinngin wheel, until the operation aren't competed
  if (fine_caricamento) {
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
  }
}

//---------------------------- API call and related functions --------------------------------------------------

const configuration = new Configuration({
  apiKey: ""// insert here your api key
});
const openai = new OpenAIApi(configuration);
//call the api
async function API_call(number_image, User_prompt) {
  try {
    const response = await openai.createImage({
      prompt: User_prompt,
      n: number_image,
      size: "256x256",
      response_format: "b64_json",
    });
    console.log("chiamata fatta correttamente");
    url_response = response.data.data[0].b64_json;
    //downloads img
    downalod_img(url_response);
    //convert_image
    convert_img_to_gcode(url_response)
      .then((result) => {
        console.log("Img convertita correttamente: ");
        console.log(result);
        //salvo il file del gcode formattato
        stringa_gcode = result.data.gcode.join("\n");
        downloadGcodeFile(stringa_gcode, "def.gcode");
        pagina.show_instruction = 1;
      })
      .catch((error) => {
        console.error(error);
      });
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

//downloads the image from a b64json string
function downalod_img(url) {
  var a = document.createElement("a"); //Create <a>
  a.href = "data:image/png;base64," + url;
  let name_image = "Image.png";
  a.download = name_image;
  a.click(); //Downloaded file

  pagina.pic_downloaded = 1;
}

//converts image from a buffer to gcode
const convert_img_to_gcode = (image) =>
  new Promise((resolve, reject) => {
    //terzo modo per decodificare un b64json
    let buffer = Buffer.from(image, "base64");

    img2gcode
      .start({
        // It is mm
        toolDiameter: 1,
        sensitivity: 0.9, // intensity sensitivity
        // scaleAxes: 128, // default: image.height equal mm
        feedrate: { work: 1200, idle: 3000 }, // Only the corresponding line is added.
        deepStep: -1, // default: -1
        // invest: {x:true, y: false},
        laser: {
          commandPowerOn: "M04",
          commandPowerOff: "M05",
        },
        whiteZ: 0, // default: 0
        blackZ: -3,
        safeZ: 1,
        info: "emitter", // ["none" | "console" | "emitter"] default: "none"
        image: buffer,
      })
      .on("error", (data) => {
        resolve({
          success: false,
          error: data,
        });
      })
      .on("complete", (data) => {
        // console.log(data.config);
        // console.log(data.dirgcode);
        console.log("complete");
      })
      .then((data) => {
        resolve({
          success: true,
          data,
        });
      });
  });

function downloadGcodeFile(gcodeString, fileName) {
  var a = document.createElement("a");
  var blob = new Blob([gcodeString], { type: "text/plain" });
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
}

//---------------------------------------- Visual functions --------------------------------------------------------------

//shows elements of the landing page
function inizializza_prima_pagina() {
  button.show();
  input.show();
}

//stores the user's imput, hides the button and the input box
function verifica_risposta() {
  pagina.input_prompt = 0;
  valore_utente = input.value();
  input.hide();
  button.hide();
}

//shows the final's instructions list
function instruction() {
  if (istruzioni_mostrate == 0) {
    list = createElement("ol");
    list.child(createElement("li", "Open the terminal"));
    list.child(createElement("li", "Run 'CNC' to launch the sender"));
    list.child(
      createElement("li", "Chose the correct port and import the .gocde file")
    );
    list.position(50, 50);
    list.style("font-size", round(windowHeight / 16) + "px");
    list.center("horizontal");
    list.center("vertical");
    istruzioni_mostrate = 1;
  }
  //if window is resized
  if (!(windowWidth == ww) || !(windowHeight == wh)) {
    ww = windowWidth;
    wh = windowHeight;
    resizeCanvas(windowWidth, windowHeight);
    title.position(0, 0);
    title.style("font-size", round(windowHeight / 16) + "px");
    title.center("horizontal");
    list.position(50, 50); // Posiziona l'elenco nella pagina
    list.style("font-size", round(windowHeight / 16) + "px");
    list.center("horizontal");
    list.center("vertical");
  }
}
//---------------------------------- Exectution -----------------------------------------------------------------
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
    if (pagina.pic_downloaded == 1) {
      fine_caricamento = false; //elimnates the loading wheel
      if (pagina.show_instruction == 1) {
        instruction(); //show the instruction to continue
      }
    }
  } else {
    //creates the first page, wait until "generate" button is pressed
    inizializza_prima_pagina();
  }
}

window.setup = setup;
window.draw = draw;

//------------------------------------------ END! ---------------------------------------------------------------
