let dropArea = document.getElementById('drop-area');

dropArea.addEventListener("dragover", event => {
    event.preventDefault();
});
    
dropArea.addEventListener("drop", event => {
    let dt = event.dataTransfer.files;
    for (let i = 0; i < dt.length; i++) {
        console.log(dt[i]);
        createRow(dt[i]);
    }
    dropArea.firstElementChild.value = "";
    event.preventDefault();
});
    
dropArea.firstElementChild.addEventListener("change", () => {
    let file = dropArea.firstElementChild.files;
    for (let i = 0; i < file.length; i++) {
        console.log(file[i]);
        createRow(file[i]);
    }
    dropArea.firstElementChild.value = "";
});
function createRow(file) {

    let formData = new FormData();
    formData.append("image", file);

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let predictions = JSON.parse(xhttp.responseText);
            let div = document.createElement("div");
            div.className = "prediction";

            for (let i = 0; i < Object.keys(predictions).length; i++) {
                predictions[Object.keys(predictions)[i]] = parseFloat(predictions[Object.keys(predictions)[i]]);
            }

            let x = document.createElement("div");
            x.style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
            x.className = "image";

            let graph = document.createElement("canvas");
            graph.getContext("2d");
            new Chart(graph, {
                // The type of chart we want to create
                type: 'bar',

                // The data for our dataset
                data: {
                    labels: Object.keys(predictions),
                    datasets: [{
                        label: file.name,
                        backgroundColor: '#2F80ED',
                        data: Object.values(predictions)
                    }]
                },

                // Configuration options go here
                options: {
                    legend: {
                        display: true
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            barPercentage: 1,
                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: "Confidence Level"
                            },
                            ticks: {
                                beginAtZero: true,
                                max: 1
                            }
                        }]
                    }
                }
            });

            div.appendChild(x);
            div.appendChild(graph);
            document.getElementsByTagName("main")[0].appendChild(div);
        }
    };
    xhttp.open("POST", "/predict", true);
    xhttp.send(formData);
}
