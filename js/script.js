const today = dayjs().format('YYYY-MM-DD');

const input1 = document.querySelector('.input1')
const input2 = document.querySelector('.input2')
const select = document.querySelector('select')

const week = document.querySelector('.week')
const month = document.querySelector('.month')
const quarter = document.querySelector('.quarter')
const year = document.querySelector('.year')

week.addEventListener('click', () => period(-1, `week`))
month.addEventListener('click', () => period(-1, `month`))
quarter.addEventListener('click', () => period(-3, `month`))
year.addEventListener('click', () => period(-1, `year`))
select.addEventListener('change', deleteTr)

input1.addEventListener('change', input)
input2.addEventListener('change', input)

const chartDiv = document.getElementById('chart_div')

function period(n, m) {
    const before = dayjs().add(n, m).format('YYYY-MM-DD')
    input1.value = before;
    input2.value = today;
    input()
}

function input() {
    if(input1.value&&input2.value&&select.value !== 'Pick currency') {
        workerTwo(select.value, input1.value, input2.value)
    }
}

const worker = new Worker('/js/worker.js')

const mapping = {
    currentRate: (payload) => {
        result = payload.map(
            ({
                Cur_ID,
                Cur_Name_Eng,
                Cur_DateStart,
                Cur_DateEnd,
                Cur_QuotName,
                Cur_Scale,
                Cur_Abbreviation
            }) => {
                return {
                    Cur_ID,
                    Cur_Name_Eng,
                    Cur_DateStart,
                    Cur_DateEnd,
                    Cur_QuotName,
                    Cur_Scale,
                    Cur_Abbreviation
                };
            });
        result.forEach(el => {
            if(parseInt(el.Cur_DateEnd) > today.slice(0,4)){
        let option = document.createElement('option')
        option.innerText = el.Cur_Name_Eng.toUpperCase();
        option.value = el.Cur_ID;
        select.append(option);}
        })
    }
}

select.addEventListener('change', () => {
    deleteTr()
    if(select.value !== 'Pick currency') {
        const el = result.filter((el) => {
            return el.Cur_ID == select.value
        })[0];
        input1.min = el.Cur_DateStart.slice(0,10)
        input1.max = el.Cur_DateEnd.slice(0,10)
        input2.min = el.Cur_DateStart.slice(0,10)
        input2.max = el.Cur_DateEnd.slice(0,10)
        count = el.Cur_Scale
        abb = el.Cur_Abbreviation
        workerTwo(el.Cur_ID, el.Cur_DateStart, el.Cur_DateEnd)
    }
})



worker.addEventListener('message', ({data}) => {
    mapping[data.msg](data.payload);
});

const worker2 = new Worker('/js/worker2.js')

function workerTwo(idCur, start, end) {
    deleteTr()
    worker2.postMessage({
        id: idCur,
        dataStart: start,
        dataEnd: end
    });
}

worker2.addEventListener('message', ({data}) => {
    workerData({data}.data)
})

const div = document.querySelector('.tb');

function workerData(el) {
    let rateArr = el;
    div.style.display = 'block';
    if(rateArr.length === 0) {
        div.innerHTML = "API doesn't provide data";
        chartDiv.innerHTML = '';
        div.style.color = 'red';
    } else {
    div.style.color = 'inherit'
    rateArr.forEach((json) => {
    createTr(`${json.Date.slice(0,10)} `, ` ${count} ` + ` ${abb} ` + `  ${json.Cur_OfficialRate}  ` + ` BYN`)
    })
    arrCurs = [];
    rateArr.forEach(el => arrCurs.push([new Date(el.Date), el.Cur_OfficialRate]))
    createChart()
    }
}

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

function deleteTr() {
    const div = document.querySelector('.tb');
    div.textContent = '';
}

function createChart() {
    chartDiv.style = 'block'
    chartDiv.innerHTML = '';
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawBackgroundColor);
}

function drawBackgroundColor() {
    const data = new google.visualization.DataTable();
    data.addColumn('datetime', 'X');
    data.addColumn('number', 'Rate');
    data.addRows(arrCurs);
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
    const chart = new google.visualization.LineChart(chartDiv);
    chart.draw(data, options);
}

const div2 = document.querySelector('.tb2');

div.addEventListener('click', (event) => {
    if(div.textContent !== "API doesn't provide data") {
    let dupNode = event.target.closest('table').cloneNode(true)
    div2.appendChild(dupNode);
    }
})


const btnClean = document.querySelector('.btn-clean')
btnClean.addEventListener('click', () => {
    div2.textContent = ''
})




