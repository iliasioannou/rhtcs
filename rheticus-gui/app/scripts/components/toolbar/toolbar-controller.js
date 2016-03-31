'use strict';
angular.module('rheticus')
.controller('ToolbarCtrl', function($scope,$rootScope,$mdSidenav,$mdDialog) {
  $scope.openSettingMenu = function() {
    $mdSidenav('settingMenu').toggle();
  };
  $scope.openFilterMenu = function() {
    $mdSidenav('filterMenu').toggle();
  };
  $scope.openAreaMenu = function() {
    $mdSidenav('areaMenu').toggle();
  };
  $scope.closeDialog = function() {
    $mdDialog.hide();
  };
  $scope.showLoading=false;
  if (($rootScope.login.details!==null) && $rootScope.login.details.info){
    document.getElementById('userNameView').innerHTML=($rootScope.login.details.info.username) ? $rootScope.login.details.info.username : "";
  }

  var alert;
  $scope.showDialog = function ($event) {
    var parentEl = angular.element(document.querySelector('md-content'));
    alert = $mdDialog.alert({
      parent: parentEl,
      targetEvent: $event,
      clickOutsideToClose:true,
      template:
        '<md-dialog ng-controller="LoginPopoupCtrl as loginPop" aria-label="Sample Dialog" ng-cloak="">' +
          '<md-content ng-hide="loginPop.getLoginStatus()">'+
          '   <form name="formLogin" ng-submit="loginPop.login()">'+
		      '			<md-input-container layout="row" layout-align="center">'+
					'				<h2>Welcome</h2>'+
					'     </md-input-container>'+
          '			<md-input-container style="margin:5px;" layout="row" layout-align="center">'+
					'				<label>Email</label>'+
					'				<input autocomplete="off" style="width: 300px; margin-right: 5px;" md-autofocus="" ng-model="loginPop.username" id="username" >'+
					'     </md-input-container><br>'+
					'     <md-input-container style="margin:5px;" layout="row" layout-align="center">'+
					'				<label>Password</label>'+
					'				<input ng-model="loginPop.password" type="password" id="password">'+
					'     </md-input-container><br>'+
					'     <md-input-container style="margin:5px;" layout="row" layout-align="center">'+
					'					<md-button type="submit" class="md-raised md-primary" style="margin-left:5px;"ng-click="loginPop.login()">Login</md-button>'+
					'     </md-input-container><br>'+
          '   </form>'+
					'			<label ng-show="loginPop.error!=null" style="color:red;display: block;text-align: center;" style="color:red;">Not authorized !!!</label>'+
          '     <md-progress-linear ng-show="loginPop.showLoading" md-mode="indeterminate"></md-progress-linear>'+
          '</md-content>' +
          '<md-content ng-show="loginPop.getLoginStatus()">'+
		      '			<md-input-container style="margin:5px;" layout="row" layout-align="center">'+
					'				<h2>You are logged as:</h2>'+
					'     </md-input-container>'+
          '			<md-input-container layout="row" layout-align="center">'+
          '				<h4> {{loginPop.user}} </h4>'+
  				'     </md-input-container>'+
					'     <md-input-container style="margin:5px;" layout="row" layout-align="center">'+
					'					<md-button class="md-raised md-primary" style="margin-left:5px;"ng-click="loginPop.logout()">Logout</md-button>'+
					'     </md-input-container><br>'+
          '     <md-progress-linear ng-show="loginPop.showLoading" md-mode="indeterminate"></md-progress-linear>'+
          '</md-content>' +
        '</md-dialog>',

    });

    $mdDialog
      .show( alert )
      .finally(function() {
        alert = undefined;
      });
  };

});

angular.module('rheticus').config(function($mdThemingProvider) {
  $mdThemingProvider.definePalette('amazingPaletteName', {
   '50': '003a57',
   '100': 'fbfbfb',
   '200': '003a57',
   '300': '003a57',
   '400': '003a57',
   '500': '003a57',
   '600': '003a57',
   '700': '003a57',
   '800': '003a57',
   '900': '003a57',
   'A100': '003a57',
   'A200': '003a57',
   'A400': '003a57',
   'A700': '003a57',
   'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                       // on this palette should be dark or light
   'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    '200', '300', '400', 'A100'],
   'contrastLightColors': undefined    // could also specify this if default was 'dark'
 });
  $mdThemingProvider.theme('default')
    .primaryPalette('amazingPaletteName', {
      'default': '500',
      'hue-1': '50',
      'hue-2' : '500',
    });
});



/**
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/
