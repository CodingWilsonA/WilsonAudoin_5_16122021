//The function below displays the product selected by the user on the home page
function displaySelectedProduct() {
  const whatProductUrl = window.location.href;
  const productUrl = new URL(whatProductUrl);
  const search_params = new URLSearchParams(productUrl.search);
  function verifyIdThenDisplayProduct() {
    if(search_params.has('id')) {
      let productId = search_params.get('id');
      fetch("http://localhost:3000/api/products/" + productId)
        .then(function(res) {
          if (!res.ok) {
            return res.text().then(function(text) {throw new Error(text)});
          } else {
            return res.json();
          }
        })
        .then(function(displayIdProduct) {
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
        })
        .catch(function(err) {
          console.error("An error occured while fetching product info : ", err);
          const productImgContainer = document.getElementsByClassName('item__img');
          const displayedProductImg = document.createElement("img");
          const displayedProductColors = document.getElementById("colors");
          const selectColor = document.createElement("option");
          selectColor.setAttribute("value", "Indisponible");
          displayedProductImg.setAttribute("src", "../images/icons/fetch-error.png");
          productImgContainer[0].appendChild(displayedProductImg);
          document.getElementById("title").innerText = "Oops";
          document.getElementById("price").innerText = "N.A";
          document.getElementById("description").innerText = "Ce produit est actuellement indisponible";
          selectColor.innerText = "Indisponible";
          displayedProductColors.appendChild(selectColor);
      });
    }
  }
  verifyIdThenDisplayProduct();
}
displaySelectedProduct();