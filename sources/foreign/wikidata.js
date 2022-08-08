module.exports = function () {
  return `SELECT DISTINCT ?person ?name ?country ?countryLabel ?position ?positionLabel ?start 
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

        OPTIONAL {
          ?ps prov:wasDerivedFrom ?ref .
          ?ref pr:P4656 ?source FILTER CONTAINS(STR(?source), 'https://en.wikipedia.org/wiki/List_of_current_foreign_ministers') .
          OPTIONAL { ?ref pr:P1810 ?sourceName }
          OPTIONAL { ?ref pr:P813  ?sourceDate }
        }
        OPTIONAL { ?person rdfs:label ?labelName FILTER(LANG(?labelName) = "en") }
        BIND(COALESCE(?sourceName, ?labelName) AS ?name)
      }

      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" }
    }
    # ${new Date().toISOString()}
    ORDER BY ?countryLabel ?start ?person`
}
