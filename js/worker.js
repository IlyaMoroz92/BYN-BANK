fetch('https://www.nbrb.by/api/exrates/currencies')
    .then(response => response.json())
    .then(payload => ({
            msg: 'currentRate',
            payload,
        })
    )
    .then(postMessage)


    const mapping = {
        dynamics: (data) => {getRate(data)}
    }

    addEventListener('message', ({data}) => {
        if(data.msg === 'dynamics'){
            sendRate(data.arrWorker)
        }
    })

    function getRate(id, dataStart, dataEnd){
        fetch(`https://www.nbrb.by/api/exrates/rates/dynamics/${id}?startdate=${dataStart}&enddate=${dataEnd}`)
        .then(response => response.json())
        .then((data) => {
            postMessage({dynam: data})
        })
        
    }
    
    function sendRate(data) {
        getRate(data.id, data.dataStart, data.dataEnd);
    }
