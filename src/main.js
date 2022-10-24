import "./css/index.css"
import IMask from "imask"

//seleciona a cor do cartão
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
const background = document.querySelector(".cc")

function setCardType(type) {
  const colors = {
    visa: {
      background: "url('./visa.svg')",
    },
    mastercard: {
      background: "url('./mastercard.svg')",
    },
    elo: {
      background: "url('./elo.svg')",
    },
    default: {
      background: "url('./cc-default.svg')",
    },
  }

  background.style.backgroundImage = colors[type].background
  ccLogo.setAttribute("src", `./cc-${type}.svg`)
}

/*

*/

globalThis.setCardType = setCardType

//criar mascara para os inputs

const cvc = document.getElementById("security-code")
const cvcParttern = {
  mask: "0000",
}

const cvcMasked = IMask(cvc, cvcParttern)

const expirationDate = document.getElementById("expiration-date")
const expirationDatePartern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePartern)

const cardNumber = document.getElementById("card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^6\d{0,15}/,
      cardtype: "elo",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^606282|^3841(?:[0|4|6]{1})0/,
      cardtype: "hipercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.getElementById("add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.getElementById("card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

cvcMasked.on("accept", () => {
  uptadeCvc(cvcMasked.value)
})

function uptadeCvc(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  uptadeCardNumber(cardNumberMasked.value)
})

function uptadeCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  uptadeExpirationDate(expirationDateMasked.value)
})

function uptadeExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "12/32" : date
}
