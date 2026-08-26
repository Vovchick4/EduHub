import React from "react";

const HomePage: React.FC = () => {
  return (
    <>
      <div className="home-container">
        {/* <!-- Hero Section --> */}
        <section className="hero-section">
          <div className="avatar-glow">
            <div className="education-icon">🚀</div>
          </div>
          <div className="hero-intro">
            <p className="greeting">Платформа сучасного навчання</p>
            <h2 className="sub-greeting">Прокачай свої скіли разом з</h2>
            <h1 className="main-heading">
              EduHub <span className="oval-badge">платформа...</span>
            </h1>
            <p className="hero-subtext">
              Отримуй актуальні знання від практикуючих спеціалістів та будуй
              кар'єру своєї мрії.
            </p>
          </div>
        </section>

        {/* <!-- Bio Section --> */}
        <section className="bio-section">
          <h2 className="typing-title">
            Твій старт в IT та інженерії<span className="cursor">|</span>
          </h2>
          <p className="current-job">
            Доступно <span className="highlight-blue">20+ напрямків</span> для
            твого розвитку.
          </p>
          <p className="bio-description">
            Ми зібрали найкращі практичні курси в одному місці. Ніякої нудної
            теорії — тільки реальні проєкти, написання коду, розробка
            інтерфейсів та підтримка менторів на кожному етапі навчання.
          </p>
        </section>

        {/* <!-- Секція з картками курсів --> */}
        <section className="experience-section">
          <h3 className="section-title">Популярні напрямки навчання</h3>

          <div className="experience-grid">
            {/* <!-- Картка 1 --> */}
            <div className="exp-card">
              <div className="card-icon">🐍</div>
              <div className="card-content">
                <h4>Python Backend</h4>
                <p>
                  Вивчи Django, FastAPI, роботу з базами даних SQL та створи
                  свій перший потужний API.
                </p>
                <button className="btn-card open-modal-btn">
                  ДИВИТИСЬ КУРС
                </button>
              </div>
            </div>

            {/* <!-- Картка 2 --> */}
            <div className="exp-card">
              <div className="card-icon">💻</div>
              <div className="card-content">
                <h4>Frontend Development</h4>
                <p>
                  Опануй верстку, сучасний JavaScript та бібліотеку React для
                  створення інтерактивних сайтів.
                </p>
                <button className="btn-card open-modal-btn">
                  ДИВИТИСЬ КУРС
                </button>
              </div>
            </div>

            {/* <!-- Картка 3 --> */}
            <div className="exp-card">
              <div className="card-icon">🎨</div>
              <div className="card-content">
                <h4>UI/UX Design</h4>
                <p>
                  Навчися проектувати зручні інтерфейси у Figma, створювати
                  прототипи та працювати з композицією.
                </p>
                <button className="btn-card open-modal-btn">
                  ДИВИТИСЬ КУРС
                </button>
              </div>
            </div>

            {/* <!-- Картка 4 --> */}
            <div className="exp-card">
              <div className="card-icon">👁️</div>
              <div className="card-content">
                <h4>Computer Vision & ML</h4>
                <p>
                  Поринь у світ штучного інтелекту: від обробки зображень з
                  OpenCV до навчання моделей YOLO.
                </p>
                <button className="btn-card open-modal-btn">
                  ДИВИТИСЬ КУРС
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* <!-- ================= МОДАЛЬНЕ ВІКНО ================= --> */}
      <div id="courseModal" className="modal-overlay">
        <div className="modal-box">
          <button className="modal-close-btn" id="closeModalBtn">
            &times;
          </button>

          <div className="modal-header">
            <span id="modalIcon" className="modal-icon-badge">
              🎓
            </span>
            <h3 id="modalTitle" className="modal-title">
              Назва курсу
            </h3>
          </div>

          <div className="modal-body">
            <p id="modalDescription" className="modal-desc"></p>

            <div className="modal-program">
              <h4>Програма навчання включає:</h4>
              <ul id="modalFeaturesList">
                {/* <!-- Заповнюється через JS --> */}
              </ul>
            </div>
          </div>

          <div className="modal-footer">
            <button
              id="enrollBtn"
              className="btn-register modal-action-btn"
              data-auth="{{ user.is_authenticated|yesno:'true,false' }}"
              data-role="{% if user.is_authenticated %}{% if user.is_staff or user.profile.is_teacher %}teacher{% else %}student{% endif %}{% else %}guest{% endif %}"
            >
              Записатися на курс
            </button>
          </div>
        </div>
      </div>

      {/* <!-- Підключення зовнішнього JS файлу --> */}
      <script src="{% static 'js/main.js' %}"></script>
    </>
  );
};

export default HomePage;
