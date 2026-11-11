import React from "react";
import styles from "../styles/Calendar.module.css";

const DOOR_ANIMATION_MS = 700;

export const CalendarItem = ({
  day,
  index,
  unlocked,
  today,
  opened,
  onOpen,
}: {
  day: number;
  index: number;
  unlocked: boolean;
  today: boolean;
  opened: boolean;
  onOpen: (day: number) => void;
}) => {
  const [shaking, setShaking] = React.useState(false);
  const [opening, setOpening] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();

  React.useEffect(() => () => clearTimeout(timeout.current), []);

  const onPress = () => {
    if (!unlocked) {
      setShaking(true);
      return;
    }
    if (opened) {
      onOpen(day);
      return;
    }
    // Erst Tür aufklappen lassen, dann Inhalt zeigen
    setOpening(true);
    timeout.current = setTimeout(() => {
      setOpening(false);
      onOpen(day);
    }, DOOR_ANIMATION_MS);
  };

  const classNames = [
    styles.door,
    unlocked ? styles.unlocked : styles.locked,
    today && styles.today,
    (opened || opening) && styles.open,
    shaking && styles.shake,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classNames}
      style={{ "--i": index } as React.CSSProperties}
      onClick={onPress}
      onAnimationEnd={(e) => {
        if (e.animationName.includes("shake")) setShaking(false);
      }}
      aria-label={
        unlocked
          ? `Türchen ${day} öffnen`
          : `Türchen ${day} ist noch verschlossen`
      }
      aria-disabled={!unlocked}
      data-testid={`door-${day}`}
    >
      <span className={styles.doorInside} aria-hidden>
        <span className={styles.insideIcon}>☕</span>
        <span className={styles.insideNumber}>{day}</span>
      </span>
      <span className={styles.doorFront} aria-hidden>
        <span className={styles.doorNumber}>{day}</span>
        {!unlocked && <span className={styles.lockIcon}>🔒</span>}
        <span className={styles.doorKnob} />
      </span>
    </button>
  );
};
