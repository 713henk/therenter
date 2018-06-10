/**
 * Created by User on 25/05/2017.
 */
(function () {

	'use strict';
	var isDlgOpen;
	angular
		.module('therenter')
		.controller('BlogController', BlogController)
		.service('anchorSmoothScroll', function() {
		});
	function BlogController($scope,blogService, $mdDialog){
		$scope.results = "";
		//until there are articls in the db
		$scope.loadArticles = function() {
			blogService.getAllArticles().then(function (allArticles){
				$scope.cards = allArticles;
				console.log($scope.cards);
			})
		};

		$scope.showAdvanced = function(ev, id) {
			$scope.id = id;

			// get the article
			//blogService.getArticleById($scope.id).then(function (resultArticle){
			//	if (resultArticle)
			//		console.log(reultArticle);
			//	else
			//		console.log('NO ARTICLE RECEIVED');
			//})
			//get the article hard coded
			console.log('RECEIVED ID: ' + $scope.id);
			$scope.article = getArticleByID($scope.id);
			console.log('RECEIVED ARTICLE = ' + JSON.stringify($scope.article));

			//helper function to get the article hard coded
			function getArticleByID(id) {
				console.log('SEARCHING FOR ARTICLE WITH ID: ' + id);
				var found = false;
				var result = null;
				var articleId = Number(id);
				for (var i=0; i<$scope.cards.length && !found; i++){
					console.log('i = ' + i);
					console.log('current card = ' + JSON.stringify($scope.cards[i]));
					console.log('current id = ' + $scope.cards[i].id);
					console.log($scope.cards[i].id === articleId);
					if ($scope.cards[i].id === articleId) {
						found = true;
						result = $scope.cards[i];
						console.log('found article - ' + JSON.stringify(result));
					}
				}
				if (!found)
					console.log('NO ARTICLE FOUND WITH ID = ' + id);
				return result;

			}
			$mdDialog.show({
				controller: DialogController,
				templateUrl: '/js/angularApp/components/blog/articleDialog.html',
				preserveScope: true,
				locals: {
					article: $scope.article
				},
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			})
				.then(function(answer) {
					$scope.status = 'You said the information was "' + answer + '".';
				}, function() {
					$scope.status = 'You cancelled the dialog.';
				});
		};

		function DialogController($scope, $mdDialog, article) {
			$scope.article = article;
			$scope.hide = function() {
				$mdDialog.hide();
			};

			$scope.cancel = function() {
				$mdDialog.cancel();
			};

			$scope.answer = function(answer) {
				$mdDialog.hide(answer);
			};
		}
	}
})();
