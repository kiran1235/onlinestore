angular.module('fresh.services', [])
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
        this.getVendors=function(){
            return $http.get($rootScope.$domain+'/store/api/vendors');

//sample data
//{"rc":0,"data":[{"id":13,"name":"walmar","VendorContacts":[{"id":13,"isprimary":0,"VendorContactAddressBooks":[{"phone":"4088851142","formattedaddress":"777 Story Rd, San Jose, CA 95122, USA","latitude":37.3310001,"longitude":-121.860433}]}]}]}

        },

        this.getVendorProducts=function(id){
            return $http.get($rootScope.$domain+'/store/api/vendors/'+id+'/products/');
        }

    }])
    .service('$cartservice',['$http',function($http){
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
        }
    }])
    .service('$customerservice',['$http',function($http){
        if(this.deliveryAddress==undefined){
            console.log("ddd");
             this.deliveryAddress={
                   street:'655 s. fair oaks ave',
                   city:'sunnyvale',
                   state:'ca',
                   zipcode:'94086',
                   formattedaddress:'',
                   latitude:0.0,
                   longitude:0.0
            }            
        }
        
        this.setDeliveryAddress=function(address){
            this.deliveryAddress=address;
        }
        
        this.getDeliveryAddress=function(){
            return this.deliveryAddress;
        }
    }])
;