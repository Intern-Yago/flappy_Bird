const sprites = new Image()
sprites.src = "./sprites.png"

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

const flappy = {
    sx: 0,
    yx: 0,
    W: 33,
    H: 24,
    x: 10, 
    y: 50,
    vel: 0,
    g: 0.25,
    pulo:4.6,
    atualiza(){
        flappy.vel = flappy.vel + flappy.g
        flappy.y = flappy.y + flappy.vel
    },
    desenhar(){
        contexto.drawImage(
            sprites,
            flappy.sx, flappy.yx,
            flappy.W, flappy.H,
            flappy.x, flappy.y,
            flappy.W, flappy.H,
        )   
    },
    pula(){ 
        flappy.vel = -flappy.pulo
    }
}


const chao = {
    sx: 0,
    sy: 610,
    W: 224,
    H: 112,
    x: 0,
    y: canvas.height - 112,
    desenhar(incremento=0){
        contexto.drawImage(
            sprites,
            chao.sx, chao.sy,
            chao.W, chao.H,
            chao.x + incremento, chao.y,
            chao.W, chao.H,
        )
    }
}

const back = {
    sx:390,
    sy:0,
    W:275,
    H:204,
    x:0,
    y:canvas.height - 204,
    desenhar(incremento=0, fundo=true){
        if (fundo == true){
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height)
        }
        contexto.drawImage(
            sprites,
            back.sx, back.sy,
            back.W, back.H,
            back.x + incremento, back.y,
            back.W, back.H,
        )
    }
}

const inicio = {
    sx:134,
    sy:0,
    W:174,
    H:152,
    x:(canvas.width/2) - 174/2,
    y:50,
    desenhar(){
        contexto.drawImage(
            sprites,
            inicio.sx, inicio.sy,
            inicio.W, inicio.H,
            inicio.x, inicio.y,
            inicio.W, inicio.H,
        )
    }
}

let telAtiva={}
function mudaTela(novaTela){
    telAtiva = novaTela
}

const telas = {
    //COMEÇO DO JOGO
    start: {
        desenhar(){
             back.desenhar()
            back.desenhar(back.W, fundo=false)
            chao.desenhar()
            chao.desenhar(chao.W)
            flappy.desenhar()
            inicio.desenhar()
           
        },
        click(){
            mudaTela(telas.jogo)
        },
        atualiza(){
        }
    },

    //DURANTE O JOGO
    jogo: {
        desenhar(){
            back.desenhar()
            back.desenhar(back.W, fundo=false)
            chao.desenhar()
            chao.desenhar(chao.W)
            flappy.desenhar()
        },
        click(){
            flappy.pula()
        },
        atualiza(){
            flappy.atualiza()
        }
    },

    //FIM DO JOGO
    fim: {

    }
}

function loop(){

    telAtiva.desenhar()
    telAtiva.atualiza()
    
    requestAnimationFrame(loop)
}

function comando(){
    if(telAtiva.click){
        telAtiva.click()
    }
}

canvas.addEventListener('click', comando)
function verificar(e){
    if(e.code == 'Space'){
        comando()
    }
}

mudaTela(telas.start)
loop()
