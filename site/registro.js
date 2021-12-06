
const emailVr ='pato2'
const senhaVr ='pato3'

async function registro_db(){
    let front_name = document.getElementById('name');
    let front_emai = document.getElementById('email');
    let front_senha = document.getElementById('senha');
    let front_retype_p = document.getElementById('retype_p');
    if(front_senha.value != front_retype_p.value)
    {
        alert('Senhas não identicas')
        return
    }
    let send = {
        name:front_name.value,
        email:front_emai.value,
        password:front_senha.value
    }

    const fetchResponsePromise = await fetch('http://localhost:80/create' ,{ 
        
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(send)
        
    })
    let val_serv = await fetchResponsePromise.json()
    if(val_serv == 'type_password_invalid')
    {
        alert('Email ou senha não adequados ')
    }
    else 
    {
        alert('Cadastro Criado')
        window.open('login.html','_self');
    }
}





/*
const but_log = document.querySelector('.button-google')
but_log.addEventListener('click',() =>{
    validar(front_emai.value, front_senha.value)
})*/