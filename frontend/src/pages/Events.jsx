
import React, { useEffect, useState } from 'react';
import { getAllEvent } from '../API/api';
import Rating from '@mui/material/Rating';


function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const res =  await getAllEvent();
      console.log(res.data)
      setEvents(res.data);
    }
    loadEvents();
  }, []);

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <Rating name="half-rating" defaultValue={2.5} precision={0.5} />
        </div>
      ))}
    </div>
  );
}

export default Events