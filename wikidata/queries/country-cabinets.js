module.exports = function () {
  return `SELECT DISTINCT ?state ?stateLabel ?cabinet ?cabinetLabel WHERE {
    ?state wdt:P463 wd:Q1065.
    MINUS { ?state wdt:P576|wdt:P582 [] }
    OPTIONAL {
      ?cabinet wdt:P279* wd:Q640506 .
      hint:Prior hint:gearing "forward" .
      ?cabinet wdt:P1001 ?state .

      MINUS { ?cabinet wdt:P576|wdt:P582 [] }
    }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  ORDER BY ?stateLabel ?cabinetLabel`
}
