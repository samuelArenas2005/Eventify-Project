import { use, useEffect, useState } from 'react'
import React from 'react'
import {getEvents} from './searchPage'
import EventCard from '../../components/UI/EventCard/EventCard.jsx';
import { set } from 'react-hook-form';

export default function SearchPage() {
    useEffect(() => {async function loadEvents() {
        const events = await getEvents();
        console.log("Eventos formateados para el frontend:", events);
        setEventsData(events);
    } loadEvents()}), [];
    const [eventsData, setEventsData] = useState([]);
  return (
    
    <div>
        <div>
            {eventsData.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
        </div>
    </div>
  )
}
