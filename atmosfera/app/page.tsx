"use client";
import Image from "next/image";
import styles from "./index.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";

const bannerImages = [
  "/images/banner1.jpg",
  "/images/banner2.jpg",
  "/images/banner3.jpg"
];

const directions = [
  { name: "FitMix", desc: "Смешанные фитнес-программы для всех уровней" },
  { name: "Пилатес", desc: "Гибкость, сила и осанка" },
  { name: "Калланетика", desc: "Глубокие мышцы и женское здоровье" },
  { name: "Здоровая спина", desc: "Профилактика и укрепление спины" },
  { name: "Экспресс похудение", desc: "Интенсивные тренировки для снижения веса" },
  { name: "Йога", desc: "Гармония тела и разума" },
  { name: "TRX", desc: "Функциональный тренинг с петлями" },
  { name: "BodySculpt", desc: "Силовые тренировки для рельефа" },
  { name: "Zumba", desc: "Танцевальный фитнес" },
];

const reviews = [
  { text: "Очень уютный зал, тренеры всегда поддержат!", author: "Мария, 28 лет" },
  { text: "AI-подбор помог мне найти идеальные тренировки!", author: "Екатерина, 34 года" },
  { text: "Занятия только для девушек — это супер!", author: "Ольга, 22 года" },
  { text: "Понравилась атмосфера и разнообразие программ.", author: "Светлана, 31 год" },
];

