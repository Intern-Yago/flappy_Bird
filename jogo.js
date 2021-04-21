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

const chao = {
    sx: 0,
    sy: 610,
    W: 224,
    H: 112,
    dx: 0,
    dy: canvas.height - 112,
    desenhar(incremento=0){
        contexto.drawImage(
            sprites,
            chao.sx, chao.sy,
            chao.W, chao.H,
            chao.dx + incremento, chao.dy,
            chao.W, chao.H,
        )
    }
}

