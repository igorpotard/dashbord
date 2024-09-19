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
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 29); // Inclure le jour actuel

    // Initialiser salesData avec des valeurs à 0 pour chaque jour des 30 derniers jours
    for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        salesData[dateString] = 0;
    }

    deals.forEach(deal => {
        const wonTime = new Date(deal.won_time);
        if (wonTime >= startDate) {
            const date = wonTime.toISOString().split('T')[0];
            salesData[date] += deal.value;
        }
    });

    const labels = Object.keys(salesData).sort();
    const cumulativeData = labels.map((date, index) => {
        let sum = 0;
        for (let i = Math.max(0, index - 29); i <= index; i++) {
            sum += salesData[labels[i]];
        }
        return sum;
    });

    console.log('Labels:', labels); // Vérifiez les labels
    console.log('Cumulative Data:', cumulativeData); // Vérifiez les données cumulatives

    const totalSales = cumulativeData.reduce((sum, value) => sum + value, 0);
    const contractsSigned = deals.filter(deal => new Date(deal.won_time) >= startDate).length;

    document.getElementById('total-sales').textContent = totalSales;
    document.getElementById('contracts-signed').textContent = contractsSigned;

    // Ajouter 10 jours supplémentaires pour la prévisualisation
    const previewLabels = [...labels];
    const previewData = [...cumulativeData];
    for (let i = 1; i <= 10; i++) {
        const futureDate = new Date(now);
        futureDate.setDate(futureDate.getDate() + i);
        const futureDateString = futureDate.toISOString().split('T')[0];
        previewLabels.push(futureDateString);

        // Calculer la somme des ventes des 30 jours précédents pour chaque jour de la prévisualisation
        let sum = 0;
        for (let j = Math.max(0, previewLabels.length - 30); j < previewLabels.length; j++) {
            sum += salesData[previewLabels[j]] || 0;
        }
        previewData.push(sum);
    }

    createChart(previewLabels, previewData, totalSales === 0 && contractsSigned === 0);
    populateContractsTable(deals);
}

function createChart(labels, data, isPreview) {
    const ctx = document.getElementById('line-chart').getContext('2d');
    console.log('Canvas context:', ctx); // Vérifiez le contexte du canvas
    const lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: isPreview ? 'Prévisualisation' : 'Montant des ventes',
                    data: data,
                    borderColor: isPreview ? 'rgba(192, 192, 192, 1)' : 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    borderDash: isPreview ? [5, 5] : [],
                    fill: false
                }
            ]
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

function populateContractsTable(deals) {
    const tableBody = document.getElementById('contracts-table').getElementsByTagName('tbody')[0];
    let cumulativeSales = 0;

    deals.forEach(deal => {
        const wonTime = new Date(deal.won_time);
        const date = wonTime.toISOString().split('T')[0];
        const name = deal.title;
        const value = deal.value;
        cumulativeSales += value;
        const percentage = cumulativeSales < 3000 ? 10 : 20;
        const prime = (value * percentage) / 100;

        const row = tableBody.insertRow();
        row.insertCell(0).textContent = date;
        row.insertCell(1).textContent = name;
        row.insertCell(2).textContent = value;
        row.insertCell(3).textContent = percentage;
        row.insertCell(4).textContent = prime;
    });
}
