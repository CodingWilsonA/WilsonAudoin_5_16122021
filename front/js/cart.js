/*

Change session storage tree
Regroup keys into a var

*/


//Retrieve products' ids from storage
function cartIdsList() {
    const globalProducts = []
    for (let i = 0; i < sessionStorage.length; i++) {
        globalProducts.push(sessionStorage.key(i))
    }
    return globalProducts
}

//Retrieve arrays from matching products' ids
function retrieveProductsInfo() {
    const allProductsId = cartIdsList()
    const productsInfo = []
    for (let i in allProductsId) {
        productsInfo.push(JSON.parse(sessionStorage.getItem(allProductsId[i])))
    }  
    return productsInfo
}

//Retrieve data from objects located in previously retrieved arrays
function retrieveProductsTemplates() {
    const productsTemplates = retrieveProductsInfo()
    const templatesList = []
    for (let i in productsTemplates) {
        templatesList.push(productsTemplates[i][0])
    }
    return templatesList
}

//Set cart recap
function setProductsDetails() {
    sessionStorage.removeItem("IsThisFirstTime_Log_From_LiveServer")
    const products = retrieveProductsTemplates()
    //Change vars names with ones that are contextualized
    for (let i in products) {
        for (let g in products[i].details) {
            //Needs to be optimized into an HTML template
            const productBlock = document.getElementById('cart__items')
            const productContainer = document.createElement('article')
            const productImgContainer = document.createElement('div')
            const productImg = document.createElement('img')
            const productContent = document.createElement('div')
            const productDescription = document.createElement('div')
            const productTitle = document.createElement('h2')
            const productColor = document.createElement('p')
            const productPrice = document.createElement('p')
            const productSettings = document.createElement('div')
            const productQuantityContainer = document.createElement('div')
            const productQuantity = document.createElement('p')
            const quantityInput = document.createElement('input')
            const deleteProductContainer = document.createElement('div')
            const deleteProduct = document.createElement('p')
            productImgContainer.classList.add('cart__item__img')
            productContainer.classList.add('cart__item')
            productContent.classList.add('cart__item__content')
            productDescription.classList.add('cart__item__content__description')
            productSettings.classList.add('cart__item__content__settings')
            productQuantityContainer.classList.add('cart__item__content__settings__quantity')
            quantityInput.classList.add('itemQuantity')
            deleteProductContainer.classList.add('cart__item__content__settings__delete')
            deleteProduct.classList.add('deleteItem')
            productImg.setAttribute('src', products[i].imgUrl)
            productContainer.setAttribute('data-id', JSON.parse(products[i].id))
            productContainer.setAttribute('data-color', g)
            quantityInput.setAttribute('type', 'number')
            quantityInput.setAttribute('name', 'itemQuantity')
            quantityInput.setAttribute('min', 1)
            quantityInput.setAttribute('max', 100)
            quantityInput.setAttribute('value', products[i].details[g])
            productTitle.innerText = products[i].title
            productColor.innerText = "Couleur : " + g
            productPrice.innerText = "Prix unitaire de ce produit : " + products[i].unitPrice + "€"
            productQuantity.innerText = "Qté : "
            deleteProduct.innerText = "Supprimer"
            productBlock.appendChild(productContainer)
            productContainer.appendChild(productImgContainer)
            productContainer.appendChild(productContent)
            productImgContainer.appendChild(productImg)
            productContent.appendChild(productDescription)
            productContent.appendChild(productSettings)
            productDescription.appendChild(productTitle)
            productDescription.appendChild(productColor)
            productDescription.appendChild(productPrice)
            productSettings.appendChild(productQuantityContainer)
            productSettings.appendChild(deleteProductContainer)
            productQuantityContainer.appendChild(productQuantity)
            productQuantityContainer.appendChild(quantityInput)
            deleteProductContainer.appendChild(deleteProduct)
        }
        
    }
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
        console.log(quantityValues[i].value)
        if (modifiedCartProduct[0].details[modifiedProductDetails.color]) {
            modifiedCartProduct[0].details[modifiedProductDetails.color] = quantityValues[i].value
        }
        sessionStorage.setItem(modifiedProductDetails.id, JSON.stringify(modifiedCartProduct))
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
        if (deletedCartProduct[0].details[modifiedProductDetails.color]) {
            delete deletedCartProduct[0].details[modifiedProductDetails.color]
            sessionStorage.setItem(modifiedProductDetails.id, JSON.stringify(deletedCartProduct))
        }
        if (Object.keys(deletedCartProduct[0].details).length === 0) {
            sessionStorage.removeItem(modifiedProductDetails.id)
            console.log(deletedCartProduct[0].details)
        }
        deleteProduct[i].closest('article').remove()
    })
}

