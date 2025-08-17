# gcve

A place to mess around with GCVE things. Maybe someone else will find this helpful.

Currently, I've got:

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
 
