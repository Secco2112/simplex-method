var IR_HTML = '<li class="inequality-restriction"><i class="fa fa-times delete-inequality-restriction"></i><input name="x1" type="text" class="form-control"><span> x1 </span><select class="form-control" name="operation">    <option value="plus">+</option>    <option value="subtract">-</option></select><input name="x2" type="text" class="form-control"><span> x2 </span></li>';

$(document).ready(function() {
    add_ir();
    delete_ir();
});


function add_ir() {
    $(document).on("click", ".add-restriction-inequality", function() {
        var el = $(IR_HTML);

        $(".list-inequality-restrictions").append(el);
    });
}

function delete_ir() {
    $(document).on("click", ".delete-inequality-restriction", function() {
        $(this).parent().remove();
    });
}