"use client";
import styles from "../index.module.css";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function AiPodborPage() {
  const router = useRouter();
  // Проверка авторизации (токен)
  if (typeof window !== "undefined" && !localStorage.getItem("token")) {
    router.replace("/login");
    return null;
  }

  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [injuries, setInjuries] = useState("");
  const [age, setAge] = useState(25);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAiResponse(null);
    if (height < 80 || height > 220) {
      setError("Рост должен быть от 80 до 220 см");
      return;
    }
    if (age < 14 || age > 70) {
      setError("Возраст должен быть от 14 до 70 лет");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/api/ai/complex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          weight,
          height,
          injuries,
          age,
          query_text: query,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка сервера");
        setLoading(false);
        return;
      }
      setAiResponse(data.ai_response);
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  // Парсер для AI-ответа
  const parsedAI = useMemo(() => {
    if (!aiResponse) return null;
    // Убираем markdown-символы и ищем блоки по заголовкам
    const clean = aiResponse.replace(/\*\*/g, '');
    const complex = clean.match(/Комплекс[:：]?\s*([\s\S]*?)(?:Нагрузки[:：]|Питание[:：]|$)/i)?.[1]?.trim() || "";
    const loads = clean.match(/Нагрузки[:：]?\s*([\s\S]*?)(?:Питание[:：]|$)/i)?.[1]?.trim() || "";
    const food = clean.match(/Питание[:：]?\s*([\s\S]*)/i)?.[1]?.trim() || "";
    return { complex, loads, food };
  }, [aiResponse]);

  return (
    <main className={styles.main} style={{justifyContent: "center", minHeight: "80vh"}}>
      <section className={styles.sectionBlock + ' ' + styles.fadeIn + ' ' + styles.aiBlock}>
        <h1 className={styles.sectionTitlePro}>AI-подбор</h1>
        <div className={styles.aboutDesc + ' ' + styles.aiDesc}>Заполните параметры и получите персональный комплекс и рекомендации от искусственного интеллекта.</div>
        <form onSubmit={handleSubmit} className={styles.aiForm}>
          <label className={styles.aiLabel}>Вес: <span className={styles.aiLabelValue}>{weight} кг</span></label>
          <input type="range" min={30} max={200} value={weight} onChange={e => setWeight(Number(e.target.value))} className={styles.aiRange} />

          <label className={styles.aiLabel}>Рост (80–220 см):</label>
          <input type="number" min={80} max={220} value={height} onChange={e => setHeight(Number(e.target.value))} className={styles.aiInput} required />

          <label className={styles.aiLabel}>Травмы (если есть):</label>
          <input type="text" value={injuries} onChange={e => setInjuries(e.target.value)} placeholder="Например: травма колена" className={styles.aiInput} />

          <label className={styles.aiLabel}>Возраст: <span className={styles.aiLabelValue}>{age}</span></label>
          <input type="range" min={14} max={70} value={age} onChange={e => setAge(Number(e.target.value))} className={styles.aiRange} />

          <div className={styles.aiQueryRow}>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Ваш вопрос или пожелание..." className={styles.aiInput} />
            <button type="submit" className={styles.aiButton} disabled={loading}>
              {loading ? <span className="loader" style={{width: 22, height: 22, display: "inline-block"}}></span> : "→"}
            </button>
          </div>
          {error && <div className={styles.aiError}>{error}</div>}
        </form>
        <div className={styles.aiResult}>
          {parsedAI ? (
            <div className={styles.aiResultInner}>
              <div className={styles.aiResultBlock + ' ' + styles.aiResultComplex}>
                <div className={styles.aiResultTitle + ' ' + styles.aiResultTitleComplex}>Комплекс</div>
                <div style={{whiteSpace: "pre-line"}}>{parsedAI.complex}</div>
              </div>
              <div className={styles.aiResultBlock + ' ' + styles.aiResultLoads}>
                <div className={styles.aiResultTitle + ' ' + styles.aiResultTitleLoads}>Нагрузки</div>
                <div style={{whiteSpace: "pre-line"}}>{parsedAI.loads}</div>
              </div>
              <div className={styles.aiResultBlock + ' ' + styles.aiResultFood}>
                <div className={styles.aiResultTitle + ' ' + styles.aiResultTitleFood}>Питание</div>
                <div style={{whiteSpace: "pre-line"}}>{parsedAI.food}</div>
              </div>
            </div>
          ) : (
            <span className={styles.aiResultPlaceholder}>Здесь появится ответ искусственного интеллекта</span>
          )}
        </div>
      </section>
    </main>
  );
} 