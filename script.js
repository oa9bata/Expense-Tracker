const stats = document.getElementById('stats');
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const typeInputs = document.getElementsByName('type');
const addBtn = document.getElementById('addBtn');
const transactionsList = document.getElementById('transactions');
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expenses');

function load(){
    const saved = localStorage.getItem('transactions')
    if(saved){
        transactions = JSON.parse(saved)
        render()
        update()
    }
}

let transactions = []
load()

function addTransaction () {
    const de = descInput.value.trim()
    const am = amountInput.value.trim()
    const ty = document.querySelector('input[name="type"]:checked').value;

        if(de === '' || !am || am <= 0){
        return alert("some is missin' g")
    }

    const transaction = {
        id: Date.now(),
        description: de,
        amount: am,
        type: ty
    }
    descInput.value = ''
    amountInput.value = ''
    transactions.push(transaction)
    save()
    render()
}

addBtn.addEventListener('click', addTransaction)

function save(){
localStorage.setItem('transactions', JSON.stringify(transactions))
}

function render (){

    transactionsList.innerHTML = ''

    if(transactions.length !== 0){
        transactions.forEach((transaction) => {
            const li = document.createElement("li")
            li.className = `flex items-center justify-between p-4 bg-gray-700 rounded-lg border-l-4 ${transaction.type === 'income' ? 'border-green-500' : 'border-red-500'}`;

            li.innerHTML = `
                <div class="flex-1">
                    <p class="text-white font-medium" id="desc-${transaction.id}"></p>
                    <p class="text-gray-400 text-xs">${transaction.type}</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="font-bold text-lg ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}">
                        ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}
                    </span>
                    <button 
                        onclick="deleteTransaction(${transaction.id})" 
                        class="px-3 py-1 bg-red-600 text-white text-sm rounded font-semibold"
                    >
                        Delete
                    </button>
                </div>
            `; 
            transactionsList.appendChild(li)
            document.getElementById(`desc-${transaction.id}`).textContent = transaction.description
        })
    }         update()
}

function update (){
const inc = transactions.filter(transaction => transaction.type === 'income')
const exp = transactions.filter(transaction => transaction.type === 'expense')


const totalIncome = inc.reduce((sum, transaction) => {
    return sum + Number(transaction.amount)
}, 0)

const totalExpense = exp.reduce((sum, transaction) => {
    return sum + Number(transaction.amount)
}, 0)
const finalBalance = totalIncome - totalExpense

income.textContent = `$${totalIncome}`
expense.textContent = `$${totalExpense}`
balance.textContent = `$${finalBalance}`

}
function deleteTransaction(id){
 transactions = transactions.filter(transaction => transaction.id !== id)
    save()
    render()
}