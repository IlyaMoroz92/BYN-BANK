class Elementone extends HTMLElement { 

    constructor () {
        super();
        const shadow = this.attachShadow({mode: 'open'});
    
        const divElement = document.createElement('div')
        divElement.className = 'element'

        const divElementTitle = document.createElement('div')
        divElementTitle.className = 'element__title'
        divElementTitle.innerHTML = 'CURRENCY TODAY'

        const divElementNames = document.createElement('div')
        divElementNames.className = 'element__names'

        const divElementImgUsd = document.createElement('div');
        divElementImgUsd.className = 'divImgAll';
        const imgUsd = document.createElement('img');
        imgUsd.className = 'imgAll';
        imgUsd.src = "/img/icons8-сша-96.png"
        divElementImgUsd.appendChild(imgUsd)
        
        const divElementImgEur = document.createElement('div');
        divElementImgEur.className = 'divImgAll';
        const imgEur = document.createElement('img');
        imgEur.className = 'imgAll';
        imgEur.src = "/img/icons8-евро-96.png"
        divElementImgEur.appendChild(imgEur)

        const divElementImgRub = document.createElement('div');
        divElementImgRub.className = 'divImgAll';
        const imgRub = document.createElement('img');
        imgRub.className = 'imgAll';
        imgRub.src = "/img/icons8-российская-федерация-96.png";
        divElementImgRub.appendChild(imgRub);


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

        divElementUsd.appendChild(divElementImgUsd)
        divElementUsd.appendChild(spanUsdName)
        divElementUsd.appendChild(spanUsdRate)

        divElementEur.appendChild(divElementImgEur)
        divElementEur.appendChild(spanEurName)
        divElementEur.appendChild(spanEurRate)
    
        divElementRub.appendChild(divElementImgRub)
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

            .imgAll {
                width: 40px
            }

            .divImgAll {
                margin-bottom: 10px;
                text-align: center
            }

            span {
                padding-right: 10px;
            }

            .element{
                padding: 45px 0;
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
                margin: 10px auto;
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

        `
        shadow.appendChild(style)
        shadow.appendChild(divElement)
    }
    }

    customElements.define("element-one", Elementone);