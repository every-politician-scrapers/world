#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'pry'

class MemberList
  class Members
    decorator RemoveReferences
    decorator UnspanAllTables
    decorator WikidataIdsDecorator::Links

    def member_items
      super.reject(&:skip?)
    end

    def member_container
      noko.xpath("//table[.//th[contains(.,'Current')]]//tr[td]")
    end
  end

  class Member
    field :id do
      name_node.css('a/@wikidata').first
    end

    field :name do
      name_node.css('a').map(&:text).map(&:tidy).first || name_node.text.tidy
    end

    field :positionID do
    end

    field :country do
      country_node.css('a/@wikidata').last
    end

    field :countryLabel do
      country_node.css('a').map(&:text).map(&:tidy).last
    end

    field :position do
      "Foreign Minister of #{countryLabel}"
    end

    field :startDate do
      WikipediaDate.new(raw_start).to_s
    end

    field :endDate do
    end

    # holds it as HoG, rather than directly
    def skip?
      name_node.text.split('(').last =~ /prime|president/i
    end

    private

    def columns
      noko.xpath('parent::table[1]//tr[th]//th').map(&:text).map(&:tidy)
    end

    def tds
      noko.css('td')
    end

    def name_node
      tds[columns.find_index { |col| col.downcase.include? 'current' }]
    end

    def country_node
      tds[0]
    end

    def raw_start
      tds[-1].text.split('(').first.tidy
    end
  end
end

url = 'https://en.wikipedia.org/wiki/List_of_current_foreign_ministers'
puts EveryPoliticianScraper::ScraperData.new(url).csv
