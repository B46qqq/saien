function product_filter() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("product_filter");
    filter = input.value.toUpperCase();
    tab_list = document.querySelector(".product_tab_list");
    plist = tab_list.getElementsByTagName("a");
    for (i = 0; i < plist.length; ++i) {
        a = plist[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a.style.display = "";
        } else {
            a.style.display = "none";
        }
    }
}
