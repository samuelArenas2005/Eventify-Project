import { use, useEffect, useState } from 'react'
import React from 'react'
import {getEvents} from './searchPage'
import EventCard from '../../components/UI/EventCard/EventCard.jsx';
import { set } from 'react-hook-form';
import "./SearchPage.css"

export default function SearchPage() {
    useEffect(() => {async function loadEvents() {
        const events = await getEvents();
        console.log("Eventos formateados para el frontend:", events);
        setEventsData(events);
    } loadEvents()}), [];
    const [eventsData, setEventsData] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const toggleFilter = () => {
    setIsFilterOpen(prevState => !prevState); // Cambia el estado al valor opuesto
    };
  return (
    
    <div>
        <h1 className='titulo'>Explorar eventos</h1>
        <h2 className='subtitulo'>Descubre eventos increíbles de tu universidad</h2>
        <div className='search'>
            <form action="buscar" class="search-form">
                <div class="search-container">
                    <input 
                    type="search" 
                    name="buscar" 
                    class="search-input" 
                    placeholder="Buscar un evento..." 
                    />
                    <button type="submit" class="search-button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </form>
            <div className="filter-container">
                {/* Este es el botón que el usuario ve */}
                <button className="filter" onClick={toggleFilter}>
                    Filtros <i className="fas fa-chevron-down"></i> {/* Ícono de flecha */}
                </button>

                {/* Este menú solo se renderiza si isFilterOpen es true */}
                {isFilterOpen && (
                    <ul className="filter-dropdown">
                        <li><a href="#">Por Fecha</a></li>
                        <li><a href="#">Por Ubicación</a></li>
                        <li><a href="#">Categoría: Deportivo</a></li>
                        <li><a href="#">Categoría: Musical</a></li>
                    </ul>
                )}
            </div>
        </div>
        <div className='eventCards'>
            {eventsData.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
        </div>
    </div>
  )
}
