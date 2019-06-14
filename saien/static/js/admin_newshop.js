function reset_inputs(){
    var fields = document.getElementsByTagName("input");

    var i = 0;
    for (; i < fields.length; ++i)
        if (!fields[i].classList.contains("reg_btn"))
            fields[i].value = "";
}
