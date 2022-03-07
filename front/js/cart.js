//This constant is used for product quantity modification and product deletion
const modifiedProductDetails = {
    id: null,
    color: null
}

//Retrieves cart values from ids list
function retrieveProductsInfo() {
    const allProductsId = JSON.parse(sessionStorage.getItem("cartIds"))
    const productsInfo = {}
    for (let id in allProductsId) {
        Object.assign(productsInfo, {[allProductsId[id]] : JSON.parse(sessionStorage.getItem(allProductsId[id]))})
    }
    return productsInfo
}

//Sets cart recap
function setProductsDetails() {
    if (document.getElementById('cart__items')) {
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
}

//Modifies product color quantity in storage from user input
function modifyProductQuantity() {
    const quantityValues = document.querySelectorAll('.itemQuantity')
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
}

//Removes color quantity from sessionStorage and related html element. Removes entire session storage entry if product doesn't have any color
function productDeletionEventListener() {
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
}

//Calculates products units total and total price
function totals() {
    const totalProductsQuantity = document.getElementById("totalQuantity")
    const totalProductsPrice = document.getElementById("totalPrice")
    if (totalProductsQuantity && totalProductsPrice) {
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
        totalProductsQuantity.innerText = totalUnits
        totalProductsPrice.innerText = totalPrice
    }
}

//Retrieves form inputs
function retrieveFormInputs() {
    if (document.querySelector('form')) {
        document.querySelector('form').addEventListener('submit', function(eventClick) {
            eventClick.preventDefault()
            const formRegEx = /[<>"'`]*/gm
            const userFirstName = document.getElementById('firstName').value
            const userLastName = document.getElementById('lastName').value
            const userAddress = document.getElementById('address').value
            const userCity = document.getElementById('city').value
            const userEmail = document.getElementById('email').value
            if (formRegEx.test(userFirstName) ||
            formRegEx.test(userLastName) || 
            formRegEx.test(userAddress) ||
            formRegEx.test(userCity) ||
            formRegEx.test(userEmail)) {
                console.error("One of the form fields contains a forbidden value.")
                return
            }
            const userDetails = {}
            Object.assign(userDetails, {"firstName" : userFirstName, "lastName" : userLastName, "address" : userAddress, "city" : userCity, "email" : userEmail})
            sessionStorage.setItem("userDetails", JSON.stringify(userDetails))
            requestOrderId()
        })
    }
}

//Redirects to confirmation page if promise contains order id
function requestOrderId() {
    const userInfo = JSON.parse(sessionStorage.getItem("userDetails"))
    const orderIds = JSON.parse(sessionStorage.getItem("cartIds"))
    const orderArray = []
    for (let id in orderIds) {
        orderArray.push(JSON.parse(orderIds[id]))
    }  
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({contact: userInfo, products: orderArray})
    })
    .then(function(res) {
        return res.json()
    })
    .then(function(value) {
        window.location.href = "http://127.0.0.1:5500/front/html/confirmation.html?orderId=" + value.orderId
    })
    .catch(function(err) {
        console.log(err)
    })
}

//Sets order id on confirmation page
function setOrderId() {
    if (document.getElementById('orderId')) {
        const orderUrl = new URL(window.location.href);
        const searchParams = new URLSearchParams(orderUrl.search);
        if(searchParams.has('orderId')){
            document.getElementById('orderId').innerText = searchParams.get('orderId')
        }
        sessionStorageCleanUp()
    }
}

//Removes sessionStorage entries created by user order once order is completed
function sessionStorageCleanUp() {
    const idsToDelete = JSON.parse(sessionStorage.getItem("cartIds"))
    for (let id in idsToDelete) {
        sessionStorage.removeItem(idsToDelete[id])
    }
    sessionStorage.removeItem("cartIds")
    sessionStorage.removeItem("userDetails")
}

//This function initializes all of the functions above
function initialize() {
    setProductsDetails()
    modifyProductQuantity()
    productDeletionEventListener()
    retrieveFormInputs()
    setOrderId()
}
initialize()