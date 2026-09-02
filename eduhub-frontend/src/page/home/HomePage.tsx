import React from "react";
import styles from './HomePage.module.css'

const HomePage: React.FC = () => {
  return (
    <>
      <div className={styles.homeContainer}>
        {/* <!-- Hero Section --> */}
        <section className={styles.heroSection}>
          <div className={styles.avatarGlow}>
            <div className={styles.educationIcon}>🚀</div>
          </div>
          <div className={styles.heroIntro}>
            <p className={styles.greeting}>Платформа сучасного навчання</p>
            <h2 className={styles.subGreeting}>Прокачай свої скіли разом з</h2>
            <h1 className={styles.mainHeading}>
              EduHub <span className={styles.ovalBadge}>платформа...</span>
            </h1>
            <p className={styles.heroSubtext}>
              Отримуй актуальні знання від практикуючих спеціалістів та будуй
              кар'єру своєї мрії.
            </p>
          </div>
        </section>

        {/* <!-- Bio Section --> */}
        <section className={styles.bioSection}>
          <h2 className={styles.typingTitle}>
            Твій старт в IT та інженерії<span className={styles.cursor}>|</span>
          </h2>
          <p className={styles.currentJob}>
            Доступно <span className={styles.highlightBlue}>20+ напрямків</span> для
            твого розвитку.
          </p>
          <p className={styles.bioDescription}>
            Ми зібрали найкращі практичні курси в одному місці. Ніякої нудної
            теорії — тільки реальні проєкти, написання коду, розробка
            інтерфейсів та підтримка менторів на кожному етапі навчання.
          </p>
        </section>

        {/* <!-- Секція з картками курсів --> */}
        <section className={styles.experienceSection}>
          <h3 className={styles.sectionTitle}>Популярні напрямки навчання</h3>

          <div className={styles.experienceGrid}>
            {/* <!-- Картка 1 --> */}
            <div className={styles.expCard}>
              <div className={styles.cardIcon}>🐍</div>
              <div className={styles.cardContent}>
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
            <div className={styles.expCard}>
              <div className={styles.cardIcon}>💻</div>
              <div className={styles.cardContent}>
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
            <div className={styles.expCard}>
              <div className={styles.cardIcon}>🎨</div>
              <div className={styles.cardContent}>
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
            <div className={styles.expCard}>
              <div className={styles.cardIcon}>👁️</div>
              <div className={styles.cardContent}>
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
      <div id="courseModal" className={styles.modalOverlay}>
        <div className={styles.modalBox}>
          <button className={styles.modalCloseBtn} id="closeModalBtn">
            &times;
          </button>

          <div className={styles.modalHeader}>
            <span id="modalIcon" className={styles.modalIconBadge}>
              🎓
            </span>
            <h3 id="modalTitle" className={styles.modalTitle}>
              Назва курсу
            </h3>
          </div>

          <div className={styles.modalBody}>
            <p id="modalDescription" className={styles.modalDesc}></p>

            <div className={styles.modalProgram}>
              <h4>Програма навчання включає:</h4>
              <ul id="modalFeaturesList">
                {/* <!-- Заповнюється через JS --> */}
              </ul>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              id="enrollBtn"
              className={styles.btnRegister}
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
