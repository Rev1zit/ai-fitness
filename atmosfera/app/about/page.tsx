"use client";
import styles from "../index.module.css";
import { useState } from "react";

const team = [
  { name: "Мария", role: "Основатель, тренер", img: "/images/team1.jpg", bio: "Создатель клуба, сертифицированный тренер с 10+ лет опыта. Специализация: функциональный тренинг, женское здоровье." },
  { name: "Ольга", role: "Тренер по пилатесу", img: "/images/team2.jpg", bio: "Эксперт по пилатесу и реабилитации. Помогает обрести гибкость и уверенность в себе." },
  { name: "Светлана", role: "Тренер по TRX и силовым", img: "/images/team3.jpg", bio: "Силовые, TRX, бодискульпт. Мотивирует и поддерживает на каждом этапе." },
  { name: "Екатерина", role: "Тренер по йоге и калланетике", img: "/images/team4.jpg", bio: "Йога, калланетика, здоровая спина. Индивидуальный подход к каждой участнице." },
];

export default function AboutPage() {
  const [modalTrainer, setModalTrainer] = useState<null | typeof team[0]>(null);

  return (
    <main className={styles.main} style={{minHeight: "70vh", justifyContent: "flex-start"}}>
      <h1 className={styles.aboutTitle}>О нас</h1>
      <section className={styles.sectionBlock + ' ' + styles.fadeIn}>
        <h2 className={styles.sectionTitlePro}>Миссия</h2>
        <p className={styles.aboutDesc}>Создавать атмосферу поддержки, уюта и вдохновения для девушек любого возраста и уровня подготовки. Мы верим, что фитнес — это путь к гармонии, здоровью и уверенности в себе.</p>
        <h2 className={styles.sectionTitlePro}>Наши ценности</h2>
        <ul className={styles.aboutList}>
          <li className={styles.aboutCard}>🤝 Поддержка</li>
          <li className={styles.aboutCard}>🌸 Уют</li>
          <li className={styles.aboutCard}>💪 Развитие</li>
          <li className={styles.aboutCard}>👭 Дружба</li>
          <li className={styles.aboutCard}>✨ Вдохновение</li>
        </ul>
        <h2 className={styles.sectionTitlePro}>Почему выбирают нас?</h2>
        <ul className={styles.aboutList}>
          <li className={styles.aboutCard + ' ' + styles.secondary}>💖 Забота о вашем здоровье и гармонии</li>
          <li className={styles.aboutCard + ' ' + styles.secondary}>🤖 AI-подбор программ под ваши цели</li>
          <li className={styles.aboutCard + ' ' + styles.secondary}>💪 Профессиональные тренеры</li>
          <li className={styles.aboutCard + ' ' + styles.secondary}>🕒 Удобное расписание и гибкие абонементы</li>
        </ul>
      </section>
      <section className={styles.sectionBlock + ' ' + styles.fadeIn} style={{textAlign: "center"}}>
        <h2 className={styles.sectionTitlePro}>Присоединяйтесь!</h2>
        <p className={styles.aboutDesc}>Мы ждём вас в нашем уютном фитнес-пространстве. Атмосфера — это место, где каждая девушка найдёт поддержку, мотивацию и новых подруг!</p>
      </section>
    </main>
  );
} 