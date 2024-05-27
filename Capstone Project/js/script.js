document.addEventListener('DOMContentLoaded', function() {
  fetchDataAndDrawCharts();
});

async function fetchDataAndDrawCharts() {
  try {
    const response = await fetch('./data/dataset.json');
    const data = await response.json();

    // Rentang tanggal
    const startDate = new Date("1/1/2022");
    const endDate = new Date("12/31/2022");

    // Filter data berdasarkan rentang tanggal
    const filteredData = data.filter(item => {
        const date = new Date(item.TransDate);
        return date >= startDate && date <= endDate;
    });

    // Deklarasi 5 Product Terbanyak
    const top5Products = filteredData.reduce((acc, curr) => {
      const product = curr.Product;
      if (!acc[product]) {
        acc[product] = { product, total: 0 };
      }
      acc[product].total += curr.RQty;
      return acc;
    }, {});

    const sortedTop5Products = Object.values(top5Products).sort((a, b) => b.total - a.total);
    const top5ProductsRQty = sortedTop5Products.slice(0, 5).map(item => item.total);
    const top5ProductsLabels = sortedTop5Products.slice(0, 5).map(item => item.product);

    // Deklarasi Category Terbanyak
    const mostCategories = filteredData.reduce((acc, curr) => {
      const category = curr.Category;
      if (!acc[category]) {
        acc[category] = { category, total: 0 };
      }
      acc[category].total += curr.RQty;
      return acc;
    }, {});

    const sortedMostCategories= Object.values(mostCategories).sort((a, b) => b.total - a.total);
    const MostCategoriesRQty = sortedMostCategories.map(item => item.total);
    const MostCategoriesLabels = sortedMostCategories.map(item => item.category);

     // Deklarasi Location Dengan Penjualan Paling Banyak
     const mostLocations = filteredData.reduce((acc, curr) => {
      const location = curr.Location;
      if (!acc[location]) {
        acc[location] = { location, total: 0 };
      }
      acc[location].total += curr.RQty;
      return acc;
    }, {});

    const sortedMostLocations = Object.values(mostLocations).sort((a, b) => b.total - a.total);
    const mostLocationsRQty = sortedMostLocations.map(item => item.total);
    const mostLocationsLabels = sortedMostLocations.map(item => item.location);

    // Deklarasi Type Pembayaran Paling Banyak
    const mostTypes = filteredData.reduce((acc, curr) => {
      const type = curr.Type;
      if (!acc[type]) {
        acc[type] = { type, total: 0 };
      }
      acc[type].total += curr.RQty;
      return acc;
    }, {});

    const sortedMostTypes = Object.values(mostTypes).sort((a, b) => b.total - a.total);
    const mostTypesRQty = sortedMostTypes.map(item => item.total);
    const mostTypesLabels = sortedMostTypes.map(item => item.type);

    drawChart('myChart1', 'Jumlah Produk Terjual', top5ProductsLabels, top5ProductsRQty, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
    drawChart('myChart2', 'Jumlah Produk Terjual Dalam Category', MostCategoriesLabels, MostCategoriesRQty, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
    drawChart('myChart3', 'Jumlah Produk Terjual Dalam Location', mostLocationsLabels, mostLocationsRQty, 'rgba(255, 255, 0, 0.2)', 'rgba(255, 255, 0, 1)');
    drawChart('myChart4', 'Jumlah Pembayaran', mostTypesLabels, mostTypesRQty, 'rgba(0, 255, 0, 0.2)', 'rgba(0, 255, 0, 1)');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function drawChart(canvasId, label, labels, data, backgroundColor, borderColor) {
  const ctx = document.getElementById(canvasId).getContext('2d');

  new Chart(ctx, {
   type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y + ' (' + data[context.dataIndex] + ')';
              return label;
            }
          }
        }
      }
    }
  });
}