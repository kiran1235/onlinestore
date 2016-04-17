

angular.module('store.services', [])
    .service('$locationservice',['$http',function($http){
        
        this.findAddress=function(street,city,state){
          street = street.split(' ').join('+');
          return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+street+',+'+city+',+'+state);
        };
        this.calcDistance=function(fromLatitude,fromLongitude,toLatitude,toLongitude){
            return (3963.0 *  Math.acos(Math.sin(fromLatitude/57.2958) *   Math.sin(toLatitude/57.2958) + Math.cos(fromLatitude/57.2958) *  Math.cos(toLatitude/57.2958) * Math.cos(toLongitude/57.2958 - fromLongitude/57.2958)));
        };
    }])
    .service('$vendorservice',['$rootScope','$http',function($rootScope,$http){
        if(this.vendors==undefined){
            this.vendors=[];
        };
        
        this.setVendors=function(vendors){
             this.vendors=vendors;
        };
        
        this.getVendors=function(){
            return $http.get($rootScope.$domain+'/store/api/vendors');

//sample data
//{"rc":0,"data":[{"id":13,"name":"walmar","VendorContacts":[{"id":13,"isprimary":0,"VendorContactAddressBooks":[{"phone":"4088851142","formattedaddress":"777 Story Rd, San Jose, CA 95122, USA","latitude":37.3310001,"longitude":-121.860433}]}]}]}

        };

        this.getVendorProducts=function(id){
            return $http.get($rootScope.$domain+'/store/api/vendors/'+id+'/products/');
        };

    }])
    .service('$cartservice',['$rootScope','$http',function($rootScope,$http){
        if(this.items==undefined){
            this.items=[];
        }
        this.totalvalue=0;
        this.addItem=function(item){
                 
          for (var i = 0; i < this.items.length; i++) {
            if(item.id==this.items[i].id){
    
              this.totalvalue=this.totalvalue-(this.items[i].cartquantity*item.Inventories[0].unitprice);
              this.items[i].cartquantity=item.cartquantity;
              return;
            }
          }
          this.items.push(item);
        };
        this.getTotal=function(){
          this.totalvalue=0;
          for (var i = 0; i < this.items.length; i++) {
              this.totalvalue=this.totalvalue+(this.items[i].cartquantity*this.items[i].Inventories[0].unitprice);
          }
          return this.totalvalue;
        };
        this.getCartId=function(){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };
        
        this.createorder=function(data){
            return $http({
              method:'post',
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              url:$rootScope.$domain+'/store/api/orders',
              data:data,
              transformRequest: function(obj) {
                var str = [];
                console.log(obj);  
                for(var p in obj)
                    console.log(p);
                  str.push("entity["+encodeURIComponent(p) + "]=" + encodeURIComponent(obj[p]));
                return str.join('&');
              },
            });            
        }
        
    }])
    .service('$customerservice',['$http',function($http){
        if(this.firstname==undefined){
            this.firstname=""
        }
        if(this.lastname==undefined){
            this.lastname=""
        }
        if(this.email==undefined){
            this.email=""
        }
        
        if(this.deliveryAddress==undefined){
            
             this.deliveryAddress={
                   street:'655 s. fair oaks ave',
                   city:'Sunnyvale',
                   state:'CA',
                   zipcode:'',
                   country:'USA',
                   formattedaddress:undefined,
                   latitude:0.0,
                   longitude:0.0
            }            
        }
        
        if(this.scheduledate ==undefined){
            this.scheduledate='12/31/1900';
        }

        if(this.scheduletime ==undefined){
            this.scheduletime='7 PM';
        }
        
        
        this.setDeliveryAddress=function(address){
            this.deliveryAddress=address;
        }
        
        this.getDeliveryAddress=function(){
            return this.deliveryAddress;
        }
        
    }])

;


