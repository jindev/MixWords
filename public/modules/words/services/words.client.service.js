'use strict';

//Words service used to communicate Words REST endpoints
angular.module('words').factory('Words', ['$resource',
	function($resource) {
		return $resource('words/:wordId', { wordId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);