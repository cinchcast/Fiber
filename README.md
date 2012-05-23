Class
=====

*(Note: I realize "Class" isn't a very original name, so if you have any suggestions, let me know! Yes indeed, credit will be given)*

This inheritiance model, I think, is best explained with code.

Let's define an Animal class:

```javascript
// Animal base class
var Animal = Class.extend(function(base) {
    return {
        // The `init` method serves as the constructor.
        init: function() {

            // Insert private functions here
            function private1(){}
            function private2(){}

            // Insert priviledged functions here
            this.privileged1 = function(){}
            this.privileged2 = function(){}
        },
        method1: function(){}
    }
});
```

`Class.extend` expects a function that returns an object literal.  That object literal is used to construct the prototype. The `init` method in the object literal acts as the constructor, which is invoked when an instance is created.  That is:

```javascript
var animal = new Animal(); // Create a new Animal instance
```

`init` is invoked automatically.

#### Inheriting

Now, suppose I want to create a Dog class. Since a dog is essentially an animal, then it should inherit from `Animal`. Note that every class definition has access to the parent's prototype via the `base` argument (or whatever you named it, since the consumer controls this).

```javascript
// Extend the Animal class.
var Dog = Animal.extend(function(base) {
    return {
        init: function(prop) {
            // Call the base init.
            base.init.call(this);
        },
        // Override base class `method1`
        method1: function(){},
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

#### Decorating

The ability to decorate instances is quite powerful.  As an example:

```javascript
var Domesticated = function(obj, base) {
    // Override the instance' scare method
    obj.scare = function(){
        console.log('Domesticated::sorry, we dont scare');
    }

    // Add a method
    obj.kneel = function(){}

    // Bind some custom events
    $(obj).on('barking', function() {});
};
```

From the above, you can see that a decorator is merely a function that expects an instance and the base prototype, both of which are provided by the `Class` library.  Within this function, you can override, augment, bind... - that is, decorate, the instance as you please.

So, back to our `husky` example.  To decorate the instance, use `decorate`:

```javascript
husky.decorate(Domesticated);
husky.scare(); // "Domesticated::sorry, we don't scare"
```

And there you have it.

- - -

### Futher reading

#### Prototypal Inheritance

In JavaScript, there is no concept of 'classes'.  Behavior re-use is achieved by the cloning of existing objects.  To mimic inheritance (and thus behavior re-use) in JavaSript, one could write the following:

```javascript
function Animal() {}
Animal.prototype.breathe = function() {};

// Dog, which 'inherits' from Animal
function Dog(){}
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;
```

Let's look at each line in detail.

```
Dog.prototype = new Animal();
```

This forces the `Dog`'s prototype to be a new instance of `Animal`, which means that every `Dog` *constructor* instance will be an instance of `Animal`. Why do it like that? Recall that in JavaScript objects are produced by constructor functions.  Therefore, by assigning `new constructor()` to the prototype, where *constructor* is a function, the JavaScript engine creates a new object with a link to inherit properties from the constructor.  Additionally, it applies the constructor function to it, and returns the value returned by the constructor (if it does indeed return a value), which brings us to the next section.

##### Constructor property

```javascript
Dog.prototype.constructor = Dog;
```

To understand the above, note that whenever a function object is created, the `Function` constructor that produces the function object also assigns it a property named `prototype`, itself holding a single property named `constructor` whose value is the newly created function object.  In other words, whenever you create a function, the JavaScript engine performs the following code:

```javascript
this.prototype = { constructor: this };
```

Try it out, run the following code:

```javascript
function Animal() {}
console.log( Animal.prototype.constructor === Animal ); // true
```

Why is this intersting?  Well, often, you'll see this type of object construction:

```javascript
function Animal() {};
Animal.prototype = {
    method1: function() {},
    method2: function() {}
}
```

Now, that's great; however, you've essentially replaced the prototype, and therefore you've lost the constructor property!  A better approach would perhaps be:

```javascript
Animal.prototype.method1 = function() {}
Animal.prototype.method2 = function() {}
```

which means you have not replaced the prototype, and thus the constructor property still exists.  Nonetheless, if you'd like to remain concise in your object definition, you can still take the object literal assignment approach, and add the constructor manually:

```javascript
Animal.prototype = {
    method1: function() {},
    method2: function() {}
}
Animal.prototype.constructor = Animal;  // Add the constructor manually
```

or maybe

```javascript
Animal.prototype = {
    constructor: Animal,
    method1: function() {},
    method2: function() {}
}
```

##### Seriously, do we even need the constructor property?

As far as the JavaScript engine is concerned, the constructor property makes absolutely no difference to it. It's only useful if **your** code explicitly needs it (for example, if you need each of your instances to have a reference to the actual constructor function that created it).

Frankly, one could do without the `constructor` property.  In most cases you should only be concerned about the `prototype` property.


