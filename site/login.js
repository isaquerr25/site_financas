
const emailVr ='pato2'
const senhaVr ='pato3'

async function validar(){

    const Storage = {
        get() {
            return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
        },
    
        set(transactions) {
            localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
        }
    }

    let front_emai = document.getElementById('email');
    let front_senha = document.getElementById('senha');
    let send = {email:front_emai.value,password:front_senha.value}
    const fetchResponsePromise = await fetch('http://localhost:80/auth' ,{ 
        
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(send)
        
    })
    let val_serv = await fetchResponsePromise.json()
    console.log(val_serv.value)
    if(typeof val_serv.value == 'number'){
        
        Storage.set({id_server:val_serv.value})
        let gridId = val_serv.value
        window.open(`grids.html?id=${gridId}`,'_self');
    }
    else if(val_serv.value == 'invalid')
    {
        alert('Email ou senha incorreto')
    }
    else 
    {
        alert('Não encontrado')
    }
}





/*
const but_log = document.querySelector('.button-google')
but_log.addEventListener('click',() =>{
    validar(front_emai.value, front_senha.value)
})*/