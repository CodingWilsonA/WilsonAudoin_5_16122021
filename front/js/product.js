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
  const search_params = new URLSearchParams(productUrl.search);
  if(!search_params.has('id') || search_params.get('id') === "" ){
    return new Error('NO_ID_PROVIDED')
  }
  return search_params.get('id')
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
      });
  }else{
    const userError = new errorObject()
    switch(idProduct.message){
    case 'NO_ID_PROVIDED': userError.setDescription('Vous n\'avez pas selectionné un identifiant de canapé correct')
    break
    }
    setProduct(userError)
  }
}

//The function below sets the product info on the page
function setProduct(displayIdProduct) {
  if(displayIdProduct instanceof errorObject){
    document.getElementsByClassName("item__content__addButton")[0].remove()
    document.getElementsByClassName("item__content__settings")[0].remove()
    document.getElementsByClassName("item__content__description__title")[0].remove()
    document.getElementsByClassName("item__content__titlePrice")[0].remove()
  }
  const productImgContainer = document.getElementsByClassName('item__img')
  const displayedProductImg = document.createElement("img")
  const displayedProductColors = document.getElementById("colors")
  const colors = displayIdProduct.colors
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
fetchProduct()

//The snippet below saves the products' details in sessionStorage
const addToCart = document.getElementById('addToCart')
addToCart.addEventListener('click', function(eventClick) {
  eventClick.preventDefault()
  eventClick.stopPropagation()
  const productTitle = document.getElementById('title').innerText
  const productQuantity = document.getElementById('quantity').value
  const productColor = document.getElementById('colors').value
  const productUnitPrice = document.getElementById('price').innerText
  const productImgUrl = document.querySelector('div.item__img > img').getAttribute('src')
  const productId = JSON.stringify(getIdFromProductUrl())
  class cartProductTemplate {
    constructor(id, title, unitPrice, imgUrl, details) {
      this.id = id
      this.title = title
      this.unitPrice = unitPrice
      this.imgUrl = imgUrl
      this.details = details
    }
  }
  //User input verification
  if (productQuantity.value < 1 || productColor.value === "") {
    //Préparer des alertes affichées directement dans le DOM
    window.alert("Une erreur s'est produite. Veuillez sélectionner une couleur et indiquer une quantité entre 1 et 100, s'il vous plait.");
    return
  }
  //Check cart content
  const cartProduct = JSON.parse(sessionStorage.getItem(productId))
  if (cartProduct === null) {
    //Create product if it doesn't exist
    const newCartProduct = new cartProductTemplate(productId, productTitle, productUnitPrice, productImgUrl, {[productColor] : productQuantity})
    sessionStorage.setItem(productId, JSON.stringify(newCartProduct))
    saveIdsToSessionStorage(productId)
    return
  }
  if (cartProduct.details[productColor]) {
    //If color exists, increment
    cartProduct.details[productColor] = Number(cartProduct.details[productColor]) + Number(productQuantity)
  } else {
    //If color doesn't exist, create color with new quantity
    cartProduct.details[productColor] = productQuantity
  }
  sessionStorage.setItem(productId, JSON.stringify(cartProduct))
})
//Lists ids into array and save it to sessionStorage
function saveIdsToSessionStorage(id) {
  let cartIds = []
  cartIds = JSON.parse(sessionStorage.getItem("cartIds")) || []
  cartIds.push(id)
  sessionStorage.setItem("cartIds", JSON.stringify(cartIds))
}