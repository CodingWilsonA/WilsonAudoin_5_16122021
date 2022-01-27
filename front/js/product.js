class errorObject {
  constructor() {
    this.imageUrl = "../images/icons/fetch-error.png";
    this.name = "Indisponible";
    this.price = "N.A";
    this.title = "Oops";
    this.description = "Ce produit est actuellement indisponible";
    this.colors = "Indisponible";
  }
}

//The function below scraps Id from product URL
function getIdFromProductUrl() {
  const productUrl = new URL(window.location.href);
  const search_params = new URLSearchParams(productUrl.search);
  if (search_params.has('id')) {
    let productId = search_params.get('id');
      if (productId === "") {
        console.error("Null ID");
        const errorNullId = new errorObject();
        setProduct(errorNullId);
      } else {
        return productId;
      }
  } else {
    console.error("Id needs to be specified in url");
    const noId = new errorObject();
    setProduct(noId);
  }
}

//The function below fetches the product with the scrapped ID
function fetchProduct() {
  if (typeof getIdFromProductUrl() === 'string') {
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
        const unreachableData = new errorObject();
        setProduct(unreachableData);
      });
  } else {
    console.error("Returned promise value type should be a string");
  }
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

/*//The snippet below saves the product's ID, quantity and color in localStorage
const addToCart = document.getElementById('addToCart');
addToCart.addEventListener('click', function(eventClick) {
  eventClick.preventDefault();
  eventClick.stopPropagation();
  const productQuantity = document.getElementById('quantity');
  const productColor = document.getElementById('colors');
  debugger;
  //Utiliser l'approche de vérification des erreurs en premier
  if (productQuantity.value > 0 && productColor.value != null) {
    const productInfo = [productQuantity.value, productColor.value];
    localStorage.setItem(getIdFromProductUrl(), JSON.stringify(productInfo));
    console.log(localStorage);
  } else {
    //Préparer des alertes affichées directement dans le DOM
    window.alert("Une erreur s'est produite. Veuillez sélectionner une couleur et indiquer une quantité entre 1 et 100, s'il vous plait.");
  }
})*/