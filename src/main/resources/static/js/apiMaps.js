// Estado global mínimo usado pelos handlers atuais
let map;
let service;
let userLocation;
let userMarker;
let marcadores = [];
let marcadoresAdegas = [];
let marcadoresPagodes = [];
let marcadoresBarzinhos = [];
let marcadoresEventos = [];
let mapaInicializado = false;

// Módulo responsável por inicializar o mapa e manter o estado básico
const MapModule = (function () {
    function criarMapa(center) {
        const mapElement = document.getElementById("map");
        if (!mapElement || !window.google || !google.maps) {
            return false;
        }

        map = new google.maps.Map(mapElement, {
            center: center,
            zoom: 15,
            zoomControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            mapTypeControl: false
        });

        mapaInicializado = true;
        return true;
    }

    function criarMarcadorUsuario() {
        if (!map || !userLocation) return;

        // Remove marcador anterior se existir
        if (userMarker) {
            userMarker.setMap(null);
        }

        userMarker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "Você está aqui!",
            animation: google.maps.Animation.DROP
        });
    }

    function init() {
        // Tenta localizar o usuário; se falhar, não bloqueia o mapa
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const novaPosicao = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    userLocation = novaPosicao;

                    if (!map) {
                        // Ainda não existe mapa (nenhum fallback criado)
                        if (criarMapa(novaPosicao)) {
                            criarMarcadorUsuario();
                        }
                    } else {
                        // Já havia um mapa (por fallback) -> recentra e atualiza marcador
                        map.setCenter(novaPosicao);
                        criarMarcadorUsuario();
                    }
                },
                () => {
                    // Fallback simples: centro genérico
                    const fallbackCenter = { lat: -23.5505, lng: -46.6333 }; // São Paulo
                    userLocation = fallbackCenter;
                    if (!map) {
                        criarMapa(fallbackCenter);
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 1000
                }
            );
        } else {
            const fallbackCenter = { lat: -23.5505, lng: -46.6333 };
            userLocation = fallbackCenter;
            if (!map) {
                criarMapa(fallbackCenter);
            }
        }
    }

    return {
        init
    };
})();

function buscarPorCategoria(palavraChave) {
    limparResultados(); // limpa anteriores

    const request = {
        location: userLocation,
        radius: 500,
        keyword: palavraChave,
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
            document.getElementById("resultados").innerHTML = `<h2>RESULTADOS PARA: ${palavraChave}</h2>`;

            results.forEach((lugar) => {
                const marker = new google.maps.Marker({
                    position: lugar.geometry.location,
                    map: map,
                    title: lugar.name,
                });
                marcadores.push(marker);

                const div = document.createElement("div");
                div.classList.add("resultado");

                const foto = lugar.photos && lugar.photos.length > 0
                    ? lugar.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
                    : "https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel";
                const destino = lugar.geometry.location;
                const linkRota = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destino.lat()},${destino.lng()}`;

                div.innerHTML = `
          <img src="${foto}" alt="${lugar.name}" class="foto-local" onerror="this.src='https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel'">
          <h3>${lugar.name}</h3>
          <p>${lugar.vicinity || "Endereço não disponível"}</p>
          <a href="${linkRota}" target="_blank" class="botao-rota">
            <img  src="https://img.icons8.com/color/24/000000/google-maps.png" />
            Ver rota
          </a>
        `;

                document.getElementById("resultados").appendChild(div);
            });
        } else {
            document.getElementById("resultados").innerHTML = `<p>Nenhum resultado encontrado para "${palavraChave}".</p>`;
        }
    });
}

function limparMarcadoresAdegas() {
    marcadoresAdegas.forEach(marker => marker.setMap(null));
    marcadoresAdegas = [];
}

function limparTodasCategorias() {
    limparMarcadoresAdegas();
    limparMarcadoresPagodes();
    limparMarcadoresBarzinhos();
    limparMarcadoresEventos();
}

function buscarAdegas() {
    if (!map || !userLocation) {
        alert("Mapa ainda está carregando sua localização. Tente novamente em alguns segundos.");
        return;
    }

    limparTodasCategorias();

    const resultadosDiv = document.getElementById("resultados");
    if (resultadosDiv) {
        resultadosDiv.innerHTML = "<h2>RESULTADOS PARA: ADEGAS</h2>";
    }

    const request = {
        location: userLocation,
        radius: 2000,
        type: "liquor_store"
    };

    const placesService = new google.maps.places.PlacesService(map);
    placesService.nearbySearch(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            if (resultadosDiv) {
                resultadosDiv.innerHTML += "<p>Nenhuma adega encontrada nas proximidades.</p>";
            }
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userLocation);

        results.forEach((place) => {
            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            });
            marcadoresAdegas.push(marker);
            bounds.extend(place.geometry.location);

            if (!resultadosDiv) return;

            const div = document.createElement("div");
            div.classList.add("resultado");

            const foto = place.photos && place.photos.length > 0 
                ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) 
                : "https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel";
            const destino = place.geometry.location;
            const linkRota = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destino.lat()},${destino.lng()}`;

            div.innerHTML = `
                <img src="${foto}" alt="${place.name}" class="foto-local" onerror="this.src='https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel'">
                <h3>${place.name}</h3>
                <p>${place.vicinity || "Endereço não disponível"}</p>
                <a href="${linkRota}" target="_blank" class="botao-rota">
                    <img src="https://img.icons8.com/color/24/000000/google-maps.png" />
                    Ver rota
                </a>
            `;

            resultadosDiv.appendChild(div);
        });

        map.fitBounds(bounds);
    });
}

