import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import styles from "./TimeSeriesChart.module.css";

/**
 * Componente de gráfica de series de tiempo reutilizable
 */
const TimeSeriesChart = ({ data, title, subtitle, stats }) => {
  const maxValue = Math.max(...data.map((d) => d.value));
  const width = 900;
  const height = 350;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = height - padding - (d.value / maxValue) * chartHeight;
    return { x, y, value: d.value };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const fillPath = `${pathData} L ${points[points.length - 1].x} ${
    height - padding
  } L ${padding} ${height - padding} Z`;

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
          <h3 className={styles.chartTitle}>{title}</h3>
          {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
        </div>
        <div className={styles.chartContainer}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className={styles.fakeChart}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0B72B9" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0B72B9" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1={padding}
                y1={padding + (chartHeight / 4) * i}
                x2={width - padding}
                y2={padding + (chartHeight / 4) * i}
                className={styles.chartGrid}
              />
            ))}

            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => (
              <text
                key={i}
                x={padding - 10}
                y={height - padding - (chartHeight / 4) * i + 5}
                textAnchor="end"
                className={styles.chartLabel}
              >
                {Math.round((maxValue / 4) * i)}
              </text>
            ))}

            {/* X-axis labels */}
            {data
              .filter((_, i) => i % 2 === 0)
              .map((d, i) => (
                <text
                  key={i}
                  x={padding + ((i * 2) / (data.length - 1)) * chartWidth}
                  y={height - padding + 25}
                  textAnchor="middle"
                  className={styles.chartLabel}
                >
                  {d.label}
                </text>
              ))}

            {/* Area fill */}
            <path d={fillPath} className={styles.chartFill} />

            {/* Line */}
            <path d={pathData} className={styles.chartLine} />

            {/* Points */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="5"
                className={styles.chartPoint}
              >
                <title>{`${data[i].label}: ${point.value}`}</title>
              </circle>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;
