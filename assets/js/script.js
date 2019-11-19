var simplex = new Simplex();
simplex.setDecimalPlaces(2);

const ANIMATION_TIMEOUT = 1000;

var IR_HTML = '<li class="inequality-restriction"><i class="fa fa-times delete-inequality-restriction"></i><div data-index="1" class="variable-group">    <input name="x1" type="text" class="form-control" />    <span> x1 </span></div><select class="form-control" name="operation">    <option value="plus">+</option>    <option value="subtract">-</option></select><div data-index="2" class="variable-group">    <input name="x2" type="text" class="form-control" />    <span> x2 </span></div><select class="form-control" name="equality">    <option value="greater-equal">>=</option>    <option value="smaller-equal"><=</option>    <option value="equal">=</option>    <option value="greater">></option>    <option value="smaller"><</option></select><input name="b" type="text" class="form-control" /></li>';
var OPERATION_SELECT_HTML = '<select class="form-control" name="operation"><option value="plus">+</option><option value="subtract">-</option></select>';
var EQUALITY_SELECT_HTML = '<select class="form-control" name="equality"><option value="smaller-equal"><=</option><option value="greater-equal">>=</option><option value="equal">=</option><option value="smaller"><</option><option value="greater">></option></select>';
var NEXT_STEP_HTML = '<div class="next-step"><i class="fa fa-angle-double-down"></i></div>';


function scrollToBottom() {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
}


$(document).ready(function() {
    add_ir();
    delete_ir();

    add_variable();
    delete_variable();

    calculate();
});


function add_ir() {
    $(document).on("click", ".add-restriction-inequality", function() {
        var el = $(IR_HTML),
            total_variables = $(".restrictions > span").length;

        var html = "<li class='inequality-restriction'>";
            html += "<i class='fa fa-times delete-inequality-restriction'></i>";
            for(var i=1; i<=total_variables; i++) {
                html += "<div data-index='" + i + "' class='variable-group'>";
                    html += "<input name='x" + i + "' type='text' class='form-control' />";
                    html += "<span> x" + i + " </span>";
                html += "</div>";

                if(i != total_variables) html += OPERATION_SELECT_HTML;
            }
            html += EQUALITY_SELECT_HTML;
            html += "<input name='b' type='text' class='form-control' />";

        $(".list-inequality-restrictions").append(html);
    });
}

function delete_ir() {
    $(document).on("click", ".delete-inequality-restriction", function() {
        var counter = $(".list-inequality-restrictions > li").length;

        if(counter > 2) {
            $(this).parent().remove();
        } else {
            alert("Não é possível ter menos de duas restrições de inequação.");
        }
    });
}

function add_variable() {
    $(".add-variable").on("click", function() {
        var self = this,
            current_variables_count = parseInt($(".restrictions > span").length),
            index = current_variables_count + 1;

        // Adicionar item à lista de variáveis
        $(".restrictions").append("<span data-index='" + index + "'><i class='delete-variable fa fa-times'></i>x" + index + " >= 0</span>");

        // Adiciona item nas restrições
        var list = $(".list-inequality-restrictions");
        if($(list).find("> li").length > 0) {
            $(list).find("> li").each(function(i, el) {
                $(OPERATION_SELECT_HTML).insertBefore($(el).find("select[name=equality]"));

                var html = "<div data-index='" + index + "' class='variable-group'>";
                    html += "<input name='x" + index + "' type='text' class='form-control' />";
                    html += "<span> x" + index + " </span>";
                html += "</div>";
                $(html).insertBefore($(el).find("select[name=equality]"));
            });
        }

        // Adiciona variável na função
        $(".objective-function").append(OPERATION_SELECT_HTML);

        var html = "<div data-index='" + index + "' class='variable-group'>";
                html += "<input name='x" + index + "' type='text' class='form-control' />";
                html += "<span> x" + index + " </span>";
            html += "</div>";
        $(".objective-function").append(html);
    });
}

