import { use, useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getEvents } from "./searchPage.js";
import EventCard from "../../components/UI/EventCard/EventCard.jsx";
import TextPop from "../../components/UI/TextPop/TextPop.jsx";
import style from "./SearchPage.module.css";
import {
  Search,
  Filter,
  Plus,
  Sparkles,
  Tag,
  Calendar,
  MapPin,
  ChevronDown,
  X,
} from "lucide-react";
import EventModal from "../../components/UI/DetailedEvent/DetailedEvent.jsx";
import { getCategories } from "../../API/api.js";

export default function SearchPage() {
  const navigate = useNavigate();
  const [eventsData, setEventsData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [categories, setCategories] = useState([]);

  // Estados para los filtros
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Nuevo: estado para el input de búsqueda en tiempo real
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilter = () => {
    setIsFilterOpen((prevState) => !prevState);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedDate("");
    setSelectedLocation("");
  };

  // Funciones para eliminar filtros individuales
  const removeCategoryFilter = () => {
    setSelectedCategory("");
  };

  const removeDateFilter = () => {
    setSelectedDate("");
  };

  const removeLocationFilter = () => {
    setSelectedLocation("");
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Obtener filtros activos
  const activeFilters = [];
  if (selectedCategory) {
    activeFilters.push({
      type: "category",
      label: "Categoría",
      value: selectedCategory,
      onRemove: removeCategoryFilter,
      icon: Tag,
    });
  }
  if (selectedDate) {
    activeFilters.push({
      type: "date",
      label: "Fecha",
      value: formatDate(selectedDate),
      onRemove: removeDateFilter,
      icon: Calendar,
    });
  }
  if (selectedLocation) {
    // Capitalizar la primera letra de cada palabra
    const formattedLocation = selectedLocation
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    
    activeFilters.push({
      type: "location",
      label: "Ubicación",
      value: formattedLocation,
      onRemove: removeLocationFilter,
      icon: MapPin,
    });
  }

  useEffect(() => {
    async function loadEvents() {
      const events = await getEvents(handleCloseModal);
      console.log("Eventos formateados para el frontend:", events);
      setEventsData(
        events.map((event) => ({
          ...event,
          handleImageTitleClick: () =>
            setSelectedEvent(event.formattedDetailEvent),
        }))
      );
    }

    async function loadCategories() {
      const cats = await getCategories();
      setCategories(cats);
    }

    loadEvents();
    loadCategories();
  }, []);

  // Filtrado en tiempo real por título, categoría, fecha y ubicación
  const displayedEvents = eventsData.filter((ev) => {
    // Filtro por búsqueda de texto
    if (searchTerm) {
      const title = (ev.title || ev.titulo || "").toString().toLowerCase();
      if (!title.includes(searchTerm.toLowerCase())) return false;
    }

    // Filtro por categoría
    if (selectedCategory) {
      const eventCategory = ev.category || ev.categoria || "";
      if (eventCategory !== selectedCategory) return false;
    }

    // Filtro por fecha (puedes ajustar esta lógica según tus necesidades)
    if (selectedDate) {
      const eventDate = ev.date || ev.fecha || "";
      if (eventDate !== selectedDate) return false;
    }

    // Filtro por ubicación
    if (selectedLocation) {
      const eventLocation = (ev.location || ev.ubicacion || "")
        .toString()
        .toLowerCase();
      if (!eventLocation.includes(selectedLocation.toLowerCase())) return false;
    }

    return true;
  });

  // Evita que el form recargue la página al presionar Enter
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <TextPop></TextPop>
      <div className={style.search}>
        <form
          action="buscar"
          className={style.searchForm}
          onSubmit={handleSubmit}
        >
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
              <Search style={{ margin: "10px" }}></Search>
            </button>
          </div>
        </form>
        <div className={style.filterContainer}>
          <button
            className={style.filter}
            onClick={(e) => {
              e.stopPropagation();
              toggleFilter();
            }}
          >
            Filtros <Filter></Filter>
          </button>
          {isFilterOpen && (
            <div
              className={style.filterDropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={style.filterHeader}>
                <h3>Filtrar eventos</h3>
                <button className={style.clearButton} onClick={clearFilters}>
                  Limpiar
                </button>
              </div>

              {/* Filtro por Categoría */}
              <div className={style.filterSection}>
                <label className={style.filterLabel}>
                  <Tag size={18} />
                  Categoría
                </label>
                <div className={style.selectWrapper}>
                  <select
                    className={style.filterSelect}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setIsFilterOpen(false);
                    }}
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={style.selectIcon} size={18} />
                </div>
              </div>

              {/* Filtro por Fecha */}
              <div className={style.filterSection}>
                <label className={style.filterLabel}>
                  <Calendar size={18} />
                  Fecha
                </label>
                <div className={style.dateInputWrapper}>
                  <input
                    type="date"
                    className={style.filterInput}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Seleccionar fecha"
                  />
                </div>
              </div>

              {/* Filtro por Ubicación */}
              <div className={style.filterSection}>
                <label className={style.filterLabel}>
                  <MapPin size={18} />
                  Ubicación
                </label>
                <div className={style.selectWrapper}>
                  <select
                    className={style.filterSelect}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="">Todas las ubicaciones</option>
                    <option value="campus norte">Campus Norte</option>
                    <option value="campus sur">Campus Sur</option>
                    <option value="auditorio">Auditorio</option>
                    <option value="biblioteca">Biblioteca</option>
                  </select>
                  <ChevronDown className={style.selectIcon} size={18} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filtros aplicados */}
      {activeFilters.length > 0 && (
        <div className={style.activeFiltersContainer}>
          {activeFilters.map((filter, index) => {
            const IconComponent = filter.icon;
            return (
              <div key={index} className={style.activeFilterTag}>
                <IconComponent size={14} className={style.filterTagIcon} />
                <span className={style.filterTagLabel}>{filter.label}:</span>
                <span className={style.filterTagValue}>{filter.value}</span>
                <button
                  className={style.filterTagRemove}
                  onClick={filter.onRemove}
                  aria-label={`Eliminar filtro ${filter.label}`}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={style.eventCards}>
        {displayedEvents.map((event, index) => (
          <div key={event.id} style={{ "--card-index": index }}>
            <EventCard {...event} />
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className={style.ctaContainer}>
        <div className={style.ctaCard}>
          <div className={style.ctaIcon}>
            <Sparkles size={32} />
          </div>
          <h3 className={style.ctaTitle}>
            ¿No encuentras un evento de tu interés?
          </h3>
          <p className={style.ctaSubtitle}>
            Crea tu propio evento y comparte experiencias únicas con la
            comunidad
          </p>
          <button
            className={style.ctaButton}
            onClick={() => navigate("/createEvent")}
          >
            <Plus size={20} />
            Crear Evento Ahora
          </button>
        </div>
      </div>

      {selectedEvent && <EventModal {...selectedEvent} />}
    </div>
  );
}
