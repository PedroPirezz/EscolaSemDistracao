const express = require('express') // aqui estamos importando o express 
const app = express(); // Iniciando o exepress


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.use(express.static('public'))
const connection = require('./database/database.js')
const Solicitacoes = require("./database/Solicitacoes.js")
const Registros = require("./database/Registros.js")
const Bloqueios = require("./database/Bloqueios.js")
const Cadastros = require("./database/Cadastros.js");
const Motivos = require("./database/Motivos.js");
const session = require("express-session")
const bcrypt = require('bcryptjs')
const { raw } = require('mysql2');
const { where, Op, INTEGER } = require('sequelize'); 





app.use(session({
    secret: 'fernando',//É uma string que representa a chave secreta usada para assinar os cookies de sessão. Essa chave é usada para criptografar e descriptografar os dados armazenados na sessão, garantindo que apenas o servidor possa ler e escrever os dados da sessão. A chave secreta deve ser uma sequência de caracteres difícil de ser adivinhada e deve ser mantida em sigilo.
    resave: false, //É um valor booleano que indica se a sessão deve ser salva no servidor mesmo que não tenha sido modificada durante a requisição. Quando resave é false, a sessão só será salva se os dados da sessão foram modificados. Isso ajuda a evitar gravações desnecessárias no servidor e melhora a eficiência.
    saveUninitialized: true,//É um valor booleano que indica se a sessão deve ser salva no servidor, mesmo que não tenha sido inicializada. Quando saveUninitialized é true, a sessão será salva mesmo se ainda não tiver sido modificada, garantindo que uma sessão vazia seja criada para cada cliente. Isso é útil para evitar a criação de cookies desnecessários em algumas situações, mas você pode definir como false para economizar recursos se não precisar de sessões vazias.
    cookie: {
        expires: false //  É um objeto que permite definir configurações específicas para o cookie da sessão. Neste exemplo, estamos usando cookie.expires: false para fazer com que o cookie expire quando o navegador for fechado. Quando o navegador é fechado, o cookie é excluído e, portanto, a sessão também é invalidada. Se não definirmos essa propriedade ou atribuirmos uma data/hora de expiração, o cookie será armazenado em uma sessão de navegador (que geralmente dura até o usuário fechar o navegador) e a sessão permanecerá ativa mesmo que o usuário navegue para outras páginas e volte ao site.
    }
}));

async function testartoken(req, res, next) {
    if (req.session.user) {
        let usuario = req.session.user.usuario
        let token = req.session.user.token

        let user = await Cadastros.findOne({
            where: { Email: usuario }
        })

        if (user != undefined) {

            if (user.Token == token) {
                console.log("DEU")
                next();
            } else { res.redirect("/logout") }

        } else { res.redirect("/logout") }

    } else

        res.redirect("/logout")
}

connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com SUCESSO Com o Banco de Dados")
    })
    .catch((msgErr) => {
        console.log("ERRO NA CONEXÃO COM O BANCO DE DADOS")
    })

app.get('/TesteCadastro', (req, res) => {
   let testecadastro = 1
    res.render('login', {testecadastro: testecadastro})
})
app.get('/Teste', (req, res) => {
  res.render('noti')
 })
app.get('/', (req, res) => {
    let testecadastro = 0
    res.render('login', { testecadastro: testecadastro })
})
app.get('/Back', (req, res) => {
    res.redirect('/')
}) 

app.get('/Desbloquear/:idbloqueio', (req, res) => {
   let idbloqueio = req.params.idbloqueio

   Bloqueios.destroy({where:{id:idbloqueio}})
   res.redirect('/bl')  


}) 

app.post('/block', testartoken, (req, res) => {
    let dataAtual = new Date() 
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate() + 1).padStart(2, '0');
    const diacerto = String(dataAtual.getDate()).padStart(2, '0');
    let usuarioforblock = req.body.usuariosblock
    const numeroConcatenado = parseInt(ano.toString() + mes.toString() + dia.toString(), 10);
    let data = Number(numeroConcatenado)
    let data1 = (diacerto) + "/" + mes + "/" + ano
    
    
    
 

    Cadastros.findOne({raw:true, where:{id:usuarioforblock}}).then(Cadastro => {

    Bloqueios.findOne({where:{IdCadastro:Cadastro.id}}).then(bloqueados => {

        if(bloqueados){
            console.log("O usuario Já está bloqueado")
        }else{
        Bloqueios.create({Nome:Cadastro.Nome, IdCadastro:Cadastro.id, DataFim:data})
        Registros.create({IdCadastro:Cadastro.id,Matricula:Cadastro.Email, Nome:Cadastro.Nome, DataBloqueio:data1})

       
        }
        res.redirect('/bl') 
    
    })
    
 

})
})




