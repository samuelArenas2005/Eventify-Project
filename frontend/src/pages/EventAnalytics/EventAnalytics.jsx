import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Users, TrendingUp, MessageCircle } from "lucide-react";
import AnalyticsLayout from "../../components/Analytics/layout/AnalyticsLayout";
import EventAnalyticsHeader from "../../components/Analytics/headers/EventAnalyticsHeader";
import UserListView from "../../components/Analytics/views/UserListView";
import TimeSeriesChart from "../../components/Analytics/charts/TimeSeriesChart";
import CommentsPlaceholder from "../../components/Analytics/views/CommentsPlaceholder";
import { Edit } from 'lucide-react';
import { Pencil } from 'lucide-react';
import ModifyEventView from "../../components/Analytics/views/modifyEventView";

const EventAnalytics = () => {
  const [activeView, setActiveView] = useState("users");

  // Imprimir el eventId en consola


  // Datos del evento
  const eventData = {
    title: "Conferencia Tech Summit 2025",
    date: "15 Dic 2025",
    attendees: 55,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400",
  };

  // Opciones del menú
  const menuItems = [
    {
      id: "Modificar_evento",
      icon: <Pencil size={20} />,
      label: "Modificar evento",
    },
    {
      id: "users",
      icon: <Users size={20} />,
      label: "Lista de Inscritos",
    },
    {
      id: "registrations",
      icon: <TrendingUp size={20} />,
      label: "Inscripciones por Día",
    },
    {
      id: "comments",
      icon: <MessageCircle size={20} />,
      label: "Comentarios",
    }

  ];

  // Datos falsos para la lista de usuarios
  const fakeUsers = [
    {
      id: 1,
      name: "María García",
      email: "maria.garcia@email.com",
      status: "confirmed",
      registrationDate: "2025-11-15",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-16",
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana.martinez@email.com",
      status: "pending",
      registrationDate: "2025-11-17",
    },
    {
      id: 4,
      name: "José López",
      email: "jose.lopez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-18",
    },
    {
      id: 5,
      name: "Laura Sánchez",
      email: "laura.sanchez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-19",
    },
    {
      id: 6,
      name: "Pedro Hernández",
      email: "pedro.hernandez@email.com",
      status: "cancelled",
      registrationDate: "2025-11-20",
    },
    {
      id: 7,
      name: "Sofia Ramírez",
      email: "sofia.ramirez@email.com",
      status: "confirmed",
      registrationDate: "2025-11-21",
    },
    {
      id: 8,
      name: "Miguel Torres",
      email: "miguel.torres@email.com",
      status: "pending",
      registrationDate: "2025-11-22",
    },
  ];

  // Datos falsos para la gráfica
  const chartData = [
    { label: "15 Nov", value: 5 },
    { label: "16 Nov", value: 12 },
    { label: "17 Nov", value: 18 },
    { label: "18 Nov", value: 15 },
    { label: "19 Nov", value: 25 },
    { label: "20 Nov", value: 32 },
    { label: "21 Nov", value: 28 },
    { label: "22 Nov", value: 35 },
    { label: "23 Nov", value: 42 },
    { label: "24 Nov", value: 38 },
    { label: "25 Nov", value: 45 },
    { label: "26 Nov", value: 52 },
    { label: "27 Nov", value: 48 },
    { label: "28 Nov", value: 55 },
  ];

  const chartStats = [
    {
      label: "Total Inscritos",
      value: "55",
      trend: { positive: true, text: "+12% esta semana" },
    },
    {
      label: "Promedio Diario",
      value: "3.9",
      trend: { positive: true, text: "+8% vs anterior" },
    },
    {
      label: "Pico Máximo",
      value: "55",
      trend: { positive: false, text: "28 Nov 2025" },
    },
    {
      label: "Tasa de Conversión",
      value: "68%",
      trend: { positive: true, text: "+5%" },
    },
  ];

  const renderContent = () => {
    if (activeView === "users") {
      return <UserListView users={fakeUsers} />;
    }
    if (activeView === "registrations") {
      return (
        <TimeSeriesChart
          data={chartData}
          title="Inscripciones por Día"
          subtitle="Desde la publicación del evento"
          stats={chartStats}
        />
      );
    }
    if (activeView === "comments") {
      return <CommentsPlaceholder />;
    }
    if (activeView === "Modificar_evento") {
      return <ModifyEventView />
    }
    return null;
  };

  return (
    <AnalyticsLayout
      sidebarHeader={<EventAnalyticsHeader eventData={eventData} />}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {renderContent()}
    </AnalyticsLayout>
  );
};

export default EventAnalytics;
