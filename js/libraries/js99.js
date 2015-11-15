const JS99 = (function () {
    "use strict";
    let vars = {},
        varListeners = {},
        nodes = {};
        
    /* 
      You can use JS99.vars and JS99.nodes in your program
      varListeners contains arrays of nodes , each array contains all nodes
        that listen to the same variable. You should have no good reason to use varListeners. Instead use nodes
        
      If you have this in your document <input data-99-var="a">
        --> you can then use vars.a or vars["a"] here
        --> you can then use JS99.vars.a
            or               JS99.vars.["a"] in your js
        all assignments will be reflected in the document
        
        
      If you have this in your document <div data-99-node="box1"></div>
        --> you can then use nodes.box1 or nodes["box1"]
        it is basically a short cut for getElementBy...()
      
      You can define your event Listener here for small experiments.
    */
    
    /*change multiple vars at once. Shortcut function
    example
    
        JS99.changeVars({
            a: "3",
            b: "1",
            c: "always a string"
        });
        
    instead of writing
    
        JS99.vars.a = "3";
        JS99.vars.b = "1";
        JS99.vars.c = "always a string";
    
    */
    const changeVars = function (details) {
        let key;
        for (key of Object.keys(details)) {
            if (vars.hasOwnProperty(key)) {
                vars[key] = details[key];
            }
        }
    };
    
    return {
        vars,
        varListeners,
        nodes,
        changeVars
    };
}());