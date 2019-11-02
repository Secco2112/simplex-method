class Simplex{

    constructor() {
        this.variables = null;
        this.original_objective_function = null;
        this.objective_function = null;
        this.original_inequality_restrictions = null;
        this.inequality_restrictions = null;
        this.clearances = null;
    }

    setVariables(variables) {
        this.variables = variables;
        return this;
    }

    getVariables() {
        return this.variables;
    }

    setOriginalObjectiveFunction(original_objective_function) {
        this.original_objective_function = original_objective_function;
        return this;
    }

    getOriginalObjectiveFunction() {
        return this.original_objective_function;
    }

    setObjectiveFunction(objective_function) {
        this.objective_function = objective_function;
        return this;
    }

    getObjectiveFunction() {
        return this.objective_function;
    }

    setOriginalInequalityRestrictions(original_inequality_restrictions) {
        this.original_inequality_restrictions = original_inequality_restrictions;
        return this;
    }

    getOriginalInequalityRestrictions() {
        return this.original_inequality_restrictions;
    }

    setInequalityRestrictions(inequality_restrictions) {
        this.inequality_restrictions = inequality_restrictions;
        return this;
    }

    getInequalityRestrictions() {
        return this.inequality_restrictions;
    }

    setClearances(clearances) {
        this.clearances = clearances;
        return this;
    }

    getClearances() {
        return this.clearances;
    }

    getFormattedOriginalObjetiveFunction() {
        var of = this.original_objective_function,
            response = "Max. Z = ";
        
        var i = 0;
        for(var o in of) {
            var op = of[o] > 0? "+": "-";
            var value = (of[o] == 1 || of[o] == -1? "": Math.abs(of[o]));
            
            if(i++ == 0) {
                response += ((op == "-"? op: "") + value + o + " ");
            } else {
                response += (op + " " + value + o + " ");
            }
        }

        return response;
    }

    getFormattedObjectiveFunction() {
        var of = this.objective_function,
            response = "";

        var i = 0;
        for(var o in of) {
            var op = of[o] > 0? "+": "-";
            var value = (of[o] == 1 || of[o] == -1? "": Math.abs(of[o]));

            if(i++ == 0) {
                response += ((op == "-"? op: "") + value + o + " ");
            } else {
                response += (op + " " + value + o + " ");
            }
        }

        return response;
    }

}