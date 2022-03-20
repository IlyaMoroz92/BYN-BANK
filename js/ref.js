const today = dayjs().format('YYYY-MM-DD');


const div = document.querySelector('.tb');
const div2 = document.querySelector('.tb2');

const input1 = document.querySelector('.input1')
const input2 = document.querySelector('.input2')

const week = document.querySelector('.week')
const month = document.querySelector('.month')
const quarter = document.querySelector('.quarter')
const year = document.querySelector('.year')


const worker3 = new Worker('/js/worker3.js')



week.addEventListener('click', () => period(-1, `week`))
month.addEventListener('click', () => period(-1, `month`))
quarter.addEventListener('click', () => period(-3, `month`))
year.addEventListener('click', () => period(-1, `year`))


/* input1.addEventListener('change', input)
input2.addEventListener('change', input) */

const chartDiv2 = document.getElementById('chart_div2')

let mainResult;



function period(n, m) {
    const before = dayjs().add(n, m).format('YYYY-MM-DD')
    input1.value = before;
    input2.value = today;
    input()
}

/* function input() {
    if(input1.value&&input2.value) {
        workerThree(select.value, input1.value, input2.value)
    }
}

function workerThree(idCur, start, end) {
    deleteTr()
    worker3.postMessage({
        name: idCur,
        dataStart: start,
        dataEnd: end
    });
}
 */
/* const mapping = {
    currentRefRate: (payload2) => {
        result = payload2.map(
            ({
                Date,
                Value,  
            }) => {
                return {
                    Date,
                    Value,
                };
            });
        console.log(result)

        mainResult = result
    }
} */

function createTr (el1, el2) {
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    td1.className = 'td1'
    td2.className = 'td2'
    td1.innerText = el1;
    td2.innerText = el2;
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
    div.appendChild(table);
    document.querySelector('.p-clean').style.display = 'flex'
}


let arr = []
worker3.addEventListener("message", ({ data }) => {
    
    data.forEach((el) =>
    arr.push({
      Date: el.Date,
      Value: el.Value,
    }))
    input1.min = arr[0].Date.slice(0, 10);
    input1.value = arr[0].Date.slice(0, 10);
    input1.max = today;
    input2.min = arr[0].Date.slice(0, 10);
    input2.max = today;
    input2.value = today;
    
    arr.forEach((json) => {
        createTr(`${json.Date.slice(0,10)} `, `  ${json.Value}  ` + ` %`)
        });
    /* createChart(arr) */
});


div.addEventListener('click', (event) => {
    div2.style.display = 'block'
    let dupNode = event.target.closest('table').cloneNode(true)
    div2.appendChild(dupNode);
})


const btnClean = document.querySelector('.btn-clean')
btnClean.addEventListener('click', () => {
    div2.textContent = ''
})



/* function createChart() {
    chartDiv2.style = 'block'
    chartDiv2.innerHTML = '';
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawChart);
}



google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);
 */


/* function drawChart() {
    const data = new google.visualization.DataTable();
    data.addColumn('Date', 'X');
    data.addColumn('number', 'Value');
    for(i = 0; i < arr.length-1; i++) {
        arr[i].DateEnd = arr[i+1].Date;
    }
    data.addColumn('datetime', 'X');
    data.addColumn('number', 'Rate');
    data.addRows(arr);
    console.log(arr)
    const options = {
        hAxis: {
        title: ''
        },
        vAxis: {
        title: ''
        },
        backgroundColor: '#fff',
        height: 450,
    };
    const chart = new google.visualization.LineChart('chart_div2');
    chart.draw(data, options);
}
 */


/* function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Director (Year)',  'Rotten Tomatoes', 'IMDB'],
    ['Alfred Hitchcock (1935)', 8.4,         7.9],
    ['Ralph Thomas (1959)',     6.9,         6.5],
    ['Don Sharp (1978)',        6.5,         6.4],
    ['James Hawes (2008)',      4.4,         6.2]
  ]);
  console.log(arr)
  var data = google.visualization.arrayToDataTable();
  data.addColumn('Vaalue', 'X');
  data.addColumn('number', 'Date');
  data.addRows(arr);

  var options = {
    title: 'The decline of \'The 39 Steps\'',
    vAxis: {title: 'Accumulated Rating'},
    isStacked: true
  };

  var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div2'));

  chart.draw(data, options);
} */

/* drawChart() */