app.get('/Solicitacao', testartoken, (req, res) => {

 
    Bloqueios.findAll({raw:true}).then(retornoBlock =>{
      
        var dataAtual = new Date()

        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        
        const numeroConcatenado = parseInt(ano.toString() + mes.toString() + dia.toString(), 10);
        let data = Number(numeroConcatenado)

        
        retornoBlock.forEach(retornoBlock => {
            if(data>=retornoBlock.DataFim){
                Bloqueios.destroy({where:{DataFim:data}})
            }
            
        });
       




    Cadastros.findAll({raw:true}).then(retornoBD => {console.log("Deu CERTO na query")


    
    let controle = 0
    let testeadm = 0
    let sessao = req.session.user.id
    if(sessao==1){ 
        testeadm=1 
    }
    Bloqueios.findOne({raw:true, where:{IdCadastro:sessao}}).then(estoubloqueado => {
        
    Motivos.findAll({raw:true}).then(motivos => {
    Solicitacoes.findAll({order:[['id', 'DESC']], where:{UserID:sessao}}).then(solicitacoes => {
    Solicitacoes.findAll({raw:true, where:{Status:'Aguardando ser Aprovado'}}).then(todasassolicitacoes =>{
    Solicitacoes.findAll({raw:true, where:{Status: 'Negado'}}).then(numblock => {
       
        let dependencias = {
            testeadm:testeadm,
            retornoBD:retornoBD,
            retornoBlock:retornoBlock,
            registros:solicitacoes,
            estoubloqueado:estoubloqueado,
            todasassolicitacoes:todasassolicitacoes,
            motivos:motivos,
            controle:controle,
            numblock:numblock


        }


    res.render('Solicitar', {dependencias:dependencias })})})})


}).catch(console.log("Deu RUIM na query"))})})})


})

app.post('/SalvarSolicitacao', testartoken, (req, res) => {
    let dataAtual = new Date() 
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    let nome = req.session.user.nome
    let idcadastro = req.session.user.id
    let motivo = req.body.motivo
    console.log(motivo)
    let outromotivo = req.body.outroMotivo
    let horainicio = req.body.horainicio
    let horatermino = req.body.horatermino
    let data = dia + "/" + mes + "/" + ano
    let statuss = "Aguardando ser Aprovado"
    

    if (nome == "" || idcadastro == "" || motivo == "" || horainicio == "" || horatermino == "") {
        
        res.redirect('Solicitacao')
    }



    Bloqueios.findOne({where:{IdCadastro:idcadastro}}).then(bloqueados =>{
    if(bloqueados){
        res.redirect('Solicitacao')
    }else{
        if(motivo=="Outro Motivo")
        {
        Solicitacoes.create({ Nome: nome, UserID: idcadastro, DataSolicitacao: data, Horainicio: horainicio, HoraTérmino: horatermino, Motivo: outromotivo, Status: statuss })
        }else{
        Solicitacoes.create({ Nome: nome, UserID: idcadastro, DataSolicitacao: data, Horainicio: horainicio, HoraTérmino: horatermino, Motivo: motivo, Status: statuss })
        }
        res.redirect('/Solicitacao')
    }
   
    
})
})



app.post('/login', (req, res) => {
    let email = req.body.email
    let senha = req.body.senha
    let mensagem = ''
    const salt = bcrypt.genSaltSync(10)


    if (email != "" && senha != "") {
        Cadastros.findOne({ where: { Email: email } }).then(cadastros => {
            if (cadastros != undefined) {

                let testelogin = bcrypt.compareSync(senha, cadastros.Senha)
                if (cadastros && testelogin == true) {
                    logado = cadastros.Nome

                    let token = bcrypt.hashSync(email, salt)
                
                    cadastros.update({ Token: token }).then(console.log("ATUALIZOU"))

                    req.session.user = {
                        usuario: cadastros.Email,
                        token: token,
                        nome: cadastros.Nome,
                        id: cadastros.id
                    }
                    res.redirect('/Solicitacao')
                }
                else{
                    mensagem = "Email ou Senha Incorretos"
                    res.redirect('/')
                }
            }
            else {
                mensagem = "Email ou Senha Incorretos"
                res.redirect('/')
            }

        })
    }

})

