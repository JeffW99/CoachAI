function init_on_off_court(minrally,maxrally){
    var canv = document.createElement('canvas');
    canv.id = 'on_off_court_chart';
    canv.width = 800;
    canv.height = 600;
    document.getElementById("on_off_court").appendChild(canv);

    var chartRadarDOM;
    var chartRadarData;
    var chartRadarOptions;

    // Chart.defaults.global.responsive = false;
    chartRadarDOM = document.getElementById("on_off_court_chart");
    //custormized options
    chartRadarOptions = 
    {
        legend:{
            labels:{
                fontColor: 'rgba(248, 184, 82, 1)',
                fontSize: 16,
                fontStyle: "bold"
            }
        }
        // responsive:false
    };

    $.getJSON("statistics/on_off_court_sum.json", function(data) {
        // init minrally and maxrally if are undefined,null,0,NaN,empty string,false
        if (!minrally){
            minrally = d3.min(data, function(d){
                return d.rally;
            });
        }
        if (!maxrally){
            maxrally = d3.max(data, function(d){
                return d.rally;
            });
        }
        
        console.log(maxrally)
        console.log(minrally)
        
        var labels = data.map(function(e) {
            return e.balltype;
        });

        var data = data.map(function(e) {
            return e.on_off_court;
        });

        //random color generator
        color = new Array();
        for(var i = 0;i<data.length;i++){
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
            color.push('rgb(' + r + ', ' + g + ', ' + b + ')');
        }
        
        var chart = new Chart(chartRadarDOM, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    backgroundColor: color,
                    pointBorderColor: "rgba(0,0,0,0)",
                    borderColor: 'rgb(17, 16, 17)',
                    borderWidth: 1,
                    data: data
                }]
            },
            options: chartRadarOptions
        });
    });
}

function change_interval(){
    //get interval when clicking submit
    var minrally = document.getElementById("down").value;
    var maxrally = document.getElementById("up").value;
    init_on_off_court(minrally, maxrally);
    alert("HI");
}