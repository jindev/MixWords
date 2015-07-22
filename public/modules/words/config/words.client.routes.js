'use strict';

//Setting up route
angular.module('words').config(['$stateProvider',
	function($stateProvider) {
		// Words state routing
		$stateProvider.
		state('listWords', {
			url: '/words',
			templateUrl: 'modules/words/views/list-words.client.view.html'
		}).
		state('createWord', {
			url: '/words/create',
			templateUrl: 'modules/words/views/create-word.client.view.html'
		}).
		state('viewWord', {
			url: '/words/:wordId',
			templateUrl: 'modules/words/views/view-word.client.view.html'
		}).
		state('editWord', {
			url: '/words/:wordId/edit',
			templateUrl: 'modules/words/views/edit-word.client.view.html'
		});
	}
]);