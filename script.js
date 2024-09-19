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
    let totalSales = 0;
    let contractsSigned = 0;

    deals.forEach(deal => {
        const wonTime = new Date(deal.won_time);
        if (wonTime >= startDate) {
            const date = wonTime.toISOString().split('T')[0];
            if (!salesData[date]) {
                salesData[date] = 0;
            }
            salesData[date] += deal.value;
            totalSales += deal.value;
            contractsSigned++;
        }
    });

    const labels = Object.keys(salesData).sort();
    const data = labels.map(date => salesData[date]);

    console.log('Labels:', labels); // Vérifiez les labels
    console.log('Data:', data); // Vérifiez les données traitées

    document.getElementById('total-sales').textContent = totalSales;
    document.getElementById('contracts-signed').textContent = contractsSigned;

    if (data.length === 0) {
        // Ajouter une prévisualisation si les données sont vides
        const previewLabels = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return date.toISOString().split('T')[0];
        });
        const previewData = Array(30).fill(0);

        createChart(previewLabels, previewData, true);
    } else {
        createChart(labels, data, false);
    }
}

function createChart(labels, data, isPreview) {
    const ctx = document.getElementById('line-chart').getContext('2d');
    console.log('Canvas context:', ctx); // Vérifiez le contexte du canvas
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: isPreview ? 'Prévisualisation' : 'Montant des ventes',
                data: data,
                borderColor: isPreview ? 'rgba(192, 192, 192, 1)' : 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderDash: isPreview ? [5, 5] : [],
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
