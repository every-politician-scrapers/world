module.exports = function () {
  return `SELECT ?item ?itemLabel ?position ?positionLabel ?predecessor ?predecessorLabel ?after ?jurisdictionLabel
           (COUNT(DISTINCT ?otherposition) AS ?others)
    WITH {
      SELECT DISTINCT ?position ?jurisdiction WHERE {
        ?cabinet wdt:P279 wd:Q640506 ; wdt:P1001 ?jurisdiction .
        ?position wdt:P361 ?cabinet .
      }
    } AS %positions
    WITH {
      SELECT DISTINCT ?item ?position ?after ?predecessor ?jurisdiction WHERE {
        INCLUDE %positions .
        ?predecessor wdt:P31 wd:Q5 ; p:P39 ?ps .
        ?ps ps:P39 ?position ; pq:P1366 ?item .
        ?item wdt:P31 wd:Q5 .
        ?ps pq:P582 ?after FILTER(YEAR(?after) >= 2000) .
        MINUS { ?item p:P39/ps:P39 ?position }
        MINUS { ?item p:P39/ps:P39/^wdt:P1366 ?position }
      }
    } AS %missing
    WHERE {
      INCLUDE %missing.
      OPTIONAL { ?item wdt:P39 ?otherposition }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en,es". }
    } # ${new Date().toISOString()}
    GROUP BY ?item ?itemLabel ?position ?positionLabel ?predecessor ?predecessorLabel ?after ?jurisdictionLabel
    ORDER BY DESC(?after)`
}
