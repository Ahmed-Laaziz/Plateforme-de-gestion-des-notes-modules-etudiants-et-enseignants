var ctx2 = document.getElementById('doughnut').getContext('2d');
var myChart2 = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: ['Academic', 'Non-Academic', 'Administration', 'Others'],

        datasets: [{
            label: 'Employees',
            data: [42, 12, 8, 6],
            backgroundColor: [
                '#651FFF',
                'rgba(54, 162, 235, 1)',
                '#B3E5FC',
                '#CFD8DC'

            ],
            borderColor: [
                '#651FFF',
                'rgba(54, 162, 235, 1)',
                '#B3E5FC',
                '#CFD8DC'

            ],
            hoverOffset: 4,
            borderWidth: 1
        }]

    },
    options: {
        responsive: true
    }
});