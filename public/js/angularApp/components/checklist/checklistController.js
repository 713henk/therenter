/**
 * Created by User on 25/05/2017.
 */
/**
 * Created by User on 25/05/2017.
 */
(function() {
    'use strict';
    angular
        .module('therenter')
        .controller('ChecklistController', ChecklistController);

    function ChecklistController($scope, $rootScope, checklistService, $timeout, $q, $log, $mdDialog, $localStorage, $sessionStorage, $mdToast, anchorSmoothScroll, $location) {
        console.log('IS THERE A ROOT USER: ' + $rootScope.user.isLoggedIn());
        // var firstName="";
        // var lastName = "";
        // var gender = "";
        // var userID = "";
        $scope.selectedAnswers = null;
        // Initialise form submitted state
        $scope.checklistformSubmitted = false;
        $scope.searchformSubmitted = false;
        $scope.init = function(ev) {
            // $timeout(function(){
            //	if (!$rootScope.user.isLoggedIn()) {
            //		console.log('SIGN UP DIALOG ON CHECKLIST PAGE IF NO USER');
            //		$scope.showAdvanced(ev, 'signin');
            //	}
            // }, 30000);
        };
        $scope.isWaitingForm = false;
        $scope.searchAddress = {
            city: '',
            streetName: '',
            streetNumber: '',
            floor: '',
            apartmentNumber: '',
        };
        $scope.checklistAddress = {
            city: '',
            streetName: '',
            streetNumber: '',
            floor: '',
            apartmentNumber: '',
        };
        $scope.results = '';
        var maxItems = 1;
        $scope.data = {};
        $scope.data.cb1 = true;
        $scope.data.cb2 = false;
        $scope.data.cb3 = false;
        $scope.data.cb4 = false;
        $scope.data.cb5 = false;
        $scope.leaveDialogShown = false;
        $scope.createQuestionsList = function() {
            $scope.questionsList = [];
            //	console.log("Number of questions received: " + $scope.allQuestions.length);
            for (var questionIndex = 0; questionIndex < $scope.allQuestions.length; questionIndex++) {
                $scope.answers = [];
                $scope.selectedAnswers.push({ question: $scope.allQuestions[questionIndex], answers: $scope.allQuestions[questionIndex].answers, checked: [] });
                //	console.log("Question: " + $scope.allQuestions[questionIndex].question);
                for (var answers_index = 0; answers_index < $scope.allQuestions[questionIndex].answers.length; answers_index++) {
                    $scope.answers.push({
                        //	checked: false,
                        answer: $scope.allQuestions[questionIndex].answers[answers_index]
                    });
                }
                $scope.question = $scope.allQuestions[questionIndex].question;
                $scope.questionsList.push({ _id: $scope.allQuestions[questionIndex]._id, position: $scope.allQuestions[questionIndex].sortOrder, question: $scope.question, answers: $scope.answers });
            }
        };
        $scope.submitChecklistForm = function(ev) {
            if (!$rootScope.user.isLoggedIn()) {
                console.log('AN ERROR OCCURED THERE IS SUPPOSE TO BE A USER PRESENT WHEN SEEING THE CHECKLIST');
                //	$scope.showAdvanced(ev, 'signin');
            } else {
                if ($scope.checklistForm.$valid) {
                    $scope.isWaitingForm = true;
                    $scope.checklistformSubmitted = true;
                    var user = $rootScope.user.isLoggedIn();
                    $log.warn('user - ' + JSON.stringify(user));
                    $log.warn($rootScope.user.last_name);
                    $log.warn($rootScope.user.first_name);
                    var userID = user.userID;
                    $log.info('Answers: ' + JSON.stringify($scope.selectedAnswers));
                    $scope.parsedSelected = [];
                    for (var indexSelected = 0; indexSelected < $scope.selectedAnswers.length; indexSelected++) {
                        var selectedToParse = $scope.selectedAnswers[indexSelected];
                        console.log(JSON.stringify(selectedToParse));
                        if (selectedToParse.checked[0]) {
                            var parsedAnswer = selectedToParse.checked[0].answer;
                        } else {
                            parsedAnswer = "אין מידע";
                        }
                        var parsedEntry = {
                            parsed_question: selectedToParse.question.question,
                            question: selectedToParse.question._id,
                            answer: parsedAnswer,
                        };
                        $scope.parsedSelected.push(parsedEntry);
                    }
                    $log.info(JSON.stringify($scope.parsedSelected));
                    $scope.entryToCreate = {
                        facebookUser: userID,
                        address: {
                            city: $scope.selectedChecklistCity.display,
                            streetName: $scope.checklistAddress.streetName,
                            streetNumber: $scope.checklistAddress.streetNumber,
                            floor: $scope.checklistAddress.floor,
                            apartmentNumber: $scope.checklistAddress.apartmentNumber
                        },
                        answers: $scope.parsedSelected
                    };
                    checklistService.createChecklistEntry($scope.entryToCreate).then(function(createdEntry) {
                        console.log(createdEntry);
                        $scope.createdEntry = createdEntry;
                        $scope.parsedForShare = angular.copy($scope.parsedSelected);
                        console.log('created entry at entry - ' + $scope.createdEntry);
                        $scope.resetForm();
                        $scope.isWaitingForm = false;
                        $scope.showAdvanced(ev, 'checklist');

                    })
                } else {
                    var message = "השדות הבאים לא מולאו כמו שצריך: ";
                    if (!$scope.selectedChecklistCity)
                        message = message + "עיר, ";
                    if (!$scope.selectedStreet)
                        message = message + "רחוב, ";
                    if (!$scope.checklistAddress.apartmentNumber)
                        message = message + "מספר דירה, ";
                    if (!$scope.checklistAddress.streetNumber)
                        message = message + "מספר בית";
                    var toast = $mdToast.simple()
                        .textContent(message).toastClass("md-error-toast-theme")
                    $mdToast.show(
                        toast
                        .position("end")
                        .hideDelay(5000)
                    );
                }
            }
        };

        $scope.collapseAllCategories = function(category, index) {
            console.log('INDEX = ' + JSON.stringify(index));
            for (var i in $scope.categories) {
                if ($scope.categories.hasOwnProperty(i)) {
                    if ($scope.categories[i] != category) {
                        $scope.categories[i].expanded = false;
                    }
                }
            }
            category.expanded = !category.expanded;
            console.log('INDEX = ' + index);
            console.log('CATEGORY = ' + JSON.stringify($scope.categories[index]));
            $scope.gotoChecklistElement(index);
        };
        $scope.collapseAllQuestions = function(receivedQuestion, category) {
            $log.warn('COLLAPSING QUESTIONS IN CATEGORY THAT ARE NOT OUR QUESTION - ' + JSON.stringify(receivedQuestion));
            $log.warn('CATEGORY - ' + JSON.stringify(category));
            for (var i = 0; i < $scope.categories.length; i++) {
                if ($scope.categories[i].categoryName === category.categoryName) {
                    $log.warn('found category - ' + category.categoryName);
                    for (var question in $scope.categories[i].questions) {
                        if ($scope.categories[i].questions.hasOwnProperty(question)) {
                            $log.warn('CURRENT - ' + JSON.stringify($scope.categories[i].questions[question].question));
                            $log.warn('RECEIVED - ' + JSON.stringify(receivedQuestion.question));
                            var isTheSame = JSON.stringify($scope.categories[i].questions[question].question) === JSON.stringify(receivedQuestion.question)
                            $log.warn('IS THIS OUR QUESTION? - ' + isTheSame);
                            if (!isTheSame) {
                                $scope.categories[i].questions[question].expanded = false;
                            }
                        }
                    }
                }
            }
            $log.warn('COLLAPSING SAME QUESTION - DEPENDING ON VALUE - ' + receivedQuestion.expanded);
            receivedQuestion.expanded = !receivedQuestion.expanded;
            $log.warn('COLLAPSED SAME QUESTION - DEPENDING ON VALUE - ' + receivedQuestion.expanded);

            //for(var i in $scope.categories[index].questions) {
            //	console.log('loop on i = ' + i);
            //	if ($scope.categories[index].questions.hasOwnProperty(i)) {
            //		if($scope.categories[index].questions[i].question != question.question) {
            //			console.log('NOT THE DESIRED QUESTION - EXPAND FALSE');
            //			$scope.categories[index].questions[i].expanded = false;
            //		}
            //	}
            //}
            //question.expanded = !question.expanded;
        };
        $scope.sync = function(bool, answer, question) {
            $log.warn('SYNC START');
            var foundSelected = false;
            var foundAnswer = false;
            $log.warn('RECEIVED BOOL = ' + bool);
            $log.warn('RECEIVED ANSWER = ' + JSON.stringify(answer));
            $log.warn('CURRENT QUESTION TO SYNC = ' + JSON.stringify(question));
            $log.warn('CURRENT SELECTED ANSWERS - ' + JSON.stringify($scope.selectedAnswers));
            for (var selectedIndex = 0; selectedIndex < $scope.selectedAnswers.length && !foundSelected; selectedIndex++) {
                $log.warn('RECEIVED CURRENT: ' + JSON.stringify($scope.selectedAnswers[selectedIndex]));
                $log.warn('QUESTION FROM CURRENT: ' + JSON.stringify($scope.selectedAnswers[selectedIndex].question));
                $log.warn('IS QUESTION? ' + $scope.selectedAnswers[selectedIndex].question.question === question);
                if ($scope.selectedAnswers[selectedIndex].question.question === question) {
                    $log.info('Question Found');
                    $scope.currentIndex = selectedIndex;
                    foundSelected = true;
                    for (var answerIndex = 0; answerIndex < $scope.selectedAnswers[$scope.currentIndex].answers.length && !foundAnswer; answerIndex++) {
                        $log.warn('IS ANSWER? ' + $scope.selectedAnswers[$scope.currentIndex].answers[answerIndex] === answer.answer);
                        if ($scope.selectedAnswers[$scope.currentIndex].answers[answerIndex] === answer.answer) {
                            $log.warn('Answer Found');
                            $scope.currentAnswer = answerIndex;
                            foundAnswer = true;
                            if (bool) {
                                $log.info('TRUE ADDING ITEM');
                                // add item
                                $scope.selectedAnswers[$scope.currentIndex].checked.push(answer);
                                // if we have gone over maxItems:
                                if ($scope.selectedAnswers[$scope.currentIndex].checked.length > maxItems) {
                                    //remove first item
                                    $scope.selectedAnswers[$scope.currentIndex].checked[0].checked = false;
                                    $scope.selectedAnswers[$scope.currentIndex].checked.splice(0, 1);
                                }
                            } else {
                                // remove item
                                for (var i = 0; i < $scope.selectedAnswers[$scope.currentIndex].checked.length; i++) {
                                    if ($scope.selectedAnswers[$scope.currentIndex].checked[i] === answer) {
                                        $scope.selectedAnswers[$scope.currentIndex].checked[i].checked = false;
                                        $scope.selectedAnswers[$scope.currentIndex].checked.splice(i, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        $scope.exists = function(item, list) {
            return list.indexOf(item) > -1;
        };

        $scope.isIndeterminate = function() {
            return ($scope.selected.length !== 0 &&
                $scope.selected.length !== $scope.items.length);
        };


        $scope.searchRentalForm = function(event) {
            if ($scope.searchForm.$valid) {
                $scope.isWaitingForm = true;
                $scope.searchformSubmitted = true;
                $scope.parsedAddress = $scope.selectedRentalStreet.display + " " +
                    $scope.searchAddress.streetNumber + ", " +
                    $scope.selectedRentalCity.display;
                checklistService.searchAddress($scope.searchAddress).then(function(result) {
                    $scope.isWaitingForm = false;
                    if (result.length === 0) {
                        $scope.checklistResult = [{
                            address: $scope.searchAddress,
                            parsedAnswers: [{
                                question: 0,
                                answer: "אנו מתנצלים, לא קיימת רשומה לדירה זו במאגר שלנו, נשמח אם תוסיף אחת בצ'ק ליסט"
                            }]
                        }]
                    } else if (result.length === 1) {
                        $scope.checklistResult = [];
                        $scope.checklistResult = angular.copy(result);
                        $scope.checklistResult.map(function(entry) {
                            entry.parsedAnswers.map(function(question) {
                                if (question.answer === "לא ניתן מענה על שאלה זו") {
                                    question.answer = "אין מידע";
                                }
                            })
                        })
                    } else {
                        console.log('list of options');
                        console.log(result.length);
                        console.log(result);
                        $scope.checklistResult = angular.copy(result);
                        $scope.checklistResult.map(function(entry) {
                            entry.parsedAnswers.map(function(question) {
                                if (question.answer === "לא ניתן מענה על שאלה זו") {
                                    question.answer = "אין מידע";
                                }
                            })
                        })
                    }
                    $scope.gotoElement('formButtons');
                });
                // $scope.gotoElement('searchContent');
                //$scope.showAdvanced(event, 'rental');
            } else {
                alert('נא הכנס כתובת תקינה לחיפוש');
            }
        };
        $scope.gotoElement = function(eID) {
            if ($(window).width() < 600) {
                console.log('EID = ' + eID);
                // set the location.hash to the id of
                // the element you wish to scroll to.
                $location.hash(eID);
                // call $anchorScroll()
                anchorSmoothScroll.scrollTo(eID);
            } else {
                if (eID === "formButtons") {
                    console.log('scrolling to rental Search Response');
                    $location.hash(eID);
                    // call $anchorScroll()
                    anchorSmoothScroll.scrollTo(eID);
                }
                console.log('More than 600 - no scroll needed for form inputs');

            }
        };
        $scope.gotoChecklistElement = function(index) {
            console.log('INDEX = ' + JSON.stringify(index));
            var tempID;
            if (index === 0) {
                tempID = 'questions';
            } else {
                tempID = 'question-' + (index - 1);
            }
            console.log('EID = ' + tempID);
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $location.hash(tempID);
            // call $anchorScroll()
            anchorSmoothScroll.scrollTo(tempID);
        };

        function DialogController($scope, $mdDialog, $rootScope) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                console.log('created entry at answer function in dialog controller - ' + $scope.createdEntry.post.parsedAddress);
                console.log('answers - ' + JSON.stringify($scope.parsedForShare));
                var quote = $scope.createdEntry.post.parsedAddress + "\n";
                $scope.parsedForShare.map(function(question) {
                    if (question.answer !== "אין מידע") {
                        quote += question.parsed_question + " : " + question.answer + "\n";
                    }
                });
                console.log('QUOTE - ' + quote);
                $rootScope.facebook.share(quote);
                $mdDialog.hide(answer);
            };
        }
        $scope.resetForm = function() {
            $scope.checklistAddress = {
                city: "",
                streetName: "",
                streetNumber: "",
                floor: "",
                apartmentNumber: ""
            };
            $scope.parsedSelected = [];
            $scope.selectedAnswers.map(function(question) {
                if (question.checked[0])
                    question.checked[0].checked = false;
            })
        };
        $scope.showAdvanced = function(ev, source) {
            if (source === "rental") {
                $scope.dialogSource = 'checklist/checklist.dialog';
            } else if (source === "checklist") {
                $scope.dialogSource = 'checklist/thankyou.dialog';
            } else if (source === "terms") {
                $scope.dialogSource = 'terms/terms';
            } else {
                $scope.dialogSource = null;
                //$scope.dialogSource = 'checklist.dialog';
            }
            if ($scope.dialogSource !== null) {
                $mdDialog.show({
                        scope: $scope,
                        preserveScope: true,
                        controller: DialogController,
                        templateUrl: '/js/angularApp/components/' + $scope.dialogSource + '.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })
                    .then(function(answer) {
                        console.log('either answer or hide were pressed');
                    }, function() {
                        $scope.status = 'You cancelled the dialog.';
                    });
            } else {
                alert('Sorry, something went wrong: ' + source);
            }

        };
        $scope.showLeaveDialog = function(ev) {
            if (!$scope.leaveDialogShown) {
                $scope.leaveDialogShown = true;
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('היי חברים!')
                    .textContent("אם לא מלאתם את הצ'ליסט אנא תשקלו שוב. תודה!")
                    .ariaLabel('Alert Dialog Demo')
                    .ok('Got it!')
                    .targetEvent(ev)
                );
            }
        };
        $scope.simulateQuery = false;
        $scope.isDisabled = false;
        $scope.isDisabledStreets = true;
        $scope.querySearchStreets = querySearchStreets;
        $scope.querySearchCities = querySearchCities;
        $scope.selectedCityChange = selectedCityChange;
        $scope.selectedStreetChange = selectedStreetChange;
        $scope.searchCityTextChange = searchCityTextChange;
        $scope.searchStreetTextChange = searchStreetTextChange;

        $scope.newState = newState;
        //$scope.cities = ['באר שבע','רחובות'];
        //$scope.streets = ['באר שבע','רחובות'];
        function newState(state) {
            alert("Sorry! You'll need to create a Constitution for " + state + " first!");
        }

        // ******************************
        // Internal methods
        // ******************************

        /**
         * Search for cities... use $timeout to simulate
         * remote dataservice call.
         */

        function querySearchCities(query) {
            // console.log('scope cities: ' + JSON.stringify($scope.cities));
            var results = query ? $scope.cities.filter(createFilterFor(query)) : $scope.cities,
                deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function() { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }
        /**
         * Search for streets... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearchStreets(query, source) {
            var querySource;
            if (source === 'rental')
                querySource = $scope.rentalStreets;
            else if (source === 'checklist')
                querySource = $scope.checklistStreets;
            if (querySource) {
                var results = query ? querySource.filter(createFilterFor(query)) : querySource,
                    deferred;
                if ($scope.simulateQuery) {
                    deferred = $q.defer();
                    $timeout(function() { deferred.resolve(results); }, Math.random() * 1000, false);
                    return deferred.promise;
                } else {
                    return results;
                }
            } else {
                $timeout(function() {
                    alert('Search intent before streets were loaded.');
                });
            }
        }

        function searchStreetTextChange(text) {
            if (!text) {
                $log.info('No Street Text');
            } else
                $log.info('Street Text changed to ' + text);
        }

        function searchCityTextChange(text) {
            if (!text) {
                $log.info('No City Text');
            } else {
                $log.info('City Text changed to ' + text);

            }
        }

        function selectedCityChange(city, source) {
            if (source === "rental") {
                if (!city) {
                    $log.info('RENTAL - No Selected City');
                    $scope.selectedRentalStreet = null;
                    $scope.selectedRentalCity = null;
                    $scope.rentalStreets = loadCityStreets("", 'rental');
                    $scope.parsedAddress = null;
                } else {
                    $scope.searchAddress.city = city.display;
                    $scope.selectedRentalCity = city;
                    $log.info('City changed to ' + JSON.stringify(city));
                    $log.info('SELECTED RENTAL City changed to ' + JSON.stringify($scope.selectedRentalCity));
                    $log.info('LOADING ' + city.display + ' STREETS');
                    $scope.rentalStreets = loadCityStreets(city.display, 'rental');
                }
            } else if (source === "checklist") {
                if (!city) {
                    $log.info('CHECKLIST - No Selected City');
                    $scope.selectedChecklistStreet = null;
                    $scope.selectedChecklistCity = null;
                    $scope.checklistStreets = loadCityStreets("", 'checklist');
                } else {
                    $scope.checklistAddress.city = city.display;
                    $scope.selectedChecklistCity = city;
                    console.log('SELECTED CHANGE CHECKLIST CITY - ' + JSON.stringify($scope.selectedChecklistCity));
                    $log.info('CHECKLIST City changed to ' + JSON.stringify(city, 'checklist'));
                    $log.info('SELECTED CHECKLIST City changed to ' + JSON.stringify($scope.selectedChecklistCity));

                    $log.info('CHECKLIST LOADING ' + city.display + ' STREETS');
                    $scope.checklistStreets = loadCityStreets(city.display, 'checklist');
                }
            }
        }

        function selectedStreetChange(street, source) {
            if (source === "rental") {
                if (!street) {
                    $log.info('RENTAL No Selected Street');
                    $scope.selectedStreet = undefined;
                } else {
                    $scope.searchAddress.streetName = street.display;
                    $scope.selectedStreet = street;
                    $log.info('RENTAL Street changed to ' + JSON.stringify(street));

                }
            } else if (source === "checklist") {
                if (!street) {
                    $log.info('No Selected Street');
                    $scope.selectedStreet = undefined;

                } else {
                    $scope.checklistAddress.streetName = street.display;
                    $scope.selectedStreet = street;
                    $log.info('CHECKLIST Street changed to ' + JSON.stringify(street));

                }
            }

        }

        /**
         * Build `cities` list of key/value pairs
         */
        $scope.loadQuestions = function() {
            $timeout(function() {
                $log.warn('AFTER LOAD CITIES - BEFORE CREATE QUESTIONS');
                $log.warn('IS SELECTED EMPTY? - ' + $scope.selectedAnswers);
                if ($scope.selectedAnswers === undefined || $scope.selectedAnswers === null) {
                    $scope.selectedAnswers = [];
                    $log.warn('SELECTED ANSWERS WAS EMPTY OR UNDEFINED STARTING TO GET QUESTIONS');
                    checklistService.getQuestionsByCategory().then(function(allQuestions) {
                        $scope.allQuestions = allQuestions;

                        $scope.categories = angular.copy(allQuestions);
                        for (var index = 0; index < $scope.categories.length; index++) {
                            for (var questionIndex = 0; questionIndex < $scope.categories[index].questions.length; questionIndex++) {
                                $scope.categories[index].questions[questionIndex].answersParsed = [];
                                angular.forEach($scope.categories[index].questions[questionIndex].answers, function(answer) {
                                    $scope.categories[index].questions[questionIndex].answersParsed.push({ answer: answer });
                                });
                                $scope.selectedAnswers.push({ question: $scope.categories[index].questions[questionIndex], answers: $scope.categories[index].questions[questionIndex].answers, checked: [] });

                            }
                        }
                        $log.warn('CREATED SELECTED ANSWERS ARRAY FOR SYNC - ' + $scope.selectedAnswers.length + " QUESTIONS FOUND");
                        for (var index = 0; index < $scope.selectedAnswers.length; index++) {
                            $log.warn('QUESTION NUMBER - ' + (index + 1) + " - " + JSON.stringify($scope.selectedAnswers[index].question.question));
                        }
                        //console.log(JSON.stringify(allQuestions));
                        //console.log(JSON.stringify($scope.allQuestions));
                        //console.log("CALLING CREATE QUESTION LIST");
                        //$scope.createQuestionsList();
                        //console.log("END CREATE QUESTION LIST");
                    });
                } else {
                    $log.warn('SELECTED ANSWERS ARRAY FOR SYNC WAS ALREADY CREATED - ' + $scope.selectedAnswers.length + " QUESTIONS FOUND");
                    for (var index = 0; index < $scope.selectedAnswers.length; index++) {
                        $log.warn('QUESTION NUMBER - ' + index + 1 + " - " + $scope.selectedAnswers[index].question);
                    }
                }
            })
        };
        $scope.loadAllCities = function() {
            $timeout(function() {
                $log.info('LOADING CITIES');
                checklistService.getCitiesList().then(function(resultCitiesList) {
                    $scope.cities = resultCitiesList.map(function(city) {
                        //console.log(city);
                        return {
                            //value: city.toLowerCase(),
                            value: city.value,
                            display: city.display
                        };
                    });
                    //console.log("LOADED CITIES: " + JSON.stringify($scope.cities));
                });
            })
        };
        /**
         * Build `streets` list of key/value pairs
         */
        function loadCityStreets(city, source) {
            //console.log(city + " " + source);
            var cityStreetsToGet = {};
            if (city === "") {
                cityStreetsToGet = {
                    display: ""
                };
            } else {
                if (source === 'rental') {
                    console.log('selected rental - ' + JSON.stringify($scope.selectedRentalCity));
                    cityStreetsToGet = $scope.selectedRentalCity;
                } else if (source === 'checklist') {
                    console.log('selected checklist - ' + JSON.stringify($scope.selectedChecklistCity));
                    cityStreetsToGet = $scope.selectedChecklistCity;
                }
            }
            if (cityStreetsToGet) {
                console.log('cityStreetsToGet - ' + JSON.stringify(cityStreetsToGet));
                checklistService.getStreetsByCity(JSON.stringify(cityStreetsToGet.display)).then(function(resultStreetsList) {
                    if (source === 'rental') {
                        console.log('GETTING RENTAL CITY STREETS');
                        $scope.rentalStreets = resultStreetsList.map(function(street) {
                            //console.log(street);
                            return {
                                //value: city.toLowerCase(),
                                value: street.value,
                                display: street.display
                            };
                        });
                        //console.log("LOADED " + cityStreetsToGet + " STREETS: " + JSON.stringify($scope.rentalStreets));
                    } else if (source === 'checklist') {
                        console.log('GETTING CHECKLIST CITY STREETS');
                        $scope.checklistStreets = resultStreetsList.map(function(street) {
                            //console.log(street);
                            return {
                                //value: city.toLowerCase(),
                                value: street.value,
                                display: street.display
                            };
                        });
                        //console.log("LOADED " + cityStreetsToGet + " STREETS: " + JSON.stringify($scope.checklistStreets));
                    }
                    $scope.isDisabledStreets = false;
                });
            }

        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            console.log(query);
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) !== -1);
                //return (item.value.indexOf(lowercaseQuery) !== -1);
            };

        }
        // $scope.$watch('checklistForm.$valid', function () {
        // 	console.log("Checking Form Validity: "+$scope.checklistForm.$valid);
        // 	//if ($scope.checklistForm.$valid && $scope.selectedStreet) {
        // 	//	var message = "הכנסת כתובת תקינה, הצ'קליסט מוכן להזנה.";
        // 	//	var toast = $mdToast.simple()
        // 	//		.textContent(message);
        // 	//	$mdToast.show(
        // 	//		toast
        // 	//			.position("bottom end")
        // 	//			.hideDelay(3000)
        // 	//	);
        // 	//	//$timeout(function() { document.getElementById("questions").focus(); }, 500);

        // 	//}
        // });
    }
})();