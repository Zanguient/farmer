var express = require('express'),
    //routes = require('routes'),
    http = require('http');


var app = express();

var bodyParser = require('body-parser');
var _ = require('underscore');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);
//app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//app.use(methodOverride());
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/style', express.static(path.join(__dirname, '/views/style')));


//app.get('/', routes.index);


app.get('/api', function(request, response){
    response.send('HEY');
});



// Criando APIs de Produtores

//GET Score do Produtor

app.get('/produtores/:id_produtor/score', function(req, res){

    var response = {
        'produtor_nome': 'Rafael Oliveira',
        'produtor_cnpj': '09976298000144',
        'produtor_id': req.params.id_produtor,
        'projeto_id': req.params.id_projeto,
        'score': '45.2'
    };

    res.send(response);


});



// CRIANDO APIs DE PROJETOS

//POST CRIAR PROJETO

app.post('/projetos', function(req, res){
    
    var projeto = {
        'descricao': req.body.descricao,
        'cultura': req.body.cultura,
        'area': req.body.area,
        'tempo': req.body.tempo,
        'data_prevista': req.body.data_prevista,
        'investimento_previsto': req.body.investimento_previsto,
        'produto_unidade': req.body.produto_unidade,
        'unidade_peso': req.body.unidade_peso
    };


    res.send(projeto);
});

//GET SCORE DO PROJETO
app.get('/projetos/:id_projeto/analise_risco', function(req, res){

    var response = {
            'score': 15.5,
            'roi': 0.3333333333333333,
            'safra_previsao': 800,
            'colheita_data_prevista': "2019-04-20",
            'resultado_data_prevista': "2019-05-01",
            'preco_estimativa': 50
    };

    res.send(response);
});


//CALCULA O SCORE DO PROJETO
app.post('/projetos/:id_projeto/analise_risco', function(req, res){

    var projeto = {
        'descricao': 'Plantacao de Tomate Organico',
        'cultura': 'tomate',
        'area': 1,
        'local': 'BA',
        'area_unidade': 'ha',
        'tempo': 120,
        'data_prevista': '2018-09-09',
        'investimento_previsto': 30000,
        'produto_unidade': 'caixa',
        'unidade_peso': 20
    };

    var projeto_score = calculaScore(projeto);
    var projeto_roi = calculaRoi(projeto.cultura, projeto.local, projeto.data_prevista);

    var projeto_analise_risco = {
        'score': projeto_score,
        'roi': projeto_roi,
        'safra_previsao': getPrevisaoSafra(projeto.cultura),
        'colheita_data_prevista': getDataPrevistaColheita(projeto.cultura, projeto.data_prevista),
        'resultado_data_prevista': getDataPrevistaResultado(projeto.cultura),
        'preco_estimativa': getPrevisaoPreco(projeto.cultura, projeto.local, projeto.data_prevista)
    };

    res.json(projeto_analise_risco);

});

app.get('/projetos/:id_projeto', function(req, res){

    var acompanhamento;
    if(req.query.expands)
        acompanhamento = getAcompanhamento(req.params.id_projet);

    console.log(acompanhamento);
    
    var projeto = {
        'projeto_id': req.params.id_projeto,
        'descricao': 'Plantacao de Tomate Organico',
        'cultura': 'tomate',
        'cultura_tipo': 'organico',
        'area': 1,
        'area_unidade': 'ha',
        'local': 'BA',
        'plantio_prazo': 120,
        'plantio_data_prevista': '2018-09-09',
        'investimento_valor': 30000,
        'produto_unidade': 'caixa',
        'unidade_peso': 20,
        'produtor' :{
            'produtor_nome': 'Rafael Oliveira',
            'produtor_cnpj': '09976298000144',
            'produtor_id': req.params.id_produtor,
            'score': '45.2'
        },
        'analise_risco': {
            "score": 15.5,
            "roi": 0.3333333333333333,
            "safra_previsao": 800,
            "colheita_data_prevista": "2019-04-20",
            "resultado_data_prevista": "2019-05-01",
            "preco_estimativa": 50
        }
    };

    projeto.acompanhamento = acompanhamento;

    res.send(projeto);
});

app.get('/projetos', function(req, res){

    if(req.query.perfil)
        var perfil = req.query.perfil;
    

    var projetos = getProjetosByPerfil(perfil);

    res.send(projetos);
});

app.listen(3000, function(){ 
    console.log('servidor expresso escutando na porta' + app.get ('port')); 
});

