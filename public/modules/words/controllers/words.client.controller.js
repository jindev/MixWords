'use strict';

// Words controller
angular.module('words').controller('WordsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Words',
	function($scope, $stateParams, $location, Authentication, Words) {
		$scope.authentication = Authentication;

		// Create new Word
		$scope.create = function() {
			// Create new Word object
			var word = new Words ({
				name: this.name
			});

			// Redirect after save
			word.$save(function(response) {
				$location.path('words/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Word
		$scope.remove = function(word) {
			if ( word ) { 
				word.$remove();

				for (var i in $scope.words) {
					if ($scope.words [i] === word) {
						$scope.words.splice(i, 1);
					}
				}
			} else {
				$scope.word.$remove(function() {
					$location.path('words');
				});
			}
		};

		// Update existing Word
		$scope.update = function() {
			var word = $scope.word;

			word.$update(function() {
				$location.path('words/' + word._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Words
		$scope.find = function() {
			$scope.words = Words.query();
		};

		// Find existing Word
		$scope.findOne = function() {
			$scope.word = Words.get({ 
				wordId: $stateParams.wordId
			});
		};
	}
]);