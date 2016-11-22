'use strict';

/**
 * @ngdoc function
 * @name projetwebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projetwebApp
 */
var myapp=angular.module('projetwebApp');

/*
MainCtrl

*/

myapp.controller('MainCtrl',function(NgMap,$resource, isLogged, api, $scope, $mdDialog, $compile,$base64,$mdMedia,$location,$timeout,$mdSidenav, $log) {
  	var vm=this;
  	var mymap;
  	var ADMIN_URL='http://192.168.0.53:8000/admin/';
  	$scope.ADMIN_URL=ADMIN_URL;
  	var AfficheProg=false;
  	 // Listes d'événement à écouter
  	var shapeListeners={
  	 	'click':shapeClick,
  	 	'dragstart':shapeDragStart,
  	 	'dragend':shapeDragEnd,	
  	};
  	var pathListener={
  	 	'set_at':shapeSetAt,
  	 	'insert_at':shapeSetAt,
  	 	'remove_at':shapeSetAt
  	};
  	var markerListener={
  	 	'click':markerClick,
  	 	'dragstart':markerDragStart,
  	 	'dragend':markerDragEnd
  	};
  	var opt=[];
  	opt["bar"]={
        chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showValues: true,
                /*valueFormat: function(d){
                    return d3.format(',.4f')(d);
                },*/
                duration: 500,
                xAxis: {
                    axisLabel: 'X Axis'
                },
                yAxis: {
                    axisLabel: 'Y Axis',
                    axisLabelDistance: -10
                }
        }
    };
    opt["cercle"]={
        chart: {
		                type: 'pieChart',
		                height: 500,
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
		                }
        }
    };
    opt["donut"]= {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,

                pie: {
                    startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
                    endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
                },
                duration: 500,
                legend: {
                    margin: {
                        top: 5,
                        right: 70,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

  	var programme=[];
  	var ProgListener={
  		'click':progClick
  	};
  	 var IMG_URL='http://192.168.0.54:8000/images/';
  	 var zonecate=[];
	function zonecaterec(name) {
		// body...
		for (var i = 0; i < zonecate.length; i++) {
			if(zonecate[i].cat===name){
				return true;
			}
		}
		return false;
	}

  	function makeMission(result) {
  		// body...
  		var mission={
			id:result.id,
			libelle:result.libelle,
			lieux:result.lieu,
			etat:result.etat				
		};
		return mission;
  	}
  	function options(click,drag){
  		var option={
			click:click,
			drag:drag
		};
		return option;
  	}

		$scope.options = {
            chart: {
                type: 'lineChart',
                height: 250,
                margin : {
                    top: 40,
                    right: 10,
                    bottom: 40,
                    left: 10
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
            },
            caption: {
                enable: true,
                html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                css: {
                    'text-align': 'justify',
                    'margin': '10px 13px 0px 7px'
                }
            }
        };

        $scope.data = sinAndCos();
        //console.log('init intial',$scope.data);

        /*Random Data Generator */
        function sinAndCos() {
            var sin = [],sin2 = [],
                cos = [];

            //Data is represented as an array of {x,y} pairs.
            for (var i = 0; i < 50; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                sin2.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) *0.25 + 0.5});
                cos.push({x: i, y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
            }

            //Line chart data should be sent as an array of series objects.
            return [
                {
                    values: sin,      //values - represents the array of {x,y} data points
                    key: 'Sine Wave', //key  - the name of the series.
                    color: '#ff7f0e',  //color - optional: choose your own line color.
                    strokeWidth: 2,
                    classed: 'dashed'
                },
                {
                    values: cos,
                    key: 'Cosine Wave',
                    color: '#2ca02c'
                },
                {
                    values: sin2,
                    key: 'Another sine wave',
                    color: '#7777ff',
                    area: true      //area - set to true if you want this line to turn into a filled area chart.
                }
            ];
        };
	$scope.columns= [
	    ['data1', 30, 20, 50, 40, 60, 50],
	    ['data2', 200, 130, 90, 240, 130, 220],
	    ['data3', 300, 200, 160, 400, 250, 250]
	];
	$scope.curvesOptions = [
	  { id: 'data1', type: 'bar', name: "Données numéro 1", color: '#D62728' },
	  { id: 'data2', type: 'bar', name: "Données numéro 2", color: '#FF7F0E' },
	  { id: 'data3', type: 'line', name: "Données numéro 3", color: '#1F77B4' }
	];
	var categories=[];
	var types=[];
	var agents=[];
	var commerciaux=[];
	var typemissis=[];
	api.typemission.query(
		function(result){
					//console.log('typemissions',result);
					if(result.length!==0){
						//console.log('typemissions',result);
						for (var i = 0; i < result.length; i++) {
							var mission={
								id:result[i].id,
								name:result[i].name
							};
							typemissis[mission.id]=mission;
						}
						//$scope.typemissions=typemissions;
						console.log('typemissions',typemissis);
					}
		},
		function(error){Error(error)}
	);
	
	//$scope.commerciaux=commerciaux;

	var zones=[];
	var info=null;
	var zz=[];
	var mm=[];
	var leftbool;
	var statbon;
	var missions=[];
	var zoneselected=[];
	var cateselected=[];
	var agselected=[];
	var tyselected=[];
	var pourvrai=0,pourfaux=0;
	function Init(){
		console.log('init intial');
		leftbool=true;
		statbon=false;
		$scope.dat=[];

		$scope.selected = [];
		$scope.selected2 = [];
		$scope.selected3=[];
		zoneselected=[];
		$scope.zoneselected=[];
		$scope.agselected=[];
		$scope.tyselected=[];
		$scope.cateselected=[];
		cateselected=$scope.cateselected;
		agselected=$scope.agselected;
		tyselected=$scope.tyselected;
		zoneselected=$scope.zoneselected;
		$scope.categories=categories;
		$scope.agents=agents;
		$scope.types=types;
		$scope.missions=missions;
		NgMap.getMap().then(function(map) {
		    $scope.map=map;
		    mymap=map;
	  		//AfficherCategorie(catt);
		    console.log('center',map.getCenter());
		    console.log('markers', map.markers);
		    console.log('shapes', map.shapes);
		    map.setZoom(11);
		});
		api.commerciaux.query(function(result){
			console.log('com',result);
			for (var i = 0; i < result.length; i++) {
				//result[i]
				var agent={
					id:result[i].id,
					name:result[i].name,
					email:result[i].email,
					adr:result[i].adr,
					tel:result[i].tel,
					entreprise:result[i].entreprise
				};
				agents[result[i].id]=agent;
			}
			console.log('com',agents);
		},function(error){Error(error)});
	  	api.categorie.query(function(result){
	  		console.log('categories',result);
			for (var i = 0; i < result.length; i++) {

				var cate={
					id:result[i].id,
					name:result[i].name,
					couleur:result[i].couleur
				};
				categories[cate.id]=cate;
				catt.push(result[i].name);
			}
			console.log('categories',categories);
			AfficherCategorie(catt,null);
			$scope.categories=categories;
		});
	  	api.type.query(function(result){
	  		var aa=[];
	  		console.log('type',result);
	  		for (var i = 0; i < result.length; i++) {
	  			
	  			types[result[i].id]=makeType(result[i]);
	  			console.log('init ',types[i]);
	  			aa.push(types[result[i].id].type_name);

	  		}
	  		AfficherType(aa,options(true,false),ProgListener,null);
	  	},function(error){Error(error)});  	
	  	api.taches.query(function (result) {
		
			console.log('mission',result);
			for (var i = 0; i < result.length; i++) {
				var mission=makeMission(result[i]);
				//console.log('mission.etat',mission.etat);
				/*if (mission.etat) {
					pourvrai++;
					console.log('pourvrai',pourvrai);
				}
				else{
					pourfaux++;
					console.log('pourfaux',pourfaux);
				}*/
				missions[i]=mission;
				

				//lieux.push(mission.lieux);
			}
			/*$scope.optionns = {
           			chart: {
		                type: 'pieChart',
		                height: 500,
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
		                }
            		}
        		};
	        $scope.dataa = [
	            {
	                key: "terminée",
	                y: pourvrai
	            },
	            {
	                key: "en cours",
	                y: pourfaux
	            },
	        ];
			console.log('pourvrai',pourvrai,'pourfaux',pourfaux);*/

		},function(error){Error(error)});
		var p=[26,20,7,3]
	}
	function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
    function closenav() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close left is done");
        });
    };
    $scope.navbool=false;
    $scope.leftbool=false;
    $scope.statbon=false;
    $scope.dat=[];
	function shownav(bool) {
	
	if (bool) {
		vm.pres=!bool;
		vm.prog=!bool;

	}
	else{
		$scope.leftbool=bool;
		$scope.statbon=bool;
	}

	$scope.navbool=bool;
	//buildDelayedToggler('left')
	// body...
	}
	$scope.shownav=shownav;
	function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }
    
    var criteres=[
	    {name:'Etat',value:'etat'},
	    {name:'Zone',value:'zone'},
	    {name:'Catégorie',value:'cate'},
	    {name:'Lieu',value:'lieu'},
	    {name:'Agent',value:'agent'},
	    //{name:'Période',value:'fildate'}
	];
	var formats=[
	    {name:'diagramme circulaire',value:"cercle"},
	    {name:'histogramme',value:"bar"},
	    {name:'Donut Chart',value:"donut"},
	    
	];
	//$scope.criteres=newValue;
	$scope.stats=[];
	var stats_donnees=[];
	function CriteresRemove(crit) {
		// body...
		for (var i = 0; i < criteres.length; i++) {
			if (criteres[i].value===crit) {
				criteres.splice(i,1);
			}
			
		}
	}
	function CriteresRech(crit) {
		// body...
		for (var i = 0; i < criteres.length; i++) {
			if (criteres[i].value===crit) {
				return true;
			}
		}
		return false;
	}
	$scope.$watch(function(){return criteres},function(newValue){
		console.log('critere',newValue);
		$scope.criteres=newValue;
	})
	$scope.$watch(function(){return formats},function(newValue){
		console.log('formats',newValue);
		$scope.formats=newValue;
	})
  
	$scope.toggleLeft = buildDelayedToggler('left');
	function RightCtrl($scope, $timeout, $mdSidenav, $log) {
	
	    $scope.close =shownav;
	    $scope.data=""
	    $scope.types=types;
	    $scope.categories=categories;
	    $scope.cate =[];
	    $scope.zon =[];
	    $scope.agents=agents
	    $scope.bool=true;
	    
	    

	    console.log('LeftCtrl',$scope.$parent)
	    $scope.$watch('cate',function (newValue,oldValue) {
	    	// body...
	    	console.log('cate',newValue)
	    	if (oldValue!==undefined & newValue!==oldValue) {
	    		console.log('newValue',newValue,'oldValue',oldValue);
	    		stats_donnees['markers']=undefined;
	    	}
	    	if (newValue!==undefined) {
	    		stats_donnees['cate']=newValue;
	    		var m=mE;
	    		if (newValue.length===1) {
	    			CriteresRemove('cate');

	    		}
	    		else{
	    			if (!CriteresRech('cate')) {
	    				criteres.push({name:'Catégorie',value:'cate'});

	    			}
	    		}
	    		
	    		console.log('markers',m);
	    		console.log('cate',newValue);
	    		var m1=markerInZonecate(m,$scope.zon,newValue);
	    		//var m1=markerInCategorie(newValue,m);
	    		console.log('m1',m1);
	    		var p=Object.keys(m1).map(function(key){return m1[key].id});
	    		console.log('p',p);
	    		stats_donnees['markers']=p;
	    	} 
	    	else{
	    			if (!CriteresRech('cate')) {
	    				criteres.push({name:'Catégorie',value:'cate'});

	    			}
	    		}  	
	    });
	    $scope.$watch('zon',function (newValue,oldValue) {
	    	// body...
	    	console.log('zon',newValue)
	    	if (oldValue!==undefined & newValue!==oldValue) {
	    		console.log('newValue',newValue,'oldValue',oldValue);
	    		stats_donnees['markers']=undefined;
	    	}
	    	if (newValue!==undefined) {
	    		//console.log('zone',newValue);
	    		if (newValue.length===1) {
	    			CriteresRemove('zone');

	    		}
	    		else{
	    			if (!CriteresRech('zone')) {
	    				criteres.push({name:'Zone',value:'zone'});

	    			}
	    		}
	    		stats_donnees['zone']=newValue;
	    		var z=[];
	    		var zz=newValue;
	    		for (var i = 0; i < zz.length; i++) {
	    			var z=Object.keys(mP).map(function(key){
	    				console.log('zone',mP[key].z.categorie);
	    				if (zz[i]===mP[key].z.categorie) {
	    					return mP[key];
	    				}	
	    			});
	    			
	    		}
	    		console.log('zone',z);
	    		var zou=[] 
	    		for (var i = 0; i < z.length; i++) {
	    			if (z[i]!==undefined) {
	    				zou.push(z[i]);
	    			}
	    			
	    		}
	    		
	    		//var z=
	    		var m=mE;
	    		/*if(stats_donnees['markers']!==undefined ){
	    			m=stats_donnees['markers'];

	    		}*/
	    		var m1=markerInZonecate(m,zou,$scope.cate);
	    		var p=Object.keys(m1).map(function(key){return m1[key].id});
	    		console.log('p',p);
	    		stats_donnees['markers']=p;
	    		//var m2=markerInZone(zou,m)
	    		console.log('zone',zou,'mark final',m1);

	    		//stats_donnees['zone']=newValue;
	    	}
	    	else{
	    			if (!CriteresRech('zone')) {
	    				criteres.push({name:'Zone',value:'zone'});

	    			}
	    		}  		
	    });
	    function markerInZonecate(markers,zones,categories) {
	    	// body...
	    	if(zones.length!==0){
	    		var liste1=markerInZone(zones,markers);
	    		var liste2=markerInCategorie(categories,liste1);
	    	}
	    	else{
	    		var liste2=markerInCategorie(categories,markers);
	    	}
	    	
	    	return liste2;
	    }
	    $scope.$watch('agent',function (newValue) {
	    	// body...
	    	console.log('agent',newValue)
	    	if (newValue!==undefined) {
	    		if (newValue.length===1) {
	    			CriteresRemove('agent');

	    		}
	    		else{
	    			if (!CriteresRech('agent')) {
	    				criteres.push({name:'Agent',value:'agent'});

	    			}
	    		}
	    		stats_donnees['agent']=newValue;
	    	}  
	    	else{
	    			if (!CriteresRech('agent')) {
	    				criteres.push({name:'Agent',value:'agent'});

	    			}
	    		}  		
	    });
	    $scope.$watch('etat',function (newValue) {
	    	// body...
	    	console.log('etat',newValue)
	    	if (newValue!==undefined) {
	    		console.log('etat',newValue)
	    		if(newValue!=='Tout'){
	    			CriteresRemove('etat');

	    		
	    			stats_donnees['etat']=newValue;
	    		}
	    		else{
	    			if (!CriteresRech('etat')) {
	    				criteres.push({name:'Etat',value:'etat'});
	    			}
	    		
	    			
	    			stats_donnees['etat']=undefined;

	    			
	    		}
	    		
	    	}    	
	    });
	    $scope.$watch('debut',function (newValue) {
	    	// body...
	    	if (newValue!==undefined) {
		    	console.log('debut',newValue)
		    	var date = new Date (newValue);
				var year=date.getFullYear();
				var month=date.getMonth()+1 //getMonth is zero based;
				var day=date.getDate();
				var formatted=year+"-"+month+"-"+day;
				console.log('debut',formatted)
		    	stats_donnees['debut']=formatted;
	    	}   	
	    });
	    $scope.$watch('fin',function (newValue) {
	    	// body...
	    	if (newValue!==undefined) {
		    	console.log('fin',newValue)
		    	var date = new Date (newValue);
				var year=date.getFullYear();
				var month=date.getMonth()+1 //getMonth is zero based;
				var day=date.getDate();
				var formatted=year+"-"+month+"-"+day;
				console.log('fin',formatted)
		    	stats_donnees['fin']=formatted;
	    	}    	
	    });
	    function arrayfiltre(element) {
	  		return element !== undefined;
		}
	    function Submitstat() {
	    	$scope.$parent.statbon=false;
	    	$scope.$parent.critere=undefined;
	    	$scope.$parent.format=undefined;
	    	$scope.$parent.dat=[];
	    	
	    	$scope.bool=false;
	    	var data={};
	    	//$scope.stats_donnees=stats_donnees
	    	//console.log('stats_donnees',stats_donnees['agent'])
	    	if (stats_donnees['agent'] && stats_donnees['agent'].length!==0) {
	    		var agents=stats_donnees['agent']
	    		var agents_id=Object.keys(agents).map(function(key){
	    			return agents[key].id
	    			if(agents[key].id){
	    				console.log('key',key);
	    			    
	    			}
	    		});
	    		
	    		console.log('agents_id',agents_id.filter(arrayfiltre));
	    		data['agent']=agents_id.filter(arrayfiltre)
	    	}
	    	if (stats_donnees['etat']!==undefined) {
	    		data['etat']=stats_donnees['etat']
	    	}
	    	if (stats_donnees['debut']!==undefined) {
	    		console.log('debut',stats_donnees['debut'])

	    		data['debut']=stats_donnees['debut']
	    	}
	    	if (stats_donnees['fin']!==undefined) {
	    		console.log('debut',stats_donnees['fin'])
	    		data['fin']=stats_donnees['fin']
	    	}
	    	if (stats_donnees['markers']!==undefined) {
	    		console.log('markers',stats_donnees['markers'])
	    		data['lieu']=stats_donnees['markers']
	    	}
	    	api.stats.get(data,function(result){
	    		if(result.length!==0){
	    			$scope.$parent.leftbool=true;
	    			$scope.$parent.stats=result;
	    			console.log('result filtre',result,leftbool);
	    			
					var r=[];
				/*for (var i = 0; i < result.length; i++) {
					
					console.log('result filtr',result[i],i);
					
				}*/
				//console.log('bool',$scope.bool);
				//console.log('date_do',dates_do);
				/*for (var i = 0; i < dates_do.length; i++) {
					console.log('date_do',dates_do[i]);
					
				}*/				
	    		}
				
			});

	    	// body...
	    }
	    $scope.Submitstat=Submitstat
  	}
	$scope.LeftCtrl=RightCtrl;
	
	$scope.Init=Init;
	// initialisation du map
	//var map;
	
	function MakeChart(critere) {
		// body...
		$scope.opti =[];
			$scope.dat =[];
	    	console.log('critere',critere);
	    	switch(critere){
	    		case "etat":
	    		TriEtat($scope.stats);
	    		break;
	    		case "zone":
	    		TriZone($scope.stats);
	    		break;
	    		case "cate":
	    		TriCate($scope.stats);
	    		break;
	    		case "lieu":
	    		TriLieu($scope.stats);
	    		break;
	    		case "agent":
	    		TriAgent($scope.stats);
	    		break;
	    	}
	}

	
	
	$scope.$watchGroup(['critere','format'],function(newValue){
		console.log('critere et format',newValue);
		if (newValue[0]!==undefined && newValue[1]!==undefined) {
			console.log('critere et format',newValue);
			MakeChart(newValue[0]);
			AfficheChart(newValue[1]);

		}
		else{
			console.log('critere et format',newValue);
			$scope.opti=[];
			$scope.dat=[];
			//statbon=false;
		}
		
	},true);
	function AfficheChart(format) {
		// body...
		console.log('format',format);
		console.log('option',opt[format]);
		console.log('data',$scope.da);
		$scope.opti=opt[format];
		if (format==="bar") {
			$scope.dat=[{
			key:"rtertre",
			values:$scope.da}
			] ;
		}
		else{$scope.dat= $scope.da;}
		 
		

		$scope.statbon=true;


	}
	var catt=[];
	var mE=[];
	var mP=[];
	function TriEtat(result) {
		// body...
		pourvrai=pourfaux=0;
		for (var i = 0; i < result.length; i++) {
				var mission=makeMission(result[i]);
				console.log('mission.etat',mission.etat);
				if (mission.etat) {
					pourvrai++;
					console.log('pourvrai',pourvrai);
				}
				else{
					pourfaux++;
					console.log('pourfaux',pourfaux);
				}
				missions[i]=mission;
				

				//lieux.push(mission.lieux);
		}
		
	    $scope.da = [
	            {
	                key: "terminée",
	                y: pourvrai
	            },
	            {
	                key: "en cours",
	                y: pourfaux
	            },
	    ];
	    //$scope.statbon=true;
	}
	function TriZone(result) {
		// body...
		var m=[];
		if (stats_donnees['markers'].length!==0) {
			var ii=stats_donnees['markers'];
			for (var i = 0; i < ii.length; i++) {

				var id=ii[i];
				console.log('iii',id);
				m.push(mE[id]);

			}
		}
		else{
			for (var i = 0; i < result.length; i++) {

				var id=result[i].lieu.id;
				console.log('iii',id);
				m.push(mE[id]);

			}
			//m=Object.keys(result).map(function(key){return mE[result[key].lieu.id]});
		}
		
		console.log('zze',m);
		var zz=[];
		var data=[];
		if (stats_donnees['zone'].length===0) {
			zz=categories;
		}
		else{
			zz=stats_donnees['zone'];
		}
		console.log('zz',zz);
		//var t=zonecate;
		//console.log('t',t);
		for (var i in zz) {
			
			console.log('zzi',zz[i],zones);
			var zon=[];
			for (var j in mP) {
				if(mP[j].z.categorie.name===zz[i].name){
					zon.push(mP[j]) ;
				}
			}
			//var zon=Object.keys(zones).map(function(key){if(zones[key].categorie.name===zz[i].name) {return zones[key]}});
			console.log('zones',zon);
			var a=markerInZone(zon ,m);
			data.push({key:zz[i].name,y:a.length});
		}
		
			
	        $scope.da = data;
	        //$scope.statbon=true;        
	}
	function TriCate(result) {
		// body...
		var m=[];
		if (stats_donnees['markers'].length!==0) {
			var ii=stats_donnees['markers'];
			for (var i = 0; i < ii.length; i++) {

				var id=ii[i];
				console.log('iii',id);
				m.push(mE[id]);

			}
		}
		else{
			for (var i = 0; i < result.length; i++) {

				var id=result[i].lieu.id;
				console.log('iii',id);
				m.push(mE[id]);

			}
			//m=Object.keys(result).map(function(key){return mE[result[key].lieu.id]});
		}
		
		console.log('zze',m);
		var zz=[];
		var data=[];
		if (stats_donnees['cate'].length===0) {
			zz=types;
		}
		else{
			zz=stats_donnees['cate'];
		}
		console.log('zz',zz);
		for (var i in zz) {

			
			console.log('zzi',zz[i]);
			var zon=Object.keys(m).map(function(key){if(m[key].b.cl_type===zz[i]) {return m[key]}});;
			console.log('zones',zon);
			var nb=0;
			for (var l in zon) {
				if(zon[l]!== undefined){
					nb++;
				}
				
			}
			console.log('nb',nb);
			data.push({key:zz[i].type_name,y:nb});
		}
		
			/*$scope.opti = {
           			chart: {
		                type: 'pieChart',
		                height: 500,
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
		                }
            		}
        		};*/
	        $scope.da = data;
	        //$scope.statbon=true;
	}
	function TriAgent(result) {
		// body...
		var zz=[];
		var data=[];
		if (stats_donnees['agent']===undefined) {
			zz=agents;
		}
		else{
			zz=stats_donnees['agent'];
		}
		console.log('zz',zz);
		for (var i in zz) {
			var zon=[];
			for (var u = 0; u < result.length; u++) {
				if (zz[i].id===result[u].com.id) {
					zon.push(result[u])
				} 


			}
			console.log('zon',zon);
			data.push({key:zz[i].name,y:zon.length});


			
		}
		
		
		
		
		
			/*$scope.opti = {
           			chart: {
		                type: 'pieChart',
		                height: 500,
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
		                }
            		}
        		};*/
	        $scope.da = data;
	        //$scope.statbon=true;
	}
	function TriLieu(result) {
		// body...
		console.log('mE',mE);
		console.log('result',result);
		var data=[];

		for (var j in mE) {
			//mE[i]
			var nb=0;
			for (var i = 0; i < result.length; i++) {
				//result[i]
				if (mE[j].b.id===result[i].lieu.id) {
					nb++;
				}

			}
			if (nb!==0) {
				data.push({key:mE[j].b.cl_name,y:nb});
			}
			

		}
		/*$scope.opti = {
           			chart: {
		                type: 'pieChart',
		                height: 500,
		                x: function(d){return d.key;},
		                y: function(d){return d.y;},
		                showLabels: true,
		                duration: 500,
		                labelThreshold: 0.01,
		                labelSunbeamLayout: true,
		                legend: {
		                    margin: {
		                        top: 5,
		                        right: 35,
		                        bottom: 5,
		                        left: 0
		                    }
		                }
            		}
        		};*/
	        $scope.da = data;
	        
	}

  	function makeType(result) {

		// body...
		//console.log('moitié',result.icone.substring(IMG_URL.length,result.icone.lenght));
		//var img = new File([""],result.icone,{type:"image/"});
		//img.src=;
		//console.log('icone',img);
		var type={
			id:result.id,
			type_name:result.type_name,
			icone:result.icone
		};
		return type;
  	}
  	// centre du map a recalculer
	var pos;
	/* 
	Marker
	*/
	function markerClick(){
		console.log('click',this.b);
		var content='<div ng-include src="\'views/clients.html\'"></div>';
	    //var compiled = $compile(content)($scope);
	    $scope.is_marker=true;
	    //$scope.modif=true;
	    $scope.is_zone=false;
	    $scope.ajout=false;        
	  	//$scope.marker=this;
	  	//$scope.type=[];
	  	$scope.form=initForm("Modification","Modifier","Supprimer");

	  	//drag=false;

	  	//$scope.selectedType=marker.type;

	 	if(info){   
	           	closeInfo($scope.aa,this.a,$scope.drag); 
	           	//addSingleMarker(this.b,this.a,options(true,true),markerListener)
	           	//this  
	  	}
	  	$scope.drag=false;
	  	$scope.client=this.b;
	    $scope.$apply(initInfoWindow(content,this,this.a));
	}
	function markerDragStart(){
		
		console.log('dragstart',this);
	    if(info){
	      closeInfo($scope.aa,this.a,$scope.drag);  
	      //addSingleMarker(this.b,this.a,options(true,true),markerListener)

	  	}
	  	$scope.drag=true;
	}
	function markerDragEnd(){
		console.log('dragend',this);
	    var content='<div ng-include src="\'views/clients.html\'"></div>';
	  	$scope.marker=this;
	  	$scope.modif=true;
	   	var compiled = $compile(content)($scope);
	   	$scope.form=initForm("Modification","Enregistrer","Supprimer");
	   	$scope.client=this.b;
	   	 //$scope.type=this.b.cl_type;

		$scope.$apply(initInfoWindow(content,this,this.a));
	}
	function initMarker(map,u,options,Listener){
	  	mE=[];
	  	/*console.log('u',u.length);
	  	console.log('m',map);*/
	  	var m=[];
	  	for (var i = 0; i < u.length; i++) {
			m[i]=MakeMarker(u[i]);
			/*if(m[i].cl_type.type_name==='entreprise'){
				console.log('type',m[i].cl_type);
			}*/
			window.setTimeout(addSingleMarker(m[i],map,options,Listener),i*200);
			//addSingleMarker(m[i],map,i*200);
			
		}
						console.log('ME',mE);

		var bounds = new google.maps.LatLngBounds();
		for (i = 0; i < mm.length; i++) {
		  bounds.extend(mm[i].getPosition() );
		}
		console.log('map center', bounds.getCenter());
	  	
		if(map!==null){map.setCenter(bounds.getCenter());}
	}
	function MakeMarker(u){
		//console.log('u',u);	  		

		var lat=u.cl_lat;
			var long=u.cl_long;
			var name=u.cl_name;
			var id=u.id;
			var email=u.cl_email;
			var description=u.description;
			var type=types[u.cl_type];
		pos={lat:parseFloat(lat),lng:parseFloat(long)};
		var us={
					id:id,
					pos:pos,
					cl_name:name,
					cl_email:email,
					description:description,
					cl_type:type,
					cl_lat:lat,
					cl_long:long			
		};
		return us;
	}
	function addSingleMarker(marker,map,options,Listener){	
		console.log('Listener',Listener);
		var mi=new google.maps.Marker({
	      position: marker.pos,
	      map: map,
	      title:marker.cl_name +' ' +marker.description,
	      clickable:options.click,
	      draggable:options.drag,
	      animation: google.maps.Animation.DROP,
	      icon: marker.cl_type.icone,
	      id:marker.id
	    });
		//if(map!==null){map.panTo(mi.getPosition());}
	    var params={
	     	map:map,
	     	marker:marker
	    };
	    addMarkerListener(mi,Listener,params);
		mm.push(mi);
		mE[marker.id]=mi;
	}
	function addMarkerListener(marker,list,params){
		for(var event  in list){
			var name=list[event];
			//console.log('name',name);
			marker.a=params.map;
			marker.b=params.marker;
			marker.addListener(event,name);
		}
	}
	function AjoutClient(client,map,marker,type){
		/*console.log('client',client);
		console.log('map',map);
		console.log('marker',marker);*/
		console.log('type',type);
		var data={
			cl_name:client.cl_name,
			description:client.description,
			cl_lat:marker.getPosition().lat(),
			cl_long:marker.getPosition().lng(),
			cl_type:type.id,
			cl_email:client.email
		};
		var up=api.clients.save(data);
		if(up){
			console.log('up',up);
			marker.setMap(null);
		window.setTimeout(function(){
	 	 	addSingleMarker(MakeMarker(up),map,options(true,true),markerListener);},3000);
		}
	}
	$scope.AjoutClient=AjoutClient;
	function ModifClient(client,latLng,map,marker,selectedType) {
	 	var name=client.title;
	 	var cl=api.clients.get({pk:client.id});
	 	if(cl){
	 	 	console.log('cli', cl);
	 	 	console.log('mail ',client);
	 	 	//console.log('latLng', marker.getPosition().lat());

	 	 	cl.cl_name=client.cl_name;
	 	 	cl.description=client.description;
	 	 	cl.cl_lat=""+latLng.lat;
	 	 	cl.cl_long=""+latLng.lng;
	 	 	
	 	 	cl.cl_type=selectedType.id;
	 	 	cl.cl_email=client.cl_email;
			console.log('mail ',cl.cl_email);
	 	 	
	 	 	var up=api.clients.update({pk:client.id},cl);
	 	 	if(up){
	 	 		console.log('baxna',up);
	 	 		window.setTimeout(function(){info.close();
	 	 		info=null;},1000);
	 	 		window.setTimeout(function(){marker.setMap(null);},2000);
		 		window.setTimeout(function(){
		 		addSingleMarker(MakeMarker(up),map,options(true,true),markerListener);},3000);      	 		
	 	 	}
	 	 	else{
	 	 		console.log('baxoul',up);
	 	 	}
	 	}


	 	// body...
	}
	$scope.ModifClient=ModifClient;
	function Suppress(ev,client,marker){
	 	var confirm = $mdDialog.confirm()
	        .clickOutsideToClose(true)
	        .parent(angular.element(document.querySelector('#form')))
	        .title('Suppression')
	        .textContent('Vous etes sur le point de supprimer cet élément ')
	        .ariaLabel('Lucky Day')
	        .targetEvent(ev)
	        .ok('Confirmer!')
	        .cancel('Annuler');
	    $mdDialog.show(confirm).then(function(result) {
	    	console.log('choix','Confirmer ' + result + '.');
	      	if(result){
	      		if(client.name){
	      			var ii=api.zone.delete({pk:client.id});
	      			if (ii) {
	      				console.log('zone suppr',ii);
	      				marker.setMap(null);
	      				info.close();
	      			}
	      			
	      		}
		      	else{
			      	var uu=api.clients.delete({pk:client.id});
			      	if(uu){
			      		marker.setMap(null);
			      		console.log('ii',uu);
			      	}
			    }
	      	}
	    }, 
		function() {
	      console.log('choix','Annuler ');
	    }); 	
	}
	$scope.Suppress=Suppress;
	
	function initForm(title,valider,annuler){
		var form={
			title:title,
			valider:valider,
			annuler:annuler
		};
		return form;
		//$scope.form=form;
	  	//console.log('form',form);
	}

	// Zones
	function shapeClick(){
		console.log('click',this);
		$scope.drag=false;
		if(info){
	      closeInfo($scope.aa,this.map,true);  
	      //addSingleMarker(this.b,this.a,options(true,true),markerListener)
	  	}
		ShapeModif(this.map,this,this.z,this.getPath());

	}
	function shapeDragStart(){
		console.log('dragstart',this);
		$scope.shapedrag=true;
		$scope.drag=true;
		if(info){   
	           	closeInfo($scope.aa,this.map,$scope.drag);   
	  	}
	}
	function shapeDragEnd(){
		console.log('dragend',this);
		$scope.shapedrag=false;
		ShapeModif(this.map,this,this.z,this.getPath());
	}
	function shapeSetAt(){
		
		if (!$scope.shapedrag) {
			$scope.drag=true;
			console.log("set at",this);
			ShapeModif(this.a,this.parent,this.parent.z,this);
		}
	}
	function initZones(z,map){
	  	//var zz=[];
	  	mP=[];
	  	var bounds = new google.maps.LatLngBounds();
	  	for (var i = 0; i < z.length; i++) {
			var zi=makeZone(z[i]);
			zones.push(zi);
	  		//console.log('zon',zi);
			
			for (var j = 0; j < zi.paths[0].length; j++) {
		  		bounds.extend(new google.maps.LatLng(zi.paths[0][j].lat, zi.paths[0][j].lng) );
			}	
	  		window.setTimeout(addSingleZone(zi,map),i*200);
	  	}
	  	console.log('map center', bounds.getCenter());
	  	
		if(map!==null){map.setCenter(bounds.getCenter());}
	  	console.log('mp',mP);
	}
	function makeZone(zone){
	  	//console.log('makezone',zone);
		var stringArray = (new Function("return [" + zone.paths+ "];")());
		//console.log('stringArray',stringArray);
	  	var z={
	  		  	id:zone.id,
	  		  	name:zone.name,
	  			description:zone.description,
	  			paths:stringArray,
	  			categorie:categories[zone.categorie.id]

	  	};
	  	$scope.zone=z;
	  	return z;
	}
	function addSingleZone(zone,map){
		
	  	//console.log('zone',zone);
	  	//var bounds = new google.maps.LatLngBounds();
		var i;
		var paths=[];
		for (i = 0; i < zone.paths[0].length; i++) {
		  paths.push(new google.maps.LatLng(zone.paths[0][i].lat, zone.paths[0][i].lng) );
		}
		//var paths=zone.paths[0];
		var bounds=getShapeCenter(paths);
		//console.log('zone center', bounds.getCenter(),'paths',paths);
	  	var shape=new google.maps.Polygon({
	  		paths:zone.paths[0],
	  		clickable:true,
	  		editable:true,
	  		draggable:true,
	  		strokeOpacity:0.8,
	  		strokeWeight:2,
	  		strokeColor:'#FF0000' ,
	  		fillColor:zone.categorie.couleur,
	  		fillOpacity:0.35
	  	});

	  	var id=zone.id;
	  	shape.setMap(map);
	  	shape.z=zone;
	  	zz.push(shape);
	  	mP[id]=shape;
	  	addShapeListener(shape,shapeListeners,pathListener); 	
	}
	function addShapeListener(shape,list,listpaths){
		for(event in list){
			shape.addListener(event,list[event]);
		}
		if (listpaths) {
			for(event in listpaths){
			shape.getPath().a=shape.map;
			shape.getPath().parent=shape;
			shape.getPath().addListener(event,listpaths[event]);
		}
		}
		
	}
	function AjoutZone(zone,map,paths,marker){
		console.log('zone',zone);
		console.log('paths',paths.toString());
		var data={
			name:zone.name,
			description:zone.description,
			paths:paths,
			categorie:zone.categorie
			};

		api.zone.save(data,
			function(z){
				console.log('zone save',z);
				
				$scope.e.setMap(null);
				console.log('e',$scope.e);
				window.setTimeout(addSingleZone(makeZone(z),map),1000);
				
				/*$scope.e.setOptions({fillColor:zone.categorie.couleur,strokeColor:'#FF0000'});
				addShapeListener($scope.e,shapeListeners,pathListener);*/
				/*var ui=api.zone.get({id:z.id});
						console.log('rt',ui);


		  		var stringArray = (new Function("return [" + ui.paths+ "];")());
		  		console.log('stringArray',stringArray);

				//ui=makeZone(z)
				console.log('rt',makeZone(ui));
				window.setTimeout(addSingleZone(makeZone(ui),map),2500);*/
				marker.setMap(null);
			},function(error){Error(error)}
		);	
	}
	$scope.AjoutZone=AjoutZone;
	function ModifZone(zone,paths,shape){
		console.log('categorie',zone,'paths',paths.getArray());
		zone.paths=paths.getArray();
		var zi=api.zone.update({pk:zone.id},zone);
		if (zi) {
			console.log('update zone',zi);
			var map=shape.getMap();
			window.setTimeout(
				function(){
					info.close();
	 	 			info=null;
	 	 			shape.setMap(null);

	 	 		},1000
	 	 	);
	 	 	window.setTimeout(
	 	 		function() {
	 	 			addSingleZone(makeZone(zi),map);

	 	 		}, 2000
	 	 	);



		}
	}
	$scope.ModifZone=ModifZone;
	
	function getShapeCenter(paths){
		var bounds = new google.maps.LatLngBounds();
		//var path=paths.getArray();
		for (var i = 0; i < paths.length; i++) {
			//console.log('pp',path[i]);
		 	 bounds.extend(paths[i]) ;
		}
		return bounds;
	}
	function ShapeModif(map,shape,zone,paths){
			console.log('modif',shape,'paths',paths.getArray());
			var bounds=getShapeCenter(paths.getArray());
			var client;
			var marker=new google.maps.Marker({
	        	position:bounds.getCenter(),
	        	map:map,
	        	visible:false,
	        	z:shape
	        });
	        console.log('map',map);
			var content='<div ng-include src="\'views/zones.html\'"></div>';
			$scope.zone_modif=true;
			var compiled = $compile(content)($scope);
			$scope.is_zone=true;
			$scope.is_marker=false;
			/*$scope.modif=false;
		    $scope.ajout=false;*/
		    $scope.shape=shape;
		    //console.log('zone modif ', $scope.zone);
		    $scope.zone=zone; 
		    //$scope.categ=zone.categ

		    $scope.paths=paths;  
		    console.log('zone modif ', zone);
		       $scope.form=	initForm("Modification","Enregistrer","Supprimer");

		    if(info){   
	           	closeInfo($scope.aa,map,false);   
	  		}
			$scope.$apply(initInfoWindow(content,marker,map));	
	}
	// Info Window
	function initInfoWindow(content,marker,map){
		console.log('map',map,'marker',marker,content);
	  	$scope.aa=marker;
	  	$scope.type={};
	  	$scope.categ={};
	  	if(marker.b){$scope.cc=marker.b;
	  		$scope.type=marker.b.cl_type;
	  		console.log('type',$scope.type);
	  	}
	  	if(marker.z){
	  		$scope.categ=marker.z.z.categorie;
	  		console.log('categ',$scope.categ);
	  	}
		if(info){
	  		info=null;
	  	}
		
		//$scope.zone=client;
	  	$scope.latLng={lat:marker.getPosition().lat(),lng:marker.getPosition().lng()};
	  	//$scope.client=client;
	  	
	  	info=new google.maps.InfoWindow();
	  	var compiled = $compile(content)($scope);
		
		//console.log('content',compiled);
		info.setContent(compiled[0]);
	  	info.open(map,marker);
	  	map.panTo(marker.getPosition());
		google.maps.event.addListener(info,'closeclick',function(){
		  		closeInfo(marker,map,$scope.drag);
		  	});
	}
	function closeInfo(marker,map,drag){
		$mdDialog.hide();	
		info.close();
		info=null;
	  	console.log('close info',marker,'drag',drag);
	  	if (drag) {
	  		
	  		//marker.setPosition(pos);
	  		if (marker.b) { 
	  			console.log('marker',marker);
	  			marker.setMap(null);
	  			addSingleMarker(marker.b,map,options(true,true),markerListener);

	  		}
	  		else{
	  			console.log('marker',marker);
	  			marker.z.setMap(null);
	  			addSingleZone(marker.z.z,map)

	  		}
	  	}
	  	if($scope.marker){
	  		$scope.marker.setMap(null);
	  		$scope.marker=null;
	  	}
	  	if($scope.e){
	  		$scope.e.setMap(null);
	  		$scope.e=null;
	  	}
	}
	vm.drawvis=false;	
	function draw(value){
			
		vm.drawvis=value;
		console.log('drawvis',vm.drawvis);
		if(value){
			initDraw($scope.map);
			
		}
		else{
			initDraw(null);

		}
	}
	vm.draw=draw;
	var drawingManager;
	var b=true;
	function initDraw(map){
		console.log('map',map);
		if(b){
			console.log('b',b);
			drawingManager = new google.maps.drawing.DrawingManager({
				drawingControl: true,
				drawingControlOptions: {
	  				position: google.maps.ControlPosition.TOP_CENTER,
	  				drawingModes: [
	    				google.maps.drawing.OverlayType.MARKER,
	    				google.maps.drawing.OverlayType.POLYGON
	  				]
				},
				markerOptions: {
				 	//icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
		   			editable:true,
		   			clickable:true,
		   			draggable:true 
				},
				polygonOptions: {
	            	clickable: true,
	            	draggable: true,
	            	editable:true
	    		}
			});
		 	b=false;
			google.maps.event.addListener(drawingManager,'overlaycomplete',function(e){
			 	if(e.type==='polygon'){
			 		var P=[];

			 		//var bounds = new google.maps.LatLngBounds();
					var paths=e.overlay.getPath().getArray();
					var bounds=getShapeCenter(paths);
			 		$scope.e=e.overlay;
			 		console.log('array',paths);
			 		
			 		//console.log('array',P);
			 		var content='<div ng-include src="\'views/zones.html\'"></div>';
			 		//var compiled = $compile(content)($scope);

		 			$scope.is_zone=true;
		 			$scope.zone_modif=false;
		 			$scope.is_marker=false;
		 			$scope.zone=[];
		 			/*$scope.ajout=false;
		 			$scope.modif=false;*/
		 			$scope.paths=paths;
		 			var marker=new google.maps.Marker({
						position:bounds.getCenter(),
						map:$scope.map,
						visible:false
						});

			 	}
			 	else{
			 		e.overlay.setMap(null);
					var content='<div ng-include src="\'views/clients.html\'"></div>';
		 	        $scope.is_marker=true;
		 	        //$scope.modif=false;
		 			$scope.is_zone=false;
		 			$scope.ajout=true;
		        	//var compiled = $compile(content)($scope);
		        	var marker=new google.maps.Marker({
			        	position:{lat:e.overlay.position.lat(),lng:e.overlay.position.lng()},
			        	map:$scope.map
			        });
		  			console.log('mark',marker.getPosition().lng());
	 				if(info){
	        			info.close();
				        info=null;			        
				  	}
	  				var client;
	  				$scope.client=client;
	            	//initInfoWindow(compiled,marker,map);
			 	}
			 	console.log('map',marker.getMap());
			 	$scope.marker=marker;

			 	$scope.$apply(initInfoWindow(content,marker,marker.getMap()));

			 	$scope.form=initForm("Ajout","Ajouter","Annuler");

			});
		}
		console.log('drawing',drawingManager);
		drawingManager.setMap(map);
	}
	/*vm.drawvis=false;	
	vm.prog=false;*/
	$scope.$watch(function(){
	    return isLogged.is_authenticated;
		}, function (newValue) {
		vm.is_authenticated=newValue;
	});
	
	function ajouterClient(){
		console.log('ajouter zone','lkfsdf');
	}
	function raserMap(mm,zz) {
		VerifierMap(mm);
		VerifierMap(zz);
		$scope.selected=[];
		$scope.selected2=[];
		$scope.selected3=[];

		// body...
	}
	function VerifierMap(mm){
		//console.log('avant',mm);
		if(mm.length!==0){
			while(mm.length!==0){
				for (var i = 0; i < mm.length; i++) {				
					mm[i].setMap(null);
					mm.splice(i,1);
				}
			}
			
			
		}	
		//console.log('apres',mm);
	}
	function AfficheErreur(argument,list) {
		// body...
		$mdDialog.show(
			$mdDialog.alert()
	        .title(argument.title)
	        .textContent('Il n\'a pas de '+ argument.name+ ' pour '+ argument.type +' ' + argument.value)
	        .ok('Nice')
		);
	  		list.splice(list.indexOf(argument.objet), 1);
	}
	function AfficherType(name,options,Listener,map){
		VerifierMap(mm);
		var ty;
		
		api.clients.query({type:name},
			function(result){
				if (result.length!==0) {
					initMarker(map,result,options,Listener);
				}
				else{
					var erreur={
		  				title:'Client',
		  				name:'Client enregistré',
		  				type:'la categorie',
		  				value:ty,
		  				objet:name
		  				
		  			};
		  			AfficheErreur(erreur,$scope.selected);
				}
		},function(error){Error(error)});
	}
	
	function AfficherCategorie(name,map){
		var ty;
		VerifierMap(zz);
		/*if(typeof name ==='string'){
			ty=name;
		}
		else{
			ty=name.name;
		}*/
		api.zone.query({cat:name},function(result){
	  		console.log('zones',result.length);
	  		if(result.length!==0){
	  			/*if (!zonecaterec(name)){
	  			zonecate.push({cat:name,zones:result});}*/
	  			initZones(result,map);
	  		}
	  		else{
	  			var erreur={
	  				title:'Zone',
	  				name:'Zone enregistrée',
	  				type:'la categorie',
	  				value:ty,
	  				objet:name
	  			};
	  			AfficheErreur(erreur,$scope.selected2);
	  		}
	  	},function(error){console.log('error',error)});
	}
	// Missions

	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	 
	function ajouterMission(item,ev){
		/*var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

		console.log('ajouterMission',this);
		var parent=angular.element(document.querySelector('#form'));
	    $mdDialog.show({
	      controller: DialogController,
	      templateUrl: 'views/dialog.html',
	      parent: parent,
	      targetEvent: ev,
	      //clickOutsideToClose:true,
	      fullscreen: useFullScreen
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was "' + answer + '".';
	      console.log('status', $scope.status);
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	        console.log('status', $scope.status);
	    });*/
	    //var AfficheProg=true;
	    AfficheProg=true;   
	}
	$scope.$watch(
		function(){
			return AfficheProg
		},
		function(newValue){
			console.log('Affichooo Prog',newValue);
			$scope.AfficheProg=newValue;
		}
	);
	function modifierMission(item,ev){
		console.log('event',ev,'item',item);
		ajouterMission(item,ev);
	}
	function supprimerMission(item,ev){
		console.log('supprimerMission',ev);
		ajouterMission(item,ev);
	}
	//Taches
	function ajouterTache(item,ev){
		console.log('ajouterTache',this);
	}
	function modifierTache(item,ev){
		console.log('modifierTache',index);
	}
	function supprimerTache(item,ev){
		console.log('supprimerTache',this);
	}
	function announceClick(index,item,ev) {
	    /*$mdDialog.show(
	      $mdDialog.alert()
	        .title('You clicked!')
	        .textContent('You clicked the menu item at index ' + index)
	        .ok('Nice')
	    );*/
	    console.log('menu',item,'index',index,'event',ev);
		if(item.idp==='5'){
			AfficherType(item.name.split(' '));
		}
		else{
		    var name=item.name.replace(/ /g, '');
		    
		    //var func=window[name];
		    console.log('menu',eval(name));
		    //func(item);
		    eval(name).call(index,item,ev);
		}
	}
	vm.announceClick=announceClick;
	vm.menu= [
		{id:'1',name:'Missions',hsm:true},
		{id:'2',name:'Taches',hsm:false},
		/*{id:'3',name:'Regle de Gestion',hsm:true},
		//{id:'4',name:'sans sous_menu',hsm:false},
		{id:'5',name:'Catégorie',hsm:true}*/
	];
	vm.sous_menu=[
		{idp:'1', name:'ajouter Mission'},
		{idp:'1', name:'modifier Mission'},
		/*{idp:'1', name:'supprimer Mission'},
		{idp:'2', name:'ajouter Tache'},
		{idp:'2', name:'modifier Tache'},
		{idp:'2', name:'supprimer Tache'},*/
		/*{idp:'3', name:'ajouter Regle'},
		{idp:'3', name:'modifier Regle'},
		{idp:'3', name:'supprimer Regle'},
		{idp:'5',name:'Afficher Entreprise'},
		{idp:'5',name:'Afficher Pharmacie'},
		{idp:'5',name:'Afficher Tous'},*/
	];
	vm.has_sous_menu=true;
	function sousmenu(idp){
		var mymenu=[];
		var has_sous_menu=false;
		for (var i = 0; i < vm.sous_menu.length; i++) {
			//console.log('ss',vm.sous_menu[i].idp);
			if (vm.sous_menu[i].idp==idp) {
				//console.log('te','baxna');
				mymenu.push(vm.sous_menu[i]);
					 has_sous_menu=true;

			}
			else{
				//console.log('te','baxoul');
			}	}
			vm.mymenu=mymenu;
			$scope.items=mymenu;
			vm.has_sous_menu=has_sous_menu;
	}
	vm.sousmenu=sousmenu;

	//$scope.ischecked=ischecked;
	//var selectedtab=-1;
	var Tabs=[
		{id:0,title:'Ajouter Programme',disabled:false,url:'/ajout',content:'views/ajoutProg.html',controller:DialogController},
		{id:1,title:'Liste Programme',disabled:false,url:'/liste',content:'views/listeProg.html',controller:ListeController},

		//{title:'Modifier Programme',disabled:true,url:'/modif',content:'views/modifProg.html'},
	];
	$scope.Tabs=Tabs;
	$scope.$watch('Tabs',
		function (newValue) {
			// body...
			console.log("scope tabs",newValue);
		}
	);

	var tab=[];
	var selectedtab=0;
	$scope.$watch(
		function(){
			return selectedtab
		},
		function (newValue) {
			console.log('selectedtab',newValue);
			$scope.selectedtab=newValue;
			$scope.tab=Tabs[newValue];
			tab=$scope.tab;
		}
	);
	var tete=false;
	
	function TabClicked(tab){
		console.log('TabClicked',tab);
		
		var index=tab.id;
		$scope.tab=Tabs[index];
		tab=$scope.tab;
		selectedtab=index;
		if(index!=2){
			console.log('TabClicked',tab);
			Tabs.splice(2,1);
			selectedtab=1;
			tete=true;
			
		}
		var scope=$scope.$new();
		console.log('scope ',scope);
		scope.tri=true;
		tab.controller(scope,$mdDialog);
		//$location.path(tab.url);
	}
	$scope.TabClicked=TabClicked
	function toggle(item, list,parent) {
	    var idx = list.indexOf(item);
	    if (idx > -1) {
	       list.splice(idx, 1); 
	       console.log('enlever',item);
	    }
	    else {
	    	list.push(item);


	   		console.log('item',item);
	    }
	    $scope[parent] =list.slice(0);
	  	//console.log('parent',$scope[list]);  
	}
	$scope.toggle =toggle;
	function exists(item, list) {
	    return list.indexOf(item) > -1;
	}
	$scope.exists = exists;
	function isIndeterminate(selected,list) {
	    return (selected.length !== 0 &&
	        selected.length !== list.length);
	}
	$scope.isIndeterminate = isIndeterminate;
	function isChecked(selected,list) {
	  //	console.log('list',list);
	    return selected.length === list.length;
	}
	$scope.isChecked = isChecked;
	function toggleAll(selected,list,parent) {
		console.log('debut',$scope[parent]);
	    if (selected.length === list.length) {
	      selected = [];
	      console.log('vider',selected);
	    } else if (selected.length === 0 || selected.length > 0) {
	      selected = list.slice(0);
	            console.log('remplir',selected);
	    }
	    //console.log('event',event);
	   // return selected;
	   $scope[parent]=selected;
	}
	$scope.toggleAll =toggleAll;
	$scope.$watch('selected',
		function (newValue) {
			
			var t;
			if(newValue.length!==0){
				console.log('list selected',newValue);
				var params=[];
				for (var i in newValue) {
					params.push(newValue[i].type_name);
				}			
				AfficherType(params,options(true,true),markerListener,mymap);
			}
			else{
				VerifierMap(mm);
					//console.log('t',t);
			}
		}
	);
	$scope.$watch('selected2',
		function (newValue) {
			//console.log('list selected',newValue)
			var t;
			var params=[];
			if(newValue.length!==0){
				/*if(newValue.length=== $scope.categories.length){
					t="Tous";
				}
				else{
					t=newValue[0];
				}*/
				for (var i in newValue) {
							params.push(newValue[i].name);
						}
				console.log('t',params);
				AfficherCategorie(params,mymap);
			}
			else{
				VerifierMap(zz);
				//console.log('t',t);
			}
		}
	);
	$scope.$watch('selected3',
		function (newValue) {
		// body...
		if (newValue.length!==0) {
			console.log('liste 3',newValue);
			var t;
			if(newValue.length=== $scope.agents.length){
				t="Tous";
			}
			else{
				t=newValue[0];
			}	
			afficherMission(t,options(true,false),ProgListener);

		}
		else{
			VerifierMap(mm);
		}
	});
	$scope.$watch('zoneselected',
		function (newValue) {
		// body...
		console.log('watch ',newValue);
		zoneselected=newValue;	
	},true);
	$scope.$watch('cateselected',
		function (newValue) {
		// body...
		console.log('watch ',newValue);
		cateselected=newValue;	
	});
	$scope.$watch('agselected',
		function (newValue) {
		// body...
		console.log('watch ',newValue);
		agselected=newValue;	
	});
	$scope.$watch('tyselected',
		function (newValue) {
		// body...
		console.log('watch ',newValue);
		tyselected=newValue;	
	});
	function afficherMission(agent,options,Listener){
		console.log('agent',agent,'options',options,'Listener',Listener);
		VerifierMap(mm);
		var lieux=[];
		var id;
		if( typeof agent==='string')
			{id='Tous';}
		else

			{id=agent.id}


		api.taches.query({com_id:id},
			function (result) {
				if(result.length!==0){
					console.log('mission',result);
					for (var i = 0; i < result.length; i++) {
						var mission=makeMission(result[i]);
						
						console.log('m',mission);
						missions.push(mission);
						lieux.push(mission.lieux);
					}
				console.log('missions',missions);
					initMarker($scope.map,lieux,options,Listener);
				}
				else{
					console.log('erreur',result);
					var erreur={
		  				title:'Mission',
		  				name:'Mission enregistrée',
		  				type:'l\'Agent',
		  				value:agent.name,
		  				objet:agent
		  				
		  			};
		  			AfficheErreur(erreur,$scope.selected3);
				}
			// body...
			
		},function(error){Error(error)});
		function Error(error) {
			// body...
			console.log('error',error);
			
		}
		//console.log('missions',missions);
	}

	//$scope.afficherMission=afficherMission;
	// Mode Programme
	vm.prog=false;
	vm.pres=false;
	function initProg(prog){
		vm.prog=prog;
		//console.log('prog',prog);
		//vm.pres=!value;
		raserMap(mm,zz);
		if(prog){
			console.log('prog',prog);	
			
			vm.pres=!prog;
			$scope.navbool=false;
			$scope.leftbool=false;
			$scope.statbon=false;
			//vm.draw(false);
			//InitProg();
		}
		else{
			console.log('prog',prog);
			AfficheProg=prog;
		}
	}
	vm.initProg=initProg;
	function initPres(value){
		console.log('pres',value);
		vm.pres=value;
		//vm.prog=!value;
		raserMap(mm,zz)
		if(!value){
			draw(value);
			
			
		}	
		else{
			vm.prog=!value;
			$scope.navbool=false;
			$scope.leftbool=false;
			$scope.statbon=false;
			AfficheProg=!value;
			console.log('vm.prog',vm.prog);
			//raserMap(mm,zz);

			//InitPres();
		}	
	}
	vm.initPres=initPres;
	function progClick(){
		console.log('progclick',this);
	}
	function markerInZone(zones,liste){
		var list=[];
		var l=[];
		console.log('zz',zones);
		console.log('liste',liste);
		/*if(zones.length==0){
			return liste;

		}*/
		for (var i in zones) {
			for (var j in liste) {
				//console.log('j',j);
				if(google.maps.geometry.poly.containsLocation(liste[j].getPosition(), zones[i])){
					list.push( liste[j]);
					//console.log('marker in zone',liste[j]);
					//console.log('my zone',zones[i]);

				}
			}
		}
				console.log('liste fin',list);

		return list;
	}
	function listeZones(newValue){
			var liste1=[];
			if(newValue.length!==0){
				
				console.log('zone selected', newValue);
				for (var i = 0; i < newValue.length; i++) {
						
					var id=newValue[i].id;
					liste1[id]=mP[id];
					google.maps.event.clearInstanceListeners(liste1[id]);
					addShapeListener(liste1[id],ProgListener);
					liste1[id].setEditable(false);
					liste1[id].setDraggable(false);

				}
				console.log('zone zone',liste1);
				
			}
			return liste1;
	}
	function markerInCategorie(liste,markers){
			var tt=[];
			console.log('liste',liste,'markers',markers);
			if(liste.length==0){
				return markers;
			}

			for (var j in markers) {
				//console.log('j',j);
					var test=false;
					for (var i in liste) {
						if(liste[i].type_name===markers[j].b.cl_type.type_name){
							test=true;
							tt.push(markers[j]);
						}
					}
				}
			return tt;
	}
	function AfficherMap(liste,map){
		//console.log('liste',liste);
		for (var i in liste) {
			
		window.setTimeout(liste[i].setMap(map),i*200);
		//console.log('iyu',liste[i].getMap());
		}
	}
	function Redirect(API){
			//var API="http://192.168.8.101:8000/admin/";
			//console.log('API',API);
			window.open(API,'_newtab');
	}
	$scope.Redirect=Redirect;
	$scope.once=true;
	console.log('scope en haut',$scope);
	function DialogController($scope,$mdDialog) {

		var jo=[];
		/*$scope.d=[];
		$scope.o=[];
		$scope.m=[];
		$scope.j=[];
		$scope.jo=[];
		$scope.z=[];*/
		$scope.toggleAll=toggleAll;
		$scope.isChecked=isChecked;
		$scope.isIndeterminate=isIndeterminate;
		$scope.exists=exists;
		$scope.toggle=toggle;
		var markerinzone=[];
		$scope.times=[];
		$scope.mark=[];
		$scope.categories=categories;
		$scope.zonees=[];
		$scope.typemissions=[];	
		$scope.typem=[];
		$scope.agentes=[];
	  	$scope.typees=[];
	  	$scope.tyselected=[];
	  	$scope.agselected=[];
	  	$scope.zoneselected =[]; 
	  	$scope.cateselected=[];
		console.log('mann mii',$scope);
	  	var params=[];
	  	var zones=[];
		var typemissions=[];
  		function initJour(days) {
  			var a=[];
			for (var i = 1; i <= days; i++) {
				a.push(i);
			}
			//console.log('a',a);
			//$scope.ok=true;
			$scope.days=a;
			// body...
  		}
  		$scope.$watch('categories',
  			function(newValue){
  				//console.log('categories',newValue,'once',$scope.once);
				if (newValue.length!==0 && $scope.once) {
					console.log('categories',newValue,'once',$scope.once);
					Init();
					$scope.once=false;
				}
			},true
		);
		function InitListe(programme) {
  				// body...
  				$scope.form=initForm("Programme","Modifier","Annuler");

  				var lieux=programme.lieux;
  				var com=programme.com;
  				var missions=programme.typemission;
  				var timing = (new Function("return [" + programme.timing+ "];")());
  				var t=timing[0];

  				var mois=Object.keys(t).map(function(key){return t[key].mois});
  				var jours=Object.keys(t).map(function(key){return t[key].jour});
  				console.log('lieux',lieux,'com',com,'stringArray',timing[0],'mois',mois,'jours',jours,'missions',missions);
  				$scope.choix=programme.timing;
  				var markers=Object.keys(lieux).map(function (key) {return mE[lieux[key]]});
  				$scope.mark=markers;
  				var typem=Object.keys(missions).map(function (key){return typemissis[missions[key]]})
  				var cate=[];
  				cate=Object.keys(markers).map(function(key){if(cate.indexOf(markers[key].b.cl_type)===-1){return types[markers[key].b.cl_type.id]}});
  				console.log('cate',cate,$scope.mark);
  				//$scope.typem=typem;
  				tyselected=cate;
  				agselected=Object.keys(com).map(function (key) {return agents[com[key]]});
  				AfficherMap(markers,mymap);
  				console.log('markers',markers,'map',mymap);
  		}
  		function Init(){
  			
  			console.log('initializing .....',$scope);
  			//
			if(typemissions.length===0){
				api.typemission.query(function(result){
					console.log('typemissions',result);
					if(result.length!==0){
						//console.log('typemissions',result);
						for (var i = 0; i < result.length; i++) {
							var mission={
								id:result[i].id,
								name:result[i].name
							};
							typemissions[mission.id]=mission;
						}
						$scope.typemissions=typemissions;
						//console.log('typemissions',typemissions);
					}
				},function(error){Error(error)});
			}
			
			//console.log('categories',categories);
			if(zones.length===0){
				for (var i in  categories) {
  				params.push(categories[i].name);
  				}	
				api.zone.query({cat:params},function(result){
		  			console.log('zones',result);
		  			for (var i = 0; i < result.length; i++) {
		  				//console.log('zone',result[i]);
		  				zones.push(makeZone(result[i]));
		  			}
		  			//console.log('zones api',zones);
	  			},function(error){Error(error)});
	  			$scope.zonees=zones;
			}

  			markerinzone=[];
  			tyselected=[];
  			agselected=[];
  			zoneselected=[];
  			cateselected=[];
  			$scope.typem=[];
  			$scope.times=[];
			$scope.agentes=agents;
		  	$scope.typees=types;
		  	$scope.tyselected=tyselected;
		  	$scope.agselected=agselected;
		  	$scope.zoneselected =zoneselected; 
		  	$scope.cateselected=cateselected;
		  	
			InitTiming();
			initChoix(true); 
  			$scope.$watch(function(){return programme},
  				function (newValue) {

  					// body...
  					
  					if( newValue!== undefined && newValue.length!=0 && Tabs.length===3){
  						console.log('programme',newValue);
  						InitListe(newValue);
  						$scope.programme=programme;

  						
  					}
  					else{
  						$scope.form=initForm("Programme","Ajouter","Annuler");
  						$scope.programme=[];
					}
  					
  				}
  			);
		  	
			
			
		}
		$scope.$watch(
			function(){
				return tete;
			},
			function(newValue){
				$scope.tete=newValue;

				console.log('zzz ',$scope.tete);
			},true
		);
		$scope.$watch(
			function(){
				return tab;
			},
			function(newValue){
				$scope.tab=newValue;

				console.log('zzz ',$scope.tab);
			},true
		);
		$scope.$watchGroup(['tete','tab']
			/*function(){
				return "["+tete+","+tab+"]";
			}*/,
			function(newValue){
				//$scope.zoneselected=newValue;
				if (newValue!==undefined) {
					console.log('zzz ',newValue);

					if(newValue[0] && newValue[1].id!==2){
						console.log('zzz ',newValue);
						VerifierMap($scope.mark);}
					}
				
			
			},true
		);
		
		if($scope.tri){
			Init();
		}
		$scope.Init=Init;
		
		function InitTiming() {
			jo=[];
			
			$scope.mod=[];

			//$scope.Mod2=[];
			//$scope.Mod=[];
			$scope.Mod={isMultiple:true};
			$scope.Mod2={isMultiple:true};
			//initChoix();
			//$scope.days=[];
			initJour(31);
			$scope.choix=[];
			$scope.typem=[];
			
			// body...
		}
		$scope.InitTiming=InitTiming;
		function initChoix(bool){

			$scope.d=[];
			$scope.o=[];
			$scope.m=[];
			$scope.j=[];
			$scope.jo=[];
			$scope.z=[];
			if (bool) {console.log('initChoix',bool);$scope.choix=[];$scope.typem=[];}
			
			//
		}
		$scope.initChoix=initChoix;
		$scope.bool=true;
		$scope.close=function (bool) {
			$scope.bool=bool;
			// body...
		}
		function CloseSelect() {
			// body...
			$scope.$watch('bool',function (newValue) {
			// body...
			console.log('bool',newValue);
				if (!newValue) {
					initChoix(newValue);
					$scope.bool=!newValue;
				}
				
				
			});
		}
		function onChange(times){
			//console.log('times',times,$scope.Mod);
			if(times.isMensuel){
				console.log('times',times,$scope.Mod);
				$scope.Mod2=$scope.Mod;
				console.log('Mod2',$scope.Mod2)
							

			}
			
		}
		$scope.$watch('times',
			function(newValue,oldValue){
				//if()
				console.log('times',newValue);
				if(newValue!==oldValue){
					console.log('times',newValue);
					
					//InitTiming();
					
					initChoix(true);

						
				}

				/*else if((newValue[0]!==oldValue[0]) || (newValue[1]!==oldValue[1])){
					initChoix();
					
					console.log('newValue',newValue[0],'oldValue',oldValue[0]);

				}*/
			},true
		);
		$scope.onChange=onChange;
		function showConfirm (ev) {
			//var bool=false;
	    	var confirm = $mdDialog.confirm()
	          .title('Voulez-Vous Changer de Mode?')
	          .textContent('Les données enregistrées vons être supprimer.')
	          .ariaLabel('Lucky day')
	          .targetEvent(ev)
	          .ok('Confirmer!')
	          .cancel('Annuler');
	   		$mdDialog.show(confirm).then(
				function() {

					initChoix(true);
					$mdDialog.cancel();
					//bool= true;
				},
				function() {
					initChoix(false);
					$mdDialog.cancel();

					//bool= false;
				}
	   		);
	   		
	   		//return bool;
 		};

	  	function onModeChange(mode,event) {
	  		// body...
	  		var i=1;
	  		console.log('caller',mode);

	  		var bool=false;
	  		$scope.$watchGroup(['Mod','mod'],
	  			function (newValue,oldValue) {
	  				// body...
	  				console.log('Mod, mod',newValue);

	  				if(!bool){
	  					console.log('Ancien',oldValue,'Nouveau',newValue,'i',i);
	  					if( $scope.times.isMensuel){
				  			$scope.Mod2=newValue[0];
				  			console.log('Mod2',$scope.Mod2);
				  		}
		  				if (oldValue!==newValue) {
		  					
		  					if(oldValue[1]!==newValue[1]){
		  						if ($scope.choix.length!==0) {showConfirm(event);}

		  						
		  						bool=true;


		  						//console.log('baxxna',bool);
		  					}
		  						
		  					//console.log('Ancien',oldValue,'Nouveau',newValue);
		  				}
	  				}
	  				
	  			},true
	  		);
	  		i++;
	  		console.log('bool',bool);
	  	}
	  	$scope.onModeChange=onModeChange;
		$scope.hide = function() {
		    $mdDialog.hide();
		};
		$scope.$watch('typem',
			function(newValue){
				console.log('type mmm',newValue);
			}
		);
		$scope.cancel = function() {
	    $mdDialog.cancel();
	  	};
	 	$scope.answer = function(answer) {
	  	  $mdDialog.hide(answer);
	  	};
	  	
		$scope.timing=[
			{id:1,name:'Chaque Année',isAnnuel:true},
			{id:2,name:'Chaque Mois',isMensuel:true},
			{id:3,name:'Chaque Semaine',isHebdo:true},
			{id:4,name:'Chaque Jour',isJour:true}
		];
		$scope.modes=[{id:1,name:'Jours de mois',isJour:true},{id:2,name:'Jours de Semaine',isHebdo:true}];
		$scope.mois=[
			{id:1,name:'Janvier'},
			{id:2,name:'Fevrier'},
			{id:3,name:'Mars'},
			{id:4,name:'Avril'},
			{id:5,name:'Mai'},
			{id:6,name:'Juin'},
			{id:7,name:'Juillet'},
			{id:8,name:'Aout'},
			{id:9,name:'Septembre'},
			{id:10,name:'Octobre'},
			{id:11,name:'Novembre'},
			{id:12,name:'Décembre'},
		];
		$scope.Modes=[{id:1,name:'Unique',isMultiple:false},{id:2,name:'Multiple',isMultiple:true}];
		$scope.jours=[
			{id:1,name:'Lundi',},
			{id:2,name:'Mardi',},
			{id:3,name:'Mercredi',},
			{id:4,name:'Jeudi',},
			{id:5,name:'Vendredi',},
			{id:6,name:'Samedi',},
			{id:7,name:'Dimanche',},
		];
		$scope.occurences=[
			{id:1,name:'Premier',},
			{id:2,name:'Deuxième',},
			{id:3,name:'Troisième',},
			{id:4,name:'Quatrième',},
			{id:5,name:'Dernier',},
			{id:6,name:'Tous',},
		];
		function daysInMonth(month) {
			var currentyear=new Date().getFullYear();
   			return new Date(currentyear, month,0).getDate();
		}	
		$scope.$watch('m',
			function(newValue){
				//console.log('m',newValue);
				if(!$scope.Mod.isMultiple){
					if(newValue.length!==0){
						if($scope.mod.isJour){
							var days=0;
							console.log('newValue',newValue.id);
							console.log('days',daysInMonth(newValue.id));
						 
							days=daysInMonth(newValue.id);
						 
							initJour(days);
						 	console.log('days',$scope.days);
						}
						else{
							initJour(31);
							//$scope.ok=false;
						}
				}
				}
			}
		);

		function AfficheTriangulaire(markers,zones,categories){
			if(zones.length!=0 && categories.length!=0){
				var bool=false;
				console.log('markers',markers);
				console.log('zones',zones);
				console.log('categories',categories);
				//enlever markeurs
				AfficherMap(mE,null);
				AfficherMap(mP,null);
				var confirm = $mdDialog.alert()
	          			.title('Erreur?')
			        	.textContent('Il n\'y a pas de clients pour les categories ou zones selectionnées .')
			        	.ariaLabel('Lucky day')
			       		//.targetEvent(ev)
			        	.ok('Confirmer!');
			   		
				//filtre marker zones
				var liste1=markerInZone(zones,markers);
				if(liste1.length!==0){
					console.log('filtre 1',liste1);
					//filtre marker categorie
					var liste2=markerInCategorie(categories,liste1);
					console.log('filtre2',liste2);
					if(liste2.length!==0){
						console.log('markers',$scope.mark)
						var liste3=liste2.concat($scope.mark);
						//$scope.mark.concat(liste2);
						$scope.mark=liste3;
						
						AfficherMap(zones,mymap);
						AfficherMap(liste3,mymap);
					}
					else{
						bool=true;
					}
				}
				else{
					bool=true;

				}
				if (bool) {
					$mdDialog.show(confirm).then(
							function(result) {
								console.log('result',result);
	
								/*zoneselected=[];
								tyselected=[];*/
								//bool= true;
							},
							function() {
								//initChoix(false);
								//bool= false;
							}
				   	);
				}
			}
			/*else{
				AfficherMap(mE,null);
				AfficherMap(mP,null);
			}*/
		}
		
		$scope.$watch(
			function(){
				return zoneselected;
			},
			function(newValue){
				$scope.zoneselected=newValue;

				if(newValue.length!==0){
				console.log('zzz ',newValue);
					AfficheTriangulaire(mE,listeZones(zoneselected),tyselected);}		
			},true
		);
		$scope.$watch(
			function(){
				return agselected;
			},function(newValue){
				//console.log('agent selected',newValue);
				$scope.agselected=newValue;
			}
		);
		
		$scope.$watch(
			function(){
				return tyselected;
			},function(newValue){
				$scope.tyselected=newValue;
				//console.log('types selected',newValue,zoneselected);
				//console.log('liste markeurs',markerinzone);
				if(newValue.length!==0){
					console.log('tyty ',newValue);
					AfficheTriangulaire(mE,listeZones(zoneselected),newValue);}


			}
		);
		$scope.$watch(function(){
			return cateselected;
			},function (newValue) {
			// body...
			//console.log('categorie selected ',newValue);
			$scope.cateselected=newValue;	
		});
		
		$scope.$watchGroup(['j', 'o'],
			function(newValue){
				
				console.log('newValue',newValue);
					
				if((newValue[0].length!=0 && newValue[1].length!=0 ) && $scope.mod.isHebdo){
					var names=[];
					var index;
					var bool=false;
					var ocrs=[];
					//console.log('concat',newValue);
					var params=[];
					var jrs= newValue[0];
					var ocr=newValue[1];
					if($scope.Mod.isMultiple){
						//$scope.choix=[];
						for (var i = 0; i < ocr.length; i++) {
							ocrs.push(ocr[i].name);
						}
					}
					else{ocrs.push(ocr.name)}
					if($scope.Mod2.isMultiple){
						$scope.choix=[];
						for (var i = 0; i < jrs.length; i++) {
							if (jrs[i].name) {
							names.push(jrs[i].name);}
						}
					}
					else{
						names.push(jrs.name);
						for (var i = 0; i < $scope.choix.length; i++){ 
							var choix=$scope.choix[i];
							if (choix.jours===jrs.name) {
								bool=true;
								ocrs.push(choix.occur);
								console.log('choice',choix);
								index=i;
								
								//
							}
						}
					}
					console.log('jo Annuel',names);
					var arr = Object.keys(names).map(function (key) {return names[key]});
					var arr1= Object.keys(ocrs).map(function (key){return ocrs[key]});									
					if($scope.times.isMensuel){
						params.push('jours','occur');
						var mois=$scope.mois;
						var arr2=Object.keys(mois).map(function(key){return mois[key].id});
						var line={mois:arr2,jours:arr,occur:arr1};
						console.log(' jo mensuel',line);
						LinePush($scope.choix,line,bool,index);
						$scope.bool=true;
						CloseSelect();
						/*$scope.j=[];
						$scope.o=[];*/

						//$scope.choix.push();
						//Choix(ok,$scope.mod,$scope.Mod,params,$scope.times);
					}
					else{
						//if(newValue[0])
						//console.log()
						params.push('mois','jours','occur');
						var ok={jours:arr,occur:arr1};
						console.log('jo Annuel',arr,'oo annuel',arr1,'okk',ok);
						$scope.z=ok;
					}
				}
			},true
		);
		$scope.$watch('d',
			function(newValue){
				//console.log('d',newValue);
				if($scope.times.isMensuel && $scope.mod.isJour){
					$scope.choix=[];
					console.log('days',newValue);
					$scope.choix.push({mois:$scope.mois,jours:newValue});
				}
			}
		);
		$scope.$watch('j',
			function(newValue){
				//console.log('j',newValue);
				if($scope.times.isHebdo && newValue.length!=0){
					var names=[];
					$scope.choix=[];
					for (var i = 0; i < newValue.length; i++) {
						names.push( newValue[i].name);
					}
					console.log('days',names.toString());
					$scope.choix.push({semaine:'Tous',jours:names.toString()});
				}
			}
		);
		$scope.$watchGroup(['m','d'],
			function (newValue) {				
				// body...
				//console.log('m d',newValue);

				if ($scope.times.isAnnuel && $scope.mod.isJour&& newValue.length!=0) {
					console.log('md',newValue);
					var params=[];
					params.push('mois','jour');
					console.log('params',params);
					Choix(newValue,$scope.mod,$scope.Mod,params,$scope.times);
				

					//Choix(newValue);
				}
			},true
		);
		$scope.$watchGroup(['m','z'],
			function (newValue) {
				// body...
				//console.log('m z',newValue);
				//console.log('joo Anuel',newValue[1].toString());
				if ($scope.times.isAnnuel&& $scope.mod.isHebdo&& newValue.length!=0) {
					console.log('joo',newValue);
					var params=[];
					params.push('mois','jour','occur');
					Choix(newValue,$scope.mod,$scope.Mod,params,$scope.times);
					//Choix(newValue);
				}
								
			},true
		);
		function Choix(lists,modJour,modSel,params,times){
			var names=[];
			var line;
			console.log('liste',lists);
			if(times.isAnnuel){
				if (lists.length==2) {
							console.log('lists',lists);
							if (lists[0].length!==0 && lists[1].length!==0) {
								var liste=lists[0];
								var bool=false;
								var index;
								var loo=lists[1];
								console.log('loo',loo);
								console.log('choix',lists);
								console.log('mois',liste);
								var mois,jour,occur;
								if (modSel.isMultiple) {
									$scope.choix=[];
									for (var i = 0; i < liste.length; i++) {
										//liste[i]
										if (liste[i].id){
											console.log('name',liste[i].id);
											names.push(liste[i].id);
										}
									}
									}
								else{
									names.push(liste.id);									
									for (var i = 0; i < $scope.choix.length; i++){ 
										var choix=$scope.choix[i];
										if (choix.mois===liste.id) {
											bool=true;
											console.log('choice',choix);
											index=i;
											
											//
										}
									}
								}
								if(modJour.isJour){
									console.log('params',params);
									mois=params[0];
									jour=params[1];
									line={[mois]:names.toString(),[jour]:lists[1].toString()};
									}
								else{
									console.log('params',params);
									mois=params[0];
									jour=params[1];
									occur=params[2];
									line={[mois]:names.toString(),[jour]:lists[1].jours,[occur]:lists[1].occur}
								}
								LinePush($scope.choix,line,bool,index);
							}
							CloseSelect();
				}
			}
			else if(times.isMensuel){

				console.log('mensuel',lists,'params',params);
			}			
		}

		function LinePush(lists,line,bool,index){
			console.log('linepush',line);
			if(bool){
				lists.splice(index,1,line);
			}
			else{
				lists.push(line);
			}
		}
		/*$scope.$watch(function(){return AfficheProg;},function(newValue){
			console.log('affichera prog',newValue);

			$scope.AfficheProg=newValue;
			//raserMap()
			AfficherMap(mE,null);
			AfficherMap(mP,null);
			//if(newValue){Init();}
		});*/
		function Programmer(zones,categories,agents,choix,times,Mode,mode,typem,mark){
			console.log('zones',zones,'categories',categories,
				'agents',agents,'votre choix',choix,
				'timing',times,'Mode',Mode,
				'Type',mode,'Missions',typem,'mark',mark);
			var lieux = Object.keys(mark).map(function (key) {return mark[key].b.id});
			var coms = Object.keys(agents).map(function (key) {return agents[key].id});
			var typm_id = Object.keys(typem).map(function (key) {return typem[key].id});
			var typm_name = Object.keys(typem).map(function (key) {return typem[key].name});

			var date=new Date();

			console.log('arr',lieux,'com',coms);
			var programme= {
				lieux:lieux,
				created_on:date ,
				modified_on:date ,
				com:coms ,
				agent:coms[0] ,
				libelle:typm_name.toString() ,
				typemission:typm_id,
				timing:choix 
			};
			if($scope.programme.id){
				var id=$scope.programme.id
				//programme.id=$scope.programme.id;
				programme.created_on=$scope.programme.created_on;
				console.log('programme',programme);
				var upd=api.programme.update({id:id},programme);
				if(upd){
					console.log('update reussie',upd);
					TabClicked(Tabs[1]);
					//selectedtab=1;
				}
				

			}
			else{
				api.programme.save(programme,
					function(test){
						console.log('resulat',test);
						TabClicked(Tabs[1]);
						//selectedtab=1;
					},
					function(error){Error(error)}
				);
				
			}
			$scope.programme=[];
			console.log('tabs',Tabs[0]);
			//Tabs.splice(2,1);
			//selectedtab=2;
			//TabClicked(Tabs[1]);
			//$scope.$digest();
			//$timeout(DialogController().Init());
			/*var fd=new FormData();
			angular.forEach(programme, function(value, key) {
			 	console.log('value ',value,'key',key);
            	fd.append(key, value);
       		});
			console.log('fd ',fd.get('lieux'));*/
			
		}
		$scope.Programmer=Programmer;
	}
	$scope.DialogController=DialogController;
	function ListeController($scope,$mdDialog){
		$scope.clis=mE;
		console.log('clis',$scope.clis);
		$scope.agents=agents;
		
		var programmes=[];

		function Inite(){
			$scope.programmes=[];
			console.log('initializing programs .....',new Date());
			api.programme.query(function (result) {
				// body...
				//console.log('liste programme',result,new Date());
				programmes=result;
				//$scope.programmes=programmes;
				console.log('prgrammes',programmes);

				},
				function(error){Error(error)}
			);
		}
		$scope.$watch(
			function(){
				return programmes;
			},
			function(newValue){
				$scope.programmes=[];
				//console.log('newValue',newValue,$scope.programmes);
				$scope.programmes={p:newValue};
				console.log($scope.programmes);

			}
		);
		if($scope.tri){
			console.log('ListeController',$scope);
			Inite();
		}
		$scope.Init=Inite;
		function ModifProgramme(event,programm){
			programme=programm;
			console.log('event',event,'programme',programme);
			var tab={id:2,title:'Modifier Programme',disabled:false,url:'/modif',content:'views/ajoutProg.html',controller:DialogController};
			//Tabs[1].title="Modifier Programme";
			for(var index in Tabs){
				if(Tabs[index].title===tab.title){
					console.log('index',index);
					Tabs.splice(index,1)
				}
			}
			Tabs.push(tab);

			console.log('Tabs',Tabs);
			//selectedtab=3;
			//DialogController.Init;

		}
		$scope.ModifProgramme=ModifProgramme;
	}
	$scope.ListeController=ListeController;




});


