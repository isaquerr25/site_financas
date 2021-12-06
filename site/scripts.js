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
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        console.log(index)
        App.delet_row(index)
        
    },

    incomes(array_db) {
        let income = 0;
        array_db.forEach(transaction => {
            if( transaction.price > 0 ) {
                income += transaction.price;
            }
        })
        return income;
    },

    expenses(array_db) {
        let expense = 0;
        array_db.forEach(transaction => {
            if( transaction.price < 0 ) {
                expense += transaction.price;
            }
        })
        return expense;
    },

    total(array_db) {
        return Transaction.incomes(array_db) + Transaction.expenses(array_db);
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.price > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.price)
        let dateStr =new Date(transaction.date_inform)  
        const html = `
        <td class="description">${transaction.name}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${dateStr.toLocaleDateString()}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
        `

        return html
    
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) 
        
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
    
        value =  value.toFixed(2).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

       return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()
        
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            App.send_manager(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}



const App = {
    async init(){
        let string_url = document.URL
        let url  = new URL(string_url)
        let user_id = url.searchParams.get("id");
        let grid_id = url.searchParams.get("grid_id");
        const fetchResponsePromise = await fetch(`http://localhost:80/users/${user_id}/gridvalues/${grid_id}/managergrids` ,{ 
            
            method:'GET',
            headers: {'Content-Type':'application/json'},
            
            
        })
        let val_serv = await fetchResponsePromise.json()
        val_serv.forEach(objJ => {
        
            DOM.addTransaction(objJ,objJ.id);
        })



        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes(val_serv))

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses(val_serv))

        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total(val_serv))

        console.log(val_serv)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
    async send_manager(contem){

        let send = {name:contem.description ,price:contem.amount, date_inform:contem.date}
        let string_url = document.URL
        let url  = new URL(string_url)
        let user_id = url.searchParams.get("id");
        let grid_id = url.searchParams.get("grid_id");
        const fetchResponsePromise = await fetch(`http://localhost:80/users/${user_id}/gridvalues/${grid_id}/managergrids` ,{ 
        
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(send)
        })
        let val_serv = await fetchResponsePromise.json()
        App.reload();
    },
    async delet_row(contem){
        console.log(contem)
        let send = {id_delet:contem}
        let string_url = document.URL
        let url  = new URL(string_url)
        let user_id = url.searchParams.get("id");
        let grid_id = url.searchParams.get("grid_id");
        console.log('patssso')
        const fetchResponsePromise = await fetch(`http://localhost:80/users/${user_id}/gridvalues/${grid_id}/managergrids_dell` ,{ 
        
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(send)
        });
        let val_serv = await fetchResponsePromise.json()
        console.log('pato')
        App.reload();
        
    },
}



App.init()