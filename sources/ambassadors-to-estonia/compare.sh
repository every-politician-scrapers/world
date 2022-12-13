#!/bin/bash

TMPFILE=$(mktemp)

cd $(dirname $0)

bundle exec ruby scraper.rb $(jq -r .reference.P4656 meta.json) |
  qsv select country,countryLabel,id,name,startDate |
  qsv rename country,countryLabel,item,itemLabel,startDate > scraped.csv

wd sparql -f csv wikidata.js | sed -e 's/T00:00:00Z//g' -e 's#http://www.wikidata.org/entity/##g' | qsv dedup -s psid > wikidata.csv

qsv join --left country scraped.csv country wikidata.csv |
  qsv select "country[0],countryLabel[0],item[0],itemLabel[0],country[1],countryLabel[1],item[1],itemLabel[1]" |
  qsv rename "wpcountry,wpcountrylabel,wpperson,wppersonlabel,wdcountry,wdcountrylabel,wdperson,wdpersonlabel" > $TMPFILE

sqlite3 :memory: -cmd '.mode csv' -cmd ".import $TMPFILE comparison" -cmd '.mode csv' -header '
  SELECT COALESCE(NULLIF(wpcountry,""),NULLIF(wdcountry,"")) AS country,
         COALESCE(NULLIF(wpcountrylabel,""),NULLIF(wdcountrylabel,"")) AS countrylabel,
         wpperson,wppersonlabel,wdperson,wdpersonlabel
  FROM comparison
  ORDER BY countrylabel' > comparison.csv

sqlite3 :memory: -cmd '.mode csv' -cmd ".import comparison.csv comparison" -cmd '.mode csv' -header '
  SELECT * FROM comparison WHERE (wpperson!="" AND wpperson != wdperson) OR (wpperson = "" AND wppersonlabel != wdpersonlabel)
  ' | qsv search -s countrylabel -v "(Yemen|Myanmar)" | qsv fmt | tee diff.csv

cd ~-
