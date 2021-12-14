import { useQueries, useQuery } from 'react-query'
import axios from 'axios'
import { useEffect, useState, FC } from 'react'
import { Header, Container, List } from 'semantic-ui-react'
import styles from '../styles/CastList.module.css'
import CharacterDetails from './character-details'

interface Props {
    endpoints: string[],
    query: string,
    id: number,
}

interface Character {
    name: string,
    image: string,
    birth_year: string,
    homeworld: string,
}

interface ImdbCharacter {
    asCharacter: string,
    image: string,
    name: string,
}

const CastList: FC<Props> = ({endpoints, query, id}) => {
    const [characters] = useState<Character[]>([])
    const [imdbCharacters] = useState<ImdbCharacter[]>([])
    const [imdbId, setImdbId] = useState<string | null>(null)

    const requests = endpoints.map((endpoint, index) => {
        return { queryKey: ['character', index], queryFn: async () => await axios(endpoint)}
    })
    
    const results = useQueries(requests)

    const {isLoading, error, data} = useQuery(`film-imdb-${id}`, async () => await axios(`https://imdb-api.com/en/API/SearchMovie/k_aldqld2m/${query}`))

    const castResults = useQuery(`cast-imdb-${imdbId}`, async () => await axios(`https://imdb-api.com/en/API/FullCast/k_aldqld2m/${imdbId}`))

    useEffect(() => {
        if (characters.length <= endpoints.length) {
            results.forEach(result => {
                if (result.isSuccess && !result.error) {
                    const character: Character = result.data?.data.result.properties;
                    if (!characters.includes(character)) characters.push(character)
                }
            })
        }
        return () => {};
    }, [results, characters])

    useEffect(() => {
        if (!isLoading && !error) {
            setImdbId(data?.data.results[0].id)
        }
    }, [isLoading, error, data, setImdbId])

    useEffect(() => {
        if (castResults.isSuccess && !castResults.error) {
            castResults?.data?.data.actors.forEach((actor: ImdbCharacter) => {
                imdbCharacters.push(actor);
            })
        }
    }, [castResults, characters, imdbCharacters])

    function getImage(name: string): string {
        const filtered = imdbCharacters.filter((character: ImdbCharacter) => {
            if ((character.asCharacter).includes(name)) {
                return character
            }
        })
        return filtered[0]?.image
    }

    function getActorName(name: string): string {
        const filtered = imdbCharacters.filter((character: ImdbCharacter) => {
            if ((character.asCharacter).includes(name)) {
                return character
            }
        })
        return filtered[0]?.name
    }

    return (
        <Container className={styles.container}>
            <Header as="h3" size="large" inverted color="grey">Characters</Header>
            <List inverted divided className={styles.list}>
                {characters.map((character: Character, index: number) => {
                    if (getImage(character.name)) {
                        return (
                            <List.Item key={index} className={styles.item}>
                                <div className={styles.image} style={{backgroundImage: `url(${getImage(character.name)})`}}>
                                    <img src={getImage(character.name)} alt={character.name} />
                                </div>
                                <List.Content>
                                    <List.Header as="h4">{getActorName(character.name)}</List.Header>
                                    <List.Description>{character.name}</List.Description>
                                    <List.Description><CharacterDetails homeworld_endpoint={character.homeworld} birth_year={character.birth_year} /></List.Description>
                                </List.Content>
                            </List.Item>
                        )
                    }
                    return null;
                })}
            </List>
        </Container>
    )
}

export default CastList
