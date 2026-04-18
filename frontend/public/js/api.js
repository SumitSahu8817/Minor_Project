// // URL logic: Local aur Deployment dono ke liye safe
// const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
//     ? "http://localhost:3000/api" 
//     : "/api";

// const api = {
//     getHeaders() {
//         const token = localStorage.getItem("token");
//         const headers = { "Content-Type": "application/json" };
//         if (token) headers["Authorization"] = `Bearer ${token}`;
//         return headers;
//     },

//     async handleResponse(res) {
//         const data = await res.json();
//         if (res.status === 401) {
//             localStorage.removeItem("token");
//             window.location.href = "index.html";
//             return;
//         }
//         return data;
//     },

//     async get(path) {
//         const res = await fetch(API_URL + path, { headers: this.getHeaders() });
//         return this.handleResponse(res);
//     },

//     async post(path, data) {
//         const res = await fetch(API_URL + path, {
//             method: "POST",
//             headers: this.getHeaders(),
//             body: JSON.stringify(data),
//         });
//         return this.handleResponse(res);
//     },

//     async patch(path, data) {
//         const res = await fetch(API_URL + path, {
//             method: "PATCH",
//             headers: this.getHeaders(),
//             body: JSON.stringify(data),
//         });
//         return this.handleResponse(res);
//     },

//     async del(path) {
//         const res = await fetch(API_URL + path, {
//             method: "DELETE",
//             headers: this.getHeaders(),
//         });
//         return this.handleResponse(res);
//     }
// };

// // ==========================================
// // --- GLOBAL THEME LOGIC (SAFE VERSION) ---
// // ==========================================
// document.addEventListener('DOMContentLoaded', () => {
//     const themeBtn = document.getElementById('themeToggle'); // ID check karo har page pe
//     const currentTheme = localStorage.getItem('theme') || 'light';

//     // 1. Initial Theme Apply
//     if (currentTheme === 'dark') {
//         document.body.setAttribute('data-theme', 'dark');
//         if (themeBtn) themeBtn.innerText = '☀️';
//     }

//     // 2. Click Logic (Safe check ke sath)
//     if (themeBtn) {
//         themeBtn.onclick = () => {
//             const isDark = document.body.getAttribute('data-theme') === 'dark';
//             if (isDark) {
//                 document.body.removeAttribute('data-theme');
//                 localStorage.setItem('theme', 'light');
//                 themeBtn.innerText = '🌙';
//             } else {
//                 document.body.setAttribute('data-theme', 'dark');
//                 localStorage.setItem('theme', 'dark');
//                 themeBtn.innerText = '☀️';
//             }
//         };
//     }
// });
// URL logic: Local aur Deployment (Render) dono ke liye automatically kaam karega
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
    ? "http://localhost:3000/api" 
    : "/api";

const api = {
    // Har request ke liye headers taiyar karna (Token ke saath)
    getHeaders() {
        const token = localStorage.getItem("token");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    },

    // Agar token expire ho jaye toh automatically index.html par bhej do
    async handleResponse(res) {
        const data = await res.json();
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }
        return data;
    },

    // API Methods
    async get(path) {
        const res = await fetch(API_URL + path, { headers: this.getHeaders() });
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
// --- GLOBAL THEME LOGIC (SAFE VERSION) ---
// ==========================================
// Yeh code check karega ki button hai ya nahi, taaki script crash na ho
document.addEventListener('DOMContentLoaded', () => {
    // Button ka ID 'themeToggle' ya 'globalThemeToggle' kuch bhi ho, ye pakad lega
    const themeBtn = document.getElementById('themeToggle') || document.getElementById('globalThemeToggle'); 
    const currentTheme = localStorage.getItem('theme') || 'light';

    // 1. Initial Theme Apply karna
    if (currentTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeBtn) themeBtn.innerText = '☀️';
    }

    // 2. Click karne par Theme switch karna
    if (themeBtn) {
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
});