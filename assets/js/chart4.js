var ctx = document.getElementById('piechart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Feminin', 'Masculin'],
        datasets: [{
            axis: 'y',
            label: 'Note moyenne',
            data: [6, 5],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'
            ],
            borderColor: '#64B5F6',
            hoverOffset: 4,

            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        indexAxis: 'y',
    }
});