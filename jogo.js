const sprites = new Image()
sprites.src = "./sprites.png"

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

const flappy = {
    sx: 0,
    yx: 0,
    W: 33,
    H: 24,
    dx: 10, 
    dy: 50,
    desenhar(){
        contexto.drawImage(
            sprites,
            flappy.sx, flappy.yx,
            flappy.W, flappy.H,
            flappy.dx, flappy.dy,
            flappy.W, flappy.H,
        )   
    }
}

