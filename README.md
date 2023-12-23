# Pen Plotter with DALL-E Integration

Welcome to the Pen Plotter GitHub repository! This project combines the power of the DALL-E API with a pen plotter to create unique and artistic drawings. The code contacts the DALL-E API to fetch an image, which is then converted into a G-code file and downloaded. To send the G-code to the pen plotter, CNCjs is used, providing a web-based and lightweight solution. The entire application is built using Node.js and provides a GUI for inserting prompts.

## Features

- **DALL-E Integration**: Connects to the DALL-E API to generate diverse and creative images.
- **G-code Conversion**: Converts the fetched image into G-code for the pen plotter.
- **CNCjs Integration**: Uses CNCjs as the G-code sender for controlling the pen plotter.
- **Node.js GUI**: Provides a GUI for inserting prompts and interacting with the application.

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/pen-plotter.git
   cd pen-plotter
  ```
2. Install dependencies:
  ```bash
   npm install
  ```

3. Run the application:
  ```bash
   npm start
  ```

4. Access the GUI in your web browser at **http://localhost:3000**.

## Usage

1. Insert a prompt into the GUI to generate an image from the DALL-E API.
2. Choose the desired image from the options provided.
3. Convert the selected image into G-code.
4. Download the G-code file.
5. Open CNCjs and load the downloaded G-code file.
6. Control and observe the pen plotter as it creates the artwork.

## Planned Upgrades
**More Image Options**: Provide additional image options and allow users to choose the best one.
**GUI Improvement**: Enhance the GUI for a better user experience.


Feel free to contribute, and happy plotting! 🖋️🎨
