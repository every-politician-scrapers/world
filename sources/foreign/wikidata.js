module.exports = function () {
  return `SELECT DISTINCT ?person ?personLabel ?country ?countryLabel ?position ?positionLabel ?start 
            (STRAFTER(STR(?ps), STR(wds:)) AS ?psid)
    WHERE {
      ?position wdt:P279* wd:Q7330070 .
      MINUS { ?position wdt:P576 [] }

      ?position wdt:P1001 ?country .
      MINUS { ?country wdt:P576 [] }

      OPTIONAL {
        ?person wdt:P31 wd:Q5 ; p:P39 ?ps .
        ?ps ps:P39 ?position ; pq:P580 ?start .
        MINUS { ?ps pq:P582 [] }
        FILTER NOT EXISTS { ?ps wikibase:rank wikibase:DeprecatedRank }
      }

      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    # ${new Date().toISOString()}
    ORDER BY ?countryLabel ?start ?person`
}
