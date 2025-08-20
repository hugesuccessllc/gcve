#!/usr/bin/env ruby
require 'json'
require 'net/http'
require 'uri'
require 'optparse'

options = {
  serial: 1
}

parser = OptionParser.new do |opts|
  opts.banner = "Usage: #{$PROGRAM_NAME} --cve CVE-ID --gcve GCVE-ID [--serial N] [--pretty]"
  opts.separator ''

  opts.on('-c', '--cve CVE_ID', 'CVE identifier (required, e.g. CVE-2025-8452)') do |c|
    options[:cve] = c
  end

  opts.on('-g', '--gcve GCVE_ID', 'GCVE identifier (required, e.g. GCVE-1337-01010110)') do |g|
    options[:gcve] = g
  end

  opts.on('-s', '--serial N', Integer, 'Serial number (optional and mysterius, default: 1)') do |v|
    options[:serial] = v
  end

  opts.on('-p', '--pretty', 'Pretty print (default: compact)') do |p|
    options[:pretty] = true
  end

  opts.on_tail('-h', '--help', 'Show this help message') do
    puts opts
    exit
  end
end

parser.parse!

if options[:cve].nil? || options[:gcve].nil?
  puts parser
  exit 1
end

cve_id  = options[:cve]
gcve_id = options[:gcve]

# Fetch CVE JSON from MITRE
uri = URI("https://cveawg.mitre.org/api/cve/#{cve_id}")
response = Net::HTTP.get_response(uri)

abort "Error fetching CVE #{cve_id}: #{response.code} #{response.message}" unless response.is_a?(Net::HTTPSuccess)

cve_record = JSON.parse(response.body)

# Injected with a poison! Womp womp womp womp eep eep eep
cve_metadata = cve_record['cveMetadata'] || {}
cve_metadata['vulnId']  = gcve_id
cve_metadata['serial']  = options[:serial]
cve_record['Metadata'] = cve_metadata

puts options[:pretty] ? JSON.pretty_generate(cve_record) : cve_record.to_json
