fetch('https://www.nbrb.by/api/refinancingrate')
.then(response => response.json())
.then(postMessage)