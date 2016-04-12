angular.module('fresh.services', [])
<<<<<<< HEAD
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
=======
.service('$productservice',['$http',function($http){
    this.getItems=function(){
      //return $http.get('http://localhost:3000/customers');
        return [
            { title: 'Reggaeeee', id: 1, unitprice: 10.01, currency:'$' },
            { title: 'Chill', id: 2, unitprice: 12.01, currency:'$' },
            { title: 'Dubstep', id: 3, unitprice: 13.01, currency:'$' },
            { title: 'Indie', id: 4, unitprice: 20.01, currency:'$' },
            { title: 'Rap', id: 5, unitprice: 11.01, currency:'$' },
            { title: 'Cowbell', id: 6, unitprice: 15.44, currency:'$' },
            { title: 'Item', id: 7, unitprice: 10.11, currency:'$' },      
            { title: 'Itemsds', id: 8, unitprice: 17.01, currency:'$'  },      
            { title: '12dsd', id: 9, unitprice: 19.01, currency:'$'  },      
            { title: 'rerxccdfd', id: 10, unitprice: 8.21, currency:'$'  },      
            { title: 'dfdf dfd d dfd ', id: 11, unitprice: 5.31, currency:'$'  }            
        ];
    }
}])
.service('$cartservice',['$http',function($http){
    var self=this;
    self.items=[];
    self.TotalQuantity=0;
    self.TotalPrice=0;
    self.addItem=function(item){
        if(item.quantity == undefined){
            item.quantity = 1;
        }        
        if(item.itemTotalPrice == undefined){
            item.itemTotalPrice = item.unitprice*item.quantity;
        }        
        
        var l=self.items.length;
        for(var i=0;i<l;i++){
            if(self.items[i].id==item.id){
                self.items[i].quantity+=1;
                self.items[i].itemTotalPrice= item.unitprice*self.items[i].quantity;
                self.items[i].itemTotalPrice= item.unitprice*self.items[i].quantity;
                self.TotalPrice+=item.unitprice;
                self.TotalQuantity+=1;
                return self.items[i].quantity;
            }
           //self.TotalPrice+=self.items[i].itemTotalPrice;
            
        }
        self.TotalPrice+=item.unitprice*item.quantity; 
        self.TotalQuantity+=1;
        self.items.push(item);
        return 1;
    };
    self.removeItem=function(item){
        if(item.quantity == undefined){
            item.quantity = 0;
        }        
        var l=self.items.length;
        for(var i=0;i<l;i++){
            if(self.items[i].id==item.id){
                self.items[i].quantity--;
                if(self.items[i].quantity<=0){
//                 self.items[i].quantity=0;
//                self.items[i].itemTotalPrice= 0;
                    self.items.splice(i,1);                    
                self.TotalPrice-=item.unitprice; 
                self.TotalQuantity-=1; 
                    return 0;
                }else{
                self.items[i].itemTotalPrice= item.unitprice*self.items[i].quantity;
                self.TotalPrice-=item.unitprice; 
                self.TotalQuantity-=1;    
                }
                
                if(self.TotalPrice<=0){
                    self.TotalPrice=0;
                    self.TotalQuantity=0;
                }
>>>>>>> 9fdb478785db4b47f6315452d29b697aeabc3eff

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
<<<<<<< HEAD
    }])
;
=======
        return 0;
    }
    
    self.getTotalPrice=function(){
        if(self.TotalPrice<=0){
            self.TotalPrice=0;
            self.TotalQuantity=0;
        }        
        return self.TotalPrice;
    }
    self.getTotalQuantity=function(){
        if(self.TotalQuantity<=0){
            self.TotalPrice=0;
            self.TotalQuantity=0;
        }        
        return self.TotalQuantity;
    }   
    self.getItems=function(){
      //return $http.get('http://localhost:3000/customers');
//        return [
//            { title: 'Reggae', id: 1, quantity: 10 },
//            { title: 'Chill', id: 2, quantity: 10 },
//            { title: 'Dubstep', id: 3, quantity: 10 },
//            { title: 'Indie', id: 4, quantity: 10 },
//            { title: 'Rap', id: 5, quantity: 10 },
//            { title: 'Cowbell', id: 6, quantity: 10 }
//        ];
        return self.items;
    }
}])
>>>>>>> 9fdb478785db4b47f6315452d29b697aeabc3eff
