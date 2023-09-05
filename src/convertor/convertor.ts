export interface resposta {
    success: boolean,
    data?: {
      gcode: Array<string>
    }
    error?: object
  }
  const img2gcode = require("@tutagomes/img2gcode");
  
export const convert = (image: string): Promise<resposta> => (new Promise((resolve, reject) => {
    let img = base64ImageToBuffer(image)
    img2gcode
        .start({
            // It is mm
            toolDiameter: 0.04,
            scaleAxes: 29,
            deepStep: -1,
            whiteZ: 0,
            blackZ: -2,
            safeZ: 2,
            laser: {
              commandPowerOn: 'Z0',
              commandPowerOff: 'Z-3'
            },
            invest: {
              y: false,
              x: false
            },
            // gcodeFile: 'output', // Name of gcode output file. Must be provided for Buffered Image.
            image: img // Or Buffer from base64 -> https://github.com/oliver-moran/jimp/issues/231
        })
        .on("error", (data: any) => {
          resolve({
            success: false,
            error: data
          })
        })
        .then((data: any) => {
          resolve({
            success: true,
            data
          })
        });
  }))

export const base64ImageToBuffer = (base64String: string): Buffer => {
  const base64clean = base64String.split(",")
  const bufferBase64 = Buffer.from(base64clean[1], 'base64')
  return bufferBase64
}