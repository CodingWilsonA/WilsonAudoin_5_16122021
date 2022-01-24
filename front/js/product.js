//The function below scraps Id from product URL
//Add incorrect or null ID error feedback and remove the unnecessary const
function getIdFromProductUrl() {
  const whatProductUrl = window.location.href;
  const productUrl = new URL(whatProductUrl);
  const search_params = new URLSearchParams(productUrl.search);
  if(search_params.has('id')) {
    let productId = search_params.get('id');
    return productId;
  }
}

//The function below fetches the product with the scrapped ID
//Update the function below with a string type verification for getIdFromProductUrl
function fetchProduct() {
  fetch("http://localhost:3000/api/products/" + getIdFromProductUrl())
    .then(function(res) {
      if (!res.ok) {
        return res.text().then(function(text) {throw new Error(text)});
      } else {
        return res.json();
      }
    })
    .then(function(displayIdProduct) {
      setProduct(displayIdProduct);
    })
    .catch(function(err) {
      console.error("An error occured while fetching product info : ", err);
      const errorObject = {
        imageUrl : "../images/icons/fetch-error.png",
        name : "Indisponible",
        price : "N.A",
        title : "Oops",
        description : "Ce produit est actuellement indisponible",
        colors : "Indisponible" 
      }
      setProduct(errorObject);
    });
}

//The function below sets the product info on the page
function setProduct(displayIdProduct) {
  const productImgContainer = document.getElementsByClassName('item__img');
  const displayedProductImg = document.createElement("img");
  const displayedProductColors = document.getElementById("colors");
  const colors = displayIdProduct.colors;
  displayedProductImg.setAttribute("src", displayIdProduct.imageUrl);
  productImgContainer[0].appendChild(displayedProductImg);
  document.getElementById("title").innerText = displayIdProduct.name;
  document.getElementById("price").innerText = displayIdProduct.price;
  document.getElementById("description").innerText = displayIdProduct.description;
  for (let i in colors) {
    const selectColor = document.createElement("option");
    selectColor.setAttribute("value", colors[i]);
    selectColor.innerText = colors[i];
    displayedProductColors.appendChild(selectColor);
  }
} 
fetchProduct();