document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Load users from JSON file
    const users = {
        "users": [
            {
                "email": "test@example.com",
                "password": "123456"
            }
        ]
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Check credentials
        const user = users.users.find(u => u.email === email && u.password === password);

        if (user) {
            if (remember) {
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('user', JSON.stringify(user));
            }
            window.location.href = 'ind.html';
        } else {
            alert('Қате email немесе құпия сөз');
        }
    });
});