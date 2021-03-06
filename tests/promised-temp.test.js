"use strict";

var chai  	= require("chai");
var expect  = chai.expect;
var temp 	= require("../lib/promised-temp");
var Q		= require("q");
var os		= require("os");
var path    = require("path");
var fs 		= require("fs");

/**
 * Simplified test suite for promised-temp module to test that it correctly calls the 
 * underlying temp module. Temp module has it's own tests suite to test the actual inner
 * workins, how it generates the temps and such inside it and these tests do not take any
 * part in that.
 */
describe("Promise wrapped temps", function() {
	"use strict"

	after(function(done) {
		// after all tests, we remove the created directories and files created
		temp.track();
		temp.cleanup().done(function() { done(); });
	});

	/**
	 * Tests for .path
	 */
	describe("Creates temporary path", function() {
		it("With specified prefix (string).", function(done) {
			var path = "foobar213";
			temp
				.open(path)
				.then(function(result) {
					expect(result.path).to.include(path);
					done();
				})
				.catch(console.log)
				.done();
		});
		
		it("With specified prefix (Object).", function(done) {
			var path = "foobar321";
			temp
				.open({ prefix: path })
				.then(function(result) {
					expect(result.path).to.include(path);
					done();
				})
				.catch(console.log)
				.done();
		});

		it("With specified suffix.", function(done) {
			var path = "foobar123";
			temp
				.open({ suffix: path })
				.then(function(result) {
					expect(result.path).to.include(path);
					done();
				})
				.catch(console.log)
				.done();
		});

		it("With specified prefix and suffix.", function(done) {
			var path1 = "foobar123";
			var path2 = "foobar321";
			temp
				.open({ prefix: path1, suffix: path2 })
				.then(function(result) {
					expect(result.path).to.include(path1).and.to.include(path2);
					done();
				})
				.catch(console.log)
				.done();
		});

		it("With specified prefix, suffix and dir.", function(done) {
			var path1 = "foobar123";
			var path2 = "foobar321";
			var path3 = path.join(os.tmpdir(), "321foobar");
			temp
				.open({ prefix: path1, suffix: path2, dir: path3 })
				.then(function(result) {
					expect(result.path)
						.to.include(path1)
						.and.to.include(path2)
						.and.to.include(path3);
					done();
				})
				.catch(console.log)
				.done();
		});

		it("With specified dir.", function(done) {
			var path1 = path.join(os.tmpdir(), "321foobar");
			temp
				.open({ dir: path1 })
				.then(function(result) {
					expect(result.path).to.include(path1);
					done();
				})
				.catch(console.log)
				.done();
		});
	});

	/**
	 * Tests for .mkdir
	 */
	describe("Creates directory", function() {
		it("With specific prefix.", function(done) {
			// create file, manual cleanup
			var path1 = "foobar";
			temp.mkdir(path1).then(function(result) {
				expect(path1).to.contain(path1);
				expect(fs.lstatSync(result).isDirectory()).to.equal(true);
				done();
			})
			.catch(console.log)
			.done();
		});
	});

	/**
	 * Tests for .cleanup
	 */
	describe("Performs cleanup", function() {
		afterEach(function() {
			temp.track(false);
		});

		it("Manually, error with no tracking.", function(done) {
			// create file, manual cleanup
			var path1 = "foobar";
			temp.open(path1).then(function(result) {
				temp.cleanup().catch(function() { done(); }).done();
			})
			.catch(console.log)
			.done();
		});

		it("Manually, with tracking.", function(done) {
			// track, create file, manual cleanup
			var path1 = "foobar";
			temp.track();
			temp.open(path1).then(function(result) {
				temp.cleanup().then(function() { done(); }).catch(console.log).done();
			})
			.catch(console.log)
			.done();
		});
	});
});
