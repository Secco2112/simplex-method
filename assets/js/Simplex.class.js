class Simplex{

    constructor() {
        this.current_iteration = 1; // Iteração atual
        this.decimal_places = 2; // Número de casas decimais para os cálculos

        this.variables = null; // Vetor com as variáveis
        this.original_objective_function = null; // Objeto da função objetivo original
        this.objective_function = null; // Função objetivo pós processada
        this.original_inequality_restrictions = null; // Objeto com as restrições de inequação originais
        this.inequality_restrictions = null; // Restrições de inequação pós processadas
        this.clearances = null; // Vetor com as folgas
        this.main_table = null; // Matriz contendo a tabela principal do exercício
        this.pivot_number = null; // Número pivô
        this.pivot_number_coord = null; // Posições do número pivô na tabela principal (this.main_table)
        this.new_pivot_line = null; // Nova linha pivô
        this.basic_variables = null; // Variáveis básicas
        this.not_basic_variables = null; // Variáveis não básicas
        this.z_value = null; // Valor de Z final
    }

    setCurrentIteration(current_iteration) {
        this.current_iteration = current_iteration;
        return this;
    }

    getCurrentIteration() {
        return this.current_iteration;
    }

    setDecimalPlaces(dp) {
        this.decimal_places = dp;
        return this;
    }

    getDecimalPlaces() {
        return this.decimal_places;
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

    setPivotNumberCoord(pivot_number_coord) {
        this.pivot_number_coord = pivot_number_coord;
        return this.pivot_number_coord;
    }

    getPivotNumberCoord() {
        return this.pivot_number_coord;
    }

    setNewPivotLine(new_pivot_line) {
        this.new_pivot_line = new_pivot_line;
        return this;
    }

    getNewPivotLine() {
        return this.new_pivot_line;
    }

    setBasicVariables(bv) {
        this.basic_variables = bv;
        return this;
    }

    getBasicVariables() {
        return this.basic_variables;
    }

    setNotBasicVariables(nbv) {
        this.not_basic_variables = nbv;
        return this;
    }

    getNotBasicVariables() {
        return this.not_basic_variables;
    }

    /*
        Função auxiliar utilizada para formatar os valores do exercício. Ela utiliza o número de
        casas decimais do objeto da classe, ou o parâmetro 'decimal_places'.
    */
    format(number, decimal_places=null) {
        return !isNaN(+number)? Number(((+number).toFixed(decimal_places || this.decimal_places) * 1).toString()): Number(number);
    }
    
    /*
        Retorna uma string com a função objetivo original
    */
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

    /*
        Retorna uma string com a função objetivo formatada
    */
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

    /*
        Retorna um vetor de string's com as restrições de inequação originais
    */
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

    /*
        Retorna um vetor de string's com as restrições de inequação formatadas
    */
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

    /*
        Encontra as variáveis básicas do exercício, iterando os campos da tabela principal (this.main_table)
    */
    findBasicVariables() {
        var main_table = this.getMainTable(),
            valid_fields = [],
            headers = [],
            bv = {};
        
        for(var i=0; i<this.getVariables().length; i++) {
            headers.push(this.getVariables()[i]);
        }
        for(var i=0; i<this.getClearances().length; i++) {
            headers.push(this.getClearances()[i]);
        }

        for(var i=1; i<main_table.length; i++) {
            var l =[];
            for(var j=1; j<main_table[i].length-1; j++) {
                l.push(main_table[i][j]);
            }
            valid_fields.push(l);
        }

        var row = valid_fields[0];
        for(var j=0; j<row.length; j++) {
            if(row[j] == 0 || row[j] == 1) {
                var check = 1, line_one = null;
                for(var k=1; k<valid_fields.length; k++) {
                    if(valid_fields[k][j] == 1 || valid_fields[k][j] == 0) {
                        check++;
                        if(valid_fields[k][j] == 1) {
                            line_one = main_table[k+1][main_table[0].length-1];
                        }
                    }
                }

                if(row[j] == 1) {
                    line_one = main_table[1][main_table[0].length-1];
                }

                if(check == valid_fields.length) {
                    bv[headers[j]] = line_one;
                }
            }
        }

        return bv;
    }

    /*
        Encontra as variáveis não básicas do exercício, iterando os campos da tabela principal (this.main_table)
    */
    findNotBasicVariables() {
        var main_table = this.getMainTable(),
            valid_fields = [],
            headers = [],
            nbv = {};
        
        for(var i=0; i<this.getVariables().length; i++) {
            headers.push(this.getVariables()[i]);
        }
        for(var i=0; i<this.getClearances().length; i++) {
            headers.push(this.getClearances()[i]);
        }

        for(var i=1; i<main_table[0].length-1; i++) {
            valid_fields.push(main_table[0][i]);
        }

        for(var i=0; i<valid_fields.length; i++) {
            if(valid_fields[i] != 0) {
                nbv[headers[i]] = 0;
            }
        }

        return nbv;
    }

    /*
        Verifica se foi encontrada uma solução ótima para o exercício
    */
    isGoodSolution() {
        var valid_fields = [],
            main_table = this.getMainTable();

        for(var i=1; i<main_table[0].length-1; i++) {
            valid_fields.push(main_table[0][i]);
        }

        var check = valid_fields.filter(function(v) {
            return v >= 0;
        });

        return check.length === valid_fields.length;
    }

}