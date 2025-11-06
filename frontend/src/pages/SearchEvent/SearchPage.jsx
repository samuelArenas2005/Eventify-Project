import { use, useEffect, useState } from 'react';
import React from 'react';
import { getEvents } from './searchPage.js';
import EventCard from '../../components/UI/EventCard/EventCard.jsx';
import TextPop from '../../components/UI/TextPop/TextPop.jsx';
import { set } from 'react-hook-form';
import style from "./SearchPage.module.css";
import { Search, Filter } from 'lucide-react';
import EventModal from '../../components/UI/DetailedEvent/DetailedEvent.jsx'; // Import the DetailedEvent component

export default function SearchPage() {
    const [eventsData, setEventsData] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Nuevo: estado para el input de búsqueda en tiempo real
    const [searchTerm, setSearchTerm] = useState('');

    const toggleFilter = () => {
        setIsFilterOpen(prevState => !prevState);
    };

    const handleCloseModal = () => {
        setSelectedEvent(null);
    };

    useEffect(() => {
        async function loadEvents() {
            const events = await getEvents(handleCloseModal); // Pass the close handler function
            console.log("Eventos formateados para el frontend:", events);
            setEventsData(events.map(event => ({
                ...event,
                handleImageTitleClick: () => setSelectedEvent(event.formattedDetailEvent)
            })));
        }

        loadEvents();
    }, []);

    // Filtrado en tiempo real por título (case-insensitive)
    const displayedEvents = eventsData.filter(ev => {
        if (!searchTerm) return true;
        const title = (ev.title || ev.titulo || '').toString().toLowerCase();
        return title.includes(searchTerm.toLowerCase());
    });

    // Evita que el form recargue la página al presionar Enter
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <TextPop></TextPop>
            <div className={style.search}>
                <form action="buscar" className={style.searchForm} onSubmit={handleSubmit}>
                    <div className={style.searchContainer}>
                        <input
                            type="text"
                            name="buscar"
                            className={style.searchInput}
                            placeholder="Buscar un evento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className={style.searchButton}>
                            <Search style={{ margin: '10px' }}></Search>
                        </button>
                    </div>
                </form>
                <div className={style.filterContainer}>
                    <button className={style.filter} onClick={toggleFilter}>
                        Filtros <Filter></Filter>
                    </button>
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
                {displayedEvents.map((event, index) => (
                    <div
                        key={event.id}
                        style={{ "--card-index": index }}
                        onClick={event.onClick ?? event.handleImageTitleClick}
                    >
                        <EventCard {...event} />
                    </div>
                ))}
            </div>
            {selectedEvent && <EventModal {...selectedEvent}/>}
        </div>
    );
}
