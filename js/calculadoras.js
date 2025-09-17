/**
 * InvestMaster - Portal de Finanças e Investimentos
 * calculadoras.js - Calculadoras e simuladores financeiros
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar calculadoras se estiverem presentes na página
    initJurosCompostosCalculator();
    initSimuladorCarteira();
    initFinanciamentoImobiliario();
    initPlanejadorAposentadoria();
    
    // Inicializar gráficos se a biblioteca estiver disponível
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
});

/**
 * Calculadora de Juros Compostos
 */
function initJurosCompostosCalculator() {
    const calculator = document.getElementById('juros-compostos-calculator');
    if (!calculator) return;
    
    const form = calculator.querySelector('form');
    const resultDiv = calculator.querySelector('.calculator-result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const valorInicial = parseFloat(form.querySelector('#valor-inicial').value) || 0;
        const aporteMensal = parseFloat(form.querySelector('#aporte-mensal').value) || 0;
        const taxaJuros = parseFloat(form.querySelector('#taxa-juros').value) || 0;
        const periodo = parseInt(form.querySelector('#periodo').value) || 0;
        const periodoTipo = form.querySelector('#periodo-tipo').value;
        
        // Validar entradas
        if (taxaJuros <= 0 || periodo <= 0) {
            showCalculatorError(resultDiv, 'Por favor, insira valores válidos para todos os campos.');
            return;
        }
        
        // Calcular juros compostos
        const resultado = calcularJurosCompostos(valorInicial, aporteMensal, taxaJuros, periodo, periodoTipo);
        
        // Exibir resultado
        displayJurosCompostosResult(resultDiv, resultado);
        
        // Atualizar gráfico se disponível
        updateJurosCompostosChart(resultado);
    });
    
    // Inicializar com valores padrão
    if (form.querySelector('#valor-inicial').value) {
        form.dispatchEvent(new Event('submit'));
    }
}

/**
 * Calcular juros compostos
 */
