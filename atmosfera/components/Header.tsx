"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./header.module.css";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

function Drawer({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  return (
    <div className={styles.drawer + (open ? ' ' + styles.drawerOpen : '')}>
      <button className={styles.drawerClose} onClick={onClose} aria-label="Закрыть меню">×</button>
      {children}
    </div>
  );
}

export default function Header() {
  const [logged, setLogged] = useState<boolean | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login'|'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLogged(!!localStorage.getItem("token"));
      setUserEmail(localStorage.getItem("user_email"));
      const handler = () => {
        setLogged(!!localStorage.getItem("token"));
        setUserEmail(localStorage.getItem("user_email"));
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    setLogged(false);
    setDrawerOpen(false);
    router.push("/");
  };

  // Вход
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка входа');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_email', data.user.email);
      setLogged(true);
      setDrawerOpen(false);
      setError(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  // Регистрация
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
      // После регистрации сразу логиним
      await handleLogin({
        preventDefault: () => {},
        currentTarget: { elements: { namedItem: (n: string) => ({ value: n === 'email' ? email : password }) } }
      } as any);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.logoBlock}>
          <Link href="/">
            <Image
              src="/images/log.jpg"
              alt="Логотип"
              width={54}
              height={54}
              className={styles.logo}
              style={{ width: 54, height: 54, aspectRatio: '1/1', objectFit: 'cover', minWidth: 54, minHeight: 54, maxWidth: 54, maxHeight: 54 }}
            />
          </Link>
          <Link href="/" className={styles.title}>
            Атмосфера
          </Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/schedule">Расписание</Link>
          <Link href="/trainers">Тренеры</Link>
          <Link href="/about">О нас</Link>
        </nav>
        <div className={styles.right}>
          <button onClick={() => setDrawerOpen(true)} style={{background:'none',border:'none',cursor:'pointer',marginLeft:8}} aria-label="Открыть меню">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect y="6" width="32" height="4" rx="2" fill="#FFD600"/><rect y="14" width="32" height="4" rx="2" fill="#FFD600"/><rect y="22" width="32" height="4" rx="2" fill="#FFD600"/></svg>
          </button>
        </div>
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className={styles.drawerTitle}>Меню</div>
        {logged ? (
          <>
            <Link href="/cabinet" className={styles.drawerLink}>Личный кабинет</Link>
            <Link href="/ai" className={styles.drawerLink}>AI-подбор</Link>
            <Link href="/reviews" className={styles.drawerLink}>Отзывы</Link>
            {userEmail === 'hulligan_200519_6657@mail.ru' && (
              <Link href="/admin" className={styles.drawerLink}>Админка</Link>
            )}
            <button onClick={handleLogout} className={styles.drawerButton} style={{marginTop:32}}>Выйти</button>
          </>
        ) : (
          <>
            <div className={styles.drawerTabs}>
              <button onClick={()=>setAuthTab('login')} className={styles.drawerTab + (authTab==='login' ? ' ' + styles.drawerTabActive : '')}>Вход</button>
              <button onClick={()=>setAuthTab('register')} className={styles.drawerTab + (authTab==='register' ? ' ' + styles.drawerTabActive : '')}>Регистрация</button>
            </div>
            {authTab==='login' ? (
              <form onSubmit={handleLogin} className={styles.drawerForm}>
                <input name="email" type="email" placeholder="Email" required className={styles.drawerInput} />
                <input name="password" type="password" placeholder="Пароль" required className={styles.drawerInput} />
                {error && <div className={styles.drawerError}>{error}</div>}
                <button type="submit" disabled={loading} className={styles.drawerButton}>{loading?'Вход...':'Войти'}</button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className={styles.drawerForm}>
                <input name="name" type="text" placeholder="Имя" required className={styles.drawerInput} />
                <input name="email" type="email" placeholder="Email" required className={styles.drawerInput} />
                <input name="password" type="password" placeholder="Пароль" required className={styles.drawerInput} />
                {error && <div className={styles.drawerError}>{error}</div>}
                <button type="submit" disabled={loading} className={styles.drawerButton}>{loading?'Регистрация...':'Зарегистрироваться'}</button>
              </form>
            )}
          </>
        )}
      </Drawer>
    </header>
  );
} 