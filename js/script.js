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

let mainResult;

function input() {
    if(input1.value&&input2.value&&select.value !== 'Pick currency') {
        workerTwo(select.value, input1.value, input2.value)
    }
}

function period(n, m) {
    const before = dayjs().add(n, m).format('YYYY-MM-DD')
    input1.value = before;
    input2.value = today;
    input()
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
        mainResult = result
    }
}

select.addEventListener('change', () => {
    deleteTr()
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
    let dupNode = event.target.closest('table').cloneNode(true)
    div2.appendChild(dupNode);
})


const btnClean = document.querySelector('.btn-clean')
btnClean.addEventListener('click', () => {
    div2.textContent = ''
})

/* ------------------------------------------------------------ */



let rates = document.getElementById('rates')
rates.addEventListener('click', showRates)

const navi1 = document.querySelector('.navi__one')
navi1.addEventListener('click', showRates)

const navi2 = document.querySelector('.navi__two').style.display
const navi3 = document.querySelector('.navi__three').style.display


function showRates() {
    document.querySelector('.navi__one').style.display = 'none'
    document.querySelector('.navi__two').style.display = 'none'
    document.querySelector('.navi__three').style.display = 'none'
    document.querySelector('footer').style.display = 'none'
    let display = document.getElementById('box').style.display
    if(display==='none') {
        document.getElementById('box').style.display = 'block' 
        } else {
            document.getElementById('box').style.display = 'none' 
    }
}


/* --------------------------------------------------- */   // ELEMENT
const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');


class Elementone extends HTMLElement { 

    constructor () {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        
        function getKurs() {

        fetch(`https://www.nbrb.by/api/exrates/rates/dynamics/451?startdate=${yesterday}&enddate=${today}`)
        .then((response) => response.json()) 
        .then(function aaa(json) {  
        for(let i=0; i<json.length; i++) {
        createTr(`${json[i].Date.slice(0,10)}: 1 EUR `, `${json[i].Cur_OfficialRate} BYN`)
        }
        })

        fetch(`https://www.nbrb.by/api/exrates/rates/dynamics/431?startdate=${yesterday}&enddate=${today}`)
        .then((response) => response.json()) 
        .then(function aaa(json) {  
        for( let j=0; j<json.length; j++) {
        createTr(`${json[j].Date.slice(0,10)}: 1 USD `, `${json[j].Cur_OfficialRate} BYN`)
        }
        })

        fetch(`https://www.nbrb.by/api/exrates/rates/dynamics/456?startdate=${yesterday}&enddate=${today}`)
        .then((response) => response.json()) 
        .then(function aaa(json) {  
        for( let j=0; j<json.length; j++) {
        createTr(`${json[j].Date.slice(0,10)}: 100 RUS `, `${json[j].Cur_OfficialRate} BYN`)
        }
        })
    }
    
        const divElement = document.createElement('div')
        divElement.className = 'element'

        const divElementTitle = document.createElement('div')
        divElementTitle.className = 'element__title'
        divElementTitle.innerHTML = 'CURRENCY TODAY'

        const divElementNames = document.createElement('div')
        divElementNames.className = 'element__names'

        const pElementBank = document.createElement('p')
        pElementBank.className = 'element__bank'
        pElementBank.innerHTML = 'NBRB'

        const pElementExchange = document.createElement('p')
        pElementExchange.className = 'element__exchange'
        pElementExchange.innerHTML = 'Currency Converter'

        divElementNames.appendChild(pElementBank)
        divElementNames.appendChild(pElementExchange)

        const divElementRates = document.createElement('div')
        divElementRates.className = 'element__rates'

        const divElementUsd = document.createElement('div')
        divElementUsd.className = 'element__usd'
        const spanUsdName = document.createElement('span')
        spanUsdName.className = 'usd_name'
        const spanUsdRate = document.createElement('span')
        spanUsdRate.className = 'usd_rate, blue_span'

        const divElementEur = document.createElement('div')
        divElementEur.className = 'element__eur'
        const spanEurName = document.createElement('span')
        spanEurName.className = 'eur_name'
        const spanEurRate = document.createElement('span')
        spanEurRate.className = 'eur_rate, blue_span'

        const divElementRub = document.createElement('div')
        divElementRub.className = 'element__rub'
        const spanRubName = document.createElement('span')
        spanRubName.className = 'rub_name'
        const spanRubRate = document.createElement('span')
        spanRubRate.className = 'rub_rate, blue_span'

        fetch('https://www.nbrb.by/api/exrates/rates/431')
        .then((response) => response.json())
        .then((data) => {
            spanUsdName.innerHTML = data.Cur_Scale + ' ' + data.Cur_Abbreviation
            spanUsdRate.innerHTML = data.Cur_OfficialRate;
        })

        fetch('https://www.nbrb.by/api/exrates/rates/451')
        .then((response) => response.json())
        .then((data) => {
            spanEurName.innerHTML = data.Cur_Scale + ' ' + data.Cur_Abbreviation
            spanEurRate.innerHTML = data.Cur_OfficialRate;
        })

        fetch('https://www.nbrb.by/api/exrates/rates/456')
        .then((response) => response.json())
        .then((data) => {
            spanRubName.innerHTML = data.Cur_Scale + ' ' + data.Cur_Abbreviation
            spanRubRate.innerHTML = data.Cur_OfficialRate;
        })

        divElementUsd.appendChild(spanUsdName)
        divElementUsd.appendChild(spanUsdRate)

        divElementEur.appendChild(spanEurName)
        divElementEur.appendChild(spanEurRate)
    
        divElementRub.appendChild(spanRubName)
        divElementRub.appendChild(spanRubRate)

        divElementRates.appendChild(divElementUsd)
        divElementRates.appendChild(divElementEur)
        divElementRates.appendChild(divElementRub)

        divElement.appendChild(divElementTitle)
        divElement.appendChild(divElementNames)
        divElement.appendChild(divElementRates)

        const style = document.createElement('style');

        style.textContent = `
            span {
                padding-right: 10px;
            }

            .element{
                margin-top: 10px;
                padding: 40px 0;
                width: 100%;
                height 100%;
                background-color: rgb(247, 245, 245);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .element__names {
                background-color: rgb(247, 245, 245);
                width: 60%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                margin: 20px auto;
                font-size: 15px;
            }

            .element__rates {
                width: 90%;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-size: 15px;
            }

            .blue_span {
                color: #4285f4;
                font-weight: bold;
            }
            
            .blue_span::after {
                content: ' BYN';
                color: #616161;
                font-weight: 400;
            }
                

        `
        shadow.appendChild(style)
        shadow.appendChild(divElement)
    }
    }

    customElements.define("element-one", Elementone);