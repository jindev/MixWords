'use strict';

// Configuring the Articles module
angular.module('words').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Words', 'words', 'dropdown', '/words(/create)?');
		Menus.addSubMenuItem('topbar', 'words', 'List Words', 'words');
		Menus.addSubMenuItem('topbar', 'words', 'New Word', 'words/create');
	}
]);