function getProjetosByPerfil(perfil){

    var projetos = [
        {
            "projeto_id": "1",
            "descricao": "Plantacao de Tomate Organico",
            "cultura": "tomate",
            "area": 1,
            "area_unidade": "ha",
            "local": "BA",
            "plantio_prazo": 120,
            "plantio_data_prevista": "2018-09-09",
            "investimento_valor": 30000,
            "produto_unidade": "caixa",
            "unidade_peso": 20,
            "produtor": {
                "produtor_nome": "Rafael Oliveira",
                "produtor_cnpj": "09976298000144",
                "produtor_id": "10",
                "score": "45.2"
            },
            "analise_risco": {
                "score": 15.5,
                "roi": 0.3333333333333333,
                "safra_previsao": 800,
                "colheita_data_prevista": "2019-04-20",
                "resultado_data_prevista": "2019-05-01",
                "preco_estimativa": 50
            }
        },
        {
            "projeto_id": "2",
            "descricao": "Plantacao de Cebola",
            "cultura": "cebola",
            "area": 1,
            "area_unidade": "ha",
            "local": "PA",
            "plantio_prazo": 110,
            "plantio_data_prevista": "2018-09-09",
            "investimento_valor": 30000,
            "produto_unidade": "caixa",
            "unidade_peso": 20,
            "produtor": {
                "produtor_nome": "Rafael Oliveira",
                "produtor_cnpj": "09976298000144",
                "produtor_id": "10",
                "score": "85.2"
            },
            "analise_risco": {
                "score": 75.5,
                "roi": 0.4333333333333333,
                "safra_previsao": 800,
                "colheita_data_prevista": "2019-04-20",
                "resultado_data_prevista": "2019-05-01",
                "preco_estimativa": 50
            }
        }
    ];

    var scoresPerfil = getScoresPerfil(perfil);


    var projetosPorPerfil = _.filter(projetos, function(projeto){
        console.log(scoresPerfil);
        return projeto.analise_risco.score >= scoresPerfil.projeto_score_minimo && 
               projeto.analise_risco.roi >= scoresPerfil.roi_minimo &&
               projeto.produtor.score >= scoresPerfil.produtor_score_minimo;
    });

    return projetosPorPerfil;
}

function getScoresPerfil(perfil){
    
    var scores;

    console.log(perfil);

    if(perfil == 'conservador'){
        scores = {
            'projeto_score_minimo': 80,
            'roi_minimo': 0.33,
            'produtor_score_minimo': 80
        };
    }

    else if(perfil == 'moderado'){
        scores = {
            'projeto_score_minimo': 60,
            'roi_minimo': 0.35,
            'produtor_score_minimo': 60
        };
    }
    else{    
        scores = {
            'projeto_score_minimo': 40,
            'roi_minimo': 0.27,
            'produtor_score_minimo': 40
        };

    }

    return scores;
}


function calculaScore(projeto){


    var indiceSazonalidade = calculaIndiceSazonalidade(projeto.cultura, projeto.local, projeto.data_prevista);
    var roi = calculaRoi(projeto.cultura, projeto.local, projeto.data_prevista);
    var produtor_score = getScoreProdutor(projeto.id_produtor);

    return roi * indiceSazonalidade * produtor_score;
};

function calculaIndiceSazonalidade(cultura, local, data){

    //Calcula indice baseado na proximidade da data retornada no getIndiceSazonalidade
    if(getIndiceSazonalidade(cultura, local) == data)
        return 1;
};

function getIndiceSazonalidade(cultura, local){
    
    //GET banco de dados Regras de Sazonalidade
    if(cultura == 'tomate' && local == 'BA')
        return '2018-09-09';
        
};

function calculaRoi(cultura, local, data_prevista){


    var retornoInvestimento = getPrevisaoSafra(cultura) * getPrevisaoPreco(cultura, local, data_prevista);
    var custoProducao = getCustoProducao(cultura);

    var roi = (retornoInvestimento - custoProducao) / custoProducao;

    return roi;
};

function getPrevisaoSafra(cultura){
    
    //GET Banco de Dados Previsao de Safra por Cultura
    if(cultura == 'tomate')
        return 800;
    else
        return 0;
};

function getPrevisaoPreco(cultura, local, data_prevista){

    //GET Banco de Dados Previsao de Preco por Cultura para determinada data
    if(cultura == 'tomate' && getDataPrevistaColheita(cultura, data_prevista) == '2019-04-20')
        return 50;
    else
        return 1;
}

function getDataPrevistaColheita(cultura, data_prevista){

    //GET Tempo Plantio Cultura
    var tempo_plantio = 120;

    return '2019-04-20';

};

function getCustoProducao(cultura){
    if(cultura == 'tomate')
        return 30000;
};

function getScoreProdutor(idProdutor){
    
    return 46.5; 
}

function getDataPrevistaResultado(cultura){
    
    return '2019-05-01';
}

function getAcompanhamento(projeto_id){
    var acompanhamento = {
        'projeto_iniciado': true,
        'preparacao_solo': true,
        'adubacao': true,
        'capina_inicial': true,
        'plantio': true,
        'irrigacao_inicio': true,
        'status': [
            {
                'data': '2018-08-01',
                'conteudo': 'Primeira semente germinou'
            }
        ]
    };

    return acompanhamento;
}