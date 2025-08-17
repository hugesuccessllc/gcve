# gcve

A place to mess around with GCVE things. Maybe someone else will find this helpful.

Currently, I've got:

  - `aha-gcve-schema.json` : How to read and write AHA! originated GCVE records.
  - `test-gcve-sample.json` : A sample GCVE identifier conforming to the AHA! format.
  - `tools/aha-gcve-validator.rb` : A basic validator for those two things.
  - `tools/aha-gcveify.rb` : A converter for standard CVE records to GCVE records.
  - `tools/worker.js` : The Cloudflare Worker script running at https://aha-gcve.todb.workers.dev/ which implements the minimum required API for GCVE tooling.

Enjoy! Not fit for any purpose, 2-Clause BSD licensed, etc.
