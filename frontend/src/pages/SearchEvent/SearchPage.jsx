import { use, useEffect, useState } from 'react'
import React from 'react'
import { getEvents } from './searchPage'
import EventCard from '../../components/UI/EventCard/EventCard.jsx';
import TextPop from '../../components/UI/TextPop/TextPop.jsx';
import { set } from 'react-hook-form';
import style from "./SearchPage.module.css"
import { Search, Filter } from 'lucide-react';

export default function SearchPage() {

    useEffect(() => {
        async function loadEvents() {
            const events = await getEvents();
            console.log("Eventos formateados para el frontend:", events);
            setEventsData(events);
        }

        loadEvents(); // Llamamos a la función dentro del efecto
    }, []); // Dependencias vacías: se ejecuta solo una vez al montar el componente


    const [eventsData, setEventsData] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const toggleFilter = () => {
        setIsFilterOpen(prevState => !prevState); // Cambia el estado al valor opuesto
    };
    return (

        <div>
            <TextPop></TextPop>
            <div className={style.search}>
                <form action="buscar" class={style.searchForm}>
                    <div class={style.searchContainer}>
                        <input
                            type="search"
                            name="buscar"
                            class={style.searchInput}
                            placeholder="Buscar un evento..."
                        />
                        <button type="submit" class={style.searchButton}>
                            <Search style={{margin: '10px'}}></Search>
                        </button>
                    </div>
                </form>
                <div className={style.filterContainer}>
                    {/* Este es el botón que el usuario ve */}
                    <button className={style.filter} onClick={toggleFilter}>
                        Filtros <Filter></Filter>
                    </button>

                    {/* Este menú solo se renderiza si isFilterOpen es true */}
                    {isFilterOpen && (
                        <ul className={style.filterDropdown}>
                            <li><a href="#">Por Fecha</a></li>
                            <li><a href="#">Por Ubicación</a></li>
                            <li><a href="#">Categoría: Deportivo</a></li>
                            <li><a href="#">Categoría: Musical</a></li>
                        </ul>
                    )}
                </div>
            </div>
            <div className={style.eventCards}>
                {eventsData.map((event) => (
                    <EventCard key={event.id} {...event} />
                ))}
            </div>
        </div>
    )
}
