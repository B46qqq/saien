function confirmDelete(e){
    e.currentTarget.style.display= 'none';
    document.getElementById('delete').classList.remove('hide');
    document.getElementById('delete').classList.add('del_confirm');
    document.getElementById('canceldelete').classList.remove('hide');
}

function cancelDelete(){
    document.getElementById('beforedelete').style.display = "block";
    document.getElementById('delete').classList.add('hide');
    document.getElementById('delete').classList.remove('del_confirm');
    document.getElementById('canceldelete').classList.add('hide');
}
