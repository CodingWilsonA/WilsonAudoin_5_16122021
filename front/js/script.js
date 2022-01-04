//The function below displays all products img, h3 and p on the home page

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
            for (let i in value) {
                const displayedProduct = document.getElementById("items");
                const displayedProductArticle = document.createElement("article");
                displayedProduct.appendChild(displayedProductArticle);
                const displayedProductImg = document.createElement("img");
                displayedProductImg.setAttribute("src", value[i].imageUrl);
                displayedProductImg.setAttribute("alt", value[i].altTxt);
                displayedProductArticle.appendChild(displayedProductImg);
                const displayedProductTitle = document.createElement("h3");
                displayedProductTitle.classList.add("productName");
                displayedProductTitle.innerText = value[i].name;
                displayedProductArticle.appendChild(displayedProductTitle);
                const displayedProductDescription = document.createElement("p");
                displayedProductDescription.classList.add("productDescription");
                displayedProductDescription.innerText = value[i].description;
                displayedProductArticle.appendChild(displayedProductDescription);
            }
    })
    .catch(function(err) {
        console.log("An error occured while fetching the product list.");
    });