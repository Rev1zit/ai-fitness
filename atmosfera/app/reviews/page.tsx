"use client";
import { useEffect, useState } from "react";
import styles from "../index.module.css";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
    fetchReviews();
    document.body.classList.add('reviews-page');
    return () => { document.body.classList.remove('reviews-page'); };
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      setError("Ошибка загрузки отзывов");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");
      setText("");
      fetchReviews();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.main} style={{justifyContent: "center", minHeight: "80vh"}}>
      <section className={styles.sectionBlock + ' ' + styles.fadeIn + ' ' + styles.reviewsBlock}>
        <h1 className={styles.sectionTitlePro}>Отзывы</h1>
        {isAuth ? (
          <form onSubmit={handleSubmit} className={styles.reviewsForm}>
            <textarea
              value={text}
              onChange={e=>setText(e.target.value)}
              placeholder="Ваш отзыв..."
              required
              rows={3}
              className={styles.reviewsTextarea}
            />
            {error && <div className={styles.reviewsError}>{error}</div>}
            <button type="submit" disabled={submitting||!text.trim()} className={styles.reviewsButton}>
              {submitting ? 'Отправка...' : 'Оставить отзыв'}
            </button>
          </form>
        ) : (
          <div className={styles.reviewsNotice}>
            Только для авторизованных пользователей. Пожалуйста, войдите через меню.
          </div>
        )}
        {loading ? (
          <div className={styles.reviewsNotice}>Загрузка...</div>
        ) : error ? (
          <div className={styles.reviewsError}>{error}</div>
        ) : (
          <ul className={styles.aboutList + ' ' + styles.reviewsList}>
            {reviews.length === 0 ? (
              <div className={styles.reviewsNotice}>Пока нет отзывов.</div>
            ) : reviews.map(r => (
              <li key={r.id} className={styles.aboutCard + ' ' + styles.reviewsCard}>
                <div className={styles.reviewsUser}>{r.user_name || 'Пользователь'}</div>
                <div className={styles.reviewsText}>{r.text}</div>
                <div className={styles.reviewsDate}>{new Date(r.created_at).toLocaleString('ru-RU')}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
} 