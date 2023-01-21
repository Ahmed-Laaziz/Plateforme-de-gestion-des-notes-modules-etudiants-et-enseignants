var ctx = document.getElementById('barchart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['2IT1', '2ITE2', 'ISIC1', 'ISI2'],
        datasets: [{
            axis: 'y',
            label: 'Note moyenne',
            data: [12.34, 13.01, 12.73, 13.24],
            backgroundColor: [
                '#64B5F6',
                '#1565C0',
                '#64B5F6',
                '#1565C0',

            ],
            borderColor: '#64B5F6',

            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        indexAxis: 'y',
    }
});