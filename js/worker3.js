/* fetch('https://www.nbrb.by/api/refinancingrate')
.then(response => response.json())
.then(payload2 => ({
        msg: 'currentRefRate',
        payload2,
    })
)
.then(postMessage) */


fetch('https://www.nbrb.by/api/refinancingrate')
.then(response => response.json())
.then(postMessage)