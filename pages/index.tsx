import type { NextPage } from 'next'
import Head from 'next/head'
import FilmSelect from '../components/film-select'
import styles from '../styles/Home.module.css'
import { Container, Header } from 'semantic-ui-react'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [seconds, setSeconds] = useState(0)
  const [isPlayingSequence, setIsPlayingSequence] = useState(true)

  useEffect(() => {
    let interval: any = null

    if (isPlayingSequence) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1)
      }, 1000)
    } else if (!isPlayingSequence && seconds !== 0) {
      clearInterval(interval)
    }
    if (seconds > 18) {
      setIsPlayingSequence(false)
      setSeconds(0)
    }
    return () => clearInterval(interval)
  }, [isPlayingSequence, seconds, setSeconds, setIsPlayingSequence])

  return (
    <Container text className={styles.container}>
      <Head>
        <title>Star Wars</title>
        <meta name="description" content="A demo app using the star wars api" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {seconds < 6 && isPlayingSequence &&
        <Header as="h2" size="huge" inverted color="blue" className={ seconds < 5 ? `${styles.visible} ${styles.intro}` : `${styles.invisible} ${styles.intro}`}>
          A long time ago in a galaxy far, <br />
          far away....
        </Header>
      }
      { seconds < 18 && isPlayingSequence &&
        <header className={seconds > 6 && seconds < 17 ? `${styles.header} ${styles.visible}` : `${styles.header} ${styles.invisible}`}>
          <h1 className={styles.title}>
            <span>Star</span>
            <span className={styles.titleWars}>wars</span>
          </h1>
        </header>
      }
      {!isPlayingSequence &&
        <FilmSelect />
      }
    </Container>
  )
}

export default Home
