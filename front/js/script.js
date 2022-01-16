//The function below displays all products img, h3 and p on the home page
function displayProducts() {
    fetch("http://localhost:3000/api/products")
        .then(function(res) {
            if (!res.ok) {
                return res.text().then(function(text) {throw new Error(text)});
            } else {
                return res.json();
            }
        })
        .then(function(value) {
                for (let i in value) {
                    const displayedProduct = document.getElementById("items");
                    const displayedProductLink = document.createElement("a");
                    const displayedProductArticle = document.createElement("article");
                    const displayedProductImg = document.createElement("img");
                    const displayedProductTitle = document.createElement("h3");
                    const displayedProductDescription = document.createElement("p");
                    displayedProductLink.setAttribute("href", "./product.html?id=" + value[i]._id);
                    displayedProductImg.setAttribute("src", value[i].imageUrl);
                    displayedProductImg.setAttribute("alt", value[i].altTxt);
                    displayedProductTitle.classList.add("productName");
                    displayedProductTitle.innerText = value[i].name;
                    displayedProductDescription.classList.add("productDescription");
                    displayedProductDescription.innerText = value[i].description;
                    displayedProduct.appendChild(displayedProductLink);
                    displayedProductLink.appendChild(displayedProductArticle);
                    displayedProductArticle.appendChild(displayedProductImg);
                    displayedProductArticle.appendChild(displayedProductTitle);
                    displayedProductArticle.appendChild(displayedProductDescription);
                }
            })
            .catch(function(err) {
                console.error("The fetch request returned the following text :",err);
                const displayedError = document.getElementById("items");
                const displayedErrorLink = document.createElement("a");
                const displayedErrorArticle = document.createElement("article");
                const displayedErrorImg = document.createElement("img");
                const displayedErrorTitle = document.createElement("h3");
                const displayedErrorDescription = document.createElement("p");
                displayedErrorLink.setAttribute("href", "#");
                displayedErrorImg.setAttribute("src", "../images/icons/fetch-error.png" );
                displayedErrorImg.setAttribute("alt", "Cette image représente un ouvrier de chantier. Elle est affichée en cas d'erreur de chargement de la page.");
                displayedErrorTitle.classList.add("productName");
                displayedErrorTitle.innerText = "Oops";
                displayedErrorDescription.classList.add("productDescription");
                displayedErrorDescription.innerText = "Nous travaillons à résoudre cette erreur.";
                displayedError.appendChild(displayedErrorLink);
                displayedErrorLink.appendChild(displayedErrorArticle);
                displayedErrorArticle.appendChild(displayedErrorImg);
                displayedErrorArticle.appendChild(displayedErrorTitle);
                displayedErrorArticle.appendChild(displayedErrorDescription);
    });
}
displayProducts();