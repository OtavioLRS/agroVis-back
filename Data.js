module.exports = {

  structureExportData(data) {
    // Formatando os dados para a tabela
    const tableData = data.map((tuple) => {
      // console.log(tuple);
      return {
        "Ano": tuple.CO_ANO,
        "Mês": tuple.CO_MES, // Escrever o mes, e nao o numero
        "Cod. do Município": tuple.CO_MUN,
        "Nome do Município": tuple.NO_MUN_MIN,
        "Pais de destino": tuple.NO_PAIS,
        "SH4": tuple.SH4,
        "Descrição": tuple.NO_SH4_POR,
        "Valor FOB (U$)": tuple.VL_FOB
      }
    });

    // Dados relevantes para o Horizon Chart
    const horizonDataRaw = tableData.map(row => {
      const ano = row['Ano'];
      const mes = row['Mês'];
      const sh4 = row['SH4'];
      const fob = row['Valor FOB (U$)']

      return { ano, mes, sh4, fob }
    });

    const horizonData = structureHorizonData(horizonDataRaw);

    return [tableData, horizonData];
  }

}

// Função para estruturar os dados para o Horizon Chart
function structureHorizonData(data) {
  // Limites de tempo em que os dados se encontram
  const yearInterval = d3.extent(data.map(d => d.ano));

  // Não há dados
  if (!yearInterval[0]) { return null; }

  // Intervalo de tempo absoluto dos dados
  const interval = yearInterval[1] - yearInterval[0] + 1;
  // console.log('Intervalo de tempo', yearInterval, ' - ', interval);

  // Agrupa os dados por SH4
  const groupedBySH4 = d3.nest()
    .key(d => d.sh4)
    .entries(data)
    .sort((x, y) => d3.ascending(x.key, y.key));
  // console.log('Horizon Data Grouped = SH4', groupedBySH4);

  // Vetor com os fobs de cada um dos sh4
  let fobBySH4 = [];

  // Para cada SH4 é preciso agrupar por anos
  groupedBySH4.forEach(chartValues => {
    // Agrupa por anos
    const groupedByYear = d3.nest()
      .key(d => d.ano)
      .entries(chartValues.values)
      .sort((x, y) => d3.ascending(x.key, y.key));
    // console.log('Horizon Data Grouped - Year', groupedByYear);

    // Inicia o vetor onde serão colocados os dados
    let fobsByYear = new Array(interval * 12);
    fobsByYear = fobsByYear.fill(0);

    // Para cada ano
    groupedByYear.forEach(year => {
      // Posição cronológica do ano
      const yearIndex = year.values[0].ano - yearInterval[0];
      // console.log('Ano: ', year.key, ' - Index: ', yearIndex);

      // Somando o valor FOB em seu intervalo de tempo adequado
      year.values.forEach(value => {
        const monthIndex = value.mes;
        fobsByYear[(yearIndex * 12) + monthIndex - 1] += parseInt(value.fob);
        // console.log('Adicionei ', value.fob, ' no mes ', monthIndex, ' do ano ', yearIndex);
      })
    })

    // console.log('Valores ', fobsByYear);

    // Salva os fobs de todos os anos para o sh4 atual
    fobBySH4.push({ key: chartValues.key, values: fobsByYear });
  })


  // Agora, é necessário montar o dataframe final com as datas e fobs
  // console.log('Todos Fobs', fobBySH4);

  let dates = new Array(interval * 12);
  for (let y = 0; y < interval; y++) {
    for (let m = 0; m < 12; m++) {
      // Construindo as datas
      dates[(y * 12) + m] = parseDate((m + 1).toString() + '/' + (y + yearInterval[0]).toString())
    }
  }
  // console.log('Datas', dates);

  // Data frame final
  const finalData = {
    dates,
    series: fobBySH4.map(sh4 => {
      // const baseline = sh4.values[0]; // Primeiro valor
      const baseline = d3.max(sh4.values); // Maior valor
      // const baseline = d3.min(sh4.values); // Menor valor
      return {
        name: sh4.key,
        values: sh4.values
        // values: sh4.values.map(value => { /*console.log(value);*/ return Math.log(value / baseline) }) // Normalizar?
      }
    })
  };
  // console.log('Final Data', finalData);

  return finalData;
}

const d3 = require('d3');

const parseDate = d3.timeParse('%m/%Y');

function teste() {
  console.log('sim')
}