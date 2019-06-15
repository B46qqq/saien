function reset_inputs(){
    var fields = document.getElementsByTagName("input");
    var errors = document.getElementsByClassName("alert");

    var i = 0;
    for (; i < fields.length; ++i)
        if (!fields[i].classList.contains("reg_btn"))
            fields[i].value = "";

    for (i = 0; i < errors.length; ++i)
        errors[i].style.display = 'none';
}
