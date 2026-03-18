const header=document.querySelector("header");

/*----------------- Person Image Carousel --------------------*/

const personSlides = document.querySelectorAll(".person-slide");
let currentPersonIndex = 0;

function changePersonSlide() {
    personSlides[currentPersonIndex].classList.remove("active");    
    currentPersonIndex = (currentPersonIndex + 1) % personSlides.length;    
    personSlides[currentPersonIndex].classList.add("active");
}

setInterval(changePersonSlide, 5000);


/* =========================
   SEDES MACRORREGIONALES
========================= */

(function () {
  const sedesMapContainer = document.getElementById("sedes-map-container");
  const sedesGrid = document.getElementById("sedes-universities-grid");
  const sedesRegionTitle = document.getElementById("sedes-region-title");
  const sedesRegionDescription = document.getElementById("sedes-region-description");
  const sedesRegionBadge = document.getElementById("sedes-selected-region-badge");
  const sedesTabs = document.querySelectorAll(".sedes-region-tab");

  if (!sedesMapContainer || !sedesGrid || !sedesRegionTitle || !sedesRegionDescription || !sedesRegionBadge) {
    return;
  }

  const DEPARTMENT_TO_REGION = {
    "PE-TUM": "Norte",
    "PE-PIU": "Norte",
    "PE-LAM": "Norte",
    "PE-LAL": "Norte",
    "PE-CAJ": "Norte",

    "PE-ANC": "Costa Centro",
    "PE-LIM": "Costa Centro",
    "PE-LMA": "Costa Centro",
    "PE-CAL": "Costa Centro",
    "PE-ICA": "Costa Centro",

    "PE-HUC": "Centro",
    "PE-PAS": "Centro",
    "PE-JUN": "Centro",
    "PE-HUV": "Centro",
    "PE-AYA": "Centro",

    "PE-ARE": "Sur",
    "PE-CUS": "Sur",
    "PE-TAC": "Sur",
    "PE-MOQ": "Sur",
    "PE-PUN": "Sur",
    "PE-APU": "Sur",

    "PE-LOR": "Oriente",
    "PE-SAM": "Oriente",
    "PE-UCA": "Oriente",
    "PE-MDD": "Oriente",
    "PE-AMA": "Oriente"
  };

  const DECORATIVE_IDS = ["PE-LKT"];

  const UNIVERSITY_DATA = {
    "Norte": [
      {
        name: "Universidad Nacional de Piura",
        region: "Piura",
        image: "./assets/unp.png"
      }
    ],
    "Costa Centro": [
      {
        name: "Universidad Nacional Mayor de San Marcos",
        region: "Lima",
        image: "./assets/UNMSM.svg"
      }
    ],
    "Centro": [
      {
        name: "Universidad Nacional del Centro del Peru",
        region: "Junín",
        image: "./assets/UNCP_LOGO.png"
      }
    ],
    "Sur": [
      {
        name: "Universidad Catolica San Pablo",
        region: "Arequipa",
        image: "./assets/ucsp.png"
      },
      {
        name: "Universidad Continental",
        region: "Cusco",
        image: "./assets/continental.jpg"
      }
    ],
    "Oriente": [
      {
        name: "Universidad Peruana Union",
        region: "San Martín",
        image: "./assets/upeu_logo.png"
      },
      {
        name: "Universidad Nacional Amazonica de Madre de Dios",
        region: "Madre de Dios",
        image: "./assets/UNAMAD.jpg"
      },
      {
        name: "ODS SUNASS Loreto y Ucayali",
        region: "Loreto y Ucayali",
        image: "./assets/sunass_logo6.png"
      }
      
    ]
  };

  let currentRegion = "Norte";

  function renderUniversities(region) {
    const items = UNIVERSITY_DATA[region] || [];

    sedesRegionTitle.textContent = region;
    sedesRegionDescription.textContent = `Sedes participantes de la macrorregión ${region}.`;
    sedesRegionBadge.textContent = region;

    sedesGrid.innerHTML = items.map((item) => `
      <article class="sedes-university-card">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="sedes-university-image"
        />
        <div class="sedes-university-body">
          <h5>${item.name}</h5>
          <p>Región: ${item.region}</p>
        </div>
      </article>
    `).join("");
  }

  function updateTabs(region) {
    sedesTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.region === region);
    });
  }

  function paintRegion(region) {
    currentRegion = region;
    updateTabs(region);
    renderUniversities(region);

    const svg = sedesMapContainer.querySelector("svg");
    if (!svg) return;

    const allPaths = svg.querySelectorAll("path");

    allPaths.forEach((path) => {
      const id = path.id;
      path.classList.remove("region-active", "region-soft", "region-disabled");

      if (DECORATIVE_IDS.includes(id)) {
        path.classList.add("region-disabled");
        return;
      }

      const mappedRegion = DEPARTMENT_TO_REGION[id];

      if (!mappedRegion) {
        return;
      }

      if (mappedRegion === region) {
        path.classList.add("region-active");
      }
    });
  }

  function bindMapEvents() {
    const svg = sedesMapContainer.querySelector("svg");
    if (!svg) return;

    const paths = svg.querySelectorAll("path");

    paths.forEach((path) => {
      const id = path.id;

      if (DECORATIVE_IDS.includes(id)) {
        path.classList.add("region-disabled");
        return;
      }

      const region = DEPARTMENT_TO_REGION[id];

      if (!region) {
        return;
      }

      path.addEventListener("click", () => {
        paintRegion(region);
      });

      path.addEventListener("mouseenter", () => {
        if (currentRegion === region) return;

        paths.forEach((p) => {
          if (DEPARTMENT_TO_REGION[p.id] === region) {
            p.classList.add("region-soft");
          }
        });
      });

      path.addEventListener("mouseleave", () => {
        paths.forEach((p) => p.classList.remove("region-soft"));
      });
    });
  }

  sedesTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const region = tab.dataset.region;
      paintRegion(region);
    });
  });

  fetch("./assets/peru.svg")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`No se encontró el SVG. Status: ${response.status}`);
    }
    return response.text();
  })
  .then((svgText) => {
    console.log("SVG cargado correctamente");
    console.log("Primeros caracteres:", svgText.substring(0, 200));

    sedesMapContainer.innerHTML = svgText;

    const svg = sedesMapContainer.querySelector("svg");
    console.log("svg encontrado en el DOM:", svg);

    if (svg) {
        svg.setAttribute("id", "sedes-map-svg");
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

        try {
            const bbox = svg.getBBox();
            svg.setAttribute(
            "viewBox",
            `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
            );
        } catch (error) {
            console.error("No se pudo ajustar el viewBox del SVG:", error);
        }
    }

    bindMapEvents();
    paintRegion(currentRegion);
  })
  .catch((error) => {
    console.error("Error cargando el mapa:", error);

    sedesMapContainer.innerHTML = `
      <div class="sedes-map-loading">
        No se pudo cargar el mapa. Verifica que el archivo esté en <strong>./assets/peru.svg</strong>
      </div>
    `;
  });
})();



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

/*----------------- Reveal Animation --------------------*/

let sr= ScrollReveal({
    duration: 2500,
    distance: "60px",
});

sr.reveal(".showcase-info", {delay:600});
sr.reveal(".showcase-image", {origin:"top",delay:700});
sr.reveal(".tl-item", { interval: 150, origin: "bottom", distance: "40px" });


/*----------------- Skills Progress Bar Animation --------------------*/

function hasReached(el){
    let topPosition = el.getBoundingClientRect().top; 

    if(window.innerHeight >= topPosition + el.offsetHeight) return true;
    return false;    
}



let skillsPlayed = false;

function skillsCounter(){
    if(!hasReached(first_skill)) return;

    skillsPlayed = true;

    sk_counters.forEach((counter, i) => {
        let target= +counter.dataset.target;
        let strokeValue= 427 - 427 * (target/100);

        progress_bars[i].style.setProperty("--target", strokeValue);

        setTimeout(() => {
            updateCount(counter, target);
        },400);
    })

    progress_bars.forEach(
        (p) => (p.style.animation = "progress 2s ease-in-out forwards")
        );
}

/*----------------- Services Counter Animation --------------------*/

let mlPlayed = false;

function mlCounter(){
    if(!hasReached(ml_section)) return;
    mlPlayed = true;
    ml_counters.forEach((ctr) =>{
        let target= +ctr.dataset.target;
              

        setTimeout(() => {
            updateCount(ctr, target);
        }, 400);
    } );
}

/*----------------- Portfolio filter Animation --------------------*/

let mixer = mixitup(".portfolio-gallery",  {
    selectors: {
        target: '.prt-card'
    },
    animation: {
        duration: 500
    }
});

/*----------------- Modal Pop Up Animation --------------------*/

let currentIndex = 0;

zoom_icons.forEach((icn, i) => 
icn.addEventListener("click",()=>{
    prt_section.classList.add("open")
    document.body.classList.add("stopScrolling");
    currentIndex = i;
    changeImage(currentIndex);
}));

modal_overlay.addEventListener("click", ()=> {
    prt_section.classList.remove("open")
    document.body.classList.remove("stopScrolling");
});

prev_btn.addEventListener("click",()=>{
    if(currentIndex === 0){
        currentIndex = 13;
    }else{
        currentIndex--;
    }
    
    changeImage(currentIndex);

})

next_btn.addEventListener("click",()=>{
    if(currentIndex === 13){
        currentIndex = 0;
    }else{
        currentIndex++;
    }    
    changeImage(currentIndex);

})


function changeImage(index){
    images.forEach(img => img.classList.remove("showImage"));
    images[index].classList.add("showImage");
}


/*----------------- Modal Pop Up Animation --------------------*/


const swiper = new Swiper ('.swiper', {
   
    loop: true,
    speed:500,
    autoplay:true,  
    pagination: {
      el: '.swiper-pagination',
      clickable:true,
    },
});

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
  

