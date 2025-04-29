class BudgetTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.balance = 0;
        this.income = 0;
        this.expenses = 0;
        
        this.initializeEventListeners();
        this.updateDashboard();
    }

    initializeEventListeners() {
        const addTransactionBtn = document.querySelector('.add-transaction');
        const modal = document.getElementById('transaction-modal');
        const transactionForm = document.getElementById('transaction-form');

        addTransactionBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });
    }

    addTransaction() {
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        const transaction = {
            id: Date.now(),
            amount: type === 'expense' ? -amount : amount,
            type,
            description,
            date
        };

        this.transactions.push(transaction);
        this.saveToLocalStorage();
        this.updateDashboard();
        
        document.getElementById('transaction-form').reset();
        document.getElementById('transaction-modal').style.display = 'none';
    }

    updateDashboard() {
        this.calculateTotals();
        this.updateBalanceDisplay();
        this.updateTransactionsList();
    }

    calculateTotals() {
        this.income = this.transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);

        this.expenses = Math.abs(this.transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + t.amount, 0));

        this.balance = this.income - this.expenses;
    }

    updateBalanceDisplay() {
        document.querySelector('.amount').textContent = `${this.balance} ₸`;
        document.querySelector('.income p').textContent = `${this.income} ₸`;
        document.querySelector('.expenses p').textContent = `${this.expenses} ₸`;
    }

    updateTransactionsList() {
        const transactionsList = document.getElementById('transactions-list');
        transactionsList.innerHTML = '';

        this.transactions.slice().reverse().forEach(transaction => {
            const div = document.createElement('div');
            div.className = `transaction ${transaction.type}`;
            div.innerHTML = `
                <div class="transaction-info">
                    <span class="date">${transaction.date}</span>
                    <span class="description">${transaction.description}</span>
                    <span class="amount">${Math.abs(transaction.amount)} ₸</span>
                </div>
            `;
            transactionsList.appendChild(div);
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }
}

// Add this at the beginning of app.js
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize Chart
    initializeChart();

    // Handle sidebar navigation
    const budgetButton = document.querySelector('.monthly-overview');
    const expensesButton = document.querySelector('.nav-item.expenses');
    const incomeButton = document.querySelector('.nav-item.income');
    const mainContent = document.querySelector('.main-content');
    
    // Add event listeners
    budgetButton.addEventListener('click', showBudgetView);
    expensesButton.addEventListener('click', showExpensesView);
    incomeButton.addEventListener('click', showIncomeView);

    function showIncomeView() {
        mainContent.innerHTML = `
            <div class="income-view">
                <h2>Кірістер тізімі</h2>
                <div class="income-list">
                    <div class="income-item">
                        <div class="income-icon"><i class="fas fa-briefcase"></i></div>
                        <div class="income-details">
                            <h3>Жалақы</h3>
                            <span class="date">Сәуір, 2024</span>
                        </div>
                        <div class="income-amount">+500 500 KZT</div>
                    </div>
                    <div class="income-item">
                        <div class="income-icon"><i class="fas fa-gift"></i></div>
                        <div class="income-details">
                            <h3>Сыйақы</h3>
                            <span class="date">Маусым, 2024</span>
                        </div>
                        <div class="income-amount">+120 000 KZT</div>
                    </div>
                    <div class="income-item">
                        <div class="income-icon"><i class="fas fa-coins"></i></div>
                        <div class="income-details">
                            <h3>Қосымша табыс</h3>
                            <span class="date">Тамыз, 2024</span>
                        </div>
                        <div class="income-amount">+90 600 KZT</div>
                    </div>
                </div>
            </div>
        `;
    }

    function showExpensesView() {
        mainContent.innerHTML = `
            <div class="expenses-view">
                <h2>Шығындар тізімі</h2>
                <div class="expenses-list">
                    <div class="expense-item">
                        <div class="expense-icon"><i class="fas fa-home"></i></div>
                        <div class="expense-details">
                            <h3>Үй жалдау</h3>
                            <span class="date">Наурыз, 2024</span>
                        </div>
                        <div class="expense-amount">-250 000 KZT</div>
                    </div>
                    <div class="expense-item">
                        <div class="expense-icon"><i class="fas fa-utensils"></i></div>
                        <div class="expense-details">
                            <h3>Азық-түлік</h3>
                            <span class="date">Шілде, 2024</span>
                        </div>
                        <div class="expense-amount">-75 500 KZT</div>
                    </div>
                    <div class="expense-item">
                        <div class="expense-icon"><i class="fas fa-bus"></i></div>
                        <div class="expense-details">
                            <h3>Транспорт</h3>
                            <span class="date">Қараша, 2024</span>
                        </div>
                        <div class="expense-amount">-160 000 KZT</div>
                    </div>
                </div>
            </div>
        `;
    }

    function showBudgetView() {
        mainContent.innerHTML = `
            <nav class="top-nav">
                <div class="date-nav">
                    <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                    <span>2024</span>
                    <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="view-controls">
                    <button class="nav-btn"><i class="fas fa-search"></i></button>
                    <button class="nav-btn"><i class="fas fa-filter"></i></button>
                </div>
            </nav>

            <div class="chart-section">
                <h2>Жылдық есеп графикпен</h2>
                <p>Бүгінге 50000 KZT салынды</p>
                <canvas id="expenseChart"></canvas>
            </div>

          
        `;

        // Reinitialize the chart after recreating the canvas
        initializeChart();
        
        // Render transactions
        

        transactions.forEach(transaction => {
            const div = document.createElement('div');
            div.className = 'transaction-item';
            div.innerHTML = `
                <div class="transaction-date">${transaction.date}</div>
                <div class="transaction-category">${transaction.category}</div>
                <div class="transaction-amount">${transaction.amount}</div>
            `;
            transactionList.appendChild(div);
        });
    }
});

function initializeChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'],
            datasets: [{
                label: 'Шығындар',
                data: [300000, 329977, 266689, 290000, 320010, 290070, 175000, 302000, 239900, 300600, 160000, 302000],
                backgroundColor: '#e91e63',
            }, {
                label: 'Кірістер',
                data: [500500, 500000, 490000, 500000, 450000, 400000, 550000, 500500, 500000, 390000, 480000, 430040],
                backgroundColor: '#4CAF50',
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

    // Add this to your existing JavaScript
    // Modal elements
    const modal = document.getElementById('addTransactionModal');
    const addBtn = document.querySelector('.add-transaction-btn');
    const closeBtn = document.querySelector('.close-btn');
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');

    // Categories definition
    const categories = {
        expense: [
            { id: 'rent', name: 'Үй жалдау' },
            { id: 'food', name: 'Азық-түлік' },
            { id: 'transport', name: 'Транспорт' }
        ],
        income: [
            { id: 'salary', name: 'Жалақы' },
            { id: 'capital', name: 'Капитал' },
            { id: 'additional', name: 'Қосымша табыс' }
        ]
    };

    // Open modal
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        populateCategories(typeSelect.value);
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Update categories when type changes
    typeSelect.addEventListener('change', (e) => {
        populateCategories(e.target.value);
    });

    function populateCategories(type) {
        categorySelect.innerHTML = categories[type]
            .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
            .join('');
    }

    // Initial categories population
    populateCategories(typeSelect.value);

    function showExpensesView() {
        mainContent.innerHTML = `
            <div class="expenses-view">
                <h2>Шығындар тізімі</h2>
                <div class="expenses-list">
                    ${transactions.expenses.map(expense => `
                        <div class="expense-item">
                            <div class="expense-icon"><i class="fas fa-file"></i></div>
                            <div class="expense-details">
                                <h3>${expense.category}</h3>
                                <span class="date">${expense.date}</span>
                            </div>
                            <div class="expense-amount">${Math.abs(expense.amount)} KZT</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function showIncomeView() {
        mainContent.innerHTML = `
            <div class="income-view">
                <h2>Кірістер тізімі</h2>
                <div class="income-list">
                    ${transactions.income.map(income => `
                        <div class="income-item">
                            <div class="income-icon"><i class="fas fa-file"></i></div>
                            <div class="income-details">
                                <h3>${income.category}</h3>
                                <span class="date">${income.date}</span>
                            </div>
                            <div class="income-amount">${income.amount} KZT</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function updateSidebarTotals(transaction) {
        const expensesAmount = document.querySelector('.nav-item.expenses .amount');
        const incomeAmount = document.querySelector('.nav-item.income .amount');
        
        if (transaction.type === 'expense') {
            const currentExpenses = parseFloat(expensesAmount.textContent.replace(/[^0-9.-]+/g, ""));
            expensesAmount.textContent = `${currentExpenses + Math.abs(transaction.amount)},00 KZT`;
        } else {
            const currentIncome = parseFloat(incomeAmount.textContent.replace(/[^0-9.-]+/g, ""));
            incomeAmount.textContent = `${currentIncome + transaction.amount},00 KZT`;
        }
    }
; 
   

    // Render transactions
    const transactionList = document.getElementById('transactionList');
    transactions.forEach(transaction => {
        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div class="transaction-date">${transaction.date}</div>
            <div class="transaction-category">${transaction.category}</div>
            <div class="transaction-amount">${transaction.amount}</div>
        `;
        transactionList.appendChild(div);
    });

        // Initialize the map
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 43.238949, lng: 76.889709 }, // Almaty coordinates
            zoom: 12
        });
    ;
;

// Бюджеттер бетін көрсету функциясы
document.querySelector('.nav-item:nth-child(3)').addEventListener('click', function() {
    document.querySelector('.chart-section').style.display = 'none';
    document.querySelector('.budget-page').style.display = 'block';
});