function calcularJurosCompostos(valorInicial, aporteMensal, taxaJuros, periodo, periodoTipo) {
    // Converter taxa de juros para decimal mensal
    let taxaMensal = taxaJuros / 100;
    if (periodoTipo === 'anos') {
        taxaMensal = Math.pow(1 + taxaMensal, 1/12) - 1;
        periodo = periodo * 12;
    } else {
        // Se for mensal, já está correto
    }
    
    // Inicializar arrays para acompanhar a evolução
    const montanteArray = [];
    const jurosArray = [];
    const aportesArray = [];
    const labelsArray = [];
    
    let montanteTotal = valorInicial;
    let totalAportes = valorInicial;
    let totalJuros = 0;
    
    // Calcular evolução mês a mês
    for (let i = 1; i <= periodo; i++) {
        // Adicionar aporte mensal (exceto no primeiro mês se já tiver valor inicial)
        if (i > 1 || valorInicial === 0) {
            montanteTotal += aporteMensal;
            totalAportes += aporteMensal;
        }
        
        // Calcular juros do mês
        const jurosMes = montanteTotal * taxaMensal;
        montanteTotal += jurosMes;
        totalJuros += jurosMes;
        
        // Adicionar aos arrays
        montanteArray.push(montanteTotal);
        jurosArray.push(totalJuros);
        aportesArray.push(totalAportes);
        
        // Criar label para o mês/ano
        const dataAtual = new Date();
        dataAtual.setMonth(dataAtual.getMonth() + i);
        labelsArray.push(dataAtual.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
    }
    
    return {
        montanteFinal: montanteTotal,
        totalAportes: totalAportes,
        totalJuros: totalJuros,
        evolucao: {
            montante: montanteArray,
            juros: jurosArray,
            aportes: aportesArray,
            labels: labelsArray
        }
    };
}

/**
 * Exibir resultado da calculadora de juros compostos
 */
function displayJurosCompostosResult(resultDiv, resultado) {
    resultDiv.innerHTML = `
        <div class="result-summary">
            <div class="result-item">
                <h4>Montante Final</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.montanteFinal)}</p>
            </div>
            <div class="result-item">
                <h4>Total Investido</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.totalAportes)}</p>
            </div>
            <div class="result-item">
                <h4>Juros Acumulados</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.totalJuros)}</p>
            </div>
        </div>
        <div class="result-chart-container">
            <canvas id="juros-compostos-chart"></canvas>
        </div>
    `;
}

/**
 * Atualizar gráfico de juros compostos
 */
function updateJurosCompostosChart(resultado) {
    const ctx = document.getElementById('juros-compostos-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    // Destruir gráfico anterior se existir
    if (window.jurosCompostosChart) {
        window.jurosCompostosChart.destroy();
    }
    
    // Criar novo gráfico
    window.jurosCompostosChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: resultado.evolucao.labels,
            datasets: [
                {
                    label: 'Montante Total',
                    data: resultado.evolucao.montante,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: true
                },
                {
                    label: 'Total Investido',
                    data: resultado.evolucao.aportes,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return Utils.formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + Utils.formatCurrency(context.raw);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Simulador de Carteira de Investimentos
 */
function initSimuladorCarteira() {
    const simulator = document.getElementById('simulador-carteira');
    if (!simulator) return;
    
    const form = simulator.querySelector('form');
    const resultDiv = simulator.querySelector('.calculator-result');
    const assetList = simulator.querySelector('.asset-list');
    const addAssetBtn = simulator.querySelector('.add-asset-btn');
    
    // Array para armazenar ativos
    let assets = [];
    
    // Adicionar ativo
    addAssetBtn.addEventListener('click', function() {
        const assetTemplate = `
            <div class="asset-item">
                <div class="form-group">
                    <label>Nome do Ativo</label>
                    <input type="text" class="asset-name" placeholder="Ex: PETR4">
                </div>
                <div class="form-group">
                    <label>Tipo</label>
                    <select class="asset-type">
                        <option value="acao">Ação</option>
                        <option value="fii">FII</option>
                        <option value="renda-fixa">Renda Fixa</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Valor Investido (R$)</label>
                    <input type="number" class="asset-value" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Rentabilidade Anual Esperada (%)</label>
                    <input type="number" class="asset-return" min="0" step="0.01">
                </div>
                <button type="button" class="remove-asset-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        // Adicionar ao DOM
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = assetTemplate;
        assetList.appendChild(tempDiv.firstElementChild);
        
        // Adicionar evento para remover ativo
        const removeBtn = assetList.lastElementChild.querySelector('.remove-asset-btn');
        removeBtn.addEventListener('click', function() {
            this.closest('.asset-item').remove();
        });
    });
    
    // Simular carteira
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados dos ativos
        assets = [];
        const assetItems = assetList.querySelectorAll('.asset-item');
        
        assetItems.forEach(item => {
            const name = item.querySelector('.asset-name').value;
            const type = item.querySelector('.asset-type').value;
            const value = parseFloat(item.querySelector('.asset-value').value) || 0;
            const returnRate = parseFloat(item.querySelector('.asset-return').value) || 0;
            
            if (name && value > 0) {
                assets.push({
                    name,
                    type,
                    value,
                    returnRate
                });
            }
        });
        
        // Validar se há ativos
        if (assets.length === 0) {
            showCalculatorError(resultDiv, 'Adicione pelo menos um ativo à carteira.');
            return;
        }
        
        // Calcular resultados da carteira
        const resultado = calcularCarteira(assets);
        
        // Exibir resultado
        displayCarteiraResult(resultDiv, resultado);
        
        // Atualizar gráficos
        updateCarteiraPieChart(resultado);
        updateCarteiraReturnChart(resultado);
    });
    
    // Adicionar um ativo inicial
    addAssetBtn.click();
}

/**
 * Calcular resultados da carteira
 */
function calcularCarteira(assets) {
    // Calcular valor total da carteira
    const valorTotal = assets.reduce((total, asset) => total + asset.value, 0);
    
    // Calcular retorno médio ponderado
    let retornoMedioPonderado = 0;
    
    if (valorTotal > 0) {
        retornoMedioPonderado = assets.reduce((total, asset) => {
            return total + (asset.value / valorTotal) * asset.returnRate;
        }, 0);
    }
    
    // Calcular distribuição por tipo
    const distribuicaoTipo = {};
    assets.forEach(asset => {
        if (!distribuicaoTipo[asset.type]) {
            distribuicaoTipo[asset.type] = 0;
        }
        distribuicaoTipo[asset.type] += asset.value;
    });
    
    // Calcular projeção para 5 anos
    const projecao = [];
    let valorProjetado = valorTotal;
    
    for (let i = 1; i <= 5; i++) {
        valorProjetado *= (1 + retornoMedioPonderado / 100);
        projecao.push({
            ano: i,
            valor: valorProjetado
        });
    }
    
    return {
        valorTotal,
        retornoMedioPonderado,
        assets,
        distribuicaoTipo,
        projecao
    };
}

/**
 * Exibir resultado do simulador de carteira
 */
function displayCarteiraResult(resultDiv, resultado) {
    // Criar tabela de ativos
    let assetsTable = `
        <table class="assets-table">
            <thead>
                <tr>
                    <th>Ativo</th>
                    <th>Tipo</th>
                    <th>Valor (R$)</th>
                    <th>Retorno (%)</th>
                    <th>Peso (%)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    resultado.assets.forEach(asset => {
        const peso = (asset.value / resultado.valorTotal * 100).toFixed(2);
        const tipoFormatado = formatarTipoAtivo(asset.type);
        
        assetsTable += `
            <tr>
                <td>${asset.name}</td>
                <td>${tipoFormatado}</td>
                <td>${Utils.formatCurrency(asset.value)}</td>
                <td>${asset.returnRate.toFixed(2)}%</td>
                <td>${peso}%</td>
            </tr>
        `;
    });
    
    assetsTable += `
            </tbody>
        </table>
    `;
    
    // Criar HTML do resultado
    resultDiv.innerHTML = `
        <div class="result-summary">
            <div class="result-item">
                <h4>Valor Total da Carteira</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.valorTotal)}</p>
            </div>
            <div class="result-item">
                <h4>Retorno Médio Anual</h4>
                <p class="result-value">${resultado.retornoMedioPonderado.toFixed(2)}%</p>
            </div>
            <div class="result-item">
                <h4>Projeção em 5 anos</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.projecao[4].valor)}</p>
            </div>
        </div>
        
        <div class="result-charts">
            <div class="chart-container">
                <h4>Distribuição da Carteira</h4>
                <canvas id="carteira-pie-chart"></canvas>
            </div>
            <div class="chart-container">
                <h4>Projeção de Crescimento</h4>
                <canvas id="carteira-return-chart"></canvas>
            </div>
        </div>
        
        <div class="assets-details">
            <h4>Detalhamento dos Ativos</h4>
            ${assetsTable}
        </div>
    `;
}

/**
 * Atualizar gráfico de pizza da carteira
 */
function updateCarteiraPieChart(resultado) {
    const ctx = document.getElementById('carteira-pie-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    // Destruir gráfico anterior se existir
    if (window.carteiraPieChart) {
        window.carteiraPieChart.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = [];
    const data = [];
    const backgroundColor = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
    ];
    
    // Processar distribuição por tipo
    Object.entries(resultado.distribuicaoTipo).forEach(([tipo, valor], index) => {
        labels.push(formatarTipoAtivo(tipo));
        data.push(valor);
    });
    
    // Criar gráfico
    window.carteiraPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = (value / resultado.valorTotal * 100).toFixed(2);
                            return `${context.label}: ${Utils.formatCurrency(value)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Atualizar gráfico de retorno da carteira
 */
function updateCarteiraReturnChart(resultado) {
    const ctx = document.getElementById('carteira-return-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    // Destruir gráfico anterior se existir
    if (window.carteiraReturnChart) {
        window.carteiraReturnChart.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = ['Hoje'];
    const data = [resultado.valorTotal];
    
    resultado.projecao.forEach(item => {
        labels.push(`Ano ${item.ano}`);
        data.push(item.valor);
    });
    
    // Criar gráfico
    window.carteiraReturnChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor Projetado',
                data: data,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return Utils.formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Valor: ' + Utils.formatCurrency(context.raw);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Calculadora de Financiamento Imobiliário
 */
function initFinanciamentoImobiliario() {
    const calculator = document.getElementById('financiamento-imobiliario');
    if (!calculator) return;
    
    const form = calculator.querySelector('form');
    const resultDiv = calculator.querySelector('.calculator-result');
    
    // Slider para entrada
    const entradaSlider = form.querySelector('#entrada-slider');
    const entradaInput = form.querySelector('#entrada-valor');
    const entradaPercent = form.querySelector('#entrada-percent');
    
    if (entradaSlider && entradaInput && entradaPercent) {
        entradaSlider.addEventListener('input', function() {
            const valorImovel = parseFloat(form.querySelector('#valor-imovel').value) || 0;
            const percentual = parseFloat(this.value);
            const valorEntrada = valorImovel * (percentual / 100);
            
            entradaPercent.textContent = `${percentual}%`;
            entradaInput.value = valorEntrada.toFixed(2);
        });
        
        entradaInput.addEventListener('input', function() {
            const valorImovel = parseFloat(form.querySelector('#valor-imovel').value) || 0;
            if (valorImovel > 0) {
                const valorEntrada = parseFloat(this.value) || 0;
                const percentual = (valorEntrada / valorImovel * 100).toFixed(0);
                
                entradaSlider.value = percentual;
                entradaPercent.textContent = `${percentual}%`;
            }
        });
    }
    
    // Atualizar entrada quando valor do imóvel mudar
    const valorImovelInput = form.querySelector('#valor-imovel');
    if (valorImovelInput) {
        valorImovelInput.addEventListener('input', function() {
            if (entradaSlider && entradaInput) {
                const valorImovel = parseFloat(this.value) || 0;
                const percentual = parseFloat(entradaSlider.value);
                const valorEntrada = valorImovel * (percentual / 100);
                
                entradaInput.value = valorEntrada.toFixed(2);
            }
        });
    }
    
    // Calcular financiamento
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const valorImovel = parseFloat(form.querySelector('#valor-imovel').value) || 0;
        const valorEntrada = parseFloat(form.querySelector('#entrada-valor').value) || 0;
        const prazo = parseInt(form.querySelector('#prazo').value) || 0;
        const taxaJuros = parseFloat(form.querySelector('#taxa-juros-financiamento').value) || 0;
        const sistema = form.querySelector('#sistema').value;
        
        // Validar entradas
        if (valorImovel <= 0 || prazo <= 0 || taxaJuros <= 0) {
            showCalculatorError(resultDiv, 'Por favor, insira valores válidos para todos os campos.');
            return;
        }
        
        if (valorEntrada >= valorImovel) {
            showCalculatorError(resultDiv, 'O valor da entrada deve ser menor que o valor do imóvel.');
            return;
        }
        
        // Calcular financiamento
        const resultado = calcularFinanciamento(valorImovel, valorEntrada, prazo, taxaJuros, sistema);
        
        // Exibir resultado
        displayFinanciamentoResult(resultDiv, resultado);
        
        // Atualizar gráfico
        updateFinanciamentoChart(resultado);
    });
    
    // Inicializar com valores padrão
    if (valorImovelInput && valorImovelInput.value) {
        // Disparar evento para atualizar entrada
        valorImovelInput.dispatchEvent(new Event('input'));
        
        // Calcular com valores iniciais
        form.dispatchEvent(new Event('submit'));
    }
}

/**
 * Calcular financiamento imobiliário
 */
function calcularFinanciamento(valorImovel, valorEntrada, prazo, taxaJuros, sistema) {
    const valorFinanciado = valorImovel - valorEntrada;
    const taxaMensal = taxaJuros / 100 / 12;
    const totalParcelas = prazo * 12;
    
    let parcelas = [];
    let totalPago = 0;
    let totalJuros = 0;
    
    if (sistema === 'sac') {
        // Sistema de Amortização Constante (SAC)
        const amortizacao = valorFinanciado / totalParcelas;
        
        for (let i = 1; i <= totalParcelas; i++) {
            const saldoDevedor = valorFinanciado - (amortizacao * (i - 1));
            const juros = saldoDevedor * taxaMensal;
            const valorParcela = amortizacao + juros;
            
            parcelas.push({
                numero: i,
                valor: valorParcela,
                amortizacao: amortizacao,
                juros: juros,
                saldoDevedor: saldoDevedor - amortizacao
            });
            
            totalPago += valorParcela;
            totalJuros += juros;
        }
    } else {
        // Sistema Price (parcelas fixas)
        const fatorPrice = (Math.pow(1 + taxaMensal, totalParcelas) * taxaMensal) / (Math.pow(1 + taxaMensal, totalParcelas) - 1);
        const valorParcela = valorFinanciado * fatorPrice;
        
        let saldoDevedor = valorFinanciado;
        
        for (let i = 1; i <= totalParcelas; i++) {
            const juros = saldoDevedor * taxaMensal;
            const amortizacao = valorParcela - juros;
            saldoDevedor -= amortizacao;
            
            parcelas.push({
                numero: i,
                valor: valorParcela,
                amortizacao: amortizacao,
                juros: juros,
                saldoDevedor: saldoDevedor
            });
            
            totalPago += valorParcela;
            totalJuros += juros;
        }
    }
    
    return {
        valorImovel,
        valorEntrada,
        valorFinanciado,
        prazo,
        taxaJuros,
        sistema,
        parcelas,
        totalParcelas,
        totalPago,
        totalJuros
    };
}

/**
 * Exibir resultado do financiamento imobiliário
 */
function displayFinanciamentoResult(resultDiv, resultado) {
    // Formatar nome do sistema
    const sistemaNome = resultado.sistema === 'sac' ? 'SAC (Amortização Constante)' : 'Price (Parcelas Fixas)';
    
    // Primeira parcela
    const primeiraParcela = resultado.parcelas[0].valor;
    
    // Última parcela (apenas relevante para SAC)
    const ultimaParcela = resultado.parcelas[resultado.parcelas.length - 1].valor;
    
    resultDiv.innerHTML = `
        <div class="result-summary">
            <div class="result-item">
                <h4>Valor Financiado</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.valorFinanciado)}</p>
            </div>
            <div class="result-item">
                <h4>Sistema</h4>
                <p class="result-value">${sistemaNome}</p>
            </div>
            <div class="result-item">
                <h4>${resultado.sistema === 'sac' ? 'Primeira Parcela' : 'Valor da Parcela'}</h4>
                <p class="result-value">${Utils.formatCurrency(primeiraParcela)}</p>
            </div>
            ${resultado.sistema === 'sac' ? `
                <div class="result-item">
                    <h4>Última Parcela</h4>
                    <p class="result-value">${Utils.formatCurrency(ultimaParcela)}</p>
                </div>
            ` : ''}
        </div>
        
        <div class="result-summary">
            <div class="result-item">
                <h4>Total Pago</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.totalPago)}</p>
            </div>
            <div class="result-item">
                <h4>Total de Juros</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.totalJuros)}</p>
            </div>
            <div class="result-item">
                <h4>Custo Efetivo</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.totalPago + resultado.valorEntrada)}</p>
            </div>
        </div>
        
        <div class="result-chart-container">
            <canvas id="financiamento-chart"></canvas>
        </div>
        
        <div class="toggle-details">
            <button type="button" id="toggle-parcelas">Ver Detalhamento das Parcelas</button>
        </div>
        
        <div class="parcelas-details" style="display: none;">
            <h4>Detalhamento das Parcelas</h4>
            <div class="table-responsive">
                <table class="parcelas-table">
                    <thead>
                        <tr>
                            <th>Parcela</th>
                            <th>Valor</th>
                            <th>Amortização</th>
                            <th>Juros</th>
                            <th>Saldo Devedor</th>
                        </tr>
                    </thead>
                    <tbody id="parcelas-table-body">
                        <!-- Será preenchido via JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Adicionar evento para mostrar/ocultar detalhamento
    const toggleBtn = resultDiv.querySelector('#toggle-parcelas');
    const parcelasDetails = resultDiv.querySelector('.parcelas-details');
    
    if (toggleBtn && parcelasDetails) {
        toggleBtn.addEventListener('click', function() {
            const isVisible = parcelasDetails.style.display !== 'none';
            parcelasDetails.style.display = isVisible ? 'none' : 'block';
            this.textContent = isVisible ? 'Ver Detalhamento das Parcelas' : 'Ocultar Detalhamento';
            
            // Preencher tabela apenas quando for exibida
            if (!isVisible) {
                fillParcelasTable(resultado.parcelas);
            }
        });
    }
}

