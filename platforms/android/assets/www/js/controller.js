// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
var app = angular.module('devTodo');

angular.module('devTodo').controller('TodoCtrl',['$scope','$ionicModal','$ionicPlatform','TodoManager',function($scope, $ionicModal, $ionicPlatform, TodoManager){
	 // Initialize the database.
    $ionicPlatform.ready(function() {
        TodoManager.initDB();

        // Get all birthday records from the database.
        TodoManager.getAllTodos().then(function(todos) {
            console.log(todos);
            $scope.tasks = todos;
        });
    });



	//initialize the tasks scope with empty array
	$scope.tasks = [];

	//initialize the task scope with empty object
	$scope.task = {};

	//configure the ionic modal before use
	$ionicModal.fromTemplateUrl('new-task-modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.newTaskModal = modal;
	});

	$scope.getTasks = function () {
		//fetches task from local storage
		return $scope.tasks;
	}
	$scope.createTask = function () {
		//creates a new task
    console.log('Created!')
    console.error('Error! :(')
		TodoManager.saveTodo($scope.task);
		$scope.task = {};
		//close new task modal
		$scope.newTaskModal.hide();
	}
	$scope.removeTask = function (index) {
		TodoManager.deleteTodo($scope.tasks[index]);
		$scope.tasks.splice(index, 1);
	}
	$scope.completeTask = function (index) {
		//updates a task as completed
		if (index !== -1) {
		  $scope.tasks[index].completed = !!$scope.tasks[index].completed ;
		}
	}

	$scope.openTaskModal = function(){
		$scope.newTaskModal.show();
	}

	$scope.closeTaskModal = function(){
		$scope.newTaskModal.hide();
	}

  $scope.$on('add', function(event, todo) {
    var results = [];
    angular.forEach($scope.tasks, function(value, key) {
      if(todo._id === value._id){
        this.push(value);
      }
    }, results);

    if(results.length === 0){
      $scope.tasks.push(todo);
    }

  });

  $scope.$on('delete', function(event, id) {
    for(var i = 0; i < $scope.tasks.length; i++) {
      if($scope.tasks[i]._id === id) {
        $scope.tasks.splice(i, 1);
      }
    }
  });

}]);


})();
