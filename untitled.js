// Extend the Animal class;
var Dog = Animal.extend(function(base) {
    return {
        init: function() {


            this.base = Class.proxy(base, this);



            this.base.init();

            base.init.call(this);
        }
    }
});

var d = new Dog();

function d1(base, settings) {
  this.blah = 2;
}

function d1(base, settings) {
  this.x = 3;
}

Class.decorate(d, d1, d2);

