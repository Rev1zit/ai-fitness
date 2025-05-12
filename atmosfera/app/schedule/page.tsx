"use client";
import styles from "../index.module.css";
import { useState } from "react";

const timeSlots = [
  "9:30 - 10:30",
  "10:30 - 11:30",
  "11:30 - 12:30",
  "13:00 - 14:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00"
];
const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const scheduleData = {
  hall1: [
    { name: "Фитмикс", day: "Понедельник", time: "9:30 - 10:30", type: "fitmix" },
    { name: "Калланетика", day: "Понедельник", time: "10:30 - 11:30", type: "callanetics" },
    { name: "Калланетика", day: "Понедельник", time: "11:30 - 12:30", type: "callanetics" },
    { name: "Пилатес", day: "Понедельник", time: "13:00 - 14:00", type: "pilates" },
    { name: "Экспресс похудение", day: "Понедельник", time: "16:00 - 17:00", type: "express-weight-loss" },
    { name: "Здоровая спина", day: "Понедельник", time: "17:00 - 18:00", type: "healthy-back" },
    { name: "Фитнес актив", day: "Понедельник", time: "18:00 - 19:00", type: "fitness-active" },
    { name: "Стройная фигура", day: "Понедельник", time: "19:00 - 20:00", type: "slim-figure" },
    { name: "Бодибаланс + Стретчинг", day: "Понедельник", time: "20:00 - 21:00", type: "bodybalance-stretching" },
    { name: "Фитнес Утро", day: "Вторник", time: "9:30 - 10:30", type: "fitness-morning" },
    { name: "Здоровая спина", day: "Вторник", time: "10:30 - 11:30", type: "healthy-back" },
    { name: "Фитнес Программа 'Стройность'", day: "Вторник", time: "13:00 - 14:00", type: "fitness-slimness" },
    { name: "Силовая + Пресс", day: "Вторник", time: "16:00 - 17:00", type: "strength-press" },
    { name: "Бодибаланс + Стретчинг", day: "Вторник", time: "17:00 - 18:00", type: "bodybalance-stretching" },
    { name: "Йога", day: "Вторник", time: "18:00 - 19:00", type: "yoga" },
    { name: "Ягодицы 360 + TRX", day: "Вторник", time: "19:00 - 20:00", type: "glutes-360-trx" },
    { name: "Фитмикс", day: "Среда", time: "9:30 - 10:30", type: "fitmix" },
    { name: "Калланетика", day: "Среда", time: "10:30 - 11:30", type: "callanetics" },
    { name: "Калланетика", day: "Среда", time: "11:30 - 12:30", type: "callanetics" },
    { name: "Пилатес", day: "Среда", time: "13:00 - 14:00", type: "pilates" },
    { name: "Экспресс похудение", day: "Среда", time: "16:00 - 17:00", type: "express-weight-loss" },
    { name: "Стретчинг", day: "Среда", time: "17:00 - 18:00", type: "stretching" },
    { name: "Фитнес актив", day: "Среда", time: "18:00 - 19:00", type: "fitness-active" },
    { name: "Стройная фигура", day: "Среда", time: "19:00 - 20:00", type: "slim-figure" },
    { name: "Грация + Сила", day: "Среда", time: "20:00 - 21:00", type: "grace-strength" },
    { name: "Фитнес Утро", day: "Четверг", time: "9:30 - 10:30", type: "fitness-morning" },
    { name: "Здоровая спина", day: "Четверг", time: "10:30 - 11:30", type: "healthy-back" },
    { name: "Фитнес Программа 'Стройность'", day: "Четверг", time: "13:00 - 14:00", type: "fitness-slimness" },
    { name: "Ягодицы + Пресс", day: "Четверг", time: "16:00 - 17:00", type: "glutes-press" },
    { name: "Идеальный Шпагат для Начинающих", day: "Четверг", time: "17:00 - 18:00", type: "perfect-splits" },
    { name: "Барре - Фитнес", day: "Четверг", time: "18:00 - 19:00", type: "barre-fitness" },
    { name: "Здоровая спина", day: "Четверг", time: "19:00 - 20:00", type: "healthy-back" },
    { name: "Бодибаланс + Стретчинг", day: "Пятница", time: "9:30 - 10:30", type: "bodybalance-stretching" },
    { name: "Здоровая спина", day: "Пятница", time: "10:30 - 11:30", type: "healthy-back" },
    { name: "Гибкая спина", day: "Пятница", time: "11:30 - 12:30", type: "flexible-back" },
    { name: "Пилатес", day: "Пятница", time: "13:00 - 14:00", type: "pilates" },
    { name: "BodySculpt", day: "Пятница", time: "17:00 - 18:00", type: "body-sculpt" },
    { name: "Zumba", day: "Пятница", time: "18:00 - 19:00", type: "zumba" },
    { name: "Ягодицы 360 + TRX", day: "Пятница", time: "19:00 - 20:00", type: "glutes-360-trx" },
    { name: "Стретчинг", day: "Пятница", time: "20:00 - 21:00", type: "stretching" },
    { name: "Фитнес Утро", day: "Суббота", time: "9:30 - 10:30", type: "fitness-morning" },
    { name: "Здоровая спина", day: "Суббота", time: "10:30 - 11:30", type: "healthy-back" },
    { name: "Активный Пресс", day: "Суббота", time: "11:30 - 12:30", type: "active-press" },
    { name: "Фитбол", day: "Суббота", time: "13:00 - 14:00", type: "fitball" }
  ],
  hall2: [
    { name: "TBW", day: "Понедельник", time: "18:00 - 19:00", type: "tbw" },
    { name: "Hot Микс", day: "Понедельник", time: "19:00 - 20:00", type: "hot-mix" },
    { name: "HLLT", day: "Вторник", time: "18:00 - 19:00", type: "hllt" },
    { name: "Степ", day: "Вторник", time: "19:00 - 20:00", type: "step" },
    { name: "Спец.программа 'Сбрось лишнее'", day: "Вторник", time: "20:00 - 21:00", type: "drop-excess" },
    { name: "TBW", day: "Среда", time: "18:00 - 19:00", type: "tbw" },
    { name: "Hot Микс", day: "Среда", time: "19:00 - 20:00", type: "hot-mix" },
    { name: "HLLT", day: "Четверг", time: "18:00 - 19:00", type: "hllt" },
    { name: "Степ", day: "Четверг", time: "19:00 - 20:00", type: "step" },
    { name: "TBW", day: "Пятница", time: "18:00 - 19:00", type: "tbw" },
    { name: "Hot Микс", day: "Пятница", time: "19:00 - 20:00", type: "hot-mix" },
    { name: "Пресс + Спина", day: "Пятница", time: "20:00 - 21:00", type: "press-back" },
    { name: "Степ", day: "Суббота", time: "10:30 - 11:30", type: "step" }
  ],
  hall3: [
    { name: "Калланетика", day: "Понедельник", time: "18:00 - 19:00", type: "callanetics" },
    { name: "Пилатес", day: "Понедельник", time: "19:00 - 20:00", type: "pilates" },
    { name: "Здоровая спина", day: "Вторник", time: "18:00 - 19:00", type: "healthy-back" },
    { name: "Йогалатес", day: "Вторник", time: "19:00 - 20:00", type: "yogalates" },
    { name: "Пилатес", day: "Среда", time: "18:00 - 19:00", type: "pilates" },
    { name: "Калланетика", day: "Среда", time: "19:00 - 20:00", type: "callanetics" },
    { name: "Калланетика", day: "Четверг", time: "18:00 - 19:00", type: "callanetics" },
    { name: "Стретчинг", day: "Четверг", time: "19:00 - 20:00", type: "stretching" },
    { name: "Здоровая спина", day: "Пятница", time: "18:00 - 19:00", type: "healthy-back" }
  ]
};

