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
    }
  });
}
