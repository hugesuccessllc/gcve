# gcve

A place to mess around with GCVE things. Maybe someone else will find this helpful.

Currently, I've got:

  - `aha-gcve-schema.json` : How to read and write AHA! originated GCVE records.
  - `test-gcve-sample.json` : A test GCVE record conforming to the AHA! format. **Not for production!**
  - `tools/aha-gcve-validator.rb` : A basic validator for those two things.
  - `tools/aha-gcveify.rb` : A converter for standard CVE records to AHA!-flavored GCVE records. Adjust to taste if you want to use it.
  - `tools/worker.js` : The Cloudflare Worker script running at https://aha-gcve.todb.workers.dev/ which implements the minimum required API for GCVE tooling.

Enjoy! Not fit for any purpose, 2-Clause BSD licensed, etc.

# DNS Spaghetti

AHA!'s GCVEness is expressed across several domains at the moment:

- [takeonme.org] : Where most of AHA! stuff happens.
- [hugesuccess.org] : Tod's internet-exposed sandbox for web shenanigans.
- [aha-gcve.todb.workers.dev] : A free way to fake up an API for GCVE. Capped at 10,000 requests or some such.
- [gcve.eu] : Where most GCVE things happen.
