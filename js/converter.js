const selectOne = document.querySelector('.select_one')
const selectTwo = document.querySelector('.select_two')

const resultOne = document.querySelector('.input_result_one')
const resultTwo = document.querySelector('.input_result_two')



const today = dayjs().format('YYYY-MM-DD');

let arr = {}
fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0')
  .then((response) => response.json())
  .then((data) => {
    arr = data
    data.forEach((data) => {
        let optionOne = document.createElement('option')
        optionOne.innerText = data.Cur_Name.toUpperCase();
        optionOne.value = data.Cur_ID;
        selectOne.append(optionOne)
        let optionTwo = document.createElement('option')
        optionTwo.innerText = data.Cur_Name.toUpperCase();
        optionTwo.value = data.Cur_ID;
        selectTwo.append(optionTwo)
    })
  })

console.log()

resultOne.addEventListener('change', exchangeOne)
resultTwo.addEventListener('change', exchangeTwo)
selectOne.addEventListener('change', exchangeOne)
selectTwo.addEventListener('change', exchangeTwo)

function exchangeOne() {
    const rateOne = arr.find((number) => Number(number.Cur_ID) === Number(selectOne.value))
    const rateTwo = arr.find((number) => Number(number.Cur_ID) === Number(selectTwo.value))
    resultTwo.value = (Number(resultOne.value) * (rateOne.Cur_OfficialRate / rateOne.Cur_Scale) / (rateTwo.Cur_OfficialRate / rateTwo.Cur_Scale)).toFixed(2)}

function exchangeTwo() {
    const rateOne = arr.find((number) => Number(number.Cur_ID) === Number(selectOne.value))
    const rateTwo = arr.find((number) => Number(number.Cur_ID) === Number(selectTwo.value))
    resultOne.value = (Number(resultTwo.value) * (rateTwo.Cur_OfficialRate / rateTwo.Cur_Scale) / (rateOne.Cur_OfficialRate / rateOne.Cur_Scale)).toFixed(2)}