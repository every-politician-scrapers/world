module.exports = function () {
  return `
    SELECT ?item ?itemLabel ?jurisdiction ?jurisdictionLabel ?mod WHERE {
      ?item wdt:P31/wdt:P279* wd:Q640506 .
      MINUS { ?item wdt:P571 ?start }
      OPTIONAL { ?item wdt:P1001 ?jurisdiction }
      ?item schema:dateModified ?mod .
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    ORDER BY DESC(?mod)
    LIMIT 50`
}
