module.exports = {

  // Função para construir a clausula WHERE da query
  buildWhereClause(filter) {
    let { cities, products, beginPeriod, endPeriod } = filter;

    // Periodo de tempo
    const beginYear = parseInt(beginPeriod.split('-')[0]);
    const beginMonth = parseInt(beginPeriod.split('-')[1]);

    const endYear = parseInt(endPeriod.split('-')[0]);
    const endMonth = parseInt(endPeriod.split('-')[1]);

    // Data
    let query = `WHERE (DATE(CO_DATA) BETWEEN '${beginYear}-${beginMonth}-1' AND '${endYear}-${endMonth}-1') `

    // Cidades
    if (cities.length != 0) {
      query += 'AND (';
      cities.forEach(e => {
        query += `CO_MUN = ${e} OR `;
      });
      query = query.substring(0, query.length - 4) + ') ';
    }

    // SH4s
    if (products.length != 0) {
      query += 'AND (';
      products.forEach(e => {
        query += `SH4 = ${e} OR `;
      });
      query = query.substring(0, query.length - 4) + ') ';
    }

    return query
  }
}
