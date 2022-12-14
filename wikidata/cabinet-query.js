const estq = (year) => {
  return `SELECT DISTINCT ?item ?itemLabel ?itemDescription ?jurisdiction ?jurisdictionLabel ?began ?ended ?type WHERE {
    SERVICE wikibase:mwapi {
        bd:serviceParam wikibase:api "Generator".
        bd:serviceParam wikibase:endpoint "en.wikipedia.org".
        bd:serviceParam mwapi:gcmtitle "Category:Cabinets established in ${year}".
        bd:serviceParam mwapi:generator "categorymembers".
        bd:serviceParam mwapi:gcmprop "ids".
        bd:serviceParam mwapi:gcmlimit "max".
        ?item wikibase:apiOutputItem mwapi:item.
      }
      OPTIONAL { ?item wdt:P1001 ?jurisdiction }
      OPTIONAL { ?item wdt:P571|wdt:P580 ?began }
      OPTIONAL { ?item wdt:P576|wdt:P582 ?ended }
      BIND(
        IF(EXISTS { ?item wdt:P31/wdt:P279* wd:Q640506 }, "cabinet",
        IF(EXISTS { ?item wdt:P31/wdt:P279* wd:Q7188 }, "government",
        "")
      ) AS ?type)

      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
    }
    # ${new Date().toISOString()}
    ORDER BY ?jurisdictionLabel ?began`
};

exports.estq = estq;