function totals() {
    sessionStorage.removeItem("IsThisFirstTime_Log_From_LiveServer")
    const totalProducts = retrieveProductsTemplates()
    for (let i in totalProducts) {
        for (let g in totalProducts[i].details) {
            const productTotalQuantity = document.getElementById('totalQuantity')
            const productTotalPrice = document.getElementById('totalPrice')
            
            const productSum = totalProducts[i].details[g].reduce(add, 0)
            function add(accumulator, a) {
                return accumulator + a
            }
            console.log(productSum)
            /*const productImgContainer = document.createElement('div')
            const productImg = document.createElement('img')
            const productContent = document.createElement('div')
            const productDescription = document.createElement('div')
            const productTitle = document.createElement('h2')
            const productColor = document.createElement('p')
            const productPrice = document.createElement('p')
            const productSettings = document.createElement('div')
            const productQuantityContainer = document.createElement('div')
            const productQuantity = document.createElement('p')
            const quantityInput = document.createElement('input')
            const deleteProductContainer = document.createElement('div')
            const deleteProduct = document.createElement('p')
            productImgContainer.classList.add('cart__item__img')
            productContainer.classList.add('cart__item')
            productContent.classList.add('cart__item__content')
            productDescription.classList.add('cart__item__content__description')
            productSettings.classList.add('cart__item__content__settings')
            productQuantityContainer.classList.add('cart__item__content__settings__quantity')
            quantityInput.classList.add('itemQuantity')
            deleteProductContainer.classList.add('cart__item__content__settings__delete')
            deleteProduct.classList.add('deleteItem')
            productImg.setAttribute('src', products[i].imgUrl)
            productContainer.setAttribute('data-id', JSON.parse(products[i].id))
            productContainer.setAttribute('data-color', g)
            quantityInput.setAttribute('type', 'number')
            quantityInput.setAttribute('name', 'itemQuantity')
            quantityInput.setAttribute('min', 1)
            quantityInput.setAttribute('max', 100)
            quantityInput.setAttribute('value', products[i].details[g])
            productTitle.innerText = products[i].title
            productColor.innerText = "Couleur : " + g
            productPrice.innerText = "Prix unitaire de ce produit : " + products[i].unitPrice + "€"
            productQuantity.innerText = "Qté : "
            deleteProduct.innerText = "Supprimer"
            productBlock.appendChild(productContainer)
            productContainer.appendChild(productImgContainer)
            productContainer.appendChild(productContent)
            productImgContainer.appendChild(productImg)
            productContent.appendChild(productDescription)
            productContent.appendChild(productSettings)
            productDescription.appendChild(productTitle)
            productDescription.appendChild(productColor)
            productDescription.appendChild(productPrice)
            productSettings.appendChild(productQuantityContainer)
            productSettings.appendChild(deleteProductContainer)
            productQuantityContainer.appendChild(productQuantity)
            productQuantityContainer.appendChild(quantityInput)
            deleteProductContainer.appendChild(deleteProduct)*/
        }
        
    }
    return totalProducts
}

