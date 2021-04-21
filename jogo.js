let frames = 0 
//Add efeitos
const hit = new Audio()
hit.src='./efeitos/efeitos_hit.wav'
const pulou = new Audio()
pulou.src='./efeitos/efeitos_pulo.wav'

//select canvas
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

//FlappyBird
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
        if(colisao(flappy, globais.chao)){
            hit.play()
            setTimeout(()=>{
                mudaTela(telas.start)
            }, 400)
             return
        }
        //gravidade do flappy
        flappy.vel = flappy.vel + flappy.g
        flappy.y = flappy.y + flappy.vel
        
    },
    //Animação de bater asas{
    frameAtual: 0,
    atualizaFrame(){
        const intervalo = 10
        const passouTime = frames % intervalo === 0
        if(passouTime){
            const base = 1
            const incremento = base + flappy.frameAtual
            const baseRepete = flappy.movimentos.length
            flappy.frameAtual = incremento%baseRepete
        }
    },
    movimentos: [
        {sX: 0, sY:0},
        {sX: 0, sY:26},
        {sX: 0, sY:52},
    ],
    //}

    desenhar(){
        flappy.atualizaFrame()
        const {sX, sY} = flappy.movimentos[flappy.frameAtual]
        contexto.drawImage(
            sprites,
            sX, sY,
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

function criarChao(){
    const chao = {
        sx:  0,
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
        },

        //chão infinito
        atualizar(){
            const movDoChao = 1
            const pete = chao.H /2
            const movimentacao = chao.x - movDoChao
            chao.x = movimentacao % pete
        }
    }
    return chao
}

const back = {
    sx:390,
    sy:0,
    W:275,
    H:204,
    x:0,
    y:canvas.height - 204,
    //o parâmetro fundo foi usado para o fundo de uma imagem n sobrepor a outra
    //o incremento foi para não ter a repetição do drawImage (mesmo método usado para o chão)
    desenhar(incremento=0, fundo=true){
        if (fundo == true){
            // add fundo azul
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

//mensagem de início
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

function criaCanos(){
    const canos = {
        largura: 52,
        altura: 400,
        chao:{
            sX: 0,
            sY: 169,
        },
        ceu: {
            sX:52,
            sY:169,
        },
        espaco: 80,
        desenha(){
            canos.pares.forEach(function(par){
                const yRandom = par.y
                const espacamento = 90

                //Cano Céu
                const canoCeuX = par.x
                const canoCeuY = yRandom
                contexto.drawImage(
                    sprites,
                    canos.ceu.sX, canos.ceu.sY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura
                )
                //-------------------------------------
                //Cano Chão
                const canoChaoX=par.x
                const canoChaoY=canos.altura + espacamento + yRandom
                contexto.drawImage(
                    sprites,
                    canos.chao.sX, canos.chao.sY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                )
                //------------------------------------

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }

                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }   
            })
        },
        temColisao(par){
            const cabeca = globais.flappy.y
            const pe = globais.flappy.y + globais.flappy.H
            if(globais.flappy.x >= par.x){

                //Flappy passou pelo cano, atualiza placar
                globais.placar.atualiza()

                //Verifica se ouve colisão{
                if(cabeca <= par.canoCeu.y){
                    return true
                }
                if(pe >= par.canoChao.y){
                    return true
                }
                //}
            }

            return false
        },
        pares: [],
        atualiza(){
            const passou100frames = frames%100 === 0
            if(passou100frames){
                // adiciona canos após intervalo de frames
                canos.pares.push({ 
                        x: canvas.width,
                        y: -150 * (Math.random() + 1),
                })
            } 
            canos.pares.forEach(function(par){
                //movimentação dos canos
                par.x = par.x - 2

                //colidiu
                if(canos.temColisao(par)){
                    mudaTela(telas.start)
                }

                //elimina o primeiro cano
                if(par.x + canos.largura <=0 ){
                    canos.pares.shift()
                }
            })
        }
    }
    return canos
}

function criaPlacar(){
    const placar = {
        pontuacao: 0,
        atualiza(){
            //intervalo é a quantidade de frames que o Flappy fica dentro do cano
            const intervalo = 32
            const passouTime = frames % intervalo === 0
            if(passouTime){
                placar.pontuacao++
            }
        },
        desenhar(){
            //uso da fonte importada
            contexto.font = '35px "VT323"'
            contexto.textAlign='right'
            contexto.fillStyle = 'white'
            contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35)
        }
    }
    return placar
}

//definição das variáveis globais que foram/serão utilizadas
//para adicionar mais uma global apenas basta escrever globais.nome_da_variável = valor
const globais = {}

//mudança das telas
let telAtiva={}
function mudaTela(novaTela){
    telAtiva = novaTela
    if(telAtiva.inicializa){
        telAtiva.inicializa()
    }
}

//definição das telas
const telas = {
    //COMEÇO DO JOGO
    start: {
        inicializa(){
            globais.flappy = criarFlappy()
            globais.chao = criarChao()
            globais.canos = criaCanos()
        },
        desenhar(){
            back.desenhar()
            back.desenhar(back.W, fundo=false)
            globais.flappy.desenhar()
            globais.chao.desenhar()
            globais.chao.desenhar(globais.chao.W)
            inicio.desenhar()
           
        },
        click(){
            mudaTela(telas.jogo)
        },
        atualiza(){
            globais.chao.atualizar()
        }
    },

    //DURANTE O JOGO
    jogo: {
        inicializa(){
            globais.placar = criaPlacar()
        },
        desenhar(){
            back.desenhar()
            back.desenhar(back.W, fundo=false)
            globais.canos.desenha()
            globais.chao.desenhar()
            globais.chao.desenhar(globais.chao.W)
            globais.flappy.desenhar()
            globais.placar.desenhar()
        },
        click(){
            globais.flappy.pula()
        },
        atualiza(){
            globais.canos.atualiza()
            globais.chao.atualizar()
            globais.flappy.atualiza()
            //aqui não teve a atualização do placar, pois já é feito quando Flappy passa pelo cano
        }
    },

    //FIM DO JOGO
    fim: {
        desenha(){
            gameOver.desenha()
        },
        atualiza(){

        },
        click(){
            mudaTela(telas.start)
        }
    }
}

function loop(){

    telAtiva.desenhar()
    telAtiva.atualiza()

    //add de frames no jogo para atualizações
    frames++
    requestAnimationFrame(loop)
}

function comando(){
    if(telAtiva.click){
        telAtiva.click()
    }
}

//se houver um click no canvas ou aperto da tecla espaço executa o pulo do Flappy
canvas.addEventListener('click', comando)
function verificar(e){
    if(e.code == 'Space'){
        comando()
    }
}

mudaTela(telas.fim)
loop()
