var IR_HTML = '<li class="inequality-restriction"><i class="fa fa-times delete-inequality-restriction"></i><div data-index="1" class="variable-group">    <input name="x1" type="text" class="form-control" />    <span> x1 </span></div><select class="form-control" name="operation">    <option value="plus">+</option>    <option value="subtract">-</option></select><div data-index="2" class="variable-group">    <input name="x2" type="text" class="form-control" />    <span> x2 </span></div><select class="form-control" name="equality">    <option value="greater-equal">>=</option>    <option value="smaller-equal"><=</option>    <option value="equal">=</option>    <option value="greater">></option>    <option value="smaller"><</option></select><input name="b" type="text" class="form-control" /></li>';
var OPERATION_SELECT_HTML = '<select class="form-control" name="operation"><option value="plus">+</option><option value="subtract">-</option></select>';
var EQUALITY_SELECT_HTML = '<select class="form-control" name="equality"><option value="greater-equal">>=</option><option value="smaller-equal"><=</option><option value="equal">=</option><option value="greater">></option><option value="smaller"><</option></select>';

$(document).ready(function() {
    add_ir();
    delete_ir();

    add_variable();
    delete_variable();
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