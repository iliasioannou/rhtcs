'use strict';

angular.module('rheticus')
 	.controller('LoginController',['$rootScope','$scope','AuthenticationService',
    function($rootScope,$scope,AuthenticationService){

      var self = this; //this controller

      var getLoginStatus = function () {
				return $rootScope.login.logged;
			};

      var getUserDetails = function () {
        var userDetails = {"username" : "", "name" : "", "surname" : "", "company" : "", "email" : ""};
        if (($rootScope.login.details!==null) && $rootScope.login.details.info){
          userDetails = {
            "username" : ($rootScope.login.details.info.username) ? $rootScope.login.details.info.username : "",
            "name" : ($rootScope.login.details.info.name) ? $rootScope.login.details.info.name : "",
            "surname" : ($rootScope.login.details.info.surname) ? $rootScope.login.details.info.surname : "",
            "company" : ($rootScope.login.details.info.company) ? $rootScope.login.details.info.company : "",
            "email" : ($rootScope.login.details.info.email) ? $rootScope.login.details.info.email : ""
          };
        }
        return userDetails;
      };

      var login = function () {
				$scope.dataLoading = true;
				AuthenticationService.Login(self.username,self.password,
          function(response) {
            self.user = "";
            if(response.username === self.username) {
  						AuthenticationService.SetCredentials(self.username,self.password,response);
              self.user = getUserDetails().name + " " + getUserDetails().surname;
              self.error = null;
  					} else {
  						self.error = response.message;
  					}
            self.dataLoading = false;
  				}
        );
			};
      var logout = function () {
				AuthenticationService.ClearCredentials();
        /*self.user = "";
        self.username = "";
        self.password = "";*/
			};

      angular.extend(self,{
        "dataLoading" : false,
        "error" : null,
        "username" : "",
        "password" : "",
        "user" : getUserDetails().name + " " + getUserDetails().surname,
        "login" : login,
        "logout" : logout,
        "getLoginStatus" : getLoginStatus
  		});
		}]
	);