const hallNames = {
  hall1: "Зал 1",
  hall2: "Зал 2",
  hall3: "Зал 3"
};

export default function SchedulePage() {
  const [activeHall, setActiveHall] = useState<keyof typeof scheduleData>("hall1");

  return (
    <main className={styles.main} style={{minHeight: "70vh", justifyContent: "flex-start"}}>
      <section className={styles.sectionBlock}>
        <h1 className={styles.sectionTitlePro}>Расписание занятий</h1>
        <div className={styles.scheduleHallBtns}>
          {Object.entries(hallNames).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setActiveHall(key as keyof typeof scheduleData)}
              className={styles.scheduleHallBtn + (activeHall === key ? ' ' + styles.active : '')}
            >
              {name}
            </button>
          ))}
        </div>
        <div className={styles.scheduleTableWrap}>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th className={styles.scheduleTh}>Время</th>
                {days.map(day => (
                  <th key={day} className={styles.scheduleTh}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className={styles.scheduleTime}>{time}</td>
                  {days.map(day => {
                    const session = scheduleData[activeHall].find((item: { day: string; time: string; name: string; type: string }) => item.day === day && item.time === time);
                    return (
                      <td
                        key={day + time}
                        className={
                          styles.scheduleTd +
                          (session ? ' session-' + (session.type || '').replace(/[^a-zA-Z0-9\-]/g, '').toLowerCase() : ' ' + styles.empty)
                        }
                      >
                        {session ? (
                          <span className={styles.scheduleSession}>{session.name}</span>
                        ) : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
} 