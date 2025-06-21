import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const TransactionChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => new Date(d.date).toLocaleDateString()),
        datasets: [
          {
            label: "Credit",
            data: data.map((d) => d.credit),
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Debit",
            data: data.map((d) => d.debit),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "rgba(255, 255, 255, 0.7)" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
          x: {
            ticks: { color: "rgba(255, 255, 255, 0.7)" },
            grid: { color: "rgba(255, 255, 255, 0.1)" },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "rgba(255, 255, 255, 0.7)",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default TransactionChart;
