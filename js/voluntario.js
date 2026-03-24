const header=document.querySelector("header");



const first_skill = document.querySelector(".skill:first-child");
const sk_counters = document.querySelectorAll(".counter span");
const progress_bars = document.querySelectorAll(".skills svg circle");

const ml_section = document.querySelector(".milestones");
const ml_counters = document.querySelectorAll(".number span");

const prt_section = document.querySelector(".portfolio");
const zoom_icons = document.querySelectorAll(".zoom-icon");
const modal_overlay = document.querySelector(".modal-overlay");
const images = document.querySelectorAll(".images img");
const prev_btn = document.querySelector(".prev-btn");
const next_btn = document.querySelector(".next-btn");

const links = document.querySelectorAll(".nav-link");

const toggle_btn = document.querySelector(".toggle-btn");

const hamburger = document.querySelector(".hamburger");

window.addEventListener("scroll", () => {
    activeLink();
    if (!skillsPlayed) skillsCounter();
    if (!mlPlayed) mlCounter();
});

function updateCount(num, maxNum){
    let currentNum= +num.innerText;
    

    if(currentNum < maxNum){
        num.innerText= currentNum + 1;
        setTimeout(()=>{
            updateCount(num, maxNum);
        },12);
    }
}


/*----------------- Sticky Navbar --------------------*/

function stickyNavbar(){
    header.classList.toggle("scrolled", window.pageYOffset >0);
}

stickyNavbar();

window.addEventListener("scroll",stickyNavbar);







/* ----------------- Change active link on scroll --------------------* */

function activeLink(){
    let sections = document.querySelectorAll("section[id]");
    let passedSections = Array.from(sections).map((sct,i)=>{
        return { 
            y:sct.getBoundingClientRect().top - header.offsetHeight,
          id:i,};
    }).filter(sct => sct.y <= 0);

    let currSectionID = passedSections.at(-1).id;

    links.forEach((l)=> l.classList.remove("active"));
    links[currSectionID].classList.add("active");      
} 
 
activeLink();

/*----------------- Change Page Theme --------------------*/

let firstTheme = localStorage.getItem("dark");

changeTheme(+firstTheme);

function changeTheme (isDark){
    if(isDark){
        document.body.classList.add("dark");
        toggle_btn.classList.replace("uil-moon","uil-sun");
        localStorage.setItem("dark", 1);
    }
    else{
        document.body.classList.remove("dark");
        toggle_btn.classList.replace("uil-sun","uil-moon");
        localStorage.setItem("dark", 0);
    }
}  

toggle_btn.addEventListener("click", ()=>{
    changeTheme(!document.body.classList.contains("dark"));
});

/*----------------- Open & Cloes Navbar Menu --------------------*/

hamburger.addEventListener("click", () =>{
    document.body.classList.toggle("open");
    document.body.classList.toggle("stopScrolling");
});

links.forEach(link =>
 link.addEventListener("click", () =>{
    document.body.classList.remove("open");
    document.body.classList.remove("stopScrolling");
})
);



const volunteerResources = [
  {
    title: "Reunión general de voluntarios",
    description: "Accede al enlace de la reunión de coordinación general con el equipo organizador.",
    date: "25 de abril, 7:00 p. m.",
    type: "Reunión",
    tag: "Meet",
    url: "https://meet.google.com/",
    icon: "uil-video"
  },
  {
    title: "Cronograma y base de trabajo",
    description: "Consulta el archivo con las actividades, responsables y fechas importantes del voluntariado.",
    date: "Actualizado el 22 de abril",
    type: "Documento",
    tag: "Excel / Drive",
    url: "https://docs.google.com/",
    icon: "uil-file-alt"
  },
  {
    title: "Material gráfico para difusión",
    description: "Descarga imágenes y piezas gráficas oficiales para compartir en redes y grupos.",
    date: "Disponible",
    type: "Difusión",
    tag: "Imágenes",
    url: "https://drive.google.com/",
    icon: "uil-image"
  },
  {
    title: "Publicaciones sugeridas",
    description: "Encuentra copys, textos y referencias para apoyar la difusión del evento.",
    date: "Nueva versión",
    type: "Contenido",
    tag: "Redes sociales",
    url: "https://www.notion.so/",
    icon: "uil-edit"
  },
  {
    title: "Directorio de coordinación",
    description: "Revisa los enlaces clave de comunicación y organización del equipo de voluntarios.",
    date: "Acceso interno",
    type: "Coordinación",
    tag: "Enlaces útiles",
    url: "https://linktr.ee/",
    icon: "uil-link"
  },
  {
    title: "Galería de recursos",
    description: "Espacio con fotografías, materiales visuales y contenidos compartidos por el equipo.",
    date: "Última carga reciente",
    type: "Galería",
    tag: "Drive",
    url: "https://drive.google.com/",
    icon: "uil-camera"
  }
];

function renderVolunteerResources() {
  const grid = document.getElementById("volunteers-grid");
  if (!grid) return;

  grid.innerHTML = volunteerResources.map((item) => `
    <article class="volunteer-card">
      <div class="volunteer-top">
        <span class="volunteer-badge">
          <i class="uil ${item.icon}"></i>
          ${item.type}
        </span>
        <span class="volunteer-date">${item.date}</span>
      </div>

      <h3>${item.title}</h3>
      <p>${item.description}</p>

      <div class="volunteer-meta">
        <span class="volunteer-tag">${item.tag}</span>
      </div>

      <div class="volunteer-actions">
        <div class="volunteer-link">
          <div class="volunteer-icon">
            <i class="uil ${item.icon}"></i>
          </div>
        </div>

        <a href="${item.url}" class="btn" target="_blank" rel="noopener noreferrer">
          Abrir enlace
        </a>
      </div>
    </article>
  `).join("");
}

renderVolunteerResources();