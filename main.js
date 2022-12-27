window.addEventListener('load', carregado);



var db = openDatabase('logindb.', '1.0', 'logindb', 2 * 1024 * 1024);

function carregado(){
    document.getElementById('btn-login').addEventListener('click',salvar)
}

function salvar(){
    var email = document.getElementById('logemail').value;
    var pass = document.getElementById('logpass').value;


    db.transaction(function(tx){
        tx.executeSql('INSERT INTO logindb (email, pass) VALUES (?,?)',[email, pass]);
    });
};