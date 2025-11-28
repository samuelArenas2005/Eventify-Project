import React, { useState } from "react";
import { Users, Calendar } from "lucide-react";
import AnalyticsLayout from "../../components/Analytics/AnalyticsLayout";
import AdminAnalyticsHeader from "../../components/Analytics/AdminAnalyticsHeader";
import TimeSeriesChart from "../../components/Analytics/TimeSeriesChart";

const AdminAnalytics = () => {
  const [activeView, setActiveView] = useState("users");

  // Opciones del menú
  const menuItems = [
    {
      id: "users",
      icon: <Users size={20} />,
      label: "Usuarios Registrados",
    },
    {
      id: "events",
      icon: <Calendar size={20} />,
      label: "Eventos Creados",
    },
  ];

  // Datos falsos para usuarios registrados
  const usersChartData = [
    { label: "15 Nov", value: 12 },
    { label: "16 Nov", value: 18 },
    { label: "17 Nov", value: 15 },
    { label: "18 Nov", value: 22 },
    { label: "19 Nov", value: 28 },
    { label: "20 Nov", value: 35 },
    { label: "21 Nov", value: 30 },
    { label: "22 Nov", value: 42 },
    { label: "23 Nov", value: 48 },
    { label: "24 Nov", value: 45 },
    { label: "25 Nov", value: 52 },
    { label: "26 Nov", value: 58 },
    { label: "27 Nov", value: 55 },
    { label: "28 Nov", value: 65 },
  ];

  const usersStats = [
    {
      label: "Total Usuarios",
      value: "1,248",
      trend: { positive: true, text: "+18% este mes" },
    },
    {
      label: "Nuevos Hoy",
      value: "65",
      trend: { positive: true, text: "+12% vs ayer" },
    },
    {
      label: "Usuarios Activos",
      value: "892",
      trend: { positive: true, text: "71% del total" },
    },
    {
      label: "Tasa de Retención",
      value: "84%",
      trend: { positive: true, text: "+3%" },
    },
  ];

  // Datos falsos para eventos creados
  const eventsChartData = [
    { label: "15 Nov", value: 8 },
    { label: "16 Nov", value: 12 },
    { label: "17 Nov", value: 10 },
    { label: "18 Nov", value: 15 },
    { label: "19 Nov", value: 18 },
    { label: "20 Nov", value: 22 },
    { label: "21 Nov", value: 20 },
    { label: "22 Nov", value: 25 },
    { label: "23 Nov", value: 28 },
    { label: "24 Nov", value: 26 },
    { label: "25 Nov", value: 32 },
    { label: "26 Nov", value: 35 },
    { label: "27 Nov", value: 30 },
    { label: "28 Nov", value: 38 },
  ];

  const eventsStats = [
    {
      label: "Total Eventos",
      value: "436",
      trend: { positive: true, text: "+22% este mes" },
    },
    {
      label: "Creados Hoy",
      value: "38",
      trend: { positive: true, text: "+15% vs ayer" },
    },
    {
      label: "Eventos Activos",
      value: "284",
      trend: { positive: true, text: "65% del total" },
    },
    {
      label: "Tasa de Finalización",
      value: "92%",
      trend: { positive: true, text: "+5%" },
    },
  ];

  const renderContent = () => {
    if (activeView === "users") {
      return (
        <TimeSeriesChart
          data={usersChartData}
          title="Usuarios Registrados por Día"
          subtitle="Últimos 14 días"
          stats={usersStats}
        />
      );
    }
    if (activeView === "events") {
      return (
        <TimeSeriesChart
          data={eventsChartData}
          title="Eventos Creados por Día"
          subtitle="Últimos 14 días"
          stats={eventsStats}
        />
      );
    }
    return null;
  };

  return (
    <AnalyticsLayout
      sidebarHeader={<AdminAnalyticsHeader />}
      menuItems={menuItems}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      {renderContent()}
    </AnalyticsLayout>
  );
};

export default AdminAnalytics;
