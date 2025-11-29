import React from "react";
import { Calendar, Users } from "lucide-react";
import styles from "./EventAnalyticsHeader.module.css";

/**
 * Header para la barra lateral de estadísticas de eventos
 */
const EventAnalyticsHeader = ({ eventData }) => {
  return (
    <div className={styles.eventInfoSidebar}>
      <img
        src={eventData.image}
        alt="Event thumbnail"
        className={styles.eventThumbnailSidebar}
      />
      <div className={styles.eventDetailsSidebar}>
        <h2 className={styles.eventTitleSidebar}>{eventData.title}</h2>
        <div className={styles.eventMetaSidebar}>
          <span className={styles.metaItemSidebar}>
            <Calendar size={14} />
            {eventData.date}
          </span>
          <span className={styles.metaItemSidebar}>
            <Users size={14} />
            {eventData.attendees} inscritos
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventAnalyticsHeader;
