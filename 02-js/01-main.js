"use strict";

// - Sin alerta
// * - Alerta lima
// ! - Alerta roja
// ? - Alerta azul
// TODO - Alerta naranja

// Variables
let totalUsers = 0;
let datos = [];
let loading = true;
let rankingcontainerdiv = document.getElementById("ranking-container-div");
let ranking_containers = document.querySelector(".ranking-containers");
let sortedAsc = true; // Estado de orden ascendente

// Variables Historial
let totalGamesHistorial = 0;
let datosHistorial = [];
let historial_containers = document.querySelector(".historial-containers");
let historial_search_container = document.querySelector(".historial-search-container");

// Variables para ordenar
let rankingorder_nombre = document.getElementById("ranking-order-nombre");
let rankingorder_elo = document.getElementById("ranking-order-elo");
let rankingorder_ranking = document.getElementById("ranking-order-ranking");
let rankingorder_racha = document.getElementById("ranking-order-racha");
let rankingorder_victorias = document.getElementById("ranking-order-victorias");
let rankingorder_derrotas = document.getElementById("ranking-order-derrotas");
let rankingorder_winrate = document.getElementById("ranking-order-winrate");

async function cargarUsuarios() {
  try {
    // Agregar un parámetro único a la URL para evitar caché
        //const url = `https://raram.eljotita.com/rank?timestamp=${Date.now()}`;
        const url = "./03-assets/usersExample/users.txt";

    let respuestas = await fetch(url, { cache: "no-store" });
    let data = await respuestas.json();

    // Asegurarse de que los valores necesarios sean números
    data.forEach(user => {
      user.victorias = Number(user.victorias);
      user.derrotas = Number(user.derrotas);
      user.elo_raram = Number(user.elo_raram);
      user.rank = Number(user.rank);
    });

    // Ordenar los datos por ranking al cargar
    data.sort((a, b) => a.rank - b.rank);

    // Calcular winrate para cada usuario
    data.forEach(user => {
      const winrate = (user.victorias / (user.victorias + user.derrotas)) * 100;
      user.winrate = winrate;
    });

    // Actualizar los datos
    totalUsers = data.length;
    datos = data;

    // Imprimir los datos
    mostrarUsuarios(data);
    cargarHistorial();

  } catch (error) {
    console.log(error);
  }
}

// Llamar a la función para cargar los usuarios
cargarUsuarios();

function mostrarUsuarios(data) {
  // Limpiar el contenido existente del rankingcontainer
  rankingcontainerdiv.innerHTML = '';

  // Iterar sobre cada usuario y construir una cadena HTML para cada uno
  const usuariosHTML = data.map(user => {
    const totalGames = user.victorias + user.derrotas;
    return `
    <section class="ranking-container">
      <article class="ranking-container-nick article">
        <h3 class="ranking-h3">
          ${user.rank === 1 ? `<img class="ranking-img-puesto1" src="../LeagueManagerOld/03-assets/img/08-puesto1.png" alt="Puesto1" />` : ''}
          ${user.rank === 2 ? `<img class="ranking-img-puesto2" src="../LeagueManagerOld/03-assets/img/09-puesto2.png" alt="Puesto2" />` : ''}
          ${user.rank === 3 ? `<img class="ranking-img-puesto3" src="../LeagueManagerOld/03-assets/img/10-puesto3.png" alt="Puesto3" />` : ''}
          ${user.name.split('#')[0]}
        </h3>
      </article>

      <article class="ranking-container-elo article">
        <h3 class="ranking-h3">${user.elo_raram}</h3>
      </article>

      <article class="ranking-container-puesto article">
        <h3 class="ranking-h3">${user.rank}/${totalUsers}</h3>
      </article>

      <article class="ranking-container-racha article">
      <h3 class="ranking-h3" style="color: ${user.racha <= -3 ? '#e4595a' : user.racha >= 3 ? '#69d765' : '#ddd'}">
        ${user.racha}
      </h3>
      </article>

      <article class="ranking-container-victorias article">
        <h3 class="ranking-h3 ranking-h3-victorias">${user.victorias}</h3>
      </article>

      <article class="ranking-container-derrotas article">
        <h3 class="ranking-h3 ranking-h3-derrotas">${user.derrotas}</h3>
      </article>

      <article class="ranking-container-winrate article">
        ${totalGames <= 9 ? `<h3 class="ranking-h3-pocosgames">${totalGames}/10 games</h3>` :
        `<h3 class="ranking-h3" style="color: ${user.winrate <= 49 ? '#e4595a' : user.winrate === 50 ? '#e3f15b' : '#69d765'}">
            ${user.winrate.toFixed(2)}%
          </h3>`
      }
      </article>
    </section>
    `;
  });

  // Unir las cadenas HTML en una sola y asignarla a rankingcontainer.innerHTML
  rankingcontainerdiv.innerHTML = usuariosHTML.join('');
}

