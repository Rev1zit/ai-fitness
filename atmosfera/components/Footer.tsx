import styles from "./footer.module.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerCols}>
        {/* Левая колонка: название, соцсети и копирайт одной строкой */}
        <div className={styles.footerColLeft}>
          <div className={styles.logo}>Atmosfera</div>
          <div className={styles.socialsAndCopy}>
            <div className={styles.socials}>
              <a href="https://instagram.com/atmosferachita" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <span className={styles.socialIcon} style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="28" height="28" rx="14" fill="#fff"/>
                    <path d="M14 9.5A4.5 4.5 0 1 0 14 18.5A4.5 4.5 0 1 0 14 9.5Z" stroke="#E1306C" strokeWidth="2"/>
                    <circle cx="21" cy="7" r="1.2" fill="#E1306C"/>
                    <rect x="5" y="5" width="18" height="18" rx="6" stroke="#E1306C" strokeWidth="2"/>
                  </svg>
                </span>
              </a>
              <a href="https://vk.com/atmosfera.chita" target="_blank" rel="noopener noreferrer" aria-label="VK">
                <span className={styles.socialIcon} style={{background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="28" height="28" rx="14" fill="#fff"/>
                    <path d="M7.5 10.5H10.1C10.3 13.1 11.7 14.3 13.1 14.7V10.5H15.1V14.7C16.5 14.3 17.9 13.1 18.1 10.5H20.5C20.3 13.9 17.9 16.5 14 16.5C10.1 16.5 7.7 13.9 7.5 10.5Z" fill="#4C75A3"/>
                  </svg>
                </span>
              </a>
            </div>
            <span className={styles.copyright}>© Atmosfera, 2024</span>
          </div>
        </div>
        {/* Центр: навигация */}
        <div className={styles.footerColMid}>
          <div className={styles.footerTitle}>Навигация</div>
          <Link href="/schedule" className={styles.footerLink}>Расписание</Link>
          <Link href="/trainers" className={styles.footerLink}>Тренеры</Link>
          <Link href="/about" className={styles.footerLink}>О нас</Link>
        </div>
        {/* Правая колонка: контакты */}
        <div className={styles.footerColRight}>
          <div className={styles.footerTitle}>Контакты</div>
          <div className={styles.footerContact}>г. Чита, ул. Красноармейская, 14/1</div>
          <div className={styles.footerContact}>8 914 447-15-74</div>
          <div className={styles.footerContact}>8 914 442-11-33</div>
          <div className={styles.footerContact}>chita-atmosfera@mail.ru</div>
        </div>
      </div>
      {/* Нижний подвал с юридическими ссылками */}
      <div className={styles.footerBottom}>
        <span className={styles.footerLegalLink}>Политика конфиденциальности</span>
        <span className={styles.footerBottomDivider}>|</span>
        <span className={styles.footerLegalLink}>Пользовательское соглашение</span>
      </div>
    </footer>
  );
} 