function get_toggle_btn(){
    var toggle_btn = document.querySelector(".sidebar_toggle_switch");

    if (toggle_btn == null){
        toggle_btn = document.querySelector(".sidebar_toggle_switch_closed");
        if (toggle_btn == null){
            console.log("ERROR @ get_toggle_btn() > possibly classname not found");
            return null;
        }
    }

    return toggle_btn;
}

function toggle_animation(){
    var toggle_btn = get_toggle_btn();
    if (toggle_btn == null) return null;
    
    var tb_content = toggle_btn.textContent;
    if (escape(tb_content) === "%u292B"){
        var togglemation = document.querySelector(".sidebar_toggle_animation");
        togglemation.innerHTML = "&#171;";
    }
        
}


function toggling(){
    var toggle_btn = get_toggle_btn();
    if (toggle_btn == null) return null;

    var tb_content = toggle_btn.textContent;

    var s = document.querySelector(".sidebar");
    var c = document.querySelector(".content_container");
    var sc = document.querySelector(".sidebar_container");
    var stw = toggle_btn;

    if (escape(tb_content) === "%u292B"){
        s.style.width = "0px";
        s.style.opacity = "0.1";        
        s.style.boxShadow = "none";
        c.style.left = "0px";
        sc.style.left = "-185px";
        stw.innerHTML = "&#9776;";
        stw.removeAttribute("class");
        stw.setAttribute("class", "sidebar_toggle_switch_closed");
    } else { // Hope there are only two situation
        s.style.width = "225px";
        s.style.opacity = "1";
        s.style.boxShadow = "-5px -3px 10px 5px #000";
        c.style.left = "225px";
        sc.style.left = "0px";
        stw.innerHTML = "&#10539;";
        stw.removeAttribute("class");
        stw.setAttribute("class", "sidebar_toggle_switch");
    }
}

/* 
 * User Login Section scripts
 */
var currentTab = 0;
showTab(currentTab);

function showTab(n) {
    var x = document.getElementsByClassName("tab");
    var lsb = document.querySelector(".login_section_back");
    var lsn = document.querySelector(".login_section_next");
    x[n].style.display = "block";
    if (n == 0){
        lsb.style.display = "none";
        lsn.style.display = "none";
        hideStepIndicator();
    } else {
        lsb.style.display = "inline";
        lsn.style.display = "inline";
        showStepIndicator();
    }

    if (n == (x.length - 1))
        lsn.innerHTML = "Submit";
    else
        lsn.innerHTML = "Next";

    // The first step after user icon is the n = 0
    if (n == 0) return;
    updateStepIndicator(--n);
}

function nextPrev(n) {
    var x = document.getElementsByClassName("tab");
    if (n == 1 && !validateForm()) return false;
    x[currentTab].style.display = "none";
    currentTab = currentTab + n;
    if (currentTab >= x.length){
        console.log("submission !");
        return false;
    }
    showTab(currentTab);
}

function updateStepIndicator(n) {
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; ++i){
        x[i].className = x[i].className.replace(" active", "");
    }
    x[n].className += " active";
}

function hideStepIndicator(){
    var s = document.getElementsByClassName("step");
    for (var i = 0; i < s.length; ++i)
        s[i].style.display = "none";
}

function showStepIndicator(){
    var s = document.getElementsByClassName("step");
    for (var i = 0; i < s.length; ++i)
        s[i].style.display = "inline-block";    
}

function validateForm() {
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");

    for (i = 0; i < y.length; ++i){
        if (y[i].value == ""){
            if (! y[i].className.includes("invalid"))
                y[i].className += "invalid";
            valid = false;
        }
    }
    
    if (valid)
        document.getElementsByClassName("step")[currentTab].className += " finished";
    return valid;
}