// Ordenar por nombre
rankingorder_nombre.addEventListener('click', () => {
  const sorted = [...datos].sort((a, b) => a.name.trim().localeCompare(b.name.trim())); // Uso trim() para eliminar los espacios
  if (!sortedAsc) sorted.reverse();
  mostrarUsuarios(sorted);
  sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

// Ordenar por elo
rankingorder_elo.addEventListener('click', () => {
  const sorted = [...datos].sort((a, b) => sortedAsc ? a.elo_raram - b.elo_raram : b.elo_raram - a.elo_raram);
  mostrarUsuarios(sorted);
  sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

// Ordenar por ranking
rankingorder_ranking.addEventListener('click', () => {
  const sorted = [...datos].sort((a, b) => sortedAsc ? a.rank - b.rank : b.rank - a.rank);
  mostrarUsuarios(sorted);
  sortedAsc = !sortedAsc; // Cambiar el estado de orden
});


// Ordenar por racha
rankingorder_racha.addEventListener('click', () => {
  const sorted = [...datos].sort((a, b) => sortedAsc ? a.racha - b.racha : b.racha - a.racha);
  mostrarUsuarios(sorted);
  sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

// Ordenar por victorias
rankingorder_victorias.addEventListener('click', () => {
  const sorted = [...datos].sort((a, b) => sortedAsc ? a.victorias - b.victorias : b.victorias - a.victorias);
  mostrarUsuarios(sorted);
  sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

// Ordenar por derrotas
rankingorder_derrotas.addEventListener('click', () => {
  const sorted = [...datos].sort((a, b) => sortedAsc ? a.derrotas - b.derrotas : b.derrotas - a.derrotas);
  mostrarUsuarios(sorted);
  sortedAsc = !sortedAsc; // Cambiar el estado de orden
});

// Ordenar por winrate
rankingorder_winrate.addEventListener('click', () => {
  const sorted = [...datos].sort((a, b) => {
    // Obtener la cantidad de partidas de a y b
    const aTotalGames = a.victorias + a.derrotas;
    const bTotalGames = b.victorias + b.derrotas;

    // Si a tiene menos de 10 partidas, asignar un valor especial bajo
    const aWinrate = aTotalGames < 10 ? -1 : a.winrate;
    // Si b tiene menos de 10 partidas, asignar un valor especial bajo
    const bWinrate = bTotalGames < 10 ? -1 : b.winrate;

    // Si ambos tienen menos de 10 partidas, ordenar por cantidad de partidas
    if (aTotalGames < 10 && bTotalGames < 10) {
      return sortedAsc ? aTotalGames - bTotalGames : bTotalGames - aTotalGames;
    }

    // Ordenar por winrate
    return sortedAsc ? aWinrate - bWinrate : bWinrate - aWinrate;
  });

  mostrarUsuarios(sorted);
  sortedAsc = !sortedAsc;
});

//! Función reload página

let body_reload_icon = document.querySelector(".body-reload-icon");

body_reload_icon.addEventListener("click", function () {
  location.reload(true);
});

//! Función yournick página

let body_yournick_icon = document.querySelector(".body-yournick-icon");
let body_yournick_container = document.querySelector(".body-yournick-container");
let body_yournick_input = document.querySelector(".body-yournick-input");
let body_yournick_button1 = document.querySelector(".body-yournick-button1");
let body_yournick_button2 = document.querySelector(".body-yournick-button2");

// Entrar a yournick
body_yournick_icon.addEventListener("click", function () {
  body_yournick_container.style.display = "flex";
  body_yournick_input.value = "";
});

// Cancelar yournick
body_yournick_button1.addEventListener("click", function () {
  body_yournick_container.style.display = "none";
});

// Confirmar yournick
body_yournick_button2.addEventListener("click", function () {
  body_yournick_container.style.display = "none";
  if (body_yournick_input.value.length > 0) {
    localStorage.setItem("yournick", body_yournick_input.value);
    marcarYournick();
  } else {
    localStorage.removeItem("yournick");
    marcarYournick();
  }
});

function marcarYournick() {
  if (localStorage.getItem("yournick")) {
    let yournick = localStorage.getItem("yournick").toLowerCase().split('#')[0]; // Convertir a minúsculas

    // Obtener todos los usuarios
    const usuarios = document.querySelectorAll(".ranking-container-nick h3");

    // Iterar sobre cada usuario
    usuarios.forEach(usuario => {
      const nombreUsuario = usuario.innerText.toLowerCase(); // Convertir a minúsculas

      // Verificar si el nombre de usuario contiene el nick
      if (nombreUsuario.includes(yournick)) {
        // Agregar clase para resaltar al nombre
        usuario.classList.add("yournick-resaltado");

        // Obtener el elemento padre (contenedor de usuario)
        const contenedorUsuario = usuario.closest(".ranking-container");

        // Resaltar el elo y ranking del mismo usuario
        const eloElement = contenedorUsuario.querySelector(".ranking-container-elo h3");
        const rankingElement = contenedorUsuario.querySelector(".ranking-container-puesto h3");

        if (eloElement) {
          eloElement.classList.add("yournick-resaltado");
        }

        if (rankingElement) {
          rankingElement.classList.add("yournick-resaltado");
        }
      } else {
        // Remover clase si no coincide
        usuario.classList.remove("yournick-resaltado");

        // Obtener el elemento padre (contenedor de usuario)
        const contenedorUsuario = usuario.closest(".ranking-container");

        // Remover resaltado del elo y ranking del mismo usuario
        const eloElement = contenedorUsuario.querySelector(".ranking-container-elo h3");
        const rankingElement = contenedorUsuario.querySelector(".ranking-container-puesto h3");

        if (eloElement) {
          eloElement.classList.remove("yournick-resaltado");
        }

        if (rankingElement) {
          rankingElement.classList.remove("yournick-resaltado");
        }
      }
    });
  } else {
    // Obtener todos los usuarios
    const usuarios = document.querySelectorAll(".ranking-container-nick h3");

    // Iterar sobre cada usuario
    usuarios.forEach(usuario => {
      usuario.classList.remove("yournick-resaltado");

      // Obtener el elemento padre (contenedor de usuario)
      const contenedorUsuario = usuario.closest(".ranking-container");

      // Remover resaltado del elo y ranking del mismo usuario
      const eloElement = contenedorUsuario.querySelector(".ranking-container-elo h3");
      const rankingElement = contenedorUsuario.querySelector(".ranking-container-puesto h3");

      if (eloElement) {
        eloElement.classList.remove("yournick-resaltado");
      }

      if (rankingElement) {
        rankingElement.classList.remove("yournick-resaltado");
      }
    });
  }
}



//! Cargar datos Historial

async function cargarHistorial() {
  try {
    let respuestas = await fetch("../03-assets/data/historial.txt", { cache: "force-cache" });
    let data = await respuestas.json();
    // Ordenar los datos por id al cargar (ID = Nº de partida)
    data.sort((a, b) => b.id - a.id);

    // Actualizar los datos
    totalGamesHistorial = data.length;
    datosHistorial = data;
    loading = false;

    // Imprimir los datos
    mostrarHistorial(data);
    marcarYournick();

  } catch (error) {
    console.log(error);
  }
}

function mostrarHistorial(data) {
  // Obtener el valor del campo de búsqueda
  const searchTerm = document.getElementById('buscador').value.trim().toLowerCase();

  // Filtrar los datos según el término de búsqueda
  const filteredData = data.filter(user => {
    // Comprobar si algún nombre de jugador contiene el término de búsqueda
    return (
      user.jugador1_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador2_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador3_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador4_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador5_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador1_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador2_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador3_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador4_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ||
      user.jugador5_rojo_name.split('#')[0].toLowerCase().includes(searchTerm)
    );
  });

  // Limpiar el contenido existente del rankingcontainer
  historial_containers.innerHTML = '';

  // Verificar si hay resultados de búsqueda
  if (filteredData.length === 0) {
    historial_containers.innerHTML = '<div class="historial-sin-resultados">Sin resultados</div>';
    return;
  }

  // Si loading es true, mostrar un spinner de carga
  if (loading) {
    rankingcontainerdiv.innerHTML = '<div class="ranking-loading"></div>';
    historial_containers.innerHTML = '<div class="ranking-loading"></div>';
    return;
  }

  // Iterar sobre cada partida filtrada y construir una cadena HTML para cada una
  const historialHTML = filteredData.map(user => {
    return `
    <div class="historial-caja">
    <div class="historial-cajita">
        <div class="historial-caja-frontal">
            <div class="historial-caja-frontal-general">
                <div class="historial-caja-frontal-ladoazul">
                    <span class="${searchTerm && user.jugador1_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador1_azul_name.split('#')[0]}</span>
                    <span class="${searchTerm && user.jugador2_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador2_azul_name.split('#')[0]}</span>
                    <span class="${searchTerm && user.jugador3_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador3_azul_name.split('#')[0]}</span>
                    <span class="${searchTerm && user.jugador4_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador4_azul_name.split('#')[0]}</span>
                    <span class="${searchTerm && user.jugador5_azul_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador5_azul_name.split('#')[0]}</span>
                </div>
                <div class="historial-caja-frontal-ladocentral">
                    <span class="historial-caja-frontal-ladocentral-span1">Partida Nº ${user.id}</span>
                    <span class="historial-caja-frontal-ladocentral-span2">Ganador: <span
                            style="color: ${user.ganador === "azul" ? '#2380e4' : '#e4595a'}">${user.ganador}</span></span>
                    <span
                        class="historial-caja-frontal-ladocentral-span3">${user.fecha1}/${user.fecha2}/${user.fecha3}
                        - ${user.fecha4}:${user.fecha5}</span>
                </div>
                <div class="historial-caja-frontal-ladorojo">
                <span class="${searchTerm && user.jugador1_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador1_rojo_name.split('#')[0]}</span>
                <span class="${searchTerm && user.jugador2_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador2_rojo_name.split('#')[0]}</span>
                <span class="${searchTerm && user.jugador3_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador3_rojo_name.split('#')[0]}</span>
                <span class="${searchTerm && user.jugador4_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador4_rojo_name.split('#')[0]}</span>
                <span class="${searchTerm && user.jugador5_rojo_name.split('#')[0].toLowerCase().includes(searchTerm) ? 'resaltado' : ''}">${user.jugador5_rojo_name.split('#')[0]}</span>
                </div>
            </div>
        </div>
        <div class="historial-caja-trasera">
            <div class="historial-caja-frontal-general">
                <div class="historial-caja-trasera-ladoazul">
                    <span>> ${user.jugador1_azul_name} | ${user.jugador1_azul_elo} elo | ${user.jugador1_azul_ranking}/${totalUsers}</span>
                    <span>> ${user.jugador2_azul_name} | ${user.jugador2_azul_elo} elo | ${user.jugador2_azul_ranking}/${totalUsers}</span>
                    <span>> ${user.jugador3_azul_name} | ${user.jugador3_azul_elo} elo | ${user.jugador3_azul_ranking}/${totalUsers}</span>
                    <span>> ${user.jugador4_azul_name} | ${user.jugador4_azul_elo} elo | ${user.jugador4_azul_ranking}/${totalUsers}</span>
                    <span>> ${user.jugador5_azul_name} | ${user.jugador5_azul_elo} elo | ${user.jugador5_azul_ranking}/${totalUsers}</span>
                    <span class="historial-span-promedioazul">> Promedio elo azul: ${user.promedioazul}</span>
                    </div>
                <div class="historial-caja-trasera-ladorojo">
                <span>> ${user.jugador1_rojo_name} | ${user.jugador1_rojo_elo} elo | ${user.jugador1_rojo_ranking}/${totalUsers}</span>
                <span>> ${user.jugador2_rojo_name} | ${user.jugador2_rojo_elo} elo | ${user.jugador2_rojo_ranking}/${totalUsers}</span>
                <span>> ${user.jugador3_rojo_name} | ${user.jugador3_rojo_elo} elo | ${user.jugador3_rojo_ranking}/${totalUsers}</span>
                <span>> ${user.jugador4_rojo_name} | ${user.jugador4_rojo_elo} elo | ${user.jugador4_rojo_ranking}/${totalUsers}</span>
                <span>> ${user.jugador5_rojo_name} | ${user.jugador5_rojo_elo} elo | ${user.jugador5_rojo_ranking}/${totalUsers}</span>
                <span class="historial-span-promediorojo">> Promedio elo rojo: ${user.promediorojo}</span>
                </div>
            </div>
        </div>
    </div>
</div>
`;
  });

  // Unir las cadenas HTML en una sola y asignarla a historial_containers.innerHTML
  historial_containers.innerHTML = historialHTML.join('');
}

// Escuchar el evento de entrada en el campo de búsqueda y volver a mostrar el historial al cambiar
document.getElementById('buscador').addEventListener('input', function () {
  mostrarHistorial(datosHistorial);
});

//! Función que página cargar al ingresar

let header_link_ranking = document.querySelector(".header-link-ranking");
let header_link_jugadores = document.querySelector(".header-link-jugadores");
let header_link_historial = document.querySelector(".header-link-historial");

if (localStorage.getItem("page") === "ranking") {
  pageRanking();
} else if (localStorage.getItem("page") === "jugadores") {
  pageJugadores();
} else if (localStorage.getItem("page") === "historial") {
  pageHistorial();
} else {
  pageRanking();
}

//! Función ir a página < Ranking >

header_link_ranking.addEventListener("click", function () {
  if (localStorage.getItem("page") !== "ranking") {
    pageRanking();
  }
});

function pageRanking() {
  localStorage.setItem("page", "ranking");
  header_link_ranking.classList.add("header-link-activo");
  header_link_jugadores.classList.remove("header-link-activo");
  header_link_historial.classList.remove("header-link-activo");
  ranking_containers.style.display = "flex";
  historial_containers.style.display = "none";
  historial_search_container.style.display = "none";
}

//! Función ir a página < Jugadores >

header_link_jugadores.addEventListener("click", function () {
  if (localStorage.getItem("page") !== "jugadores") {
    pageJugadores();
  }
});

function pageJugadores() {
  localStorage.setItem("page", "jugadores");
  header_link_jugadores.classList.add("header-link-activo");
  header_link_ranking.classList.remove("header-link-activo");
  header_link_historial.classList.remove("header-link-activo");
  ranking_containers.style.display = "none";
  historial_containers.style.display = "none";
  historial_search_container.style.display = "none";
}

//! Función ir a página < Historial >

header_link_historial.addEventListener("click", function () {
  if (localStorage.getItem("page") !== "historial") {
    pageHistorial();
  }
});

function pageHistorial() {
  localStorage.setItem("page", "historial");
  header_link_historial.classList.add("header-link-activo");
  header_link_ranking.classList.remove("header-link-activo");
  header_link_jugadores.classList.remove("header-link-activo");
  ranking_containers.style.display = "none";
  historial_containers.style.display = "flex";
  historial_search_container.style.display = "flex";
}
