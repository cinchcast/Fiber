/**
 * Class.js 1.0.3
 * @Author: Kirollos Risk
 *
 * Copyright (c) 2012 LinkedIn.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
( function( global ){
  // Stores whether the object is being initialized. i.e., whether
  // to run the `init` function, or not.
  var initializing = false,

  // Keep a few prototype references around - for speed access,
  // and saving bytes in the minified version.
    ArrayProto = Array.prototype;

  // Save the previous value of Class.
    previousClass = global.Class;

  // Copies properties from one object to the other
  function copy(from, to) {
    var name;
    for( name in from ){
      if( from.hasOwnProperty( name ) ){
        to[name] = from[name];
      }
    }
  }

  // The base Class implementation
  function Class(){};

  // Create a new Class that inherits from this class
  Class.extend = function( fn ){
    // Keep a reference to the current prototye
    var parent = this.prototype,

    // Invoke the function which will return an object literal used to define
    // the prototype. Additionally, pass in the parent prototype, which will
    // allow instances to use it.
      properties = fn( parent ),

    // Stores the constructor's prototype
      proto;

    // The constructor function for the new subclass
    function child(){
      if( !initializing && typeof this.init === 'function' ){
        // All construction is done in the init method
        this.init.apply( this, arguments );
        // Prevent any re-initializing of the instance
        delete this.init;
      }
    }

    // Instantiate a base class (but only create the instance, don't run the init function),
    // and make every `constructor` instance an instance of `this` and of `constructor`
    initializing = true;
    proto = child.prototype = new this;
    initializing = false;

     // Copy the properties over onto the new prototype
    copy( properties, proto );

    // Enforce the constructor to be what we expect
    proto.constructor = child;

    // Keep a reference to the parent prototype.
    // (Note: currently used by decorators and mixins, so that the parent can be inferred)
    child.__base__ = parent;

     // Make this class extendable
    child.extend = Class.extend;

    return child;
  };

  /**
   * @purpose Return a proxy object for accessing base methods with a given context
   *
   * Overloads:
   *   - Class.proxy( instance )
   *   - Class.proxy( base, instance )
   *
   * @param base {Object}
   * @param instance {Object}
   * @return {Object}
   */
  Class.proxy = function( base, instance ) {
    var name,
      iface = {},
      wrap;

    // If there's only 1 argument specified, then it is the instance,
    // thus infer `base` from its constructor.
    if ( arguments.length === 1 ) {
      instance = base;
      base = instance.constructor.__base__;
    }

    wrap = function( fn ) {
      return function() {
        return base[fn].apply( instance, arguments );
      };
    };

    // Create a wrapped method for each method in the base
    // prototype
    for( name in base ){
      if( base.hasOwnProperty( name ) && typeof base[name] === 'function' ){
        iface[name] = wrap( name );
      }
    }
    return iface;
  };

  /**
   * @purpose Decorate an instance with given decorator(s)
   * @param instance {Object} Class instance to be decorated
   * @param decorators {Function} Argument[s] of decorator function[s]
   *
   * Note: when a decorator is executed, the argument passed in is the super class prototype
   * (i.e., the base)
   *
   * Example usage:
   *
   *  function Decorator(base) {
   *     // this === obj
   *  }
   *
   *  var obj = new Bar(); // Some Class instance
   *  Class.decorate(obj, Decorator);
   */
  Class.decorate = function( instance /*, decorator[s] */) {
    var i,
      decorators = ArrayProto.slice.call( arguments, 1 ),
      len = decorators.length,
      // Get the base prototype
      base = instance.constructor.__base__;

    for( i = 0; i < len; i++ ){
      copy( decorators[i]( base ), instance );
    }
  };

  /**
   * @purpose Add functionality to a Class definition
   * @param mixin[s] {Function} Argument[s] of mixin function[s]
   *
   * Note: when a mixing is executed, the argument passed in is the super class prototype
   * (i.e., the base)
   *
   * Overloads:
   *   - Class.mixin( definition, mix_1 )
   *   - Class.mixin( definition, mix_1, ..., mix_n )
   *
   * Example usage:
   *
   *   var Definition = Class.extend(function(base) {
   *     return {
   *       method1: function(){}
   *     }
   *   });
   *
   *   function Mixin(base) {
   *     return {
   *       method2: function(){}
   *     }
   *   }
   *
   *  Class.mixin(obj, Mixin);
   *  var obj = new Definition();
   *  obj.method2();
   */
  Class.mixin = function( definition /*, mixin[s] */ ) {
    var i,
      // Get the base prototype
      base = definition.__base__,
      // Get all the mixins in the arguments
      mixins = ArrayProto.slice.call( arguments, 1 ),
      len = mixins.length;

    for( i = 0; i < len; i++ ){
      copy( mixins[i]( base ), definition.prototype );
    }
  };

  /**
   * Run Class.js in *noConflict* mode, returning the `Class` variable to its
   * previous owner. Returns a reference to the Class object.
   */
  Class.noConflict = function() {
    global.Class = previousClass;
    return Class;
  };

   // Export the Class object to Common JS Loader
  if( typeof module !== 'undefined' ){
    if( typeof module.setExports === 'function' ){
      module.setExports( Class );
    } else if( module.exports ){
      module.exports = Class;
    }
  } else {
    global.Class = Class;
  }

})( this );
