import styles from '../styles/TextCrawl.module.css'
import { FC } from 'react'

interface Props {
    text: string,
}


const TextCrawl: FC<Props> = ({text}) => 
    <div className={styles.crawlContainer}> 
        <div className={styles.crawl}>
            {text}
        </div>
    </div>

export default TextCrawl
