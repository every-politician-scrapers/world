module.exports = function () {
  return `SELECT ?country ?countryLabel ?item ?itemLabel ?position ?positionLabel ?start 
      (STRAFTER(STR(?ps), STR(wds:)) AS ?psid)
    WHERE {
      ?position wdt:P31 wd:Q29970877 .
      ?item wdt:P31 wd:Q5; p:P39 ?ps .
      ?ps ps:P39 ?position .
      ?ps pq:P580 ?start .
      MINUS { ?ps pq:P582 ?end }
      OPTIONAL { ?position wdt:P31 [ wdt:P31 wd:Q29918328 ; wdt:P17 ?country ] }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    } # ${new Date().toISOString()}
    ORDER BY ?countryLabel`
}
