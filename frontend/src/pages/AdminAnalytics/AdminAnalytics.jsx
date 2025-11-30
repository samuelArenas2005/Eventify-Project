import React, { useEffect, useMemo, useState } from "react";
import { Users, Calendar, UserPlus, TrendingUp } from "lucide-react";
import AnalyticsLayout from "../../components/Analytics/layout/AnalyticsLayout";
import AdminAnalyticsHeader from "../../components/Analytics/headers/AdminAnalyticsHeader";
import TimeSeriesChart from "../../components/Analytics/charts/TimeSeriesChart";
import AddAdminView from "../../components/Analytics/views/AddAdminView";
import PopularEventsView from "../../components/Analytics/views/PopularEventsView";
import {
  getDailyEventsCreated,
  getDailyRegisteredUsers,
  getTotalUsersCount,
} from "../../api/api";

const EVENT_RANGE_OPTIONS = [
  { id: "7", label: "Última semana", days: 7 },
  { id: "30", label: "Último mes", days: 30 },
  { id: "90", label: "Últimos 3 meses", days: 90 },
];

const formatNumber = (value) =>
  new Intl.NumberFormat("es-ES").format(Number(value || 0));

const AdminAnalytics = () => {
  const [activeView, setActiveView] = useState("users");
  const [adminSearchId, setAdminSearchId] = useState("");
  const [usersRange, setUsersRange] = useState(EVENT_RANGE_OPTIONS[0].id);
  const [usersChartData, setUsersChartData] = useState([]);
  const [usersStats, setUsersStats] = useState([]);
  const [eventsRange, setEventsRange] = useState(EVENT_RANGE_OPTIONS[0].id);
  const [eventsChartData, setEventsChartData] = useState([]);
  const [eventsStats, setEventsStats] = useState([]);

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
    {
      id: "popular-events",
      icon: <TrendingUp size={20} />,
      label: "Eventos Populares",
    },
    {
      id: "add-admin",
      icon: <UserPlus size={20} />,
      label: "Añadir admin",
    },
  ];

  const selectedUsersRangeConfig = useMemo(() => {
    return (
      EVENT_RANGE_OPTIONS.find((option) => option.id === usersRange) ||
      EVENT_RANGE_OPTIONS[0]
    );
  }, [usersRange]);

  const selectedEventsRangeConfig = useMemo(() => {
    return (
      EVENT_RANGE_OPTIONS.find((option) => option.id === eventsRange) ||
      EVENT_RANGE_OPTIONS[0]
    );
  }, [eventsRange]);

  useEffect(() => {
    const fetchUsersAnalytics = async () => {
      const endDate = new Date();
      const startDate = new Date();
      const days = selectedUsersRangeConfig.days;
      startDate.setDate(endDate.getDate() - (days - 1));

      const previousPeriodEnd = new Date(startDate);
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
      const previousPeriodStart = new Date(previousPeriodEnd);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (days - 1));

      try {
        const [currentResponse, previousResponse, totalsResponse] =
          await Promise.all([
            getDailyRegisteredUsers(
              startDate.toISOString(),
              endDate.toISOString()
            ),
            getDailyRegisteredUsers(
              previousPeriodStart.toISOString(),
              previousPeriodEnd.toISOString()
            ),
            getTotalUsersCount(),
          ]);

        const dailyData = currentResponse?.data ?? {};
        const previousData = previousResponse?.data ?? {};
        const totalsData = totalsResponse?.data ?? {};

        const normalizedSeries = (dailyData.series ?? []).map((item) => ({
          label: item.label,
          value: item.value,
        }));

        setUsersChartData(normalizedSeries);

        const totalUsers = Number(totalsData.total_users ?? 0);
        const periodRegistrations = Number(dailyData.total_users_period ?? 0);
        const previousPeriodRegistrations = Number(
          previousData.total_users_period ?? 0
        );

        const periodDiff = periodRegistrations - previousPeriodRegistrations;
        const trendText = `${periodDiff >= 0 ? "+" : "-"}${formatNumber(
          Math.abs(periodDiff)
        )} vs periodo anterior`;

        setUsersStats([
          {
            label: "Usuarios Totales",
            value: formatNumber(totalUsers),
            trend: {
              positive: true,
              text: "Histórico acumulado",
            },
          },
          {
            label: `Usuarios nuevos (${selectedUsersRangeConfig.label})`,
            value: formatNumber(periodRegistrations),
            trend: {
              positive: periodDiff >= 0,
              text: trendText,
            },
          },
        ]);
      } catch (error) {
        console.error("Error fetching user analytics:", error);
      }
    };

    fetchUsersAnalytics();
  }, [selectedUsersRangeConfig]);

  useEffect(() => {
    const fetchEventsAnalytics = async () => {
      const endDate = new Date();
      const startDate = new Date();
      const days = selectedEventsRangeConfig.days;
      startDate.setDate(endDate.getDate() - (days - 1));

      const previousPeriodEnd = new Date(startDate);
      previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
      const previousPeriodStart = new Date(previousPeriodEnd);
      previousPeriodStart.setDate(previousPeriodStart.getDate() - (days - 1));

      try {
        const [currentResponse, previousResponse] = await Promise.all([
          getDailyEventsCreated(startDate.toISOString(), endDate.toISOString()),
          getDailyEventsCreated(
            previousPeriodStart.toISOString(),
            previousPeriodEnd.toISOString()
          ),
        ]);

        const currentData = currentResponse?.data ?? {};
        const previousData = previousResponse?.data ?? {};

        const normalizedSeries = (currentData.series ?? []).map((item) => ({
          label: item.label,
          value: item.value,
        }));

        setEventsChartData(normalizedSeries);

        const totalEvents = currentData.total_events ?? 0;
        const finishedEvents = currentData.finished_events_count ?? 0;
        const previousTotal = previousData.total_events ?? 0;
        const previousFinished = previousData.finished_events_count ?? 0;

        const totalDiff = totalEvents - previousTotal;
        const finishedDiff = finishedEvents - previousFinished;

        const buildTrendText = (diff) => {
          const sign = diff >= 0 ? "+" : "-";
          return `${sign}${Math.abs(diff)} vs periodo anterior`;
        };

        setEventsStats([
          {
            label: "Eventos Creados",
            value: totalEvents.toString(),
            trend: {
              positive: totalDiff >= 0,
              text: buildTrendText(totalDiff),
            },
          },
          {
            label: "Eventos Finalizados",
            value: finishedEvents.toString(),
            trend: {
              positive: finishedDiff >= 0,
              text: buildTrendText(finishedDiff),
            },
          },
        ]);
      } catch (error) {
        console.error("Error fetching events analytics:", error);
      }
    };

    fetchEventsAnalytics();
  }, [selectedEventsRangeConfig]);

  const renderContent = () => {
    if (activeView === "users") {
      return (
        <TimeSeriesChart
          data={usersChartData}
          title="Usuarios Registrados por Día"
          subtitle={selectedUsersRangeConfig.label}
          stats={usersStats}
          rangeOptions={EVENT_RANGE_OPTIONS}
          selectedRange={usersRange}
          onRangeChange={setUsersRange}
        />
      );
    }
    if (activeView === "events") {
      return (
        <TimeSeriesChart
          data={eventsChartData}
          title="Eventos Creados por Día"
          subtitle={selectedEventsRangeConfig.label}
          stats={eventsStats}
          rangeOptions={EVENT_RANGE_OPTIONS}
          selectedRange={eventsRange}
          onRangeChange={setEventsRange}
        />
      );
    }
    if (activeView === "popular-events") {
      return <PopularEventsView />;
    }
    if (activeView === "add-admin") {
      return (
        <AddAdminView
          searchId={adminSearchId}
          onSearchChange={setAdminSearchId}
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
