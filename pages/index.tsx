import Head from "next/head";
import styles from "../styles/Calendar.module.css";
import React from "react";
import { CalendarItem } from "../components/CalendarItem";
import { Overlay } from "../components/Overlay";
import { numbers } from "../components/numbers";
import { useAdventCalendar } from "../hooks/useAdventCalendar";
import {
  isDoorUnlocked,
  isGodMode,
  isToday,
  loadOpenedDoors,
  saveOpenedDoors,
} from "../lib/calendar";
import Snowfall from "react-snowfall";
import Link from "next/link";

export default function Home() {
  const [count, setCount] = React.useState(0);
  // Datum erst im Browser setzen, damit SSR und Client nicht auseinanderlaufen
  const [now, setNow] = React.useState<Date | null>(null);
  const [openedDoors, setOpenedDoors] = React.useState<number[]>([]);
  const [activeDay, setActiveDay] = React.useState<number | null>(null);
  const { getTextByNumber, loading } = useAdventCalendar();

  const godMode = isGodMode(count);

  React.useEffect(() => {
    setNow(new Date());
    setOpenedDoors(loadOpenedDoors(window.localStorage));
  }, []);

  const onOpen = React.useCallback((day: number) => {
    setActiveDay(day);
    setOpenedDoors((prev) => {
      if (prev.includes(day)) return prev;
      const next = [...prev, day];
      saveOpenedDoors(next, window.localStorage);
      return next;
    });
  }, []);

  const onClose = React.useCallback(() => setActiveDay(null), []);

  return (
    <div className={styles.page}>
      <Head>
        <style>
          @import
          url(https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&family=Inter:wght@400;600&display=swap);
        </style>

        <title> Adventskalender Dylan & Harper</title>
      </Head>
      <Snowfall color="rgba(255,255,255,0.7)" snowflakeCount={120} />
      <main className={styles.main}>
        {godMode && <p className={styles.godMode}>god mode activated!</p>}
        <header className={styles.header}>
          <h1 className={styles.brand}>
            <span>Dylan</span>
            <span
              className={styles.ampersand}
              onClick={() => setCount(count + 1)}
            >
              &
            </span>
            <span>Harper</span>
          </h1>
          <p className={styles.subtitle}>Adventskalender 2026</p>
        </header>

        <div className={styles.board}>
          <div className={styles.grid}>
            {numbers.map((item, index) => {
              const day = Number(item.number);
              return (
                <CalendarItem
                  key={item.number}
                  day={day}
                  index={index}
                  unlocked={!!now && isDoorUnlocked(day, now, godMode)}
                  today={!!now && isToday(day, now)}
                  opened={openedDoors.includes(day)}
                  onOpen={onOpen}
                />
              );
            })}
          </div>
        </div>

        <Link className={styles.footerLink} href="imprint">
          Impressum
        </Link>
      </main>
      <Overlay
        day={activeDay}
        text={activeDay !== null ? getTextByNumber(activeDay) : undefined}
        loading={loading}
        onClose={onClose}
      />
    </div>
  );
}
