"use client";
import styles from "../index.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyModal, setHistoryModal] = useState<{user: any, history: any[]} | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [router]);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/admin/users", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res => {
        if (res.status === 403) {
          router.replace("/cabinet");
          return;
        }
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Ошибка сервера");
        }
        return res.json();
      })
      .then(data => data && setUsers(data.users))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const openHistory = (user: any) => {
    setModalLoading(true);
    setModalError("");
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/user/${user.id}/history`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Ошибка сервера");
        }
        return res.json();
      })
      .then(data => setHistoryModal({ user, history: data.history }))
      .catch(e => setModalError(e.message))
      .finally(() => setModalLoading(false));
  };

  const deleteUser = (user: any) => {
    if (!window.confirm(`Удалить пользователя ${user.email}?`)) return;
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/user/${user.id}/delete`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Ошибка сервера");
        }
        fetchUsers();
        if (historyModal && historyModal.user.id === user.id) setHistoryModal(null);
      })
      .catch(e => alert(e.message));
  };

  const deleteComplex = (complexId: number) => {
    if (!window.confirm("Удалить этот комплекс?")) return;
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/complex/${complexId}/delete`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Ошибка сервера");
        }
        if (historyModal) {
          setHistoryModal({
            ...historyModal,
            history: historyModal.history.filter(h => h.id !== complexId)
          });
        }
      })
      .catch(e => alert(e.message));
  };

  return (
    <main className={styles.main} style={{justifyContent: "center", minHeight: "80vh"}}>
      <div style={{background: "#fff0f0", borderRadius: 32, boxShadow: "0 4px 32px rgba(211,47,47,0.10)", padding: 36, maxWidth: 900, width: "100%", margin: "32px auto"}}>
        <h1 style={{textAlign: "center", color: "#d32f2f", fontWeight: 900, fontSize: "2.1rem", marginBottom: 24}}>Админ-панель</h1>
        <h2 style={{textAlign: "center", color: "#b71c1c", fontWeight: 700, fontSize: "1.2rem", marginBottom: 24}}>Пользователи</h2>
        {loading && <div style={{textAlign: "center", color: "#b71c1c"}}>Загрузка...</div>}
        {error && <div style={{color: "#d32f2f", fontWeight: 600, fontSize: "1rem", textAlign: "center"}}>{error}</div>}
        {!loading && !error && users.length === 0 && (
          <div style={{color: "#bdbdbd", textAlign: "center"}}>Нет пользователей</div>
        )}
        <table style={{width: "100%", borderCollapse: "collapse", marginTop: 18, background: "#fff", borderRadius: 12, overflow: "hidden"}}>
          <thead>
            <tr style={{background: "#ffd6d6", color: "#d32f2f", fontWeight: 700}}>
              <th style={{padding: 10}}>ID</th>
              <th style={{padding: 10}}>Email</th>
              <th style={{padding: 10}}>Имя</th>
              <th style={{padding: 10}}>Админ</th>
              <th style={{padding: 10}}>Дата регистрации</th>
              <th style={{padding: 10}}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{borderBottom: "1px solid #ffd6d6"}}>
                <td style={{padding: 10, textAlign: "center"}}>{user.id}</td>
                <td style={{padding: 10}}>{user.email}</td>
                <td style={{padding: 10}}>{user.name || <span style={{color: "#bdbdbd"}}>—</span>}</td>
                <td style={{padding: 10, textAlign: "center"}}>{user.is_admin ? "✔️" : ""}</td>
                <td style={{padding: 10}}>{new Date(user.created_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}</td>
                <td style={{padding: 10, textAlign: "center", display: "flex", gap: 8, flexWrap: "wrap"}}>
                  <button onClick={() => openHistory(user)} style={{background: "#fff0f0", color: "#d32f2f", border: "1.5px solid #d32f2f", borderRadius: 8, padding: "4px 12px", fontWeight: 600, cursor: "pointer"}}>История</button>
                  <button onClick={() => deleteUser(user)} style={{background: "#d32f2f", color: "#fff", border: "none", borderRadius: 8, padding: "4px 12px", fontWeight: 600, cursor: "pointer"}}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Модальное окно истории */}
        {historyModal && (
          <div style={{position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.25)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"}} onClick={() => setHistoryModal(null)}>
            <div style={{background: "#fff", borderRadius: 18, boxShadow: "0 4px 32px rgba(211,47,47,0.18)", padding: 32, minWidth: 340, maxWidth: 540, width: "100%", position: "relative"}} onClick={e => e.stopPropagation()}>
              <button onClick={() => setHistoryModal(null)} style={{position: "absolute", right: 18, top: 12, background: "none", border: "none", fontSize: 22, color: "#d32f2f", cursor: "pointer"}}>&times;</button>
              <h3 style={{textAlign: "center", color: "#d32f2f", fontWeight: 800, fontSize: "1.2rem", marginBottom: 12}}>История комплексов пользователя</h3>
              <div style={{color: "#b71c1c", fontWeight: 600, marginBottom: 8}}>{historyModal.user.email}</div>
              {modalLoading && <div style={{color: "#b71c1c"}}>Загрузка...</div>}
              {modalError && <div style={{color: "#d32f2f"}}>{modalError}</div>}
              {!modalLoading && !modalError && historyModal.history.length === 0 && (
                <div style={{color: "#bdbdbd"}}>История пуста</div>
              )}
              <div style={{display: "flex", flexDirection: "column", gap: 12, maxHeight: 350, overflowY: "auto"}}>
                {historyModal.history.map(item => (
                  <div key={item.id} style={{background: "#fff0f0", borderRadius: 10, padding: 10, color: "#222", position: "relative"}}>
                    <div style={{marginBottom: 4, color: "#d32f2f", fontWeight: 700}}>
                      {new Date(item.created_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}
                    </div>
                    <div><b>Вес:</b> {item.weight} кг, <b>Рост:</b> {item.height} см, <b>Возраст:</b> {item.age}, <b>Травмы:</b> {item.injuries || 'нет'}</div>
                    {item.query_text && <div style={{margin: "4px 0 0 0", color: "#b71c1c"}}><b>Вопрос:</b> {item.query_text}</div>}
                    <div style={{marginTop: 6, background: "#fff", borderRadius: 8, padding: 8, color: "#222"}}><b>AI:</b> {item.ai_response}</div>
                    <button onClick={() => deleteComplex(item.id)} style={{position: "absolute", right: 10, top: 10, background: "#d32f2f", color: "#fff", border: "none", borderRadius: 6, padding: "2px 10px", fontWeight: 600, fontSize: "0.95rem", cursor: "pointer"}}>Удалить</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 