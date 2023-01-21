var ctx = document.getElementById('lineChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Demandes',
            data: [8, 7, 10, 15, 9, 8, 13, 14, 11, 6, 10, 16],
            backgroundColor: [
                'rgba(85,85,85, 1)'

            ],
            borderColor: '#299ADD',

            borderWidth: 1
        }]
    },
    options: {
        responsive: true
    }
});