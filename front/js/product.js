class cartProductTemplate {
  constructor(id, title, unitPrice, imgUrl, details) {
    this.id = id
    this.title = title
    this.unitPrice = unitPrice
    this.imgUrl = imgUrl
    this.details = details
  }
}
class errorObject {
  constructor() {
    this.imageUrl = "../images/icons/fetch-error.png"
  }
  setDescription(newDescription){
    this.description = newDescription
  }
}

//The function below scraps Id from product URL
function getIdFromProductUrl() {
  const productUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(productUrl.search);
  if(!searchParams.has('id') || searchParams.get('id') === "" ){
    return new Error('NO_ID_PROVIDED')
  }
  return searchParams.get('id')
}

//The function below fetches the product with the scrapped ID
function fetchProduct() {
  const idProduct = getIdFromProductUrl()
  if (typeof idProduct === 'string') {
    fetch("http://localhost:3000/api/products/" + idProduct)
      .then(function(res) {
        if (!res.ok) {
          return res.text().then(function(text) {throw new Error(text)})
        } else {
          return res.json()
        }
      })
      .then(setProduct)
      .catch(function(err) {
        console.error("An error occured while fetching product info : ", err)
        const unreachableData = new errorObject()
        unreachableData.setDescription('Le site web est en maintenance. Veuillez patienter, s\'il vous plait.')
        setProduct(unreachableData)
      })
  }else{
    const userError = new errorObject()
    switch(idProduct.message){
    case 'NO_ID_PROVIDED': userError.setDescription('Vous n\'avez pas selectionné un identifiant de canapé correct.')
    break
    }
    setProduct(userError)
  }
}

//The function below sets the product info on the page
function setProduct(displayIdProduct) {
  const productImgContainer = document.getElementsByClassName('item__img')
  const displayedProductImg = document.createElement("img")
  const displayedProductColors = document.getElementById("colors")
  const colors = displayIdProduct.colors
  if(displayIdProduct instanceof errorObject){
    document.getElementsByClassName("item__content__addButton")[0].remove()
    document.getElementsByClassName("item__content__settings")[0].remove()
    document.getElementsByClassName("item__content__description__title")[0].remove()
    document.getElementsByClassName("item__content__titlePrice")[0].remove()
    displayedProductImg.setAttribute("src", displayIdProduct.imageUrl)
    productImgContainer[0].appendChild(displayedProductImg)
    document.getElementById("description").innerText = displayIdProduct.description
  } else {
    displayedProductImg.setAttribute("src", displayIdProduct.imageUrl)
    productImgContainer[0].appendChild(displayedProductImg)
    document.getElementById("title").innerText = displayIdProduct.name
    document.getElementById("price").innerText = displayIdProduct.price
    document.getElementById("description").innerText = displayIdProduct.description
    for (let i in colors) {
      const selectColor = document.createElement("option")
      selectColor.setAttribute("value", colors[i])
      selectColor.innerText = colors[i]
      displayedProductColors.appendChild(selectColor)
    }
  }
} 

//The snippet below saves the products' details in sessionStorage
function addToCartEventListener() {
  const addToCart = document.getElementById('addToCart')
  if (addToCart) {
    addToCart.addEventListener('click', function(eventClick) {
      eventClick.preventDefault()
      eventClick.stopPropagation()
      const productTitle = document.getElementById('title').innerText
      const productQuantity = document.getElementById('quantity').value
      const productColor = document.getElementById('colors').value
      const productUnitPrice = document.getElementById('price').innerText
      const productImgUrl = document.querySelector('div.item__img > img').getAttribute('src')
      const productId = JSON.stringify(getIdFromProductUrl()) 
      //User input verification
      if (productQuantity < 1 || productColor === "") {
        const productInputError = document.getElementById('userInputFeedback')
        productInputError.setAttribute("style", "color: black")
        productInputError.innerText = "Veuillez sélectionner une couleur et indiquer une quantité entre 1 et 100, s\'il vous plait."
        return
      }
      //Check cart content
      const cartProduct = JSON.parse(sessionStorage.getItem(productId))
      if (cartProduct === null) {
        //Create product if it doesn't exist
        const newCartProduct = new cartProductTemplate(productId, productTitle, productUnitPrice, productImgUrl, {[productColor] : productQuantity})
        sessionStorage.setItem(productId, JSON.stringify(newCartProduct))
        saveIdsToSessionStorage(productId)
      } else {
        if (cartProduct.details[productColor]) {
          //If color exists, increment
          cartProduct.details[productColor] = Number(cartProduct.details[productColor]) + Number(productQuantity)
        } else {
          //If color doesn't exist, create color with new quantity
          cartProduct.details[productColor] = productQuantity
        }
        sessionStorage.setItem(productId, JSON.stringify(cartProduct))
      } 
      userInputFeedback(productQuantity, productTitle, productColor)
    })
  }
}

//User cart input feedback
function userInputFeedback(productQuantity, productTitle, productColor) {
  const userInputFeedback = document.getElementById('userInputFeedback')
  userInputFeedback.setAttribute("style", "color: black")
  userInputFeedback.innerText = "Vous avez ajouté " + productQuantity + " " + productTitle + " de couleur " + productColor + " à votre panier."
}

//Lists ids into array and save it to sessionStorage
function saveIdsToSessionStorage(id) {
  let cartIds = []
  cartIds = JSON.parse(sessionStorage.getItem("cartIds")) || []
  cartIds.push(id)
  sessionStorage.setItem("cartIds", JSON.stringify(cartIds))
}

//This function initializes all of the functions above
function initialize() {
  fetchProduct()
  addToCartEventListener()
}
initialize()