document.addEventListener("DOMContentLoaded", function () {
  const selectElement = document.getElementById("mySelect");
  let charts = {};
  selectElement.addEventListener("change", fetchDataAndDrawCharts);
  async function fetchDataAndDrawCharts() {
    try {
      const response = await fetch("./data/dataset.json");
      const data = await response.json();
      const selectedValue = selectElement.value;
      // Filter data berdasarkan tanggal
      const filteredData = filterDataByDate(data, selectedValue);
      // Dapatkan data untuk chart
      const top5ProductsData = calculateTop5Products(filteredData, 5);
      const mostCategoriesData = calculateDataByCategory(filteredData);
      const mostLocationsData = calculateDataByLocation(filteredData);
      const mostTypesData = calculateDataByType(filteredData);
      // Gambar chart
      drawOrUpdateChart(
        "myChart1",
        "Jumlah Produk Terjual",
        top5ProductsData.labels,
        top5ProductsData.data,
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 99, 132, 1)"
      );
      drawOrUpdateChart(
        "myChart2",
        "Jumlah Produk Terjual Dalam Category",
        mostCategoriesData.labels,
        mostCategoriesData.data,
        "rgba(54, 162, 235, 0.2)",
        "rgba(54, 162, 235, 1)"
      );
      drawOrUpdateChart(
        "myChart3",
        "Jumlah Produk Terjual Dalam Location",
        mostLocationsData.labels,
        mostLocationsData.data,
        "rgba(255, 255, 0, 0.2)",
        "rgba(255, 255, 0, 1)"
      );
      drawOrUpdateChart(
        "myChart4",
        "Jumlah Pembayaran",
        mostTypesData.labels,
        mostTypesData.data,
        "rgba(0, 255, 0, 0.2)",
        "rgba(0, 255, 0, 1)"
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  function filterDataByDate(data, month) {
    let startDate = new Date(2022, month - 1, 1);
    let endDate = new Date(2022, month, 0);
    if (month == "all") {
      startDate = new Date("1/1/2022");
      endDate = new Date("12/31/2022");
    }
    return data.filter((item) => {
      const date = new Date(item.TransDate);
      return date >= startDate && date <= endDate;
    });
  }
  // Deklarasi 5 Product Terbanyak
  function calculateTop5Products(data, top5) {
    const productTotals = data.reduce((acc, curr) => {
      const product = curr.Product;
      if (!acc[product]) {
        acc[product] = { product, total: 0 };
      }
      acc[product].total += curr.RQty;
      return acc;
    }, {});
    const sortedProducts = Object.values(productTotals).sort(
      (a, b) => b.total - a.total
    );
    return {
      labels: sortedProducts.slice(0, top5).map((item) => item.product),
      data: sortedProducts.slice(0, top5).map((item) => item.total),
    };
  }
  // Deklarasi Category Terbanyak
  function calculateDataByCategory(data) {
    return calculateDataByField(data, "Category");
  }
  // Deklarasi Location Dengan Penjualan Paling Banyak
  function calculateDataByLocation(data) {
    return calculateDataByField(data, "Location");
  }
  // Deklarasi Type Pembayaran Paling Banyak
  function calculateDataByType(data) {
    return calculateDataByField(data, "Type");
  }
  function calculateDataByField(data, field) {
    const fieldTotals = data.reduce((acc, curr) => {
      const fieldValue = curr[field];
      if (!acc[fieldValue]) {
        acc[fieldValue] = { fieldValue, total: 0 };
      }
      acc[fieldValue].total += curr.RQty;
      return acc;
    }, {});
    const sortedFieldTotals = Object.values(fieldTotals).sort(
      (a, b) => b.total - a.total
    );
    return {
      labels: sortedFieldTotals.map((item) => item.fieldValue),
      data: sortedFieldTotals.map((item) => item.total),
    };
  }
  function drawOrUpdateChart(
    canvasId,
    label,
    labels,
    data,
    backgroundColor,
    borderColor
  ) {
    if (charts[canvasId]) {
      charts[canvasId].data.labels = labels;
      charts[canvasId].data.datasets[0].data = data;
      charts[canvasId].update();
    } else {
      const ctx = document.getElementById(canvasId).getContext("2d");
      charts[canvasId] = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: label,
              data: data,
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 3,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  var label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  label +=
                    context.parsed.y + " (" + data[context.dataIndex] + ")";
                  return label;
                },
              },
            },
          },
        },
      });
    }
  }
  // Panggil fungsi pertama kali untuk inisialisasi chart
  fetchDataAndDrawCharts();
});
