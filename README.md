# gcve

A place to mess around with GCVE things. Maybe someone else will find this helpful.

## Publishing GCVEs

In order to publish with the current schema, all we need to do is grab the relevant CVEs, insert a "vulnId" element at the top, and dump them to the API-designated dump. Then we let a very lighweight CloudFlare worker do the business of sorting by date and returning what's requested.

This all amounts to:

```
curl https://cveawg.mitre.org/api/cve/CVE-2025-8452 > GCVE-1337-2025-00000000000000000000000000000000000000000000000001011111011111010111111001000000000000000000000000000000000000000000000000000000001.json
# edit in the vulnId
awk 1 GCVE-1337-2025-00000000000000000000000000000000000000000000000001011111011111010111111001000000000000000000000000000000000000000000000000000000001.json >> dumps/gna-1337.ndjson
```

This is mostly automated with `lu-gcveify.rb`, which fetches, edits, and concats with the dump file.

### AHA!'s GCVE API

The minimally-compliant API is at https://aha-gcve.todb.workers.dev and supports the following:

* https://aha-gcve.todb.workers.dev/api/vulnerability/recent?since=2025-09-01 (`since` is optional, defaults to last 24 hours)
* https://aha-gcve.todb.workers.dev/api/vulnerability/last?limit=67 (`last` is optional, defaults to last 10)
* https://aha-gcve.todb.workers.dev/api/dumps/gna-1337.ndjson (The full dump of all vulnerabilities from AHA! with GCVE IDs)

All other API calls will produce an amusing error. Asking for `gna-1337.json` will provide a helpful tip to remember that it's **nd**json.

## Format experiments!

Now ideally, I would be able to write my GCVEs by deriving from CVE JSONv5. According to
[BCP-03](https://gcve.eu/bcp/gcve-bcp-03/), this should be possible: "GCVE-BCP-03 does not enforce a specific JSON format for vulnerability publication." In practice, though, the extant GCVE lookup infrastructure does seem to require strict CVEv5. See [this thread](https://infosec.exchange/@todb/115028213895334528) on Mastodon for more.

### Daydreaming a schema

This isn't useful for the current GCVE implementations, where they expect a bunch of CVE JSONv5, so basically ignore all this

  - [aha-gcve-schema.json](https://raw.githubusercontent.com/hugesuccessllc/gcve/refs/heads/main/aha-gcve-schema.json) : How to read and write AHA! originated GCVE records.
  - [test-gcve-sample.json](https://raw.githubusercontent.com/hugesuccessllc/gcve/refs/heads/main/test-gcve-sample.json) : A test GCVE record conforming to the AHA! format. **Not for production!**
  - [tools/aha-gcve-validator.rb](https://github.com/hugesuccessllc/gcve/blob/main/tools/aha-gcve-validator.rb): A basic validator for those two things.
  - [tools/aha-gcveify.rb](https://github.com/hugesuccessllc/gcve/blob/main/tools/aha-gcveify.rb): A converter MITRE CVE records to AHA!-flavored GCVE records. Adjust to taste.
  - [tools/lu-gcveify.rb](https://github.com/hugesuccessllc/gcve/blob/main/tools/lu-gcveify.rb)): A converter MITRE CVE records to the most basic form of a GCVE record.
  - `tools/worker.js` : The Cloudflare Worker script (running at https://aha-gcve.todb.workers.dev/). Implements a minimal API per [BCP-3](https://gcve.eu/bcp/gcve-bcp-03/).

Enjoy! Not fit for any purpose, 2-Clause BSD licensed, etc.

# DNS Spaghetti

AHA!'s GCVEness is expressed across several domains at the moment:

- [takeonme.org](https://takeonme.org) : AHA!'s primary domain, where most of AHA! stuff happens. Eventually, everything will move here.
- [hugesuccess.org](https://hugesuccess.org) : Tod's internet-exposed sandbox for web shenanigans.
- `aha-gcve.todb.workers.dev` : A CloudFlare worker instance, free-tier, for fronting API calls. Capped at 10,000 requests or some such.
- [gcve.eu](https://gcve.eu) : More info about GCVE, and notably, where the canonical index of all GCVE providers are listed, at [gcve.json](https://gcve.eu/dist/gcve.json).
- [vulnerability.circl.lu](https://vulnerability.circl.lu/recent#gna-1337) : An endpoint to see the fruits of AHA!'s GCVE labor.