function delete_variable() {
    $(document).on("click", ".delete-variable", function() {
        var index = $(this).parent().data("index"),
            counter = $(".restrictions > span").length;
        
        if(counter > 2) {
            $(this).parent().remove();

            // Deletar variável da função objetivo
            var el = $(".objective-function").find(".variable-group[data-index='" + index + "']");
            if(index == 1) $(el).next().remove();
            else $(el).prev().remove();
            $(el).remove();

            // Deletar variáveis das inequações
            $(".list-inequality-restrictions li").each(function(i, li) {
                var el = $(li).find(".variable-group[data-index='" + index + "']");
                if(index == 1) $(el).next().remove();
                else $(el).prev().remove();
                $(el).remove();
            });

            // Refaz indíces
            $(".restrictions > span").each(function(i, span) {
                $(span).attr("data-index", i + 1);
                $(span).html("<i class='delete-variable fa fa-times'></i>x" + (i + 1) + " >= 0");
            });

            $(".objective-function .variable-group").each(function(i, vg) {
                $(vg).attr("data-index", i + 1);
                $(vg).find("input").attr("name", "x" + (i + 1));
                $(vg).find("span").text(" x" + (i + 1) + " ");
            });

            $(".list-inequality-restrictions li").each(function(i, li) {
                $(li).find(".variable-group").each(function(j, vg) {
                    $(vg).attr("data-index", j + 1);
                    $(vg).find("input").attr("name", "x" + (j + 1));
                    $(vg).find("span").text(" x" + (j + 1) + " ");
                });
            });
        } else {
            alert("Não é possível ter menos de duas variáveis.");
        }
    });
}


function calculate() {
    $(".options .calculate").on("click", function() {
        $(".overlay-on-calculate, .calc-separator").addClass("show");

        var self = this,
            variables = [];
        
        $(".restrictions").find("> span").map(function(i, span) {
            variables.push($(span).text().replace(">= 0", "").trim());
        });

        simplex.setVariables(variables);


        // Função objetivo
        var objective_function_el = $(".objective-function");
        var original_objective_function = {};
        var objective_function = {"Z": 1};

        $(objective_function_el).find(".variable-group").each(function(i, vg) {
            if($(vg).prev().attr("name") == "operation") {
                var value = $(vg).find("input").val().trim();
                if(value == "") value = "1";
                var signal = $(vg).prev().val();
                if(signal == "subtract") {
                    value = (value[0] == "-"? value.replace("-", ""): "-" + value);
                }
                original_objective_function[variables[i]] = simplex.format(value);
                objective_function[variables[i]] = simplex.format(value) * -1;
            } else {
                var value = $(vg).find("input").val().trim();
                if(value == "") value = "1";
                original_objective_function[variables[i]] = simplex.format(value);
                objective_function[variables[i]] = simplex.format(value) * -1;
            }
        });

        simplex.setOriginalObjectiveFunction(original_objective_function);
        simplex.setObjectiveFunction(objective_function);


        // Restrições de inequação
        var original_inequality_restrictions = [],
            inequality_restrictions = [];

        var folgas = [];
        $(".list-inequality-restrictions li").each(function(i, li) {
            folgas.push("xF" + (i + 1));
        });

        simplex.setClearances(folgas);

        $(".list-inequality-restrictions li").each(function(i, li) {
            var ir = {};
            $(li).find(".variable-group").each(function(j, vg) {
                if($(vg).prev().attr("name") == "operation") {
                    var value = $(vg).find("input").val().trim();
                    if(value == "") value = "1";
                    var signal = $(vg).prev().val();
                    if(signal == "subtract") {
                        value = (value[0] == "-"? value.replace("-", ""): "-" + value);
                    }
                    ir[variables[j]] = simplex.format(value);
                } else {
                    var value = $(vg).find("input").val().trim();
                    if(value == "") value = "1";
                    ir[variables[j]] = simplex.format(value);
                }
            });

            ir["b"] = simplex.format($(li).find("input[name=b]").val().trim());

            original_inequality_restrictions.push(ir);

            // Adiciona folgas
            var tmp = Object.assign({}, ir);
            $.each(folgas, function(j, f) {
                tmp["xF" + (j + 1)] = (+(j == i));
            });
            inequality_restrictions.push(tmp);
        });

        simplex.setOriginalInequalityRestrictions(original_inequality_restrictions);
        simplex.setInequalityRestrictions(inequality_restrictions);

        
        // Mostrar dados de view
        showFormattedData();
    });
}


