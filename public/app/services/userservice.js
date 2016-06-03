"use strict";

var app = angular.module('Andejobs');
app.factory('UserService', ['$http', 'baseUrl', '$window', function($http, baseUrl, $window) {
    var currentUser = getdecodedToken();
    var User = {
        register: function(data) {
            // console.log('register now!', data);
            return $http.post(baseUrl + '/signup', data)
        },
        login: function(data) {
            return $http.post(baseUrl + '/login', data)
        },
        logout: function() {
            changeUser({});
            delete $window.sessionStorage.token;
            success();
        },
        currentUser: function() {
            return getdecodedToken();
        },
        updateUser: function(id, success, error) {
            $http.put('baseUrl' + '/users/' + id).success(success).error(error)
        },
        deleteUser: function(id, success, error) {
            $http.delete('baseUrl' + '/users/' + id).success(success).error(error)
        }
    };

    //function decodes response from the data base which contains signed token in base64
    function base64Decode(token) {
        var output = token.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    };

    //this method gets the token information
    function getdecodedToken() {
        var token = $window.sessionStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(base64Decode(encoded));
        }
        return user;
    };

    function changeUser(user) {
        angular.extend(User.currentUser, user);
    }
    return User;

}]);
