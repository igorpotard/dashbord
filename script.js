const apiToken = "08b3667cfb1873642e48180259ae8df04003facf";
const apiUrl = "https://alchad-sandbox.pipedrive.com/api/v1/deals?api_token=" + apiToken;

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const deals = data.data;
        console.log('Deals:', deals); // Vérifiez les données récupérées
        processDeals(deals);
    })
    .catch(error => console.error('Erreur:', error));

function processDeals(deals) {
    const salesData = {};
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - 30));

    deals.forEach(deal => {
        const wonTime = new Date(deal.won_time);
        if (wonTime >= startDate) {
            const date = wonTime.toISOString().split('T')[0];
            if (!salesData[date]) {
                salesData[date] = 0;
            }
            salesData[date] += deal.value;
        }
    });

    const labels = Object.keys(salesData).sort();
    const data = labels.map(date => salesData[date]);

    console.log('Labels:', labels); // Vérifiez les labels
    console.log('Data:', data); // Vérifiez les données traitées

    createChart(labels, data);
}

function createChart(labels, data) {
    const ctx = document.getElementById('line-chart').getContext('2d');
    console.log('Canvas context:', ctx); // Vérifiez le contexte du canvas
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Montant des ventes',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