function showFormattedData() {
    var current_height = $(".wrapper-content .content").height();

    setTimeout(function() {
        $(".wrapper-content .content").attr("style", "height: calc(100vh + " + current_height + "px)");

        var formatted_oof = simplex.getFormattedOriginalObjetiveFunction();
        var formatted_of = simplex.getFormattedObjectiveFunction();
        var formatted_oir = simplex.getFormattedOriginalInequalityRestrictions(),
            formatted_ir = simplex.getFormattedInequalityRestrictions(),
            html_formatted_ir = "";

        $.each(formatted_oir, function(i, ir) {
            html_formatted_ir += "<div class='ir' data-index='" + i + "'>";
                html_formatted_ir += "<span id='original'>" + ir + "</span>";
                html_formatted_ir += "<span id='sep'>-></span>";
                html_formatted_ir += "<span id='formatted'>" + formatted_ir[i] + "</span>";
            html_formatted_ir += "</div>";
        });

        $("html, body").animate(
            { scrollTop: current_height },
            ANIMATION_TIMEOUT,
            function() {
                $(".formatted-values").css("marginTop", "280px");

                // Aplicar valores
                $(".formatted-values .objective-function #original").text(formatted_oof);
                $(".formatted-values .objective-function #formatted").text(formatted_of);
                $(".formatted-values .inequality-restrictions .list").html(html_formatted_ir);

                setTimeout(function() {
                    $(".formatted-values").addClass("show");

                    setTimeout(function() {
                        $(".formatted-values").next().addClass("show");

                        mountMainTable();
                    }, ANIMATION_TIMEOUT);
                }, ANIMATION_TIMEOUT);
            });
    }, ANIMATION_TIMEOUT);
}


function mountMainTable() {
    var headers = ['Z'];
    $.each(simplex.getVariables(), function(i, v) {
        headers.push(v);
    });
    $.each(simplex.getClearances(), function(i, c) {
        headers.push(c);
    });
    headers.push('b');

    var objective_function = simplex.getObjectiveFunction(),
        inequality_restrictions = simplex.getInequalityRestrictions(),
        main_table = [];

    var html = "<div class='main-table' id='main-table-" + simplex.getCurrentIteration() + "'>";
        html += "<table class='table'>";
            html += "<thead>";
                html += "<tr>";
                    html += "<th scope='col'></th>";
                    $.each(headers, function(i, h) {
                        html += "<th scope='col'>" + h + "</th>";
                    });
                html += "</tr>";
            html += "</thead>";
            html += "<tbody>";
                html += "<tr>";
                    html += "<td scope='col'>Z</td>";
                    var z_line = [];
                    $.each(headers, function(i, h) {
                        if(objective_function.hasOwnProperty(h)) {
                            html += "<td scope='row'>" + objective_function[h] + "</td>";
                            z_line.push(objective_function[h]);
                        } else {
                            html += "<td scope='row'>0</td>";
                            z_line.push(0);
                        }
                    });
                    main_table.push(z_line);
                html += "</tr>";
                $.each(inequality_restrictions, function(i, ir) {
                    html += "<tr>";
                        html += "<td scope='row'>L" + (i+1) + "</td>";
                        var i_line = [];
                        $.each(headers, function(j, h) {
                            if(ir.hasOwnProperty(h)) {
                                html += "<td scope='row'>" + ir[h] + "</td>";
                                i_line.push(ir[h]);
                            } else {
                                html += "<td scope='row'>0</td>";
                                i_line.push(0);
                            }
                        });
                        main_table.push(i_line);
                    html += "</tr>";
                });
            html += "</tbody>";
        html += "</table>";
    html += "</div>";


    simplex.setMainTable(main_table);


    if($("#main-table-" + simplex.getCurrentIteration()).length == 0) {
        $(html).insertAfter($(".formatted-values").next());
    
        $("#main-table-" + simplex.getCurrentIteration()).after(NEXT_STEP_HTML);

        setTimeout(function() {
            $("#main-table-" + simplex.getCurrentIteration()).addClass("show");

            setTimeout(function() {
                findPivotElement();
            }, ANIMATION_TIMEOUT);
        }, ANIMATION_TIMEOUT);
    }
}


