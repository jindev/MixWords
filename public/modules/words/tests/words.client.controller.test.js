'use strict';

(function() {
	// Words Controller Spec
	describe('Words Controller Tests', function() {
		// Initialize global variables
		var WordsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Words controller.
			WordsController = $controller('WordsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Word object fetched from XHR', inject(function(Words) {
			// Create sample Word using the Words service
			var sampleWord = new Words({
				name: 'New Word'
			});

			// Create a sample Words array that includes the new Word
			var sampleWords = [sampleWord];

			// Set GET response
			$httpBackend.expectGET('words').respond(sampleWords);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.words).toEqualData(sampleWords);
		}));

		it('$scope.findOne() should create an array with one Word object fetched from XHR using a wordId URL parameter', inject(function(Words) {
			// Define a sample Word object
			var sampleWord = new Words({
				name: 'New Word'
			});

			// Set the URL parameter
			$stateParams.wordId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/words\/([0-9a-fA-F]{24})$/).respond(sampleWord);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.word).toEqualData(sampleWord);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Words) {
			// Create a sample Word object
			var sampleWordPostData = new Words({
				name: 'New Word'
			});

			// Create a sample Word response
			var sampleWordResponse = new Words({
				_id: '525cf20451979dea2c000001',
				name: 'New Word'
			});

			// Fixture mock form input values
			scope.name = 'New Word';

			// Set POST response
			$httpBackend.expectPOST('words', sampleWordPostData).respond(sampleWordResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Word was created
			expect($location.path()).toBe('/words/' + sampleWordResponse._id);
		}));

		it('$scope.update() should update a valid Word', inject(function(Words) {
			// Define a sample Word put data
			var sampleWordPutData = new Words({
				_id: '525cf20451979dea2c000001',
				name: 'New Word'
			});

			// Mock Word in scope
			scope.word = sampleWordPutData;

			// Set PUT response
			$httpBackend.expectPUT(/words\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/words/' + sampleWordPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid wordId and remove the Word from the scope', inject(function(Words) {
			// Create new Word object
			var sampleWord = new Words({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Words array and include the Word
			scope.words = [sampleWord];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/words\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWord);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.words.length).toBe(0);
		}));
	});
}());