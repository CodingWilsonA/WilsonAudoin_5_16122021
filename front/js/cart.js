//Retrieve cart values from ids list
function retrieveProductsInfo() {
    const allProductsId = JSON.parse(sessionStorage.getItem("cartIds"))
    const productsInfo = {}
    for (let id in allProductsId) {
        Object.assign(productsInfo, {[allProductsId[id]] : JSON.parse(sessionStorage.getItem(allProductsId[id]))})
    }
    return productsInfo
}

//Set cart recap
function setProductsDetails() {
    const products = retrieveProductsInfo()
    for (let product in products) {
        for (let productDetails in products[product].details) {
            const htmlCartRecapTemplate = `
                <article class="cart__item" data-id="${JSON.parse(products[product].id)}" data-color="${productDetails}">
                    <div class="cart__item__img">
                        <img src="${products[product].imgUrl}" alt="Photographie d'un canapé">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${products[product].title}</h2>
                            <p>${productDetails}</p>
                            <p>${products[product].unitPrice} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${products[product].details[productDetails]}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>
            `
            document.getElementById('cart__items').innerHTML += htmlCartRecapTemplate
        }
        
    }
    totals()
}
setProductsDetails()

//Modifies product color quantity in storage from user input
const quantityValues = document.querySelectorAll('.itemQuantity')
const modifiedProductDetails = {
    id: null,
    color: null
}
for (let i = 0; i < quantityValues.length; i++) {
    quantityValues[i].addEventListener('change', function(eventChange) {
        eventChange.preventDefault()
        eventChange.stopPropagation()
        const modifiedProduct = quantityValues[i].closest("article")
        modifiedProductDetails.id = JSON.stringify(modifiedProduct.getAttribute('data-id'))
        modifiedProductDetails.color = modifiedProduct.getAttribute('data-color')
        const modifiedCartProduct = JSON.parse(sessionStorage.getItem(modifiedProductDetails.id))
        if (modifiedCartProduct.details[modifiedProductDetails.color]) {
            modifiedCartProduct.details[modifiedProductDetails.color] = quantityValues[i].value
        }
        sessionStorage.setItem(modifiedProductDetails.id, JSON.stringify(modifiedCartProduct))
        retrieveProductsInfo()
        totals()
    })
}

//Removes color quantity from sessionStorage and related html element. Removes entire session storage key if product doesn't have any color
const deleteProduct = document.querySelectorAll('.deleteItem')
for (let i = 0; i < deleteProduct.length; i++) {
    deleteProduct[i].addEventListener('click', function(eventClick) {
        eventClick.preventDefault()
        eventClick.stopPropagation()
        const deletedProduct = deleteProduct[i].closest('article')
        const cartIds = JSON.parse(sessionStorage.getItem("cartIds"))
        modifiedProductDetails.id = JSON.stringify(deletedProduct.getAttribute('data-id'))
        modifiedProductDetails.color = deletedProduct.getAttribute('data-color')
        const deletedCartProduct = JSON.parse(sessionStorage.getItem(modifiedProductDetails.id))
        if (deletedCartProduct.details[modifiedProductDetails.color]) {
            delete deletedCartProduct.details[modifiedProductDetails.color]
            sessionStorage.setItem(modifiedProductDetails.id, JSON.stringify(deletedCartProduct))
        }
        if (Object.keys(deletedCartProduct.details).length === 0) {
            for (let id in cartIds) {
                if (cartIds[id] === modifiedProductDetails.id) {
                    cartIds.splice(id, 1)
                }
            }
            sessionStorage.setItem("cartIds", JSON.stringify(cartIds))
            sessionStorage.removeItem(modifiedProductDetails.id)
        }
        retrieveProductsInfo()
        totals()
        if (cartIds.length === 0) {
            sessionStorage.removeItem("cartIds")
        }
        deleteProduct[i].closest('article').remove()
    })
}

//Calculates products units total and total price
function totals() {
    const products = retrieveProductsInfo()
    const productUnits = []
    const productSubPrices = []
    let totalUnits = 0
    let totalPrice = 0
    for (let product in products) {
        for (let productDetails in products[product].details) {
            productUnits.push(Number(products[product].details[productDetails]))
            productSubPrices.push(Number(products[product].details[productDetails]) * Number(products[product].unitPrice))
        }
    }
    for (let unit in productUnits) {
        totalUnits += productUnits[unit]
    }
    for (let subPrice in productSubPrices) {
        totalPrice += productSubPrices[subPrice]
    }
    const cartTotalUnits = document.getElementById("totalQuantity")
    const cartTotalPrice = document.getElementById("totalPrice")
    cartTotalUnits.innerText = totalUnits
    cartTotalPrice.innerText = totalPrice
}


function submitOrder(eventClick) {
    debugger
    eventClick.preventDefault()
    console.log(eventClick)
    //Sanitize this form input results
    const userFirstName = document.getElementById('firstName').value
    const userLastName = document.getElementById('lastName').value
    const userAddress = document.getElementById('address').value
    const userCity = document.getElementById('city').value
    const userEmail = document.getElementById('email').value
    const userDetails = {}
    Object.assign(userDetails, {"firstName" : userFirstName, "lastName" : userLastName, "address" : userAddress, "city" : userCity, "email" : userEmail})
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails))
    request()
}


function request() {
    const userInfo = JSON.parse(sessionStorage.userDetails)
    const orderIds = JSON.parse(sessionStorage.cartIds)
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"contact": userInfo, "products": orderIds})
    })
    .then(function(res) {
        if (!res.ok) {
            console.log(res)
            return res.text().then(function(text) {throw new Error(text)})
        } else {
            console.log(res)
            return res.json()
        }
    })
    .catch(function(err) {
        console.log(err)
    })
}