
const questions = [
    { id: 'realName', question: 'اسمك الحقيقي :' },
    { id: 'serverName', question: 'اسمك داخل الخادم :' },
    { id: 'age', question: 'سنك :' },
    { id: 'id', question: 'ايدي :' },
    { id: 'level', question: 'ليفلك :' },
    { id: 'serverHours', question: 'ساعاتك داخل الخادم :' },
    { id: 'gangExperience', question: 'خبراتك في العصابات :' },
    { id: 'contribution', question: 'ماذا سوف تقدم للولكر ؟ :' },
    { id: 'dailyActivity', question: 'ما هو حد تفاعلك داخل الخادم بشكل يومي ؟ :' },
    { id: 'voiceChat', question: 'التواج في الفويس اثناء وجودك باعصابه شئ مهم جدا ... هل عندك استعداد ؟ :' },
    { id: 'discordUser', question: 'يوزرك بالديسكورد :' }
];

const roleplayQuestions = [
    { id: 'pg', question: 'PG :' },
    { id: 'pk', question: 'PK :' },
    { id: 'lta', question: 'LTA :' },
    { id: 'pd', question: 'PD :' },
    { id: 'mg', question: 'MG :' }
];

let currentQuestionIndex = 0;
let formAnswers = {};
let roleplayAnswers = {};
let startTime = null;
let timerInterval = null;
let isSubmitting = false;

// Discord Webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1473707241751183535/M0UrQghiI53kuV08Npj1ZINIrLol86zmQCCXODGpUEpDIQuZTI4Ovv3nNCjxtd00bctG';

// ============================================
// DOM ELEMENTS
// ============================================

const agreementBox = document.getElementById('agreementBox');
const agreeBtn = document.getElementById('agreeBtn');
const questionContainer = document.querySelector('.question-container');
const questionTitle = document.getElementById('questionTitle');
const answerInput = document.getElementById('answerInput');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressFill = document.getElementById('progressFill');
const currentQuestionSpan = document.getElementById('currentQuestion');
const totalQuestionsSpan = document.getElementById('totalQuestions');
const timerValue = document.getElementById('timerValue');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const notificationIcon = document.getElementById('notificationIcon');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    totalQuestionsSpan.textContent = questions.length;
    setupEventListeners();
    initParticles();
    revealElements();
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    agreeBtn.addEventListener('click', startApplication);
    nextBtn.addEventListener('click', nextQuestion);
    prevBtn.addEventListener('click', previousQuestion);
    
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') nextQuestion();
    });
}

function startApplication() {
    agreementBox.style.display = 'none';
    questionContainer.style.display = 'block';
    startTime = Date.now();
    displayQuestion(0);
    startTimer();
}

// ============================================
// PARTICLES.JS INITIALIZATION
// ============================================

function initParticles() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "repulse": { "distance": 100, "duration": 0.4 }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }
}

// ============================================
// REVEAL ELEMENTS ON SCROLL
// ============================================

function revealElements() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", revealElements);

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

window.addEventListener("scroll", function() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.style.padding = "10px 0";
        navbar.style.background = "rgba(0, 8, 26, 0.95)";
    } else {
        navbar.style.padding = "20px 0";
        navbar.style.background = "rgba(0, 8, 26, 0.8)";
    }
});

// ============================================
// QUESTION DISPLAY
// ============================================

function displayQuestion(index) {
    if (index < 0 || index >= questions.length) return;

    currentQuestionIndex = index;
    const question = questions[index];

    const questionBox = document.querySelector('.question-box');
    if (questionBox) {
        questionBox.style.animation = 'none';
        void questionBox.offsetWidth;
        questionBox.style.animation = 'fadeIn 0.3s ease-out forwards';
    }

    questionTitle.textContent = question.question;
    answerInput.value = formAnswers[question.id] || '';
    updateProgress();

    prevBtn.style.display = index === 0 ? 'none' : 'flex';
    nextBtn.textContent = index === questions.length - 1 ? 'إنهاء التقديم' : 'التالي';

    answerInput.focus();
    window.scrollTo(0, 0);
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressFill.style.width = progress + '%';
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
}

