module.exports = function () {
  return `
    SELECT ?page WHERE {
      SERVICE wikibase:mwapi {
        bd:serviceParam wikibase:endpoint "en.wikipedia.org";
                        wikibase:api "Generator";
                        mwapi:generator "categorymembers";
                        mwapi:gcmtitle "Category:Current governments";
                        mwapi:gcmprop "ids|title|type";
                        mwapi:gcmlimit "max".
        ?page wikibase:apiOutput mwapi:title.
        ?item wikibase:apiOutputItem mwapi:item.
      }
      FILTER(!BOUND(?item))
    }
    ORDER BY ?page
  `
}
