//Retrieve products' ids from storage
function cartIdsList() {
    const globalProducts = []
    for (let i = 0; i < sessionStorage.length; i++) {
        if (sessionStorage.key(i) != "IsThisFirstTime_Log_From_LiveServer") {
            globalProducts.push(sessionStorage.key(i))
        }
    }
    return globalProducts
}

//Retrieve values
function retrieveProductsInfo() {
    const allProductsId = cartIdsList()
    const productsInfo = {}
    for (let i in allProductsId) {
        if (allProductsId[i] != "currentCart") {
            Object.assign(productsInfo, {[allProductsId[i]] : JSON.parse(sessionStorage.getItem(allProductsId[i]))})
        }
    }
    sessionStorage.setItem("currentCart", JSON.stringify(productsInfo))
    return productsInfo
}

//Set cart recap
function setProductsDetails() {
    retrieveProductsInfo()
    const products = JSON.parse(sessionStorage.currentCart)
    for (let product in products) {
        for (let productDetails in products[product].details) {
            //Needs to be optimized into an HTML template
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
        modifiedProductDetails.id = JSON.stringify(deletedProduct.getAttribute('data-id'))
        modifiedProductDetails.color = deletedProduct.getAttribute('data-color')
        const deletedCartProduct = JSON.parse(sessionStorage.getItem(modifiedProductDetails.id))
        if (deletedCartProduct.details[modifiedProductDetails.color]) {
            delete deletedCartProduct.details[modifiedProductDetails.color]
            sessionStorage.setItem(modifiedProductDetails.id, JSON.stringify(deletedCartProduct))
        }
        if (Object.keys(deletedCartProduct.details).length === 0) {
            sessionStorage.removeItem(modifiedProductDetails.id)
        }
        retrieveProductsInfo()
        totals()
        deleteProduct[i].closest('article').remove()
    })
}

function totals() {
    retrieveProductsInfo()
    const products = JSON.parse(sessionStorage.currentCart)
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