function limparMarcadoresPagodes() {
    marcadoresPagodes.forEach(marker => marker.setMap(null));
    marcadoresPagodes = [];
}

function buscarPagodes() {
    if (!map || !userLocation) {
        alert("Mapa ainda está carregando sua localização. Tente novamente em alguns segundos.");
        return;
    }

    limparTodasCategorias();

    const resultadosDiv = document.getElementById("resultados");
    if (resultadosDiv) {
        resultadosDiv.innerHTML = "<h2>RESULTADOS PARA: PAGODES</h2>";
    }

    const request = {
        location: userLocation,
        radius: 2000,
        type: "night_club",
        keyword: "pagode samba"
    };

    const placesService = new google.maps.places.PlacesService(map);
    placesService.nearbySearch(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            if (resultadosDiv) {
                resultadosDiv.innerHTML += "<p>Nenhum local de pagode encontrado nas proximidades.</p>";
            }
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userLocation);

        results.forEach((place) => {
            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            });
            marcadoresPagodes.push(marker);
            bounds.extend(place.geometry.location);

            if (!resultadosDiv) return;

            const div = document.createElement("div");
            div.classList.add("resultado");

            const foto = place.photos && place.photos.length > 0 
                ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) 
                : "https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel";
            const destino = place.geometry.location;
            const linkRota = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destino.lat()},${destino.lng()}`;

            div.innerHTML = `
                <img src="${foto}" alt="${place.name}" class="foto-local" onerror="this.src='https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel'">
                <h3>${place.name}</h3>
                <p>${place.vicinity || "Endereço não disponível"}</p>
                <a href="${linkRota}" target="_blank" class="botao-rota">
                    <img src="https://img.icons8.com/color/24/000000/google-maps.png" />
                    Ver rota
                </a>
            `;

            resultadosDiv.appendChild(div);
        });

        map.fitBounds(bounds);
    });
}

function limparMarcadoresBarzinhos() {
    marcadoresBarzinhos.forEach(marker => marker.setMap(null));
    marcadoresBarzinhos = [];
}

function buscarBarzinhos() {
    if (!map || !userLocation) {
        alert("Mapa ainda está carregando sua localização. Tente novamente em alguns segundos.");
        return;
    }

    limparTodasCategorias();

    const resultadosDiv = document.getElementById("resultados");
    if (resultadosDiv) {
        resultadosDiv.innerHTML = "<h2>RESULTADOS PARA: BARZINHOS</h2>";
    }

    const request = {
        location: userLocation,
        radius: 2000,
        type: "bar"
    };

    const placesService = new google.maps.places.PlacesService(map);
    placesService.nearbySearch(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            if (resultadosDiv) {
                resultadosDiv.innerHTML += "<p>Nenhum barzinho encontrado nas proximidades.</p>";
            }
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userLocation);

        results.forEach((place) => {
            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });
            marcadoresBarzinhos.push(marker);
            bounds.extend(place.geometry.location);

            if (!resultadosDiv) return;

            const div = document.createElement("div");
            div.classList.add("resultado");

            const foto = place.photos && place.photos.length > 0 
                ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) 
                : "https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel";
            const destino = place.geometry.location;
            const linkRota = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destino.lat()},${destino.lng()}`;

            div.innerHTML = `
                <img src="${foto}" alt="${place.name}" class="foto-local" onerror="this.src='https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel'">
                <h3>${place.name}</h3>
                <p>${place.vicinity || "Endereço não disponível"}</p>
                <a href="${linkRota}" target="_blank" class="botao-rota">
                    <img src="https://img.icons8.com/color/24/000000/google-maps.png" />
                    Ver rota
                </a>
            `;

            resultadosDiv.appendChild(div);
        });

        map.fitBounds(bounds);
    });
}

