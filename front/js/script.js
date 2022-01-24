//The function below fetches products array
function displayProducts() {
    fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (!res.ok) {
                return res.text().then(function(text) {throw new Error(text)});
            } else {
                return res.json();
            }
        })
        .then(function(displayAllProducts) {
            setAllProducts(displayAllProducts);
        })
        .catch(function(err) {
            console.error("The fetch request returned the following text :",err);
            const errorObject = {
               errorArray : {
                _id : "#",
                imageUrl : "../images/icons/fetch-error.png",
                altTxt : "Cette image représente un ouvrier de chantier. Elle est affichée en cas d'erreur de chargement de la page.",
                name : "Oops",
                description : "Nous travaillons à résoudre cette erreur."
               } 
            };
            setAllProducts(errorObject);
        });
}

//The function below sets products' title, img and description
function setAllProducts(displayAllProducts) {
    for (let i in displayAllProducts) {
        const displayedProduct = document.getElementById("items");
        const displayedProductLink = document.createElement("a");
        const displayedProductArticle = document.createElement("article");
        const displayedProductImg = document.createElement("img");
        const displayedProductTitle = document.createElement("h3");
        const displayedProductDescription = document.createElement("p");
        displayedProductLink.setAttribute("href", "./product.html?id=" + displayAllProducts[i]._id);
        displayedProductImg.setAttribute("src", displayAllProducts[i].imageUrl);
        displayedProductImg.setAttribute("alt", displayAllProducts[i].altTxt);
        displayedProductTitle.classList.add("productName");
        displayedProductTitle.innerText = displayAllProducts[i].name;
        displayedProductDescription.classList.add("productDescription");
        displayedProductDescription.innerText = displayAllProducts[i].description;
        displayedProduct.appendChild(displayedProductLink);
        displayedProductLink.appendChild(displayedProductArticle);
        displayedProductArticle.appendChild(displayedProductImg);
        displayedProductArticle.appendChild(displayedProductTitle);
        displayedProductArticle.appendChild(displayedProductDescription);
    }
}
displayProducts();