app.post    ('/novomotivo', (req, res) => {
    let nome = req.body.motivo

    Motivos.create({Nome:nome}).then(res.redirect('/Solicitacao'))
   
});

app.get('/bl', (req, res) => {

    
    Bloqueios.findAll({raw:true}).then(retornoBlock =>{
      
        var dataAtual = new Date()

        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        
        const numeroConcatenado = parseInt(ano.toString() + mes.toString() + dia.toString(), 10);
        let data = Number(numeroConcatenado)

        
        retornoBlock.forEach(retornoBlock => {
            if(data>=retornoBlock.DataFim){
                Bloqueios.destroy({where:{DataFim:data}})
            }
            
        });
       




    Cadastros.findAll({raw:true}).then(retornoBD => {console.log("Deu CERTO na query")


    
    let controle = 1
    let testeadm = 0
    let sessao = req.session.user.id
    if(sessao==1){ 
        testeadm=1 
    }
    Bloqueios.findOne({raw:true, where:{IdCadastro:sessao}}).then(estoubloqueado => {
        
    Motivos.findAll({raw:true}).then(motivos => {
    Solicitacoes.findAll({order:[['id', 'DESC']], where:{UserID:sessao}}).then(solicitacoes => {
    Solicitacoes.findAll({raw:true, where:{Status:'Aguardando ser Aprovado'}}).then(todasassolicitacoes =>{
        Solicitacoes.findAll({raw:true, where:{Status: 'Negado'}}).then(numblock => {   
        let dependencias = {
            testeadm:testeadm,
            retornoBD:retornoBD,
            retornoBlock:retornoBlock,
            registros:solicitacoes,
            estoubloqueado:estoubloqueado,
            todasassolicitacoes:todasassolicitacoes,
            motivos:motivos,
            controle:controle,
            numblock:numblock 


        }


    res.render('Solicitar', {dependencias:dependencias })})})


}).catch(console.log("Deu RUIM na query"))})})})})


 
   
});




   
app.get('/logout', (req, res) => {
    // Destruir a sessão (remove todos os dados da sessão)
    req.session.destroy
    req.session.user = {
        usuario: "",
        token: ""
    }
    res.redirect('/');
});

app.get('/aprovar/:id', (req, res) => {
    let idsolicitacao = req.params.id

    Solicitacoes.update({Status:"Aprovado"}, {where:{id:idsolicitacao}}).then(res.redirect('/Solicitacao'))
   
});

app.get('/aprovartodas', (req, res) => {
    

    Solicitacoes.update({Status:"Aprovado"}, {where:{Status:'Aguardando Aprovação'}}).then(res.redirect('/Solicitacao'))
   
});

app.get('/negar/:id', (req, res) => {
    let idsolicitacao = req.params.id

    Solicitacoes.update({Status:"Negado"}, {where:{id:idsolicitacao}}).then(res.redirect('/Solicitacao'))
   
});


app.post('/SalvarCadastro', (req, res) => {
    const salt = bcrypt.genSaltSync(10)
    let Email = req.body.email
    let Nome = req.body.nome
    let Senha = req.body.senha
    let ConfirmaSenha = req.body.confirmasenha

    if (Nome == "" || Email == "" || Senha == "" || ConfirmaSenha == "") {

    } else {
        testecadastro = 0
        if (Senha == ConfirmaSenha) {
            Cadastros.findOne({ raw: true, where: { Email: Email } }).then(existe => {


                if (existe == null) {
                    let hash = bcrypt.hashSync(Senha, salt)
                    let tokenhash = bcrypt.hashSync(Email, salt)
                    Cadastros.create({ Nome: Nome, Email: Email, Senha: hash, Token: tokenhash })
                    testelogin = 0
                    res.redirect('/')
                }
            }).catch(console.log("Usuario Existente"))
        }
    }


})





app.listen(80, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro!")
    } else {
        console.log("Servidor iniciado com sucesso")
    }
})