angular.module('store.controllers', [])
    .controller('CheckoutCtrl', function($state,$stateParams,$scope,$locationservice,$vendorservice,$cartservice,$customerservice,$ionicSideMenuDelegate,$base64) {
        $scope.customer={
            firstname:$customerservice.firstname,
            lastname:$customerservice.lastname,
            email:$customerservice.email,
            deliveryAddress:$customerservice.deliveryAddress,
            scheduledate:$customerservice.scheduledate,
            scheduletime:$customerservice.scheduletime
        };
        $scope.comments="none";
        $scope.items=$cartservice.items;
        $scope.totalvalue=0;
        
        $scope.getTotal=function(){
          return $cartservice.getTotal();
        };
        $scope.totalvalue=function(){return $cartservice.getTotal()};
        
        if(!$scope.items.length){
            $state.go("app.welcome");
        }else if($scope.items.length<=0){
            $state.go("app.welcome");
        }

        $scope.addDays=function(currdate,days){
            var dat = new Date(currdate);
            dat.setDate(dat.getDate() + days);
            return dat;            
        }
    
        $scope.getAvailiableDates=function(days){
            var dateArray = new Array();
            var currentDate = new Date();
            var stopDate = $scope.addDays(currentDate,days);
            while (currentDate <= stopDate) {
                dateArray.push((currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' +  currentDate.getFullYear())
                currentDate = $scope.addDays(currentDate,1);
            }
            return dateArray;            
        }
        
        
        
        $scope.availiabledates=$scope.getAvailiableDates(7);
        $scope.availiabletimes=["9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM"];
            $scope.timeformats=["09:00:00","10:00:00","11:00:00","12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00","18:00:00","19:00:00"];

        $scope.buildorder=function(){
            var _l=10;
            var _c=0;
            for(_i=0;_i<10;_i++){
                if($scope.customer.scheduletime==$scope.availiabletimes[_i]){
                    _c=_i;
                    break;
                }
            };            
                var _customer={
                    name:$scope.customer.lastname+","+$scope.customer.firstname,
                    email:$scope.customer.email,
                    deliveryAddress:$customerservice.getDeliveryAddress(),
                    scheduledate:$scope.customer.scheduledate,
                    scheduletime:$scope.timeformats[_c]
                };
                var _items=$cartservice.items;
                
                var _prevendor=_items[0].Vendors.id;
                var _vendors=[];
                var _il=_items.length;
            
                var _currentvendor={
                    id:_items[0].Vendors.id,
                    name:_items[0].Vendors.name,
                    vendorcontactid:_items[0].Vendors.vendorcontactid,
                    vendorcontactaddressbookid:_items[0].Vendors.vendorcontactaddressbookid,
                    Products:[]
                };
                for(_i=0;_i<_il;_i++){
                    if(_prevendor!=_items[_i].Vendors.id){
                        _vendors.push(_currentvendor);
                    _currentvendor={
                    id:_items[_i].Vendors.id,
                    name:_items[_i].Vendors.name,
                    vendorcontactid:_items[_i].Vendors.vendorcontactid,
                    vendorcontactaddressbookid:_items[_i].Vendors.vendorcontactaddressbookid,
                        Products:[]
                };                 
                        _prevendor=_items[_i].Vendors.id;
                    }
                    _currentvendor.Products.push({
                        id:_items[_i].id,
                        name:_items[_i].name,
                        category:_items[_i].category,
                        subcategory:_items[_i].subcategory,
                        type:_items[_i].type,
                        model:_items[_i].model,
                        cartquantity:_items[_i].cartquantity,
                        Inventories:_items[_i].Inventories,
                    });
                    
                }
                
                _vendors.push(_currentvendor);
            
                return {
                    customer:_customer,
                    items:_vendors
                }
        }
    
        $scope.placeorder=function(){
            

            
            console.log(angular.toJson($scope.buildorder(),false));
            
            
            var _jsonstring=$base64.encode(angular.toJson($scope.buildorder(),false))
            ;
            
            
            
//            var _jsonstring=$base64.encode(angular.toJson({
//                customer:{
//                    name:$scope.customer.lastname+","+$scope.customer.firstname,
//                    email:$scope.customer.email,
//                    deliveryAddress:$customerservice.getDeliveryAddress(),
//                    scheduledate:$scope.customer.scheduledate,
//                    scheduletime:$scope.timeformats[_c]
//                },
//                items:$cartservice.items
//            },false));
            $cartservice.createorder({json:_jsonstring}).then(function(response){
               console.log(response.data); 
            });
        }
    
    
    })
    .controller('CartCtrl', function($state,$stateParams,$scope,$locationservice,$vendorservice,$cartservice,$customerservice,$ionicSideMenuDelegate) {
        $scope.items=$cartservice.items;
        $scope.totalvalue=0;

        $scope.getTotal=function(){
          return $cartservice.getTotal();
        };
        $scope.totalvalue=function(){return $cartservice.getTotal()};
        $scope.shouldShowDelete=false;
        $scope.edit=function(){
            $scope.shouldShowDelete = !$scope.shouldShowDelete;
        };
        $scope.checkout=function(){
            $ionicSideMenuDelegate.toggleRight();
            $state.go("app.checkout",{id: $cartservice.getCartId()},{reload: true});
        };


        
    })
    .controller('VendorCtrl', function($state,$stateParams,$scope,$locationservice,$vendorservice,$cartservice,$customerservice) {
        $scope.back=function(){
            $state.go("app.vendors",{},{reload: true});
        };
        $scope.totalvalue=function(){return $cartservice.getTotal()};
        $scope.vendor=$stateParams.vendor;
        $scope.products=[];
        $scope.getVendorProducts=function(vendor){
            $vendorservice.getVendorProducts(vendor.id).then(function(response){
              $scope.products=response.data.products;
              for (var i = 0; i < $scope.products.length; i++) {
                $scope.products[i].cartquantity=0;
                $scope.products[i].Vendors=$scope.vendor; 
              }
            });
        };

        $scope.addProductToCart=function(product){
          product.cartquantity++;    
          $cartservice.addItem(product,product.name);
        };
        $scope.removeProductFromCart=function(product){
          product.cartquantity--;  
          if(product.cartquantity<=0){
              product.cartquantity=0;
          }    
          $cartservice.addItem(product,product.name);
        };    
        if($stateParams.vendor == undefined){
            $scope.back();
        }else{
            $scope.getVendorProducts($scope.vendor);
        };
    
//        if($scope.customer.deliveryAddress.formattedaddress==undefined){
//            $state.go("app.welcome");
//        }else{
//            $scope.back();
//        }
        
    })
    .controller('StoreCtrl', function($state,$stateParams,$scope,$locationservice,$vendorservice,$cartservice,$customerservice) {
        $scope.vendors=[];
        $scope.back=function(){
            $state.go("app.welcome");
        };
        $scope.showvendors=function(){
            if($scope.vendors.length>0){
                return false;
            }else{
                return true;
            }
        };
        $scope.getVendors=function(){
            $vendorservice.getVendors().then(function(response){
                if(response.data.rc>=0){
                    _vendors=response.data.vendors;
                    _vcnt = _vendors.length;
                    for (_i = 0; _i < _vcnt ; _i++) {
                        _vccnt = _vendors[_i].VendorContacts.length;
                        for (_ci = 0; _ci < _vccnt ; _ci++) {
                            _vcacnt = _vendors[_i].VendorContacts[_ci].VendorContactAddressBooks.length;
                            for (_cai = 0; _cai < _vcacnt ; _cai++) {
                                $scope.vendors.push({
                                    'id':_vendors[_i].id,
                                    'name':_vendors[_i].name,
                                    'vendorcontactid':_vendors[_i].VendorContacts[_ci].id,
                                   'vendorcontactaddressbookid':_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].id, 'formattedAddress':_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].formattedaddress,
                                    'latitude':_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].latitude,
                                    'longitude':_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].longitude,
                                    'distance':$locationservice.calcDistance($scope.customer.deliveryAddress.latitude,$scope.customer.deliveryAddress.longitude,_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].latitude,_vendors[_i].VendorContacts[_ci].VendorContactAddressBooks[_cai].longitude)
                                })
                            }
                        }
                    }
                }
            }).catch(function(){
                $state.go("app.welcome");
            });
        };    
        $scope.customer="";
        $scope.totalvalue=function(){return $cartservice.getTotal()};
        if($stateParams.customer == undefined){
            
            $scope.customer={deliveryAddress:$customerservice.getDeliveryAddress()};
            if($scope.customer.deliveryAddress.formattedaddress==undefined){
                $state.go("app.welcome");
            }else{
                $scope.getVendors();
            }
        }else{
            $scope.customer=$stateParams.customer;
            $scope.getVendors();
        }
    })
    .controller('AppCtrl', function($state,$scope,$locationservice,$vendorservice,$cartservice,$customerservice) {
         $scope.onerror=false;
         $scope.showvendors=false;
         $scope.goToVendor=function(){
            _street=$scope.customer.deliveryAddress.street;
            _city=$scope.customer.deliveryAddress.city;
            _state=$scope.customer.deliveryAddress.state;
            _zipcode=$scope.customer.deliveryAddress.zipcode;
             $locationservice.findAddress($scope.customer.deliveryAddress.street,$scope.customer.deliveryAddress.city,$scope.customer.deliveryAddress.state).then(function(location){
                
                var _n=location.data.results[0].address_components.length;
                
                for(var _i=0;_i<_n;_i++){
                    var item=location.data.results[0].address_components[_i];
                    if(item.types[0]=="street_number"){
                        _streetnumber=item.short_name;
                    }
                    else if(item.types[0]=="route"){
                        _route=item.short_name;
                    }
                    else if(item.types[0]=="street_number"){
                        _streetnumber=item.short_name;
                    }
                    else if(item.types[0]=="locality"){
                        _city=item.short_name;
                    }
                    else if(item.types[0]=="administrative_area_level_1"){
                        _city=item.short_name;
                    }
                    else if(item.types[0]=="country"){
                        _country=item.short_name;
                    }
                    else if(item.types[0]=="postal_code"){
                        _zipcode=item.short_name;
                    }                    
                }
                    
                
               $scope.customer.deliveryAddress.street=_streetnumber+" "+_route; 
               $scope.customer.deliveryAddress.city=_city;
               $scope.customer.deliveryAddress.state='CA';
               $scope.customer.deliveryAddress.zipcode=_zipcode;   
               $scope.customer.deliveryAddress.formattedaddress=location.data.results[0].formatted_address,
               $scope.customer.deliveryAddress.latitude=location.data.results[0].geometry.location.lat,
               $scope.customer.deliveryAddress.longitude=location.data.results[0].geometry.location.lng
               $customerservice.setDeliveryAddress($scope.customer.deliveryAddress);            
               $state.go('app.vendors',{'customer':$scope.customer});
           }).catch(function(error){
                 $scope.onerror=true;
           });
         }
         $scope.Math = window.Math;
         $scope.message="Welcome to grocery store";
         $scope.vendors = [];
         $scope.cities=[
            'Alameda','Albany','American Canyon','Antioch','Atherton','Belmont','Belvedere','Benicia','Berkeley','Brentwood','Brisbane','Burlingame','Calistoga','Campbell','Clayton','Cloverdale','Colma','Concord','Corte Madera','Cotati','Cupertino','Daly City','Danville','Dixon','Dublin','East Palo Alto','El Cerrito','Emeryville','Fairfax','Foster City','Fremont','Gilroy','Half Moon Bay','Hayward','Healdsburg','Hercules','Hillsborough','Lafayette','Larkspur','Livermore','Los Altos','Los Altos Hills','Los Gatos','Martinez','Menlo Park','Mill Valley','Millbrae','Milpitas','Monte Sereno','Moraga','Morgan Hill','Mountain View','Napa','Newark','Novato','Oakland','Oakley','Orinda','Pacifica','Palo Alto','Petaluma','Piedmont','Pinole','Pittsburg','Pleasant Hill','Pleasanton','Portola Valley','Redwood City','Richmond','Rio Vista','Rohnert Park','Ross','St. Helena','San Anselmo','San Bruno','San Carlos','San Francisco','San Jose','San Leandro','San Mateo','San Pablo','San Rafael','San Ramon','Santa Clara','Santa Rosa','Saratoga','Sausalito','Sebastopol','Sonoma','South San Francisco','Suisun City','Sunnyvale','Tiburon','Union City','Vacaville','Vallejo','Walnut Creek','Windsor','Woodside','Yountville'
             
         ];
         $scope.customer={deliveryAddress:$customerservice.getDeliveryAddress()};
    })
