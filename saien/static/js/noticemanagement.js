// Change the state of submit button
blankForm();

var changedInput = 0;

var inputs = document.getElementsByTagName('input');
var textareas = document.getElementsByTagName('textarea');

var postBtn = document.getElementById('postBtn');

for (var i = 0; i < inputs.length; ++i)
    addEvent(inputs[i]);

for (var i = 0; i < textareas.length; ++i)
    addEvent(textareas[i]);

function addEvent(e){
    e.addEventListener('input', function(){
        if (e.value == '' || e.value == null)
            -- changedInput;
        else
            ++ changedInput;
        updatePostButton();
    })
}

function updatePostButton(){
    if (changedInput > 0)
        postBtnShow();
    else
        postBtnHide();
}

function postBtnShow(){
    postBtn.classList.remove('disabled');
    postBtn.setAttribute('type', 'submit');
}

function postBtnHide(){
    postBtn.classList.add('disabled');
    postBtn.setAttribute('type', 'button');
}

function blankForm(){
    document.getElementById('notice_form').reset();
}

// For old notice section

var coll = document.getElementsByClassName("collap");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
            resetPostDeleteBtn(content.getElementsByTagName('button'));
        }
    });
}


function deleteNotice(id){
    var args = 'id=' + id;
    var request = new XMLHttpRequest();
    request.open('POST', url_removeNotice, true);
    request.setRequestHeader('Content-type',
                             'application/x-www-form-urlencoded');
    
    request.onload = function(){
        var ret =  JSON.parse(this.responseText);
        var msg_div = document.getElementById('message');
        var msg = msg_div.querySelector('strong');
        msg_div.classList.remove('hide');
        if ('success' in ret){
            var removeDiv = document.getElementById(id);
            removeDiv.click();
            removeDiv.style.display = 'none';
            msg_div.classList.add('warning');
            msg.innerHTML = ret['success'];
            return;
        }
        msg_div.classList.remove('warning');
        msg.innerHTML = ret['error'];
    };
    
    request.send(args);
}


function resetPostDeleteBtn(btns){
    btns[0].style.display = "block";
    btns[1].classList.add('hide');
    btns[2].classList.add('hide');
    btns[2].classList.remove('del_confirm');
}

function confirmDelete(e){
    e.currentTarget.style.display= 'none';
    var div = e.currentTarget.parentElement;
    var btns = div.getElementsByTagName('button');
    btns[1].classList.remove('hide');
    btns[2].classList.remove('hide');
    btns[2].classList.add('del_confirm');
}

function cancelDelete(e){
    var div = e.currentTarget.parentElement;
    var btns = div.getElementsByTagName('button');
    resetPostDeleteBtn(btns);
}
