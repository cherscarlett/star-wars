import styles from '../styles/FilmSelect.module.css'
import { Header, List } from 'semantic-ui-react'
import { useQuery } from 'react-query'
import axios from "axios"
import { useEffect, useState, FC } from 'react'


const FilmImage: FC = () => {
    

    return (
        <div className="bb8">
            <div className="bb8-head">
            </div>
            <div className="bottom-head"></div>
            <div className="bb8-body">
                <div className="circle1">
                    <div className="s1"></div>
                    <div className="s2"></div>
                </div>
                    <div className="circle2">
                    <div className="s1"></div>
                    <div className="s2"></div>
                </div>
                    <div className="circle3">
                    <div className="s1"></div>
                    <div className="s2"></div>
                </div>
            </div>
        </div>
    )
}

export default FilmImage
