class Simplex{

    constructor() {
        this.current_iteration = 1;
        this.variables = null;
        this.original_objective_function = null;
        this.objective_function = null;
        this.original_inequality_restrictions = null;
        this.inequality_restrictions = null;
        this.clearances = null;
        this.main_table = null;
        this.pivot_number = null;
    }

    setCurrentIteration(current_iteration) {
        this.current_iteration = current_iteration;
        return this;
    }

    getCurrentIteration() {
        return this.current_iteration;
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

    setMainTable(main_table) {
        this.main_table = main_table;
        return this;
    }

    getMainTable() {
        return this.main_table;
    }

    setPivotNumber(pivot_number) {
        this.pivot_number = pivot_number;
        return this;
    }

    getPivotNumber() {
        return this.pivot_number;
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

    getFormattedOriginalInequalityRestrictions() {
        var ir = this.original_inequality_restrictions;
        var response = [];
        
        for(var i in ir) {
            var r = "",
                it = 0;
            for(var j in ir[i]) {
                var key = j,
                    value = ir[i][j];

                if(key != "b" && value != 0) {
                    var op = value > 0? "+": "-";
                    value = (value == 1 || value == -1? "": Math.abs(value));

                    if(it++ == 0) {
                        r += ((op == "-"? op: "") + value + key + " ");
                    } else {
                        r += (op + " " + value + key + " ");
                    }
                }
            }

            r += "<= " + ir[i]["b"];
            
            response.push(r);
        }

        return response;
    }

    getFormattedInequalityRestrictions() {
        var ir = this.inequality_restrictions;
        var response = [];
        
        for(var i in ir) {
            var r = "",
                it = 0;
            for(var j in ir[i]) {
                var key = j,
                    value = ir[i][j];

                if(key != "b" && value != 0) {
                    var op = value > 0? "+": "-";
                    value = (value == 1 || value == -1? "": Math.abs(value));

                    if(it++ == 0) {
                        r += ((op == "-"? op: "") + value + key + " ");
                    } else {
                        r += (op + " " + value + key + " ");
                    }
                }
            }

            r += "= " + ir[i]["b"];
            
            response.push(r);
        }

        return response;
    }

}