fetch("/views/templates/menu.html")
    .then(response => response.text())
    .then(data => document.getElementById("menu").innerHTML = data);

// Carregar o rodapé fixo
fetch("/views/templates/footer.html")
    .then(response => response.text())
    .then(data => document.getElementById("footer").innerHTML = data);

fetch("/views/home.html")
    .then(response => response.text())
    .then(data => document.getElementById("home").innerHTML = data);