;


angular
    .module('store', ['ionic','ui.router','base64' ,'store.controllers','store.services','ngIOS9UIWebViewPatch'])
    .run(function ($ionicPlatform,$rootScope, $state, $stateParams,$http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$domain="http://localhost";
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
              // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
              // for form inputs)
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

              // Don't remove this line unless you know what you are doing. It stops the viewport    
              // from snapping when text inputs are focused. Ionic handles this internally for
              // a much nicer keyboard experience.
              cordova.plugins.Keyboard.disableScroll(true);
            }
            if(window.StatusBar) {
              StatusBar.styleDefault();
            }
        });    
    })
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
      $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppCtrl'
        })
        .state('app.welcome', {
        url: '/welcome',
          params:{customer: null},
          views:{
            "menuContent":{
              templateUrl: 'templates/welcome.html',
              controller: 'AppCtrl',
            },
            "cartContent":{
              templateUrl: 'templates/cart.html',
              controller: 'CartCtrl'
            }
          }
        })
        .state('app.vendors', {
            url: '/vendors',
            params:{customer: null},
            views:{
              "menuContent":{
                templateUrl: 'templates/vendors.html',
                controller: 'StoreCtrl'
              },
              "cartContent":{
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
              }
            }

//            resolve:{
//                vendor:['$stateParams',function($stateParams){
//                    console.log($stateParams.id);
//                    return $stateParams.vendor;
//                }]
//            }
        })
      
        .state('app.vendor', {
            url: '/vendors/:id',
            params:{vendor: null,id:0},
            views:{
              "menuContent":{
                templateUrl: 'templates/vendor.html',
                controller: 'VendorCtrl'
              },
              "cartContent":{
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
              }
            }

//            resolve:{
//                vendor:['$stateParams',function($stateParams){
//                    console.log($stateParams.id);
//                    return $stateParams.vendor;
//                }]
//            }
        })
        .state('app.checkout', {
            url: '/cart/:id',
            params:{id:0},
            views:{
              "menuContent":{
                templateUrl: 'templates/checkout.html',
                controller: 'CheckoutCtrl'
              },
              "cartContent":{
                templateUrl: 'templates/cart.html',
                controller: 'CartCtrl'
              }
            }

//            resolve:{
//                vendor:['$stateParams',function($stateParams){
//                    console.log($stateParams.id);
//                    return $stateParams.vendor;
//                }]
//            }
        })      
      ;
      $urlRouterProvider.otherwise("/app/welcome");
    }])
;
