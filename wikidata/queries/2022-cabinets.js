module.exports = function () {
  return `SELECT DISTINCT ?item ?itemLabel ?itemDescription ?jurisdiction ?jurisdictionLabel ?began ?ended WHERE {
    SERVICE wikibase:mwapi {
        bd:serviceParam wikibase:api "Generator".
        bd:serviceParam wikibase:endpoint "en.wikipedia.org".
        bd:serviceParam mwapi:gcmtitle "Category:Cabinets established in 2022".
        bd:serviceParam mwapi:generator "categorymembers".
        bd:serviceParam mwapi:gcmprop "ids".
        bd:serviceParam mwapi:gcmlimit "max".
        ?item wikibase:apiOutputItem mwapi:item.
      }
      OPTIONAL { ?item wdt:P1001 ?jurisdiction }
      OPTIONAL { ?item wdt:P571|wdt:P580 ?began }
      OPTIONAL { ?item wdt:P576|wdt:P582 ?ended }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    # ${new Date().toISOString()}
    ORDER BY ?jurisdictionLabel ?began`
}
