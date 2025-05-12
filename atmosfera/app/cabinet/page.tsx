"use client";
import styles from "../index.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CabinetPage() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetch("http://localhost:3001/api/ai/history", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Ошибка сервера");
        }
        return res.json();
      })
      .then(data => setHistory(data.history))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className={styles.main} style={{justifyContent: "center", minHeight: "80vh"}}>
      <section className={styles.sectionBlock + ' ' + styles.fadeIn + ' ' + styles.cabinetHistory}>
        <h1 className={styles.sectionTitlePro}>Личный кабинет</h1>
        <div className={styles.aboutDesc + ' ' + styles.cabinetDesc}>Здесь вы можете посмотреть историю ваших AI-комплексов и рекомендаций.</div>
        <h2 className={styles.sectionTitlePro + ' ' + styles.cabinetSubTitle}>История AI-комплексов</h2>
        {loading && <div className={styles.aboutDesc + ' ' + styles.cabinetLoading}>Загрузка...</div>}
        {error && <div className={styles.aboutDesc + ' ' + styles.cabinetError}>{error}</div>}
        {!loading && !error && history.length === 0 && (
          <div className={styles.aboutDesc + ' ' + styles.cabinetEmpty}>История пуста</div>
        )}
        <ul className={styles.aboutList + ' ' + styles.cabinetList}>
          {history.map(item => (
            <li key={item.id} className={styles.aboutCard + ' ' + styles.cabinetCard}>
              <div className={styles.cabinetDate}>
                {new Date(item.created_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}
              </div>
              <div className={styles.cabinetParams}><b>Вес:</b> {item.weight} кг, <b>Рост:</b> {item.height} см, <b>Возраст:</b> {item.age}, <b>Травмы:</b> {item.injuries || 'нет'}</div>
              {item.query_text && <div className={styles.cabinetQuestion}><b>Вопрос:</b> {item.query_text}</div>}
              <div className={styles.cabinetAI}><b>AI:</b> {item.ai_response}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
} 