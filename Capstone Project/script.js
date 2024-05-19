document.addEventListener('DOMContentLoaded', function() {
  fetchDataAndDrawCharts();
});

async function fetchDataAndDrawCharts() {
  try {
    const response = await fetch('./data/dataset.json');
    const data = await response.json();

    const top5Products = data.reduce((acc, curr) => {
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

    const top5Categories = data.reduce((acc, curr) => {
      const category = curr.Category;
      if (!acc[category]) {
        acc[category] = { category, total: 0 };
      }
      acc[category].total += curr.RQty;
      return acc;
    }, {});

    const sortedTop5Categories= Object.values(top5Categories).sort((a, b) => b.total - a.total);
    const top5CategoriesRQty = sortedTop5Categories.slice(0, 5).map(item => item.total);
    const top5CategoriesLabels = sortedTop5Categories.slice(0, 5).map(item => item.category);

    drawChart('myChart1', 'Top 5 Produk Terjual', top5ProductsLabels, top5ProductsRQty, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
    drawChart('myChart2', 'Top 5 Kategori Produk', top5CategoriesLabels, top5CategoriesRQty, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
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
        borderWidth: 1
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