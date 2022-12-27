module.exports = function () {
  return `
    SELECT ?item ?itemLabel ?jurisdiction ?jurisdictionLabel ?start
    WHERE
    {
      ?item wdt:P31/wdt:P279* wd:Q640506 ; wdt:P571 ?start .
      OPTIONAL { ?item wdt:P1001 ?jurisdiction }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY DESC(?start)
    LIMIT 20`
}
