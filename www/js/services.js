angular.module('fresh.services', [])
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
                return self.items[i].quantity;
            }
           //self.TotalPrice+=self.items[i].itemTotalPrice;
            
        }
        self.TotalPrice+=item.unitprice*item.quantity; 
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
                 self.items[i].quantity=0;
                self.items[i].itemTotalPrice= 0;
                self.TotalPrice-=item.unitprice;                 }else{
                self.items[i].itemTotalPrice= item.unitprice*self.items[i].quantity;
           self.TotalPrice-=item.unitprice;                    
                }
                
                if(self.TotalPrice<=0){
                    self.TotalPrice=0;
                }

                
                return self.items[i].quantity;
            }
            
        }
        return 0;
    }
    
    self.getTotalPrice=function(){
        return self.TotalPrice;
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