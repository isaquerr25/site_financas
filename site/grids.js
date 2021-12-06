
let box_work = []


async function addForm(){
    

    let front_description = document.getElementById('description');
    let front_date        = document.getElementById('date');

    let send = {name:front_description.value , date_inform:front_date.value}


    let string_url = document.URL
    let url  = new URL(string_url)
    let user_id = url.searchParams.get("id");
    const fetchResponsePromise = await fetch(`http://localhost:80/users/${user_id}/gridvalues` ,{ 
        
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(send)
        
    })

    Modal.close()
    front_description.value  = ''
    front_date.value         = ''
    
    App.init();
};

function complet_grid(array_values){
    
    let itensGrid = document.querySelector('.itens')
    let text_html =''
 
    array_values.forEach(objJ => {
        console.log(objJ)
        text_html += work_html(objJ.name,0,objJ.date_inform,objJ.id)
    });
    text_html += `
                <div onclick="Modal.open()" class="plus_box">
                    <div>+</div>
                </div>
                `
    itensGrid.innerHTML = text_html
}

function work_html(name,money,date_table,id_table){
    let dateStr =new Date(date_table)    
    let conten = `
    <div class="box-ints"  onclick="App.manager(${id_table})">
        <div>
            <a>${name}</a>
        </div>
        
        <div>
            Valor
            <a>${money}</a>
        </div>
        
        <div>
            Data atalização
            <a>${dateStr.toLocaleDateString()}</a>
        </div>    
    </div>
    `
    return conten
}

const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close(){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
};

const App = {
    
    async init(){
        let string_url = document.URL
        let url  = new URL(string_url)
        let user_id = url.searchParams.get("id");
        const fetchResponsePromise = await fetch(`http://localhost:80/users/${user_id}/gridvalues` ,{ 
            
            method:'GET',
            headers: {'Content-Type':'application/json'},
            
            
        })
        let val_serv = await fetchResponsePromise.json()
        console.log(val_serv.length)
        complet_grid(val_serv)
    },
    manager(id_rotative){
        console.log(id_rotative)
        let string_url = document.URL
        let url  = new URL(string_url)
        let user_id = url.searchParams.get("id");
        window.open(`index.html?id=${user_id}&grid_id=${id_rotative}`,'_self');
    }
}


App.init();