document.addEventListener('DOMContentLoaded', function() {
    fetchDataAndDrawCharts();
  });
  
  async function fetchDataAndDrawCharts() {
    try {
      const response = await fetch('./data/dataset.json');
      const data = await response.json();
  
      // Sorting data based on RQty (Product Terjual) and Transaction (Total Transaksi)
      const sortedByRQty = data.sort((a, b) => b.RQty - a.RQty);
      const sortedByTransaction = data.sort((a, b) => b.Transaction - a.Transaction);
  
      // Selecting top 5 products
      const top5ProductsRQty = sortedByRQty.slice(0, 5);
      const top5ProductsTransaction = sortedByTransaction.slice(0, 5);
  
      const labels1 = top5ProductsRQty.map(item => item.Product);
      const data1 = top5ProductsRQty.map(item => item.RQty);
  
      const labels2 = top5ProductsTransaction.map(item => item.Product);
      const data2 = top5ProductsTransaction.map(item => item.Transaction);
  
      drawChart('myChart1', 'Product Terjual', labels1, data1, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)');
      drawChart('myChart2', 'Total Transaksi', labels2, data2, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
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
  