document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('courseModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalIcon = document.getElementById('modalIcon');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeaturesList = document.getElementById('modalFeaturesList');

    // Деталізація програм курсів
    const courseDetails = {
        'Python Backend': [
            'Основи Python 3 та ООП',
            'Розробка REST API на Django та FastAPI',
            'Бази даних: PostgreSQL, SQLAlchemy, ORM',
            'Асинхронний Python та веб-сокети'
        ],
        'Frontend Development': [
            'Сучасний семантичний HTML5 & CSS3',
            'JavaScript (ES6+) та асинхронні запити',
            'Розробка на React.js (Hooks, State Management)',
            'Робота з Figma-макетами та REST API'
        ],
        'UI/UX Design': [
            'Дослідження користувачів та макетування',
            'Створення дизайн-систем у Figma',
            'Інтерактивне прототипування',
            'Підготовка макетів до верстки'
        ],
        'Computer Vision & ML': [
            'Машинне навчання та обробка даних',
            'Робота з бібліотекою OpenCV',
            'Навчання нейромереж YOLO для виявлення об\'єктів',
            'Аннотація даних та робота з комп\'ютерним зором'
        ]
    };

    // Відкриття модального вікна
    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.exp-card');
            const title = card.querySelector('h4').textContent.trim();
            const desc = card.querySelector('p').textContent.trim();
            const icon = card.querySelector('.card-icon').textContent.trim();

            modalTitle.textContent = title;
            modalDescription.textContent = desc;
            modalIcon.textContent = icon;

            // Динамічне заповнення списку
            modalFeaturesList.innerHTML = '';
            const features = courseDetails[title] || ['Практичні модулі', 'Підтримка ментора', 'Сертифікат'];
            features.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                modalFeaturesList.appendChild(li);
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Функція закриття
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Закриття по кліку за межами вікна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Закриття по клавіші Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Знаходимо кнопку запису
    const enrollBtn = document.getElementById('enrollBtn');

    if (enrollBtn) {
        enrollBtn.addEventListener('click', () => {
            const isAuthenticated = enrollBtn.dataset.auth === 'true';
            const role = enrollBtn.dataset.role;
            const courseTitle = modalTitle ? modalTitle.textContent : 'курс';

            if (!isAuthenticated) {
                // 1. Якщо користувач НЕ авторизований
                alert('⚠️ Будь ласка, увійдіть або зареєструйтесь, щоб записатися на курс!');
                // Можна за бажанням перенаправити на сторінку логіну:
                // window.location.href = '/login/';
            } else if (role === 'teacher') {
                // 2. Якщо увійшов викладач
                alert('ℹ️ Ви увійшли як викладач. Запис на курси доступний лише для студентів.');
            } else {
                // 3. Якщо це зареєстрований студент
                alert(`🎉 Вітаємо! Ви успішно записалися на курс "${courseTitle}"!`);
                closeModal(); // Автоматично закриваємо модалку після успішного запису
            }
        });
    }

});