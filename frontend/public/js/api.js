const API_URL = "/api"; // Deployment safe URL

const api = {
    // Helper function: Har request ke liye taaza headers taiyar karne ke liye
    getHeaders() {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json"
        };
        // Agar token milta hai toh Authorization header add karo
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    },

    // Global Response Handler: Status codes (jaise 401) handle karne ke liye
    async handleResponse(res) {
        const data = await res.json();
        // Agar token expire ho gaya ya invalid hai (401), toh logout karwao
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }
        return data;
    },

    async get(path) {
        const res = await fetch(API_URL + path, { 
            headers: this.getHeaders() 
        });
        return this.handleResponse(res);
    },

    async post(path, data) {
        const res = await fetch(API_URL + path, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse(res);
    },

    async patch(path, data) {
        const res = await fetch(API_URL + path, {
            method: "PATCH",
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        return this.handleResponse(res);
    },

    async del(path) {
        const res = await fetch(API_URL + path, {
            method: "DELETE",
            headers: this.getHeaders(),
        });
        return this.handleResponse(res);
    }
};

// ==========================================
// --- GLOBAL DAY/NIGHT THEME LOGIC ---
// ==========================================

const themeBtn = document.getElementById('globalThemeToggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Page load hone par purana theme lagao
if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    if(themeBtn) themeBtn.innerText = '☀️';
}

// Button click karne par theme change karo
if(themeBtn) {
    themeBtn.onclick = () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeBtn.innerText = '🌙';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeBtn.innerText = '☀️';
        }
    };
}