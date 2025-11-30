import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./TimeSeriesChart.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TimeSeriesChart = ({
  data,
  title,
  subtitle,
  stats,
  rangeOptions,
  selectedRange,
  onRangeChange,
}) => {
  const dataPoints = data?.length ?? 0;
  const computedBarThickness = (() => {
    if (dataPoints <= 0) return 24;
    const base = Math.floor(220 / dataPoints);
    return Math.max(6, Math.min(base, 28));
  })();

  const chartData = {
    labels: data?.map((point) => point.label) ?? [],
    datasets: [
      {
        label: title,
        data: data?.map((point) => point.value) ?? [],
        backgroundColor: "rgba(11, 114, 185, 0.8)",
        borderRadius: 6,
        barThickness: computedBarThickness,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0B1A2A",
        titleFont: { size: 14, family: "Inter, sans-serif" },
        bodyFont: { size: 13, family: "Inter, sans-serif" },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280" },
      },
      y: {
        grid: { color: "#1F2937", drawBorder: false },
        ticks: { color: "#6B7280" },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.registrationsChartView}>
      {stats && stats.length > 0 && (
        <div className={styles.statsCards}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
              {stat.trend && (
                <span
                  className={`${styles.statTrend} ${
                    stat.trend.positive
                      ? styles.trendPositive
                      : styles.trendNegative
                  }`}
                >
                  {stat.trend.positive ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}{" "}
                  {stat.trend.text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <div>
            <h3 className={styles.chartTitle}>{title}</h3>
            {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
          </div>
          {Array.isArray(rangeOptions) && rangeOptions.length > 0 && (
            <div className={styles.rangeControls}>
              {rangeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.rangeButton} ${
                    option.id === selectedRange ? styles.rangeButtonActive : ""
                  }`}
                  onClick={() => onRangeChange && onRangeChange(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.chartContainer}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
