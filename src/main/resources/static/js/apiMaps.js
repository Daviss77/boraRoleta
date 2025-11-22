/**
 * @fileoverview Integração com Google Maps JavaScript API e Places API.
 * Gerencia inicialização do mapa, geolocalização, busca de estabelecimentos
 * por categoria (Adegas, Pagodes, Barzinhos, Eventos) e renderização de resultados.
 * 
 * @author Equipe Bora Roleta - SENAC
 * @version 2.0
 */

/**
 * Instância do mapa Google Maps.
 * @type {google.maps.Map}
 */
let map;

/**
 * Serviço de busca de lugares (Places API).
 * @type {google.maps.places.PlacesService}
 */
let service;

/**
 * Localização atual do usuário.
 * @type {google.maps.LatLng|Object}
 */
let userLocation;

/**
 * Marcador indicando posição do usuário no mapa.
 * @type {google.maps.Marker}
 */
let userMarker;

/**
 * Array de marcadores genéricos (uso futuro).
 * @type {Array<google.maps.Marker>}
 */
let marcadores = [];

/**
 * Array de marcadores específicos para categoria "Adegas" (vermelho).
 * @type {Array<google.maps.Marker>}
 */
let marcadoresAdegas = [];

/**
 * Array de marcadores específicos para categoria "Pagodes" (verde).
 * @type {Array<google.maps.Marker>}
 */
let marcadoresPagodes = [];

/**
 * Array de marcadores específicos para categoria "Barzinhos" (azul).
 * @type {Array<google.maps.Marker>}
 */
let marcadoresBarzinhos = [];

/**
 * Array de marcadores específicos para categoria "Eventos" (amarelo).
 * @type {Array<google.maps.Marker>}
 */
let marcadoresEventos = [];

/**
 * Flag indicando se o mapa foi inicializado com sucesso.
 * @type {boolean}
 */
let mapaInicializado = false;

/**
 * Módulo responsável por inicializar o mapa e gerenciar estado básico.
 * Implementado como IIFE (Immediately Invoked Function Expression) para encapsular lógica.
 * @namespace
 */
const MapModule = (function () {
    /**
     * Cria uma instância do Google Maps no elemento DOM especificado.
     * 
     * @param {Object} center - Coordenadas do centro inicial do mapa {lat, lng}
     * @returns {boolean} true se criado com sucesso, false caso contrário
     */
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

    /**
     * Cria ou atualiza o marcador indicando a posição do usuário no mapa.
     * Remove marcador anterior se já existir e cria um novo com animação.
     */
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

    /**
     * Inicializa o mapa com geolocalização do usuário.
     * Tenta obter posição atual via Geolocation API. 
     * Se falhar, utiliza São Paulo como localização padrão (fallback).
     * Também configura o serviço Places API para buscas.
     */
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

/**
 * Remove todos os marcadores da categoria "Adegas" do mapa.
 */
function limparMarcadoresAdegas() {
    marcadoresAdegas.forEach(marker => marker.setMap(null));
    marcadoresAdegas = [];
}

/**
 * Remove marcadores de todas as categorias do mapa (Adegas, Pagodes, Barzinhos, Eventos).
 */
function limparTodasCategorias() {
    limparMarcadoresAdegas();
    limparMarcadoresPagodes();
    limparMarcadoresBarzinhos();
    limparMarcadoresEventos();
}

/**
 * Busca estabelecimentos do tipo "Adegas" (liquor_store) próximos à localização do usuário.
 * Limpa categorias anteriores, adiciona marcadores vermelhos e ajusta zoom do mapa
 * para mostrar todos os resultados encontrados.
 */
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

/**
 * Remove todos os marcadores da categoria "Pagodes" do mapa.
 */
function limparMarcadoresPagodes() {
    marcadoresPagodes.forEach(marker => marker.setMap(null));
    marcadoresPagodes = [];
}

/**
 * Busca estabelecimentos relacionados a "Pagode" (bares e restaurantes com música ao vivo).
 * Limpa categorias anteriores, adiciona marcadores verdes e ajusta zoom do mapa.
 */
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

/**
 * Remove todos os marcadores da categoria "Barzinhos" do mapa.
 */
function limparMarcadoresBarzinhos() {
    marcadoresBarzinhos.forEach(marker => marker.setMap(null));
    marcadoresBarzinhos = [];
}

/**
 * Busca estabelecimentos do tipo "Bares" (bar) próximos à localização do usuário.
 * Limpa categorias anteriores, adiciona marcadores azuis e ajusta zoom do mapa.
 */
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

/**
 * Remove todos os marcadores da categoria "Eventos" do mapa.
 */
function limparMarcadoresEventos() {
    marcadoresEventos.forEach(marker => marker.setMap(null));
    marcadoresEventos = [];
}

/**
 * Busca estabelecimentos do tipo "Eventos" (night_club) próximos à localização do usuário.
 * Limpa categorias anteriores, adiciona marcadores amarelos e ajusta zoom do mapa.
 */
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

/**
 * Limpa todos os marcadores e resultados de pesquisa do mapa.
 * Recentra o mapa na localização do usuário com zoom padrão (15).
 * Chamado pelo botão "Limpar" na interface.
 */
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

/**
 * Tenta inicializar o mapa verificando se DOM e Google Maps API estão prontos.
 * Garante que mapModule.init() só seja chamado quando condições estiverem satisfeitas.
 */
function tentarInicializarMapa() {
    if (mapaInicializado) return;

    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    if (!window.google || !google.maps) return;

    MapModule.init();
}

// Tenta inicializar o mais cedo possível (imediatamente após script carregar)
tentarInicializarMapa();

/**
 * Mecanismo de polling para garantir inicialização do mapa.
 * Verifica a cada 150ms por até 3 segundos se o mapa pode ser inicializado.
 * Isso lida com casos onde o DOM ou a API do Google Maps demoram para carregar.
 */
document.addEventListener("DOMContentLoaded", function () {
    const start = Date.now();
    const interval = setInterval(() => {
        tentarInicializarMapa();
        if (mapaInicializado || Date.now() - start > 3000) {
            clearInterval(interval);
        }
    }, 150);
});