function findPivotElement(first_iteration=true) {
    var pivot_number = null,
        biggest_negative_number = null,
        line_index = 1,
        column_index = 1,
        main_table = simplex.getMainTable();

    biggest_negative_number = main_table[0][0];
    for(var i=1; i<main_table[0].length; i++) {
        if(main_table[0][i] < biggest_negative_number) {
            biggest_negative_number = main_table[0][i];
            column_index = i;
        }
    }

    var lowest_column_number = main_table[1][main_table[1].length-1] / main_table[1][column_index];
    if(main_table.length > 2) {
        for(var i=2; i<main_table.length; i++) {
            var aux = main_table[i][main_table[i].length-1] / main_table[i][column_index];
            if(aux < lowest_column_number) {
                if(aux > 0) {
                    lowest_column_number = aux;
                    line_index = i;
                }
            }
        }
    }

    if(!first_iteration) simplex.setCurrentIteration(simplex.getCurrentIteration() + 1);
    
    pivot_number = main_table[line_index][column_index];
    simplex.setPivotNumber(pivot_number);
    simplex.setPivotNumberCoord({x: line_index, y: column_index});

    // Pinta linha e coluna
    setTimeout(function() {
        if(first_iteration) {
            var table = $("#main-table-" + simplex.getCurrentIteration());
        } else {
            var id = "#last-table-" + (simplex.getCurrentIteration() - 1).toString();
            var table = $(document).find(id);
        }

        $(table).find("thead tr th:nth-child(" + (column_index + 2) + ")").css("backgroundColor", "#f3f2f2");
        $(table).find("tbody tr").each(function(i, tr) {
            $(tr).find("td:nth-child(" + (column_index + 2) + ")").css("backgroundColor", "#f3f2f2");
        });

        $(table).find("tbody tr:nth-child(" + (line_index + 1) + ") td").css("backgroundColor", "#f3f2f2");

        // Pinta elemento pivô
        setTimeout(function() {
            $(table).find("tbody tr:nth-child(" + (line_index + 1) + ") td:nth-child(" + (column_index + 2) + ")").css("backgroundColor", "#dadada");
            
            generateNewPivotLine(first_iteration);
        }, ANIMATION_TIMEOUT);
    }, ANIMATION_TIMEOUT);
}


function generateNewPivotLine(first_iteration=true) {
    var current_line = [],
        new_pivot_line = [],
        pivot_number_coord = simplex.getPivotNumberCoord();

    if(first_iteration) {
        var table = $("#main-table-" + simplex.getCurrentIteration());
    } else {
        var id = "#last-table-" + (simplex.getCurrentIteration() - 1).toString();
        var table = $(document).find(id);
    }

    $(table).find("tbody tr:nth-child(" + (pivot_number_coord.x + 1) + ") td").each(function(i ,td) {
        if(i > 0) {
            var v = simplex.format($(td).text().trim());
            current_line.push(v);
        }
    });

    for(var i=0; i<current_line.length; i++) {
        var v = current_line[i] / simplex.getPivotNumber();
        v = simplex.format(v);
        new_pivot_line.push(v);
    }

    simplex.setNewPivotLine(new_pivot_line);

    
    // Setar valor na tabela principal
    var mt = simplex.getMainTable();
    mt[pivot_number_coord.x] = new_pivot_line;
    simplex.setMainTable(mt);


    var html = "<div class='new-pivot-line' id='new-pivot-line-" + simplex.getCurrentIteration() + "'>";
            html += "<h4>Nova linha pivô</h4>";
            html += "<table class='table'>";
                html += "<tbody>";
                    html += "<tr>";
                        html += "<td></td>";
                        $.each(current_line, function(i, v) {
                            html += "<td>" + v + "</td>";
                        });
                    html += "</tr>";
                    html += "<tr>";
                        html += "<td>/ " + simplex.getPivotNumber() + "</td>";
                        $.each(new_pivot_line, function(i, v) {
                            html += "<td>" + v + "</td>";
                        });
                    html += "<tr>";
                html += "</tbody>";
            html += "</table>";
        html += "</div>";

    if(first_iteration) {
        var element = $(table).next()
        $(html).insertAfter(element);
    } else {
        var element = $(table).next().next();
        $(html).insertAfter(element);
    }


    scrollToBottom();


    setTimeout(function() {
        $(element).next().addClass("show");

        $("#new-pivot-line-" + simplex.getCurrentIteration()).addClass("show");

        $("#new-pivot-line-" + simplex.getCurrentIteration()).after(NEXT_STEP_HTML);

        setTimeout(function() {
            $("#new-pivot-line-" + simplex.getCurrentIteration()).next().addClass("show");

            calculateNewLines(first_iteration);
        });
    }, ANIMATION_TIMEOUT);
}


