import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { CalendarItem } from '../components/CalendarItem'
import { numbers } from '../components/numbers'
import Snowfall from 'react-snowfall'
import Link from 'next/link'


export default function Home() {

  const [count, setCount] = React.useState(0)

  return (
    <div className={styles.container}>
      <Head>
        <style>
          @import url(https://fonts.googleapis.com/css2?family=Libre+Baskerville&display=swap);
        </style>

        <title> Adventskalender Dylan & Harper</title>
      </Head>
      <main className={styles.main}>
        <Snowfall />
        {count > 9 && <p style={{ position: "absolute", top: 0 }}>god mode activated!</p>}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: 'Libre Baskerville',
          fontSize: "2em",
          marginTop: 24,
          color: "white"
        }}>
          <p >Dylan</p>
          <p onClick={() => setCount(count + 1)} style={{ fontStyle: 'italic' }} >&nbsp;&&nbsp;</p>
          <p >Harper</p>
        </div>
        <p style={{ fontFamily: "Libre Baskerville", fontSize: "1.2em", marginTop: -24, color: "white" }}>Adventskalender 2022</p>
        <div style={{
          backgroundImage: "url(https://image.jimcdn.com/app/cms/image/transf/dimension=1008x10000:format=jpg/path/sfb26f3d4a5091d4b/image/i896d5852974effc1/version/1667127594/kaffee-shop.jpg)",
          backgroundSize: "cover",
          opacity: 0.8,
          borderRadius: 12,
        }}>
          <div style={{ flexDirection: "row", display: "flex", flexWrap: "wrap", justifyContent: "space-between", maxWidth: 450, minWidth: 370 }}>
            {numbers.map((item) => {
              return <CalendarItem key={item.number} item={item} count={count} />
            })}
          </div>
        </div>
        <Link style={{ marginTop: 100, color: "#ffffffbb" }} href="imprint">Impressum
        </Link>
      </main>
    </div>
  )
}
