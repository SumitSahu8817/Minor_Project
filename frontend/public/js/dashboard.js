// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    location.href = "index.html";
};

// UI Toggle Animation Helper (Naya)
function toggleAddClassForm() {
    document.getElementById('addClassSection').classList.toggle('show');
}

// Classes load karne ka function
async function loadClasses() {
    const res = await api.get("/classes");
    const container = document.getElementById("classesContainer");
    container.innerHTML = "";

    if (res.success && res.classes) {
        res.classes.forEach(cls => {
            const card = document.createElement("div");
            // Naya CSS class animation ke liye add kiya hai ('animate-pop')
            card.className = "class-card animate-pop";
            card.innerHTML = `
                <h4 style="color: var(--text-primary); margin-bottom: 10px;">${cls.subject}</h4>
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 15px;">
                    Students: <strong>${cls.num_students}</strong> | Days: <strong>${cls.num_days}</strong>
                </p>
                <div class="card-buttons" style="display: flex; gap: 10px; margin-top: 15px;">
                    <a href="attendance.html?class=${cls.id}" class="primary-btn" style="flex: 1; text-align: center; text-decoration: none; padding: 10px;">Attendance</a>
                    <a href="planner.html?class=${cls.id}" class="btn" style="flex: 1; text-align: center; text-decoration: none; padding: 10px; background: var(--glass-border); color: var(--text-primary);">Planner</a>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// ─── NAYI CLASS AUR PDF/IMAGE SCANNING LOGIC ───
document.getElementById('newClassForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Yahan maine IDs ko HTML ke hisaab se theek rakha hai
    const subject = document.getElementById('subjectInput').value;
    const students = document.getElementById('studentsInput').value;
    const days = document.getElementById('daysInput').value;
    const fileInput = document.getElementById('syllabusFile');
    const statusMsg = document.getElementById('uploadStatus'); // Agar HTML mein nahi banaya toh warning na de isliye dhyan rakhna
    const saveBtn = document.getElementById('saveBtn');

    if (fileInput.files.length === 0) return alert("Please upload a file!");

    const file = fileInput.files[0];
    
    // UI Update
    if(statusMsg) statusMsg.style.display = 'block';
    saveBtn.disabled = true;

    let extractedText = "";

    // CONDITION 1: PDF FILE
    if (file.type === "application/pdf") {
        if(statusMsg) statusMsg.innerText = "📄 Reading PDF content... Please wait.";
        
        const fileReader = new FileReader();
        fileReader.onload = async function() {
            try {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(" ");
                    extractedText += pageText + " \n";
                }
                saveClassToBackend(subject, students, days, extractedText);
            } catch(err) {
                handleError("Error reading PDF!");
            }
        };
        fileReader.readAsArrayBuffer(file);
    } 
    // CONDITION 2: IMAGE FILE (OCR)
    else if (file.type.startsWith("image/")) {
        if(statusMsg) statusMsg.innerText = "🖼️ Scanning Image content (OCR)... This might take 5-10 seconds.";
        
        Tesseract.recognize(file, 'eng')
        .then(({ data: { text } }) => {
            extractedText = text;
            saveClassToBackend(subject, students, days, extractedText);
        }).catch(err => {
            handleError("Error scanning Image!");
        });
    } 
    else {
        handleError("Unsupported file format! Please upload PDF or Image.");
    }
});

// Final step: Text backend mein bhejna
async function saveClassToBackend(subject, students, days, text) {
    const res = await api.post("/classes", { 
        subject: subject, 
        num_students: parseInt(students), 
        num_days: parseInt(days), 
        syllabus_text: text 
    });

    if (res.success) {
        document.getElementById('newClassForm').reset();
        document.getElementById('addClassSection').classList.remove('show'); // NAYA: Form save hone ke baad hide ho jayega
        loadClasses();
    } else {
        alert("Error saving class: " + res.message);
    }
    resetUI();
}

function handleError(msg) {
    alert(msg);
    resetUI();
}

function resetUI() {
    const statusMsg = document.getElementById('uploadStatus');
    if(statusMsg) statusMsg.style.display = 'none';
    document.getElementById('saveBtn').disabled = false;
}

// Page start hote hi classes load karna
loadClasses();