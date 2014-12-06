"use strict";

var capstonesUrl = 'https://api.parse.com/1/classes/capstones';


angular.module('CapstonesList', [])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'LPLyK3Gy2gc4VHUW143qhkZXSblTUC1jzRdwC7AY';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'Tyu8ovkDEuLhi6TvX8gBRbJQazvXJSRRFigEu9gl';
    })
    .controller('CapstonesController', function($scope, $http) {
        $scope.refreshCapstones = function() {
            $http.get(capstonesUrl)
                .success(function(data) {
                    $scope.capstones = data.results;
                });
        };
        $scope.refreshCapstones();

        $scope.addCapstones = function() {
            $scope.inserting = true;
            $http.post(capstonesUrl, $scope.newCapstone)
                .success(function(responseData) {
                    $scope.newCapstone.objectId = responseData.objectId;
                    $scope.capstones.push($scope.newCapstone);
                    // $scope.refreshCapstones();

                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        function validateForm(form) {
            var requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'birthdate'];
            var idx;
            var valid = true;

            for(idx = 0; idx < requiredFields.length; idx++) {
                if (!validateRequiredField(form.elements[requiredFields[idx]])) {
                    valid = false;
                }
            }
        }

        function validateRequiredField(field) {

            var value = field.value;
            value = value.trim();
            var valid = value.length > 0;

            if (valid) {
                field.className = 'form-control';
            } else {
                field.className = 'form-control invalid-field';
            }

            return valid;
        }

        $scope.submitForm = function(isValid) {
            // check to make sure the form is completely valid
            $scope.submitted = true;
            if (isValid) {
                $scope.addCapstones();
                alert('our form is amazing');
            }
        }

        $scope.updateCapstones = function(comment) {
            $http.put(capstonesUrl + '/' + comment.objectId, comment)
                .success(function() {
                });
        };

        $scope.submit = function() {
            alert('Submitted!');
        };

        $scope.cancel = function($location) {
            if (window.confirm("Do you really want to leave?")) {
                window.location = 'index.html';
            }
        };

        $scope.year="";
        $scope.program="";
        $scope.category = "";
        
        $scope.refreshCapstones();


        $scope.filter = function() {
          
            // $http.get(capstonesUrl + '?where={"year":year.value}')
            //     .success(function(data) {
            //         $scope.capstones = data.results;
            //     });
            $http.get(capstonesUrl)
                .success(function(data) {
                
                    $scope.capstones = data.results.filter(function(capstone) {
                        console.log(data.results);

                        if ($scope.year == "yearAll" || $scope.year == "") {
                            capstone.year = year.value;
                        }

                        if ($scope.category == "categoryAll" || $scope.category == "") {
                            capstone.category = category.value;
                        }

                        if ($scope.program == "sortedAll" || $scope.program == "") {
                            capstone.program = program.value;
                        }

                        return (capstone.year == year.value && capstone.category == category.value 
                            && capstone.program == program.value);
                    });

                });

        };

        $scope.newProjects = {done: false};


        $scope.addProject = function() {
            $http.post(projectsUrl, $scope.newProjects).success(function(responseData) {
                $scope.newProjects.objectId = responseData.objectId;
                $scope.tasks.push($scope.newProjects);
                $scope.newProjects = {done: false};


            }).error(function(err) {
                $scope.errorMessage = err;
            });
        };


        $scope.incrementLikes = function(capstone, amount) {
            $scope.updating = true;
            $http.put(capstonesUrl + '/' + capstone.objectId, {
                likes: {
                    __op: 'Increment',
                    amount: amount
                }
            })
            .success(function(responseData) {
                capstone.likes = responseData.likes;
            }).error(function(err) {
                console.log(err);
                })
            .finally(function() {
                $scope.updating = false;
            });

        };

    })

    .controller('ProjectController', function($scope, $http) {
        $scope.getCapstone = function() {

            var newUrl = window.location.pathname+window.location.search;
            var urlArray = newUrl.split('=');
            var objectId = urlArray[1];

            $http.get(capstonesUrl)
                .success(function(data) {
                    $scope.capstones = data.results.filter(function(project) {
                        console.log("are you getting here");
                        return (project.objectId == objectId);
                    });
                });
            // $http.get(capstonesUrl + '/' + objectId)
            //     // console.log(capstonesUrl + '/' + objectId)
            //     .success(function(data) {

            //         $scope.capstones = data.results;
            //         console.log($scope.capstones);


            //     });
        };
        $scope.getCapstone();

        $scope.changePic = function(imgSrc) {
            document.getElementById("img-main").src = imgSrc;
        };

        $scope.banner = function() {

        }
    });


// Pretty file
// if ($('.prettyFile').length) {
//    $('.prettyFile').each(function() {
//        var pF          = $(this),
//            fileInput   = pF.find('input[type="file"]');

//        fileInput.change(function() {
//            // When original file input changes, get its value, show it in the fake input
//            var files = fileInput[0].files,
//                info  = '';
//            if (files.length > 1) {
//                // Display number of selected files instead of filenames
//                info     = files.length + ' files selected';
//            } else {
//                // Display filename (without fake path)
//                var path = fileInput.val().split('\\');
//                info     = path[path.length - 1];
//            }

//            pF.find('.input-append input').val(info);
//        });

//        pF.find('.input-append').click(function(e) {
//            e.preventDefault();
//            // Make as the real input was clicked
//            fileInput.click();
//        })
//    });
// }
