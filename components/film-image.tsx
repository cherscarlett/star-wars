import styles from '../styles/FilmImage.module.css'
import { useQuery } from 'react-query'
import axios from "axios"
import { useEffect, useState, FC } from 'react'

interface Props {
    query: string,
    id: number,
}


const FilmImage: FC<Props> = ({query, id}) => {
  const {isLoading, error, data} = useQuery(`film-imdb-${id}`, async () => await axios(`https://imdb-api.com/en/API/SearchMovie/k_aldqld2m/${query}`))
  const [image, setImage] = useState()

  useEffect(() => {
    if (!isLoading && !error && data?.data?.results) {
        setImage(data?.data?.results[0]?.image)
    }
  }, [isLoading, data, error, setImage])

    return (
        <div className={styles.imageContainer}>  
            {image &&
                <img className={styles.image} src={image} alt="Movie poster" />
            }
        </div>
    )
}

export default FilmImage
