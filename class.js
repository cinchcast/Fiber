/**
 * Class.js 1.0.2
 * @Author Kirollos Risk
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
( function(){
  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this,

  // Stores whether the object is being initialized. i.e., whether
  // to run the `init` function, or not.
    initializing = false,

  // Keep a few prototype references around - for speed access,
  // and saving bytes in the minified version.
    ArrayProto = Array.prototype,
    ObjectProto = Object.prototype,

  // Save the previous value of Class.
    previousClass = root.Class;

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
    var base = this.prototype,
      // Invoke the function which will return an object literal used to define
      // the prototype. Additionally, pass in the parent prototype, which will
      // allow instances to use it
      properties = fn( base ),
      // Stores the constructor's prototype
      proto;

       // The dummy constructor function
      function ctor(){
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
      proto = ctor.prototype = new this;
      initializing = false;

       // Copy the properties over onto the new prototype
      copy( properties, proto );

      // Enforce the constructor to be what we expect
      proto.constructor = ctor;

      // Keep a reference to the parent prototype.
      // (Note: currently used by decorators, so that the `base` can be inferred)
      ctor.__base__ = base;

       // Make this class extendable
      ctor.extend = Class.extend;

      // Add ability to create mixins
      ctor.mixin = function( /* mixin[s] */ ) {
        var i,
          len = arguments.length

        for( i = 0; i < len; i++ ){
          copy( arguments[i]( base ), proto );
        }
      }

      return ctor;
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
   * @param decorators {Function|[Functions]} A single decorator or a list of decorators to apply
   * @param(s) args Remaining arguments to be passed into each decorator
   *
   * (Note: when a decorator is called, the first arguments passed is is the super class prototype
   * (i.e., the base))
   *
   * Example usage:
   *
   *  function Decorator(base, arg1, arg2) {
   *     // this === obj
   *     // arg1 === 1
   *     // arg2 === 2
   *  }
   *
   *  var obj = new Bar(); // Some Class instance
   *  Class.decorate(obj, 1, 2);
   */
  Class.decorate = function( instance, decorators /*, arg[s] */ ) {
    var i,
      decorators = ObjectProto.toString.call( decorators ) ===  '[object Array]' ? decorators : [decorators],
      len = decorators.length,
      base = instance.constructor.__base__,
      // Get the rest of the arguments, if any are specified
      args = ArrayProto.slice.call( arguments, 2 );

    // Prepend the the base object
    args.unshift(base);

    for( i = 0; i < len; i++ ){
      decorators[i].apply( instance, args );
    }
  };

  /**
   * Run Class.js in *noConflict* mode, returning the `Class` variable to its
   * previous owner. Returns a reference to the Class object.
   */
  Class.noConflict = function() {
    root.Class = previousClass;
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
    root.Class = Class;
  }

}).call( this );