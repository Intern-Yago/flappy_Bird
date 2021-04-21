const hit = new Audio()
hit.src='./efeitos/efeitos_hit.wav'
const pulou = new Audio()
pulou.src='./efeitos/efeitos_pulo.wav'

const sprites = new Image()
sprites.src = "./sprites.png"

const canvas = document.querySelector('canvas')
const contexto = canvas.getContext('2d')

function colisao(personagem1, personagem2){
    const p1Y = personagem1.y + personagem1.H
    const p2Y = personagem2.y

    if(p1Y >= p2Y){
        return true
    }
    else{
        return false
    }
}
function criarFlappy() {
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
        if(colisao(flappy, chao)){
            hit.play()
            setTimeout(()=>{
                mudaTela(telas.start)
            }, 400)
             return
        }
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
        pulou.play()
        flappy.vel = -flappy.pulo
    }
}
return flappy
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

function criaCanos() {
    const canos = {
        W:52,
        H:400,
        chao:{
            sx:0,
            sy:169,
        },
        ceu: {
            sx: 52,
            sy: 169,
        },
        espaco: 80,
        desenha(){
            canos.pares.forEach(function(par){
                const yRandom = par.y
                const espacamento = 90;

                const canoCeuX = par.x
                const canoCeuY = yRandom
                
                contexto.drawImage(
                    sprites,
                    canos.ceu.sx, canos.ceu.sy,
                    canos.W, canos.H,
                    canoCeuX, canoCeuY,
                    canos.W, canos.H,
                )

                const canoChaoX = par.x
                const canoChaoY = canos.H + espacamento + yRandom
                contexto.drawImage(
                    sprites,
                    canos.chao.sx, canos.chao.sy,
                    canos.W, canos.H,
                    canoChaoX, canoChaoY,
                    canos.W, canos.H,
                )
            })
        },
        colisao(par){

            if(globais.flappy.x >= par.x){
                console.log('Flappy está nos canos')
                
                //Console.log(globais.flappy.y, par.y, canos.canoChao)

            }
            
            return true

            return false
        },
        pares: [],
        atualiza(){
            const passouCemFrames = frames % 100 === 0
            if(passouCemFrames){
                canos.pares.push({
                    x: canvas.width,
                    y: -350
                    //y:-150 * (Math.random() + 1),
                })   
            }
            canos.pares.forEach(function(par){
                par.x = par.x - 2
                if(canos.colisao(par)){
                    console.log('Perdeu')
                }
                if(par.x + canos.H <= 0){
                    canos.pares.shift()
                }
            }) 
    }
            
    }
    return canos
}

const globais = {}
let telAtiva={}
function mudaTela(novaTela){
    telAtiva = novaTela
    if(telAtiva.inicializa){
        telAtiva.inicializa()
    }
}

const telas = {
    //COMEÇO DO JOGO
    start: {
        inicializa(){
            globais.flappy = criarFlappy()
        },
        desenhar(){
            back.desenhar()
            back.desenhar(back.W, fundo=false)
            chao.desenhar()
            chao.desenhar(chao.W)
            globais.flappy.desenhar()
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
            globais.flappy.desenhar()
        },
        click(){
            globais.flappy.pula()
        },
        atualiza(){
            globais.flappy.atualiza()
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
