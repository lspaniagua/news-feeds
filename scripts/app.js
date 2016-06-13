'use strict';

(function() {

	angular.module('app', ['ngAnimate', 'ngMaterial'])
		.constant("API", { "NEWS_MOCK": "api/news_mock.json" })
		.factory('news', ['$q', '$http', 'API', News])
		.config(Config)
		.controller('AppController', ['$scope', '$mdDialog', 'news', AppController])

	function News($q, $http, API) {
	 	var source = API.NEWS_MOCK;

	 	return {
			get: function(callback) {
        var cb = callback || angular.noop;
        var defer = $q.defer();

        $http.get(source)
          .success(function (data) {
            defer.resolve(data);
            return cb(data);
          })
          .error(function (err) {
            defer.reject(err);
            return cb(err);
          });

        return defer.promise;
      },
			setApi: function(_source) {
				source = _source
			},
			setDefault: function() {
				source = API.NEWS_MOCK;
			}
		};
	}

	function Config($mdThemingProvider) {
		$mdThemingProvider
	 		.theme('default')
	 		.warnPalette('red');
	}

	function AppController($scope, $mdDialog, news) {
	 	$scope.title = null;
	 	$scope.selectedNew = null;
	 	$scope.news = [];

	 	$scope.getNews = function() {
	 		$scope.selectedNew = null;
	 		$scope.news = null;
			news.get().then(
				function(data) {
					$scope.news = data;
				},
				function(err) {
					$scope.news = [];
					$scope.showAlert(err);
				});
	 	};

	 	$scope.selectNew = function(feed) {
	 		$scope.selectedNew = $scope.selectedNew === feed.id ? null : feed.id;
	 		$scope.title = feed.title;
	 	};

	 	$scope.setApiDefault = function() {
	 		news.setDefault();
	 		$scope.getNews();
	 	};

		$scope.showAlert = function(message) {
	    $mdDialog.show(
	      $mdDialog.alert()
	        .clickOutsideToClose(true)
	        .title('Error')
	        .textContent(message)
	        .ok('Cerrar')
	    );
	  };

	 	$scope.showPrompt = function(ev) {
	 	 	var confirm = $mdDialog.prompt()
	 				 .title('Ingrese el API de las Noticias')
	 				 .textContent('')
	 				 .placeholder('API de Noticias')
	 				 .ariaLabel('API News')
	 				 .targetEvent(ev)
	 				 .ok('Okay!')
	 				 .cancel('Cancelar');
	 	 	$mdDialog.show(confirm).then(function(result) {
	 			if (result) {
	 				news.setApi(result);
	 				$scope.getNews();
	 			}
	 		}, function() {});
	  };
	}

})();
