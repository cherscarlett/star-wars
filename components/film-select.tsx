import styles from '../styles/FilmSelect.module.css'
import { Header, List, Divider, Button } from 'semantic-ui-react'
import { useQuery } from 'react-query'
import axios from 'axios'
import { useEffect, useState, FC } from 'react'
import FilmImage from './film-image'
import TextCrawl from './text-crawl'
import CastList from './cast-list'

interface Film {
  episode_id: number,
  title: string,
  producer: string,
  release_date: string,
  director: string,
  opening_crawl: string,
  characters: [],
}

interface Props  {
  properties: Film
}

const ROMAN_NUMERALS_MAP = ["I", "II", "III", "IV", "V", "VI"]

const FilmSelect: FC = () => {
  const {isLoading, error, data} = useQuery('films', async () => await axios('https://www.swapi.tech/api/films/'))
  const [films, setFilms] = useState([])
  const [textCrawl, setTextCrawl] = useState('')
  const [textIsCrawling, setTextIsCrawling] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [castEndpoints, setCastEndpoints] = useState([])
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null)

  useEffect(() => {
    if (!isLoading && !error) {
      setFilms(data?.data?.result)
    }
  }, [isLoading, data, error, setFilms])

  useEffect(() => {
    if (textCrawl.length) {
      setTextIsCrawling(true)
    }
  }, [textCrawl, setTextIsCrawling])

  useEffect(() => {
    let interval: any = null

    if (textIsCrawling) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1)
      }, 1000)
    } else if (!textIsCrawling && seconds !== 0) {
      clearInterval(interval)
    }
    if (seconds > 60) {
      handleClose()
    }
    return () => clearInterval(interval);
  }, [textIsCrawling, seconds, setSeconds, setTextIsCrawling, setTextCrawl])

  function handleClose() {
    setTextCrawl('')
    setSeconds(0)
    setTextIsCrawling(false)
  }

  function handleCastClick(film: Film) {
    setCurrentFilm(film)
    setCastEndpoints(film.characters)
  }

  return (
    <main className={styles.main}>
      <Header size="huge" inverted color="yellow">
        Star Wars Film Explorer
      </Header>
      {films.length ?  
        <List>
          {films.map(({properties: film}: Props) => {
            const episode = ROMAN_NUMERALS_MAP[film.episode_id - 1]
            const title = `Star Wars: Episode ${episode} - ${film.title}`

            return (
              <List.Item key={film.episode_id}>
                <FilmImage query={title} id={film.episode_id} />
                <Header as="h2" color="grey" inverted>Episode {episode}: {film.title}</Header>
                <Divider />
                <ul className={styles.meta}>
                  <li>
                    Produced by {film.producer}
                  </li>
                  <li>
                    Released on {new Intl.DateTimeFormat('en-US', {dateStyle: 'full'}).format(new Date(film.release_date))}
                  </li>
                  <li>
                    Directed by {film.director}
                  </li>
                </ul>
                <Button inverted color='yellow' onClick={() => setTextCrawl(film.opening_crawl)}>
                  Crawl Text
                </Button>
                <Button inverted color='yellow' onClick={() => handleCastClick(film)}>
                  Cast
                </Button>
              </List.Item>
            )
          })}
        </List> :
        'Loading ...'
      }
      {textIsCrawling &&
        <aside className={styles.crawl}>
          <button aria-label="Close" className={styles.close} onClick={handleClose}> X </button>
          <TextCrawl text={textCrawl} />
        </aside>
      }
      {currentFilm && castEndpoints.length ?
        <aside className={styles.crawl}>
          <button aria-label="Close" className={styles.close} onClick={() => setCastEndpoints([])}> X </button>
          {currentFilm && <CastList id={currentFilm.episode_id} query={`Star Wars: Episode ${ROMAN_NUMERALS_MAP[currentFilm.episode_id - 1]} - ${currentFilm.title}`} endpoints={castEndpoints} />}
        </aside> :
        null
      }
    </main>
  )
}

export default FilmSelect