// ============================================
// TIMER MANAGEMENT
// ============================================

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        timerValue.textContent = 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function getElapsedTime() {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

// ============================================
// FORM HANDLING
// ============================================

function saveCurrentAnswer() {
    const question = questions[currentQuestionIndex];
    formAnswers[question.id] = answerInput.value.trim();
}

function nextQuestion() {
    if (answerInput.value.trim() === "") {
        showNotification("يرجى إدخال إجابة قبل الانتقال للسؤال التالي", "error");
        return;
    }
    
    saveCurrentAnswer();

    if (currentQuestionIndex < questions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
    } else {
        showRoleplayQuestions();
    }
}

function previousQuestion() {
    saveCurrentAnswer();
    if (currentQuestionIndex > 0) {
        displayQuestion(currentQuestionIndex - 1);
    }
}

// ============================================
// ROLEPLAY QUESTIONS
// ============================================

function showRoleplayQuestions() {
    questionContainer.style.display = 'none';
    
    const formContainer = document.querySelector('.form-container');
    const roleplayContainer = document.createElement('div');
    roleplayContainer.className = 'question-container reveal active';
    roleplayContainer.id = 'roleplayContainer';
    roleplayContainer.innerHTML = `
        <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 30px; color: #ffffff; text-align: center; letter-spacing: 2px;">أسئلة الرول بلاي</h2>
        <div id="roleplayQuestionsContainer"></div>
        <div class="button-group" style="margin-top: 30px;">
            <button class="btn btn-outline" id="backToMainBtn">
                <i class="fas fa-arrow-right"></i> العودة
            </button>
            <button class="btn btn-primary" id="submitBtn">
                إرسال التقديم <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;
    
    formContainer.appendChild(roleplayContainer);
    
    const roleplayQuestionsContainer = document.getElementById('roleplayQuestionsContainer');
    roleplayQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.style.marginBottom = '20px';
        questionDiv.innerHTML = `
            <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #ffffff; font-size: 1.1rem;">${q.question}</label>
            <input 
                type="text" 
                class="roleplay-input" 
                data-id="${q.id}" 
                placeholder="أدخل إجابتك هنا..."
                value="${roleplayAnswers[q.id] || ''}"
                style="width: 100%; padding: 15px 20px; border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 10px; font-size: 1rem; color: #ffffff; background: rgba(255, 255, 255, 0.05); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-family: 'Cairo', sans-serif;"
            >
        `;
        roleplayQuestionsContainer.appendChild(questionDiv);
    });

    document.getElementById('backToMainBtn').addEventListener('click', backToMain);
    document.getElementById('submitBtn').addEventListener('click', submitForm);

    document.querySelectorAll('.roleplay-input').forEach(input => {
        input.addEventListener('input', (e) => {
            roleplayAnswers[e.target.dataset.id] = e.target.value.trim();
        });
        input.addEventListener('focus', function() {
            this.style.borderColor = '#00d4ff';
            this.style.background = 'rgba(0, 212, 255, 0.1)';
        });
        input.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            this.style.background = 'rgba(255, 255, 255, 0.05)';
        });
    });
}

function backToMain() {
    const roleplayContainer = document.getElementById('roleplayContainer');
    if (roleplayContainer) roleplayContainer.remove();
    questionContainer.style.display = 'block';
    displayQuestion(questions.length - 1);
}

// ============================================
// SUBMISSION
// ============================================

async function submitForm() {
    if (isSubmitting) return;

    // Validate roleplay questions
    const inputs = document.querySelectorAll('.roleplay-input');
    let allAnswered = true;
    inputs.forEach(input => {
        if (!input.value.trim()) allAnswered = false;
    });

    if (!allAnswered) {
        showNotification("يرجى الإجابة على جميع أسئلة الرول بلاي", "error");
        return;
    }

    isSubmitting = true;
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

    stopTimer();
    const timeTaken = getElapsedTime();

    // Prepare Discord Embeds
    const embeds = [];

    // Main Header Embed
    const headerEmbed = {
        title: '🎯 تقديم جديد - عصابة الولكر',
        description: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        color: 0x5865F2,
        thumbnail: { url: 'https://cdn-icons-png.flaticon.com/512/747/747376.png' },
        timestamp: new Date().toISOString()
    };
    embeds.push(headerEmbed);

    // Personal Information Embed
    const personalEmbed = {
        title: '👤 المعلومات الشخصية',
        color: 0x00d4ff,
        fields: [
            {
                name: '📛 الاسم الحقيقي',
                value: formAnswers['realName'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '🎮 اسم الخادم',
                value: formAnswers['serverName'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '🎂 السن',
                value: formAnswers['age'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '🆔 الايدي',
                value: formAnswers['id'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '📊 المستوى',
                value: formAnswers['level'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '⏰ ساعات الخادم',
                value: formAnswers['serverHours'] || '❌ لم يتم الرد',
                inline: true
            }
        ]
    };
    embeds.push(personalEmbed);

    // Experience Embed
    const experienceEmbed = {
        title: '💼 الخبرة والمهارات',
        color: 0x0b3d91,
        fields: [
            {
                name: '🏆 خبرة العصابات',
                value: formAnswers['gangExperience'] || '❌ لم يتم الرد'
            },
            {
                name: '🎁 ما ستقدمه للعصابة',
                value: formAnswers['contribution'] || '❌ لم يتم الرد'
            },
            {
                name: '📈 مستوى التفاعل اليومي',
                value: formAnswers['dailyActivity'] || '❌ لم يتم الرد'
            },
            {
                name: '🎤 الاستعداد للفويس',
                value: formAnswers['voiceChat'] || '❌ لم يتم الرد'
            },
            {
                name: '💬 ديسكورد',
                value: `\`${formAnswers['discordUser'] || 'لم يتم الرد'}\``
            }
        ]
    };
    embeds.push(experienceEmbed);

    // Roleplay Knowledge Embed
    const roleplayEmbed = {
        title: '🎭 معرفة الرول بلاي',
        color: 0xFF6B6B,
        fields: [
            {
                name: '🔫 PG (Power Gaming)',
                value: roleplayAnswers['pg'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '💀 PK (Player Kill)',
                value: roleplayAnswers['pk'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '⏳ LTA (Long Term Absence)',
                value: roleplayAnswers['lta'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '👮 PD (Police Department)',
                value: roleplayAnswers['pd'] || '❌ لم يتم الرد',
                inline: true
            },
            {
                name: '🏢 MG (Metagaming)',
                value: roleplayAnswers['mg'] || '❌ لم يتم الرد',
                inline: true
            }
        ]
    };
    embeds.push(roleplayEmbed);

    // Summary Embed
    const summaryEmbed = {
        title: '⏱️ ملخص التقديم',
        color: 0x2ECC71,
        fields: [
            {
                name: '⏰ الوقت المستغرق',
                value: `\`${timeTaken}\``,
                inline: true
            },
            {
                name: '📅 التاريخ',
                value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                inline: true
            }
        ],
        footer: {
            text: '✅ تم استقبال التقديم بنجاح - W.Walker Gang System',
            icon_url: 'https://cdn-icons-png.flaticon.com/512/845/845646.png'
        }
    };
    embeds.push(summaryEmbed);

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: embeds })
        });

        if (response.ok) {
            showNotification("تم إرسال تقديمك بنجاح! سيتم مراجعته قريباً.", "success");
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        } else {
            throw new Error('Failed to send');
        }
    } catch (error) {
        showNotification("حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.", "error");
        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'إرسال التقديم <i class="fas fa-arrow-left"></i>';
    }
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(text, type = 'success') {
    notificationText.textContent = text;
    notificationIcon.textContent = type === 'success' ? '✓' : '✕';
    
    if (type === 'error') {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
