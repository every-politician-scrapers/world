module.exports = function () {
  return `
    SELECT ?page ?item ?itemLabel ?country ?countryLabel ?jurisdiction ?jurisdictionLabel ?inception ?abolished WITH {
      SELECT * WHERE {
        SERVICE wikibase:mwapi {
          # in
          bd:serviceParam wikibase:endpoint "en.wikipedia.org";
                          wikibase:api "Generator";
                          mwapi:generator "categorymembers";
                          mwapi:gcmtitle "Category:Current governments";
                          mwapi:gcmprop "ids|title|type";
                          mwapi:gcmlimit "max".
          # out
          ?page wikibase:apiOutput mwapi:title.
          ?item wikibase:apiOutputItem mwapi:item.
        }
        FILTER(BOUND(?item))
      }
    } AS %api
    WHERE {
      INCLUDE %api
      OPTIONAL { ?item wdt:P17 ?country }
      OPTIONAL { ?item wdt:P1001 ?jurisdiction }
      OPTIONAL { ?item wdt:P571 ?inception }
      OPTIONAL { ?item wdt:P576 ?abolished }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    ORDER BY ?countryLabel ?jurisdictionLabel ?inception ?item
  `
}