function calculateNewLines(first_iteration=true) {
    var lines_indexes = [],
        all_indexes = [],
        pivot_number_coord = simplex.getPivotNumberCoord(),
        main_table = simplex.getMainTable(),
        table_lenght = main_table.length,
        new_pivot_line = simplex.getNewPivotLine();

    for(var i=0; i<table_lenght; i++) all_indexes.push(i);
    lines_indexes = all_indexes.filter(function(i) {
        return i != pivot_number_coord.x;
    });


    $.each(lines_indexes, function(i, line) {
        var element = (i == 0? $("#new-pivot-line-" + simplex.getCurrentIteration()): $(document).find(".new-line")),
            line_text = (line == 0? "Z": line).toString();
        var mult_number = main_table[line][pivot_number_coord.y] * -1;

        var line_multiply = [];
        $.each(new_pivot_line, function(j, npl) {
            var v = npl * mult_number;
            v = simplex.format(v);
            line_multiply.push(v);
        });

        var new_line = [];
        for(var j=0; j<line_multiply.length; j++) {
            var v = line_multiply[j] + main_table[line][j];
            v = simplex.format(v);
            new_line.push(v);
        }

        var html = "<div class='new-line new-line-" + line_text.toLowerCase() + "' id='new-line-" + line_text.toLowerCase() + "-" + simplex.getCurrentIteration() + "'>";
                html += "<h4>Nova linha " + line_text + "</h4>";
                html += "<table class='table'>";
                    html += "<tbody>";
                        html += "<tr>";
                            html += "<td></td>";
                            $.each(new_pivot_line, function(j, npl) {
                                html += "<td>" + npl + "</td>";
                            });
                        html += "</tr>";
                        html += "<tr>";
                            html += "<td>* " + (mult_number) + "</td>";
                            for(var k=0; k<line_multiply.length; k++) {
                                html += "<td>" + line_multiply[k] + "</td>";
                            }
                        html += "</tr>";
                        html += "<tr>";
                            html += "<td>+ " + (line_text) + "</td>";
                            for(var k=0; k<main_table[line].length; k++) {
                                html += "<td>" + main_table[line][k] + "</td>";
                            }
                        html += "</tr>";
                        html += "<tr>";
                            html += "<td>NL" + line_text +"</td>";
                            for(var k=0; k<new_line.length; k++) {
                                html += "<td><strong>" + new_line[k] + "</strong></td>";
                            }
                        html += "</tr>";
                    html += "</tbody>";
                html += "</table>";
            html += "</div>";

        main_table[line] = new_line;
        simplex.setMainTable(main_table);

        if(element.length > 1) {
            element = element[element.length - 1];
        }

        $(element).after(html);

        scrollToBottom();

        setTimeout(function() {
            $(element).next().addClass("show");
            $(element).after(NEXT_STEP_HTML);
            
            setTimeout(function() {
                $(element).next().addClass("show");
            }, ANIMATION_TIMEOUT);
        }, ANIMATION_TIMEOUT);
    });

    mountEndTable(first_iteration);
}