/**
 * Preencher tabela de parcelas
 */
function fillParcelasTable(parcelas) {
    const tableBody = document.getElementById('parcelas-table-body');
    if (!tableBody) return;
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    // Adicionar apenas as primeiras 12 parcelas, depois a cada 12
    const parcelasToShow = parcelas.filter((parcela, index) => {
        return index < 12 || index % 12 === 0 || index === parcelas.length - 1;
    });
    
    // Preencher tabela
    parcelasToShow.forEach(parcela => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${parcela.numero}</td>
            <td>${Utils.formatCurrency(parcela.valor)}</td>
            <td>${Utils.formatCurrency(parcela.amortizacao)}</td>
            <td>${Utils.formatCurrency(parcela.juros)}</td>
            <td>${Utils.formatCurrency(parcela.saldoDevedor)}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Atualizar gráfico de financiamento
 */
function updateFinanciamentoChart(resultado) {
    const ctx = document.getElementById('financiamento-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    // Destruir gráfico anterior se existir
    if (window.financiamentoChart) {
        window.financiamentoChart.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = [];
    const valoresParcelaData = [];
    const amortizacaoData = [];
    const jurosData = [];
    
    // Selecionar apenas algumas parcelas para o gráfico (para não ficar muito denso)
    const step = Math.max(1, Math.floor(resultado.parcelas.length / 24));
    
    for (let i = 0; i < resultado.parcelas.length; i += step) {
        const parcela = resultado.parcelas[i];
        labels.push(`Parcela ${parcela.numero}`);
        valoresParcelaData.push(parcela.valor);
        amortizacaoData.push(parcela.amortizacao);
        jurosData.push(parcela.juros);
    }
    
    // Adicionar última parcela se não foi incluída
    const ultimaParcela = resultado.parcelas[resultado.parcelas.length - 1];
    if (labels[labels.length - 1] !== `Parcela ${ultimaParcela.numero}`) {
        labels.push(`Parcela ${ultimaParcela.numero}`);
        valoresParcelaData.push(ultimaParcela.valor);
        amortizacaoData.push(ultimaParcela.amortizacao);
        jurosData.push(ultimaParcela.juros);
    }
    
    // Criar gráfico
    window.financiamentoChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Valor da Parcela',
                    data: valoresParcelaData,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    fill: false
                },
                {
                    label: 'Amortização',
                    data: amortizacaoData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    fill: false
                },
                {
                    label: 'Juros',
                    data: jurosData,
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return Utils.formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + Utils.formatCurrency(context.raw);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Planejador de Aposentadoria
 */
function initPlanejadorAposentadoria() {
    const calculator = document.getElementById('planejador-aposentadoria');
    if (!calculator) return;
    
    const form = calculator.querySelector('form');
    const resultDiv = calculator.querySelector('.calculator-result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obter valores do formulário
        const idadeAtual = parseInt(form.querySelector('#idade-atual').value) || 0;
        const idadeAposentadoria = parseInt(form.querySelector('#idade-aposentadoria').value) || 0;
        const expectativaVida = parseInt(form.querySelector('#expectativa-vida').value) || 0;
        const rendaMensal = parseFloat(form.querySelector('#renda-mensal').value) || 0;
        const patrimonioAtual = parseFloat(form.querySelector('#patrimonio-atual').value) || 0;
        const aporteMensal = parseFloat(form.querySelector('#aporte-mensal').value) || 0;
        const taxaJuros = parseFloat(form.querySelector('#taxa-juros-aposentadoria').value) || 0;
        const inflacao = parseFloat(form.querySelector('#inflacao').value) || 0;
        
        // Validar entradas
        if (idadeAtual <= 0 || idadeAposentadoria <= idadeAtual || expectativaVida <= idadeAposentadoria) {
            showCalculatorError(resultDiv, 'Por favor, verifique as idades informadas.');
            return;
        }
        
        if (rendaMensal <= 0 || taxaJuros <= 0) {
            showCalculatorError(resultDiv, 'Por favor, insira valores válidos para todos os campos.');
            return;
        }
        
        // Calcular planejamento de aposentadoria
        const resultado = calcularAposentadoria(
            idadeAtual, idadeAposentadoria, expectativaVida,
            rendaMensal, patrimonioAtual, aporteMensal,
            taxaJuros, inflacao
        );
        
        // Exibir resultado
        displayAposentadoriaResult(resultDiv, resultado);
        
        // Atualizar gráfico
        updateAposentadoriaChart(resultado);
    });
}

/**
 * Calcular planejamento de aposentadoria
 */
function calcularAposentadoria(idadeAtual, idadeAposentadoria, expectativaVida, rendaMensal, patrimonioAtual, aporteMensal, taxaJuros, inflacao) {
    // Converter taxas para valores mensais
    const taxaMensal = taxaJuros / 100 / 12;
    const inflacaoMensal = inflacao / 100 / 12;
    
    // Calcular períodos
    const mesesAteAposentadoria = (idadeAposentadoria - idadeAtual) * 12;
    const mesesAposentado = (expectativaVida - idadeAposentadoria) * 12;
    
    // Ajustar renda mensal pela inflação até a aposentadoria
    const rendaMensalAjustada = rendaMensal * Math.pow(1 + inflacaoMensal, mesesAteAposentadoria);
    
    // Calcular patrimônio necessário na aposentadoria
    let patrimonioNecessario = 0;
    let saldoRestante = 0;
    
    // Simulação mês a mês durante a aposentadoria
    for (let i = 1; i <= mesesAposentado; i++) {
        // Renda ajustada pela inflação para o mês atual da aposentadoria
        const rendaAjustada = rendaMensalAjustada * Math.pow(1 + inflacaoMensal, i);
        
        // Valor presente da renda ajustada
        const valorPresente = rendaAjustada / Math.pow(1 + taxaMensal, i);
        
        patrimonioNecessario += valorPresente;
    }
    
    // Simulação da fase de acumulação
    let patrimonioProjetado = patrimonioAtual;
    const evolucaoPatrimonio = [{
        mes: 0,
        patrimonio: patrimonioAtual,
        aporte: 0,
        rendimento: 0
    }];
    
    for (let i = 1; i <= mesesAteAposentadoria; i++) {
        // Rendimento do mês
        const rendimento = patrimonioProjetado * taxaMensal;
        
        // Adicionar aporte mensal
        patrimonioProjetado += aporteMensal + rendimento;
        
        // Registrar evolução a cada 12 meses
        if (i % 12 === 0 || i === mesesAteAposentadoria) {
            evolucaoPatrimonio.push({
                mes: i,
                patrimonio: patrimonioProjetado,
                aporte: aporteMensal,
                rendimento: rendimento
            });
        }
    }
    
    // Verificar se o patrimônio projetado é suficiente
    const patrimonioSuficiente = patrimonioProjetado >= patrimonioNecessario;
    
    // Calcular aporte necessário se o patrimônio for insuficiente
    let aporteNecessario = aporteMensal;
    
    if (!patrimonioSuficiente) {
        // Cálculo simplificado do aporte necessário
        const deficitMensal = (patrimonioNecessario - patrimonioProjetado) / mesesAteAposentadoria;
        aporteNecessario = aporteMensal + deficitMensal;
    }
    
    // Simulação da fase de consumo (aposentadoria)
    const evolucaoConsumo = [];
    let patrimonioAposentadoria = patrimonioProjetado;
    
    for (let i = 1; i <= mesesAposentado; i++) {
        // Renda ajustada pela inflação
        const rendaAjustada = rendaMensalAjustada * Math.pow(1 + inflacaoMensal, i);
        
        // Rendimento do mês
        const rendimento = patrimonioAposentadoria * taxaMensal;
        
        // Atualizar patrimônio
        patrimonioAposentadoria = patrimonioAposentadoria + rendimento - rendaAjustada;
        
        // Registrar evolução a cada 12 meses
        if (i % 12 === 0 || i === mesesAposentado) {
            evolucaoConsumo.push({
                mes: i,
                patrimonio: patrimonioAposentadoria,
                consumo: rendaAjustada,
                rendimento: rendimento
            });
        }
    }
    
    // Verificar se o dinheiro dura até o fim da expectativa de vida
    const dinheiroSuficiente = patrimonioAposentadoria > 0;
    
    return {
        idadeAtual,
        idadeAposentadoria,
        expectativaVida,
        rendaMensal,
        rendaMensalAjustada,
        patrimonioAtual,
        patrimonioProjetado,
        patrimonioNecessario,
        aporteMensal,
        aporteNecessario,
        taxaJuros,
        inflacao,
        mesesAteAposentadoria,
        mesesAposentado,
        patrimonioSuficiente,
        dinheiroSuficiente,
        evolucaoPatrimonio,
        evolucaoConsumo
    };
}

/**
 * Exibir resultado do planejador de aposentadoria
 */
function displayAposentadoriaResult(resultDiv, resultado) {
    // Calcular anos até a aposentadoria
    const anosAteAposentadoria = Math.floor(resultado.mesesAteAposentadoria / 12);
    
    // Status do planejamento
    let statusClass = 'success';
    let statusMessage = 'Seu planejamento está no caminho certo!';
    
    if (!resultado.patrimonioSuficiente) {
        statusClass = 'warning';
        statusMessage = 'Você precisa aumentar seus aportes mensais para atingir sua meta.';
    }
    
    if (!resultado.dinheiroSuficiente) {
        statusClass = 'error';
        statusMessage = 'Seu patrimônio não será suficiente para toda sua expectativa de vida.';
    }
    
    resultDiv.innerHTML = `
        <div class="result-status ${statusClass}">
            <i class="fas fa-${resultado.patrimonioSuficiente ? 'check-circle' : 'exclamation-circle'}"></i>
            <p>${statusMessage}</p>
        </div>
        
        <div class="result-summary">
            <div class="result-item">
                <h4>Patrimônio Necessário</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.patrimonioNecessario)}</p>
            </div>
            <div class="result-item">
                <h4>Patrimônio Projetado</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.patrimonioProjetado)}</p>
            </div>
            <div class="result-item">
                <h4>Tempo até Aposentadoria</h4>
                <p class="result-value">${anosAteAposentadoria} anos</p>
            </div>
        </div>
        
        <div class="result-summary">
            <div class="result-item">
                <h4>Renda Mensal Desejada</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.rendaMensal)}</p>
            </div>
            <div class="result-item">
                <h4>Renda Ajustada pela Inflação</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.rendaMensalAjustada)}</p>
            </div>
            <div class="result-item">
                <h4>Aporte Mensal Atual</h4>
                <p class="result-value">${Utils.formatCurrency(resultado.aporteMensal)}</p>
            </div>
            ${!resultado.patrimonioSuficiente ? `
                <div class="result-item highlight">
                    <h4>Aporte Mensal Necessário</h4>
                    <p class="result-value">${Utils.formatCurrency(resultado.aporteNecessario)}</p>
                </div>
            ` : ''}
        </div>
        
        <div class="result-chart-container">
            <canvas id="aposentadoria-chart"></canvas>
        </div>
    `;
}

/**
 * Atualizar gráfico de aposentadoria
 */
function updateAposentadoriaChart(resultado) {
    const ctx = document.getElementById('aposentadoria-chart');
    if (!ctx || typeof Chart === 'undefined') return;
    
    // Destruir gráfico anterior se existir
    if (window.aposentadoriaChart) {
        window.aposentadoriaChart.destroy();
    }
    
    // Preparar dados para o gráfico
    const labels = [];
    const patrimonioData = [];
    
    // Fase de acumulação
    resultado.evolucaoPatrimonio.forEach(item => {
        const ano = Math.floor(item.mes / 12);
        labels.push(`${resultado.idadeAtual + ano} anos`);
        patrimonioData.push(item.patrimonio);
    });
    
    // Fase de consumo
    resultado.evolucaoConsumo.forEach(item => {
        const ano = Math.floor(item.mes / 12);
        labels.push(`${resultado.idadeAposentadoria + ano} anos`);
        patrimonioData.push(item.patrimonio);
    });
    
    // Criar gráfico
    window.aposentadoriaChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Patrimônio Projetado',
                data: patrimonioData,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                fill: true,
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return Utils.formatCurrency(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Patrimônio: ' + Utils.formatCurrency(context.raw);
                        }
                    }
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: resultado.patrimonioNecessario,
                            yMax: resultado.patrimonioNecessario,
                            borderColor: '#FF9800',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Patrimônio Necessário',
                                enabled: true,
                                position: 'end'
                            }
                        },
                        line2: {
                            type: 'line',
                            xMin: resultado.evolucaoPatrimonio.length - 1,
                            xMax: resultado.evolucaoPatrimonio.length - 1,
                            borderColor: '#F44336',
                            borderWidth: 2,
                            label: {
                                content: 'Aposentadoria',
                                enabled: true,
                                position: 'start'
                            }
                        }
                    }
                }
            }
        }
    });
}

/**
 * Inicializar gráficos
 */
function initCharts() {
    // Configurações globais para gráficos
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#666';
    }
}

/**
 * Exibir erro na calculadora
 */
function showCalculatorError(container, message) {
    container.innerHTML = `
        <div class="calculator-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Formatar tipo de ativo
 */
function formatarTipoAtivo(tipo) {
    const tipos = {
        'acao': 'Ação',
        'fii': 'FII',
        'renda-fixa': 'Renda Fixa',
        'outro': 'Outro'
    };
    
    return tipos[tipo] || tipo;
}