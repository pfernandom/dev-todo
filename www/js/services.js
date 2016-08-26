// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
var app = angular.module('devTodo');

app.service('TodoManager',['$q','ApiEndpoint',function($q, ApiEndpoint){
	var _db;
	var _todos;
	
	function onDatabaseChange(change) {  
		var index = findIndex(_todos, change.id);
		var birthday = _todos[index];

		if (change.deleted) {
			if (birthday) {
				_todos.splice(index, 1); // delete
			}
		} else {
			if (birthday && birthday._id === change.id) {
				_todos[index] = change.doc; // update
			} else {
				_todos.splice(index, 0, change.doc) // insert
			}
		}
	}

	// Binary search, the array is by default sorted by _id.
	function findIndex(array, id) {  
		var low = 0, high = array.length, mid;
		while (low < high) {
		mid = (low + high) >>> 1;
		array[mid]._id < id ? low = mid + 1 : high = mid
		}
		return low;
	}
	
	return {
		initDB: function(){
			// Creates the database or opens if it already exists
			console.log('Init db');
			//_db = new PouchDB('devtodo', {adapter: 'websql'});
			_db = new PouchDB('todos');
			var remoteDB = new PouchDB(ApiEndpoint);
			_db.sync(remoteDB, {live: true});
			
			
			 _db.changes({
				continuous: true,
				onChange: function(change) {
					console.log(change)/*
					if (!change.deleted) {
						$rootScope.$apply(function() {
							localDB.get(change.id, function(err, doc) {
								$rootScope.$apply(function() {
									if (err) console.log(err);
									$rootScope.$broadcast('add', doc);
								})
							});
						})
					} else {
						$rootScope.$apply(function() {
							$rootScope.$broadcast('delete', change.id);
						});
					}*/
				}
			});
			
			
			
			
			
		},
		saveTodo:function(todo){
			return $q.when(_db.post(todo));
		},
		updateTodo:function(todo){
			return $q.when(_db.put(todo));
		},
		deleteTodo:function(todo){
			return $q.when(_db.remove(todo));
		},
		getAllTodos:function(){
			if (!_todos) {
			   return $q.when(_db.allDocs({ include_docs: true}))
					.then(function(docs) {

						// Each row has a .doc object and we just want to send an 
						// array of birthday objects back to the calling controller,
						// so let's map the array to contain just the .doc objects.
						_todos = docs.rows.map(function(row) {
							// Dates are not automatically converted from a string.
							//row.doc.Date = new Date(row.doc.Date);
							return row.doc;
						});

						// Listen for changes on the database.
						_db.changes({ live: true, since: 'now', include_docs: true})
						   .on('change', onDatabaseChange);

						return _todos;
					});
			} else {
				// Return cached data as a promise
				return $q.when(_todos);
			}
		}
	
	}
	
}]);


})();