function limparMarcadoresEventos() {
    marcadoresEventos.forEach(marker => marker.setMap(null));
    marcadoresEventos = [];
}

function buscarEventos() {
    if (!map || !userLocation) {
        alert("Mapa ainda está carregando sua localização. Tente novamente em alguns segundos.");
        return;
    }

    limparTodasCategorias();

    const resultadosDiv = document.getElementById("resultados");
    if (resultadosDiv) {
        resultadosDiv.innerHTML = "<h2>RESULTADOS PARA: EVENTOS</h2>";
    }

    const request = {
        location: userLocation,
        radius: 2000,
        keyword: "festa evento balada"
    };

    const placesService = new google.maps.places.PlacesService(map);
    placesService.nearbySearch(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !results || results.length === 0) {
            if (resultadosDiv) {
                resultadosDiv.innerHTML += "<p>Nenhum evento encontrado nas proximidades.</p>";
            }
            return;
        }

        const bounds = new google.maps.LatLngBounds();
        bounds.extend(userLocation);

        results.forEach((place) => {
            const marker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
                icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            });
            marcadoresEventos.push(marker);
            bounds.extend(place.geometry.location);

            if (!resultadosDiv) return;

            const div = document.createElement("div");
            div.classList.add("resultado");

            const foto = place.photos && place.photos.length > 0 
                ? place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 }) 
                : "https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel";
            const destino = place.geometry.location;
            const linkRota = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destino.lat()},${destino.lng()}`;

            div.innerHTML = `
                <img src="${foto}" alt="${place.name}" class="foto-local" onerror="this.src='https://via.placeholder.com/400x300/a991dc/F5E85D?text=Foto+Indisponivel'">
                <h3>${place.name}</h3>
                <p>${place.vicinity || "Endereço não disponível"}</p>
                <a href="${linkRota}" target="_blank" class="botao-rota">
                    <img src="https://img.icons8.com/color/24/000000/google-maps.png" />
                    Ver rota
                </a>
            `;

            resultadosDiv.appendChild(div);
        });

        map.fitBounds(bounds);
    });
}

function limparResultados() {
    limparTodasCategorias();
    marcadores.forEach(marker => marker.setMap(null));
    marcadores = [];
    const resultados = document.getElementById("resultados");
    if (resultados) {
        resultados.innerHTML = "";
    }
    // Recentra no usuário
    if (map && userLocation) {
        map.setCenter(userLocation);
        map.setZoom(15);
    }
}

// Inicialização cuidadosa: espera DOM e API do Maps
function tentarInicializarMapa() {
    if (mapaInicializado) return;

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    if (!window.google || !google.maps) return;

    MapModule.init();
}

// Tenta inicializar o mais cedo possível
tentarInicializarMapa();

document.addEventListener("DOMContentLoaded", function () {
    const start = Date.now();
    const interval = setInterval(() => {
        tentarInicializarMapa();
        if (mapaInicializado || Date.now() - start > 3000) {
            clearInterval(interval);
        }
    }, 150);
});