const faq = [
  { q: "Можно ли прийти без опыта?", a: "Конечно! У нас есть программы для любого уровня подготовки." },
  { q: "Как работает AI-подбор?", a: "Вы заполняете анкету, и система рекомендует оптимальные тренировки по вашим целям." },
  { q: "Есть ли пробное занятие?", a: "Да, первое занятие бесплатно!" },
  { q: "Какие абонементы доступны?", a: "Есть разовые, месячные и годовые абонементы." },
];

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [showScroll, setShowScroll] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [bannerFade, setBannerFade] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.onscroll = () => {
        setShowScroll(window.scrollY > 400);
      };
    }
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerIdx]);

  function handlePrev() {
    setBannerFade(false);
    setTimeout(() => {
      setBannerIdx((idx) => (idx - 1 + bannerImages.length) % bannerImages.length);
      setBannerFade(true);
    }, 180);
  }
  function handleNext() {
    setBannerFade(false);
    setTimeout(() => {
      setBannerIdx((idx) => (idx + 1) % bannerImages.length);
      setBannerFade(true);
    }, 180);
  }

  return (
    <main className={styles.main}>
      {/* Banner Slider */}
      <section className={styles.bannerSlider} style={{marginTop: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
        <button
          onClick={handlePrev}
          className={styles.bannerArrow}
          aria-label="Предыдущий баннер"
          style={{marginRight: 24, position: 'static'}}
        >&#8592;</button>
        <div className={styles.bannerSlides} style={{position:'relative', width:'100%', maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'center', alignItems:'center'}}>
          <img
            src={bannerImages[bannerIdx]}
            alt="Баннер"
            className={styles.bannerImage + (bannerFade ? ' ' + styles.bannerFadeIn : '')}
            style={{transition:'opacity 0.4s', opacity: bannerFade ? 1 : 0, width:'100%', maxWidth:1100, borderRadius:24}}
          />
        </div>
        <button
          onClick={handleNext}
          className={styles.bannerArrow}
          aria-label="Следующий баннер"
          style={{marginLeft: 24, position: 'static'}}
        >&#8594;</button>
        <div className={styles.bannerDots}>
          {bannerImages.map((_, i) => (
            <div
              key={i}
              className={styles.bannerDot + (i === bannerIdx ? ' ' + styles.active : '')}
              onClick={() => { setBannerFade(false); setTimeout(()=>{ setBannerIdx(i); setBannerFade(true); }, 180); }}
            />
          ))}
        </div>
      </section>

      {/* Наши направления */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitlePro}>Наши направления</h2>
        <div className={styles.directionsGrid}>
          {directions.map((d) => (
            <div className={styles.directionCard} key={d.name}>
              <div className={styles.directionTitle}>{d.name}</div>
              <div className={styles.directionDesc}>{d.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Почему выбирают нас */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitlePro}>Почему выбирают нас?</h2>
        <div className={styles.cardGrid}>
          <div className={styles.cardPro}><div className={styles.cardIcon}>👩‍🎤</div>Только для девушек — уют и поддержка</div>
          <div className={styles.cardPro}><div className={styles.cardIcon}>🤖</div>AI-подбор программ под ваши цели</div>
          <div className={styles.cardPro}><div className={styles.cardIcon}>💪</div>Профессиональные тренеры</div>
          <div className={styles.cardPro}><div className={styles.cardIcon}>🕒</div>Удобное расписание и гибкие абонементы</div>
        </div>
      </section>

      {/* Как это работает */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitlePro}>Как это работает?</h2>
        <div className={styles.cardGrid}>
          <div className={styles.cardPro}><div className={styles.cardIcon}>📝</div>1. Зарегистрируйтесь на сайте</div>
          <div className={styles.cardPro}><div className={styles.cardIcon}>🤖</div>2. Пройдите AI-анкету</div>
          <div className={styles.cardPro}><div className={styles.cardIcon}>💃</div>3. Получите персональный план и занимайтесь с удовольствием!</div>
        </div>
      </section>

      {/* Частые вопросы */}
      <section className={styles.sectionBlock}>
        <h2 className={styles.sectionTitlePro}>Частые вопросы</h2>
        <div className={styles.faqList}>
          {faq.map((item, i) => (
            <div
              className={styles.faqItem + (faqOpen === i ? " " + styles.open : "")}
              key={i}
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
            >
              <div className={styles.faqQuestion}>{item.q}</div>
              {faqOpen === i && <div className={styles.faqAnswer}>{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Контакты */}
      <section className={styles.contacts}>
        <div className={styles.contactsLeft}>
          <div className={styles.contactsMap}>
            <iframe id="map_621342482" frameBorder="0" width="100%" height="320px" src="https://makemap.2gis.ru/widget?data=eJw1j0FuwyAQRe8y3VoR2ICxD5Cqu-witcrCCtMWCXsQJlJSy3fvBNpZjf5Dbz4bUHKY0L0izZiTxxXGjw3yIyKMcMQp3xJCAzFRxJQLZ-xzeHIGDtdr8jF7WmpwpUCJ1xfRWvnZcvLztji8wyjF_-wNfNWDj6Kr107kl1wMXMovUy5lpOwOalBiMI1uD0JJo7sLC7xjo5b9fmlgnuKJVl9LbBCmDGN9rLUZVGd6q2wD4Yn_fK3ojDW9VHLghkQzE8ta_g2FcP5GDO8lzemG-y_LOlmq" sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"></iframe>
          </div>
        </div>
        <div className={styles.contactsRight}>
          <div className={styles.contactsTitle}><span role="img" aria-label="contacts">📞</span> Контакты</div>
          <div className={styles.contactsInfo} style={{alignItems: 'flex-start'}}>
            <div className={styles.contactsRow}><span role="img" aria-label="map">📍</span><span className={styles.contactsText}>г. Чита, ул. Красноармейская, 14/1</span></div>
            <div className={styles.contactsRow}><span role="img" aria-label="phone">📞</span><span className={styles.contactsText}>8 914 447-15-74</span></div>
            <div className={styles.contactsRow}><span role="img" aria-label="phone">📞</span><span className={styles.contactsText}>8 914 442-11-33</span></div>
            <div className={styles.contactsRow}><span role="img" aria-label="mail">✉️</span><span className={styles.contactsText}>chita-atmosfera@mail.ru</span></div>
          </div>
          <div className={styles.contactsSignature}>Будем рады видеть вас!</div>
        </div>
      </section>

      {/* Scroll to top button */}
      {showScroll && (
        <button className={styles.scrollTopBtn} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>
          ↑
        </button>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>&times;</button>
            <div className={styles.modalTitle}>Записаться на тренировку</div>
            <form className={styles.modalForm} onSubmit={e => {e.preventDefault(); setShowModal(false); alert('Спасибо за заявку! Мы свяжемся с вами.')}}>
              <input className={styles.modalInput} type="text" placeholder="Ваше имя" required />
              <input className={styles.modalInput} type="tel" placeholder="Телефон" required />
              <textarea className={styles.modalTextarea} placeholder="Комментарий (необязательно)" rows={3} />
              <button className={styles.modalButton} type="submit">Отправить</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
