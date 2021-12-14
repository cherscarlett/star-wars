import { useEffect, useState, FC } from 'react'
import { useQuery } from 'react-query'
import axios from 'axios'

interface Props {
    homeworld_endpoint: string,
    birth_year: string,
}

interface Planet {
    name: string
}

const CharacterDetails: FC<Props> = ({homeworld_endpoint, birth_year}) => {
    const {isLoading, error, data} = useQuery(`homeworld-${homeworld_endpoint}`, async () => await axios(homeworld_endpoint))
    const [homeworld, setHomeworld] = useState<Planet | null>(null)

    useEffect(() => {
        if (!isLoading && !error) {
            setHomeworld(data?.data?.result.properties.name)
        }
    }, [isLoading, error, data, setHomeworld])

    return (
        <>
            Born {birth_year} on {homeworld}
        </>
    )
}

export default CharacterDetails