function mountEndTable(first_iteration=true) {
    var headers = ['Z'];
    $.each(simplex.getVariables(), function(i, v) {
        headers.push(v);
    });
    $.each(simplex.getClearances(), function(i, c) {
        headers.push(c);
    });
    headers.push('b');

    var main_table = simplex.getMainTable();

    var html = "<div class='last-table' id='last-table-" + simplex.getCurrentIteration() + "'>";
        html += "<h4>Nova tabela</h4>";
        html += "<table class='table'>";
            html += "<thead>";
                html += "<tr>";
                    html += "<th scope='col'></th>";
                    $.each(headers, function(i, h) {
                        html += "<th scope='col'>" + h + "</th>";
                    });
                html += "</tr>";
            html += "</thead>";
            html += "<tbody>";
                $.each(main_table, function(i, row) {
                    html += "<tr>";
                        html += "<td>" + (i == 0? "Z": "L" + i) + "</td>";
                        $.each(row, function(j, k) {
                            html += "<td>" + k + "</td>";
                        });
                    html += "</tr>";
                });
            html += "</tbody>";
        html += "</table>";
    html += "</div>";

    var last_new_line = $(".new-line").last();
    $(last_new_line).next().after(html);

    scrollToBottom();
    
    setTimeout(function() {
        $("#last-table-" + simplex.getCurrentIteration()).addClass("show");

        $("#last-table-" + simplex.getCurrentIteration()).after(NEXT_STEP_HTML);

        setTimeout(function() {
            $("#last-table-" + simplex.getCurrentIteration()).next().addClass("show");
            
            calculate_variables(first_iteration);
        }, ANIMATION_TIMEOUT);
    }, ANIMATION_TIMEOUT);
}

function calculate_variables(first_iteration=true) {
    var bv = {},
        nvb = {},
        main_table = simplex.getMainTable();

    bv = simplex.findBasicVariables();
    simplex.setBasicVariables(bv);

    nbv = simplex.findNotBasicVariables();
    simplex.setNotBasicVariables(nbv);

    
    var html = "<div class='show-variables' id='show-variables-" + simplex.getCurrentIteration() + "'>";
            html += "<div class='basic-variables'>";
                html += "<table class='table'>";
                    html += "<thead>";
                        html += "<tr>";
                            html += "<th colspan='2'>Variáveis básicas</th>";
                        html += "</tr>";
                    html += "</thead>";
                    html += "<tbody>";
                        for(var i in bv) {
                            html += "<tr>";
                                html += "<td>" + i + "</td>";
                                html += "<td>" + bv[i] + "</td>";
                            html += "</tr>";
                        }
                    html += "</tbody>";
                html += "</table>";
            html += "</div>";

            html += "<div class='not-basic-variables' id='not-basic-variables-" + simplex.getCurrentIteration() + "'>";
                html += "<table class='table'>";
                    html += "<thead>";
                        html += "<tr>";
                            html += "<th colspan='2'>Variáveis não básicas</th>";
                        html += "</tr>";
                    html += "</thead>";
                    html += "<tbody>";
                        for(var i in nbv) {
                            html += "<tr>";
                                html += "<td>" + i + "</td>";
                                html += "<td>" + nbv[i] + "</td>";
                            html += "</tr>";
                        }
                    html += "</tbody>";
                html += "</table>";
            html += "</div>";

            html += "<div class='z-value' id='z-value-" + simplex.getCurrentIteration() + "'>";
                html += "<table class='table'>";
                    html += "<thead>";
                        html += "<tr>";
                            html += "<th colspan='2'>Valor de Z</th>";
                        html += "</tr>";
                    html += "</thead>";
                    html += "<tbody>";
                        html += "<tr>";
                            html += "<td>Z</td>";
                            html += "<td>" + main_table[0][main_table[0].length-1] + "</td>";
                        html += "</tr>";
                    html += "</tbody>";
                html += "</table>";
            html += "</div>";
        html += "</div>";

    $("#last-table-" + simplex.getCurrentIteration()).next().after(html);

    scrollToBottom();

    setTimeout(function() {
        // Checa se a solução é ótima
        $("#show-variables-" + simplex.getCurrentIteration()).addClass("show");

        var good_solution = simplex.isGoodSolution();

        if(good_solution) {
            var html = '<div style="margin-top: 30px;"><span style="text-align: center; display: block; color: #006b08; font-weight: bold;">Solução ótima</span></div>';
            setTimeout(() => {
                $("#z-value-" + simplex.getCurrentIteration()).append(html);
            }, ANIMATION_TIMEOUT);
            return;
        } else {
            var html = '<div style="margin-top: 30px;"><span style="text-align: center; display: block; color: red; font-weight: bold;">Solução não ótima</span></div>';
            setTimeout(() => {
                $("#z-value-" + simplex.getCurrentIteration()).append(html);

                findPivotElement(false);
            }, ANIMATION_TIMEOUT);
        }
    }, ANIMATION_TIMEOUT);
}