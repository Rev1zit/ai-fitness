"use client";
import styles from "../index.module.css";
import { useState } from "react";

const trainers = [
  { name: "Любовь", role: "Фитнес-микс, Калланетика, Экспресс похудение", img: "/images/team1.jpg", bio: "Эксперт по фитнес-миксу и калланетике. Поможет достичь стройности и гибкости.", tags: ["Фитмикс", "Калланетика", "Экспресс похудение"] },
  { name: "Дианова Елена", role: "Пилатес, Здоровая спина, Фитбол", img: "/images/team2.jpg", bio: "Сертифицированный тренер по пилатесу и здоровой спине. Индивидуальный подход к каждому.", tags: ["Пилатес", "Здоровая спина", "Фитбол"] },
  { name: "Фёдорова Елена", role: "Стретчинг, Бодибаланс, Гибкая спина", img: "/images/team3.jpg", bio: "Профессионал по стретчингу и бодибалансу. Поможет раскрыть потенциал гибкости.", tags: ["Стретчинг", "Бодибаланс", "Гибкая спина"] },
  { name: "Журавлёва Елена", role: "Йога, Йогалатес, Калланетика", img: "/images/team4.jpg", bio: "Опытный инструктор по йоге и йогалатесу. Гармония тела и разума.", tags: ["Йога", "Йогалатес", "Калланетика"] },
  { name: "Закота Виктория", role: "Zumba, Танцевальные, TBW", img: "/images/team5.jpg", bio: "Зажигательные танцевальные тренировки и Zumba для отличного настроения.", tags: ["Zumba", "Танцы", "TBW"] },
  { name: "Евгения Ш.", role: "Силовая, Пресс, Стройная фигура", img: "/images/team6.jpg", bio: "Мотивирует и поддерживает на каждом этапе. Специализация: силовые тренировки и пресс.", tags: ["Силовая", "Пресс", "Стройная фигура"] },
  { name: "Яскевич Оксана", role: "Барре-фитнес, Грация + Сила, Hot Микс", img: "/images/team7.jpg", bio: "Эксперт по барре-фитнесу и силовым направлениям. Поможет обрести грацию и силу.", tags: ["Барре-фитнес", "Грация + Сила", "Hot Микс"] },
  { name: "Нефедьева Наталья", role: "Фитнес-утро, Активный пресс, Спец.программа 'Сбрось лишнее'", img: "/images/team8.jpg", bio: "Профессионал по утренним и активным тренировкам. Заряд бодрости на весь день.", tags: ["Фитнес Утро", "Активный Пресс", "Сбрось лишнее"] },
  { name: "Трофимова Кристина", role: "Step, HLLT, Пресс + Спина", img: "/images/team9.jpg", bio: "Специалист по степу и функциональным тренировкам. Поможет укрепить спину и пресс.", tags: ["Step", "HLLT", "Пресс + Спина"] },
];

const allTags = Array.from(new Set(trainers.flatMap(t => t.tags)));

export default function TrainersPage() {
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [modal, setModal] = useState<typeof trainers[0] | null>(null);

  const filtered = trainers.filter(t =>
    (!tag || t.tags.includes(tag)) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className={styles.main} style={{minHeight: "70vh", justifyContent: "flex-start"}}>
      <section className={styles.sectionBlock}>
        <h1 className={styles.sectionTitlePro}>Наши тренеры</h1>
        <div className={styles.filterBar}>
          <div className={styles.filterSearchWrap}>
            <input
              type="text"
              placeholder="Поиск по имени или направлению..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.trainersInput}
            />
          </div>
          <div className={styles.filterBtnsWrap}>
            <button
              className={styles.filterBtn + (!tag ? ' ' + styles.active : '')}
              onClick={() => setTag(null)}
            >Все</button>
            {allTags.map(tg => (
              <button
                key={tg}
                className={styles.filterBtn + (tag === tg ? ' ' + styles.active : '')}
                onClick={() => setTag(tg)}
              >{tg}</button>
            ))}
          </div>
        </div>
        <div style={{display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "center", maxWidth: 1100, margin: "0 auto"}}>
          {filtered.length === 0 && <div style={{color: "#b71c1c", fontWeight: 700, fontSize: "1.15rem"}}>Нет тренеров по вашему запросу.</div>}
          {filtered.map(tr => (
            <div
              key={tr.name}
              className={styles.trainerCard}
              onClick={() => setModal(tr)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === "Enter") setModal(tr); }}
            >
              <div className={styles.trainerImgWrap} style={{background: "#FFD600", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <span style={{color: "#111", fontWeight: 900, fontSize: 32}}>{tr.name[0]}</span>
              </div>
              <div className={styles.trainerName}>{tr.name}</div>
              <div className={styles.trainerRole}>{tr.role}</div>
              <div className={styles.trainerTags}>
                {tr.tags.map(tg => (
                  <span key={tg} className={styles.trainerTag}>{tg}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      {modal && (
        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
          <div
            className={styles.modal}
            style={{
              background: '#fff',
              border: '2.5px solid var(--orange)',
              borderRadius: 24,
              maxWidth: 370,
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              padding: '40px 32px 32px 32px',
              position: 'relative',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              style={{
                color: 'var(--orange)',
                background: 'none',
                borderRadius: '50%',
                width: 38,
                height: 38,
                top: 18,
                right: 18,
                fontWeight: 900,
                fontSize: '1.7rem',
                border: 'none',
                boxShadow: 'none',
                position: 'absolute',
                cursor: 'pointer',
              }}
              onClick={() => setModal(null)}
              aria-label="Закрыть"
            >
              &times;
            </button>
            <div
              className={styles.modalTitle}
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#222',
                marginBottom: 18,
                letterSpacing: 1.1,
                marginTop: 8,
              }}
            >
              {modal.name}
            </div>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'var(--orange-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
                boxShadow: '0 2px 8px var(--orange-shadow)',
              }}
            >
              <span style={{ color: 'var(--orange)', fontWeight: 900, fontSize: 38 }}>{modal.name[0]}</span>
            </div>
            <div style={{ fontWeight: 700, color: 'var(--orange)', fontSize: '1.13rem', marginBottom: 14, marginTop: 2 }}>{modal.role}</div>
            <div style={{ color: '#222b', fontSize: '1.05rem', marginBottom: 18, textAlign: 'center', maxWidth: 280, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>{modal.bio}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24, marginTop: 2 }}>
              {modal.tags.map(tg => (
                <span
                  key={tg}
                  style={{
                    background: 'var(--orange)',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '4px 14px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    boxShadow: '0 1px 4px var(--orange-shadow)',
                  }}
                >
                  {tg}
                </span>
              ))}
            </div>
            <button
              className={styles.button}
              style={{
                marginTop: 18,
                fontSize: '1.08rem',
                borderRadius: 12,
                padding: '12px 0',
                width: '100%',
                background: 'var(--orange)',
                color: '#fff',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 1px 6px var(--orange-shadow)',
                maxWidth: 220,
                alignSelf: 'center',
              }}
              onClick={() => setModal(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </main>
  );
} 