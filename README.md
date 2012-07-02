# Class.js

## Inheritance

### Usage

`[[constructor]].extend( function )`

#### Example

```javascript
// Animal base class
var Animal = Class.extend(function() {
    return {
        // The `init` method serves as the constructor.
        init: function() {
            // Private
            function private1(){}
            function private2(){}

            // Privileged
            this.privileged1 = function(){}
            this.privileged2 = function(){}
        },
        // Public
        method1: function(){}
    }
});
```

The `init` method acts as the constructor, which is invoked when an instance is created:

```javascript
var animal = new Animal(); // Create a new Animal instance
```

`init` is invoked automatically.

### Inheritance

```javascript
// Extend the Animal class.
var Dog = Animal.extend(function() {
    return {
        // Override base class `method1`
        method1: function(){
            console.log('dog::method1');
        },
        scare: function(){
            console.log('Dog::I scare you');
        }
    }
});
```

Create an instance of `Dog`:

```javascript
var husky = new Dog();
husky.scare(); // "Dog::I scare you'"
```

#### Accessing parent prototype

Every class definition has access to the parent's prototype via the first argument passed into the function:

```javascript
// Extend the Animal class.
var Dog = Animal.extend(function( base ) {
    return {
        // Override base class `method1`
        method1: function(){
            // Call the parent method
            base.method1.call(this);
        },
        scare: function(){
            console.log('Dog::I scare you');
        }
    }
});
```

## Singleton

### Usage

`[[constructor]].singleton( function, param1, param2, ... )`

```javascript
var Single = Class.singleton(function() {
  return {
    method: function() {}
  }
});
```

The singleton's instance is created once, when a call to `.getInstance()` is made:

```javascript
// Creates the instance, and calls the method
Single.getInstance().method();

// Instance has already been created, so just call the method
Single.getInstance().method();
```

### Constructor with arguments

```javascript
var Single = Class.singleton(function() {
  return {
    init: function(a, b) {
        this.a = a;
        this.b = b;
    },
    print: function() {
      console.log(this.a, this.b);
    }
  }
}, 1, 2);

Single.getInstance().print(); // 1, 2
```

### Singleton & Inheritance

```javascript
var Foo = Class.extend(function() {
  return {
    init: function(a, b) {
        this.a = a;
        this.b = b;
    }
  }
});

var FooSingle = Foo.singleton(function(base) {
  return {
    print: function() {
      base.print.call(this);
    }
  }
}, 1, 2);

FooSingle.getInstance().print(); // 1, 2
```

## Mixin

### Usage

`[[constructor]].mixin( function1, function2, ... )`

```javascript
// Animal base class
var Foo = Class.extend(function(base) {
    return {
        method1: function(){}
    }
});

var f = new Foo();
f.method1();

Foo.mixin(function() {
    return  {
        method2: function() {}
    }
});

f.method2();
```

## Decorators

### Usage

`Class.decorate( instance, function1, function2, ... )`

```javascript
function CarWithPowerWindows() {
}
function CarWithLeaterSeats() {
}

Class.decorate(myCar, CarWithPowerWindows, CarWithLeaterSeats);
```

## Proxy

### Usage

`Class.proxy( base, instance )`

```javascript
// Extend the Animal class;
var Dog = Animal.extend(function(base) {
    return {
        init: function() {
            this.base = Class.proxy(base, this);
            this.base.init();
        }
    }
});
```

