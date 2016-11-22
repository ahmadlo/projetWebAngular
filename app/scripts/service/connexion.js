'use strict';

var MyApp = angular.module('projetwebApp');
var API_URL='http://192.168.43.254:8000/api';
MyApp.factory('api', function($resource,$http,$base64){
    function add_auth_header(data){
        // as per HTTP authentication spec [1], credentials must be
        // encoded in base64. Lets use window.btoa [2]
        var header={
        	login:$base64.encode(data.login),
        	pwd:$base64.encode(data.pwd)
        }; 
        return header;
    }
    /*function add_type(argument) {
        var params={
            id:$base64.encode(argument.id)
        };
        return params;
        // body...
    } */ 
    return {
        auth: $resource(API_URL+'/login\\/', {}, {
            login: {method: 'GET', headers: add_auth_header}
           // logout: {method: 'POST', params: add_auth_header}
        }),
        users: $resource(API_URL+'/users\\/', {}, {
            create: {method: 'POST'}
        }),

        clients:$resource(API_URL+'/clients',{},{
            save:{method:'POST'},
            get:{method:'GET',url:API_URL+'/clients/:pk'},
            update:{method:'PUT',url:API_URL+'/clients/:pk'},
            delete:{method:'DELETE',url:API_URL+'/clients/:pk'},
            //query:{method:'GET',params:{i:'@id'},isArray:false}

        }),
        taches:$resource(API_URL+'/taches',{},{
            get:{method:'GET',url:API_URL+'/taches/:pk/'},
            save:{method:'POST'},
            update:{method:'PUT',url:API_URL+'/taches/:pk/'},
            delete:{method:'DELETE',url:API_URL+'/taches/:pk/'}
        }),
        type:$resource(API_URL+'/types/:pk/',{},{
            get:{method:'GET'},
            save:{method:'POST'},
            update:{method:'PUT'},
            delete:{method:'DELETE'}
            

            }),
        zone:$resource(API_URL+'/zones',{},{
            save:{method:'POST'},
            get:{method:'GET',url:API_URL+'/zones/:pk'},
            update:{method:'PUT',url:API_URL+'/zones/:pk'},
            delete:{method:'DELETE',url:API_URL+'/zones/:pk'},
        }),
        categorie:$resource(API_URL+'/categories/:id/',{},{

            get:{method:'GET'},
            save:{method:'POST'},
            update:{method:'PUT'},
            delete:{method:'DELETE'}
        }),
        agent:$resource(API_URL+'/agents/:id/',{},{
            get:{method:'GET'},
            save:{method:'POST'},
            update:{method:'PUT'},
            delete:{method:'DELETE'}

        }),
        commerciaux:$resource(API_URL+'/commerciaux/:id/',{},{
            get:{method:'GET'},
            save:{method:'POST'},
            update:{method:'PUT'},
            delete:{method:'DELETE'}

        }),
        typemission:$resource(API_URL+'/typemissions/:id/',{},{
            get:{method:'GET'},
            save:{method:'POST'},
            update:{method:'PUT'},
            delete:{method:'DELETE'} 
        }),
        programme:$resource(API_URL+'/programmes/:id/',{},{
            get:{method:'GET'},
            save:{method:'POST'},
            update:{method:'PUT'},
            delete:{method:'DELETE'} 
        }),
        stats:$resource(API_URL+'/stat',{},{
            get:{method:'GET',isArray:true},
        })
    };       
});
/*MyApp.factory('Clients',function($resource, $base64){
   
    return{
        
    }
});*/

MyApp.factory('isLogged',function($rootScope){
    var isLogged={};
   // isLogged.is_authenticated='';
    isLogged.init=function(log){
        this.is_authenticated=log;
       // this.Logged();
    };
    isLogged.exec=function(){
        this.Logged();
                //console.log(this.is_authenticated);


    };

    isLogged.Logged=function(){
         $rootScope.$broadcast('handleBroadcast');
     };
     return isLogged;

});
 

/*MyApp.factory('Log', ['$resource',
    function ($resource) {
        return $resource(API_URL+'log', {}, {
            get: {method: 'GET'}
        });
    }]);
 
MyApp.factory('Login', ['$resource',
    function ($resource) {
        return $resource(API_URL+'login', {}, {
            save: {method: 'POST'}
        });
    }]);
 
MyApp.factory('Logout', ['$resource',
    function ($resource) {
        return $resource(API_URL+'logout', {}, {
            get: {method: 'GET'}
        });
    }]);*/

/*MyApp.factory('Dream', ['$resource',
    function ($resource) {
        return $resource("dream/:id", {page: '@page'}, {
            get: {method: 'GET'},
            save: {method: 'POST'},
            delete: {method: 'DELETE'},
            update: {method: 'PUT'}
        });
    }]);*/


  /*.service('Usersres', function Usersres($q, $http, $cookies, $rootScope,$resources) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var service = {
    	'API_URL':'',
    	'login':function function_name(args) {
    		
    	}
    	//$http.defaults.useXDomain = true;


    }
    return service;
    });*/
