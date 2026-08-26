import React from "react";
import { Link } from "react-router";

const CourseListPage: React.FC = () => {
  const user = { role: "admin" };
  const courses = [
    { id: 1,
      name: "Курс 1",
      description: "Опис курсу",
      preview: { url: "https://example.com/preview1.jpg" },
    },
  ];
  return (
    <div>
      <section className="course-list-container">
        <h2 className="section-title">Список курсів</h2>
        {user.role == "teacher" || user.role == "admin" ? (
          <div className="actions-bar">
            <a href="{% url 'course_create' %}" className="btn-card">
              ➕ Додати новий курс
            </a>
          </div>
        ) : (
          ""
        )}

        <div className="course-grid">
          {courses ? (
            <>
              {courses.map((course) => (
                <Link
                  to={`/courses/${course.id}`}
                  className="course-card" >
                  {course.preview ? 
                    <img
                      src={course.preview.url}
                      alt={course.name}
                      className="course-preview"
                    />
                   : 
                    <div className="course-icon">📘</div>
                  }
                  <div className="course-content">
                    <h4>{course.name}</h4>
                    <p>{course.description}</p>
                  </div>
                </Link>
              ))}
            </>
          ) : (
            <p>Немає доступних курсів.</p>
          )}
        </div>

        {/* {% if is_paginated %}
  <nav className="pagination-container">
    <ul className="pagination">
      {% if page_obj.has_previous %}
        <li className="page-item">
          <a href="?page={{ page_obj.previous_page_number }}" className="page-link">⬅ Попередня</a>
        </li>
      {% endif %}

      {% for num in page_obj.paginator.page_range %}
        {% if page_obj.number == num %}
          <li className="page-item active">
            <span className="page-link">{{ num }}</span>
          </li>
        {% else %}
          <li className="page-item">
            <a href="?page={{ num }}" className="page-link">{{ num }}</a>
          </li>
        {% endif %}
      {% endfor %}

      {% if page_obj.has_next %}
        <li className="page-item">
          <a href="?page={{ page_obj.next_page_number }}" className="page-link">Наступна ➡</a>
        </li>
      {% endif %}
    </ul>
  </nav> */}
      </section>
    </div>
  );
};

export default CourseListPage;
