# Project name / Title (won't appear in the sidebar)

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
