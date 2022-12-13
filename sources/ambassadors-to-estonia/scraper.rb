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
      noko.xpath("//table[.//th[contains(.,'Sending')]]//tr[td]")
    end
  end

  class Member
    field :id do
      name_node.css('a/@wikidata').first
    end

    field :name do
      name_node.css('a').map(&:text).map(&:tidy).first || name_node.text.tidy
    end

    field :position do
    end

    field :country do
      country_node.css('a/@wikidata').last
    end

    field :countryLabel do
      country_node.css('a').map(&:text).map(&:tidy).last
    end

    field :startDate do
      start_node.text.split('.').reverse.join('-')
    end

    field :endDate do
    end

    # holds it as HoG, rather than directly
    def skip?
      name.downcase.include?('n/a') || name.downcase.include?('vacant')
    end

    private

    def columns
      noko.xpath('parent::table[1]//tr[th]//th').map(&:text).map(&:tidy)
    end

    def tds
      noko.css('td')
    end

    def name_node
      tds[columns.find_index { |col| col.downcase.include? 'ambassador' }]
    end

    def country_node
      tds[columns.find_index { |col| col.downcase.include? 'country' }]
    end

    def start_node
      tds[columns.find_index { |col| col.downcase.include? 'presentation' }]
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url).csv
