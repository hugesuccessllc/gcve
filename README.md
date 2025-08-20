# gcve

A place to mess around with GCVE things. Maybe someone else will find this helpful.

## Publishing GCVEs

In order to publish with the current scheme, all we need to do is grab the relevant CVEs, and dump them to the API-designated dump. Then we let a very lighweight CloudFlare worker do the business of sorting by date and returning what's requested.

This all amounts to:

```
curl https://cveawg.mitre.org/api/cve/CVE-2025-8452 > GCVE-1337-2025-00000000000000000000000000000000000000000000000001011111011111010111111001000000000000000000000000000000000000000000000000000000001.json
awk 1 GCVE-1337-2025-00000000000000000000000000000000000000000000000001011111011111010111111001000000000000000000000000000000000000000000000000000000001.json >> dumps/gna-1337.ndjson
```

I'll bash together a shell script to do this with a little more sensibility.

## Format experiments!

Now ideally, I would be able to write my GCVEs by deriving from CVEv5. According to
[BCP-03](https://gcve.eu/bcp/gcve-bcp-03/), this should be possible: "GCVE-BCP-03 does not enforce a specific JSON format for vulnerability publication." In practice, though, the extant GCVE lookup infrastructure does seem to require strict CVEv5. See [this thread](https://infosec.exchange/@todb/115028213895334528) on Mastodon for more.

  - [aha-gcve-schema.json](https://raw.githubusercontent.com/hugesuccessllc/gcve/refs/heads/main/aha-gcve-schema.json) : How to read and write AHA! originated GCVE records.
  - [test-gcve-sample.json](https://raw.githubusercontent.com/hugesuccessllc/gcve/refs/heads/main/test-gcve-sample.json) : A test GCVE record conforming to the AHA! format. **Not for production!**
  - [tools/aha-gcve-validator.rb](https://github.com/hugesuccessllc/gcve/blob/main/tools/aha-gcve-validator.rb): A basic validator for those two things.
  - [tools/aha-gcveify.rb](https://github.com/hugesuccessllc/gcve/blob/main/tools/aha-gcveify.rb): A converter MITRE CVE records to AHA!-flavored GCVE records. Adjust to taste.
  - `tools/worker.js` : The Cloudflare Worker script (running at https://aha-gcve.todb.workers.dev/). Implements a minimal API per [BCP-3](https://gcve.eu/bcp/gcve-bcp-03/).

Enjoy! Not fit for any purpose, 2-Clause BSD licensed, etc.

# DNS Spaghetti

AHA!'s GCVEness is expressed across several domains at the moment:

- [takeonme.org](https://takeonme.org) : AHA!'s primary domain, where most of AHA! stuff happens. Eventually, everything will move here.
- [hugesuccess.org](https://hugesuccess.org) : Tod's internet-exposed sandbox for web shenanigans.
- `aha-gcve.todb.workers.dev` : A CloudFlare worker instance, free-tier, for fronting API calls. Capped at 10,000 requests or some such.
- [gcve.eu](https://gcve.eu) : More info about GCVE, and notably, where the canonical index of all GCVE providers are listed, at [gcve.json](https://gcve.eu/dist/gcve.json).
