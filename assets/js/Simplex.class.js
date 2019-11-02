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
        var of = this.original_objective_function;
        console.log(of);
    }

}