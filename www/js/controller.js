// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
var app = angular.module('devTodo');

angular.module('devTodo').controller('TodoCtrl',['$scope','$ionicModal','$ionicPlatform','TodoManager','SecurityManager',function($scope, $ionicModal, $ionicPlatform, TodoManager, SecurityManager){
	 // Initialize the database.
    $ionicPlatform.ready(function() {
        // Get all birthday records from the database.
        SecurityManager.initRemote().then(function(data){
          console.log(data);
        }).catch(function(err){
          console.error(err);
        });

      TodoManager.getAllTodos().then(function(todos) {
        console.log(todos);
        $scope.tasks = todos;
      });

      SecurityManager.getLoggedInUser().then(function(data){
        $scope.loggedInUser = data;

      }).catch(function(err){
        console.error(err);
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

  $ionicModal.fromTemplateUrl('login-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.loginModal = modal;
  });

  $scope.openLoginModal = function(){
    $scope.loginModal.show();
  }

  $scope.logout = function(){
    SecurityManager.logout().then(function(data){
      console.log(data);
      delete $scope.loggedInUser;
    }).catch(function(err){
      console.error(err);
    })
  }

  $scope.resetLogin = function(){
    $scope.loginModal.hide();
  }

  $scope.user = {}
  $scope.submitLogin = function(){
    console.log($scope.user);
    SecurityManager.login($scope.user.username,$scope.user.password).then(function(data){
      $scope.loggedInUser = data;
      $scope.loginModal.hide();
    }).catch(function(err){
      console.error(err);
      $scope.loginError = err;
      delete $scope.loggedInUser;
    })

  }

	$scope.getTasks = function () {
		//fetches task from local storage
		return $scope.tasks;
	}
	$scope.createTask = function () {
		//creates a new task
		TodoManager.saveTodo($scope.task);
		$scope.task = {};
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
      TodoManager.updateTodo( $scope.tasks[index]);
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
