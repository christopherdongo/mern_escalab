/*variables global*/
let countries;
let countrie;

window.addEventListener("DOMContentLoaded", async (e) => {
  countries = await getCountries();
  viewFullCountries(countries);
  setTimeout(() => {
    hideShowContainerLabel("main", "block");
    hideShowContainerLabel("header", "flex");
    changeRoutes("#home");
    showHeader("none");
  }, [2000]);
});


let inputBox = document.querySelector("#text_input");
const form = document.getElementById("form");
const container_home = document.getElementById("container_home");
const container_details = document.getElementById("details");
const main = document.getElementsByTagName("main")[0];
const container__loader = document.querySelector(".container__loader");
const search_countries = document.getElementById("search_countries");
const logo = document.getElementById("logo");

/*options*/
const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");

/*card search countries*/
const card = document.getElementById("article-search");
const img_search_countries = document.getElementById("img_search_countries");
const name_countries = document.getElementById("name_countries");
const continent_countries = document.getElementById("continent_countires");
const countries_poblation = document.getElementById("countries_poblation");
const countries_capital = document.getElementById("countries_capital");
const notfound = document.getElementById("notfound");


/*events*/

inputBox.addEventListener("input", function () {
  // const del = filterNameCountries(this.value)
  const del = filterNameCountries(convertTextUpper(this.value))
  viewFullCountries(del)
});

card.addEventListener("click", (e) => {
  const params = e.target.parentNode.childNodes[5].childNodes[1].textContent;
  const search = filterNameCountries(params);
  hideShowContainerID("search_countries", "none");
  hideShowContainerID("home", "none");
  hideShowContainerLabel("main", "none");
  showHeader("flex");
  viewInfoDetails(search);
  setTimeout(() => {
    changeRoutes(`#details/${search[0].name.common}`);
    hideShowContainerLabel("main", "block");
    hideShowContainerID("details", "flex");
    showHeader("none");
  }, [2000]);
});



/*seleccionar el card para visualizar los detalles*/
window.addEventListener("click", (e) => {
   if (
    e.target?.parentNode?.childNodes[5]?.childNodes[1]?.textContent.length > 0 && window.location.hash === '#home'
  ) {
    clearInfoDetails();
    // const params = e.target?.parentNode?.childNodes[5].childNodes[1].textContent;
    const params = e.target?.parentNode?.childNodes[3].attributes[3].textContent;

   const search = filterFieldsCountries(params);
    hideShowContainerID("search_countries", "none");
    hideShowContainerID("container_home", "none");
    hideShowContainerLabel("main", "none");
    showHeader("flex");
    viewInfoDetails(search);

    setTimeout(() => {
      changeRoutes(`#details_${search[0].name.common}`);
      hideShowContainerLabel("main", "block");
      hideShowContainerID("details", "flex");
      showHeader("none");
    }, [2000]); 
  } 

})


/*funcion para el select*/
selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
});

optionsList.forEach((option) => {
  option.addEventListener("click", (e) => {
    e.preventDefault();
    selected.innerHTML = option.querySelector("label").innerHTML;
    console.log(option.querySelector("input").value);

    if(option.querySelector("input").value === 'Todos'){
      viewFullCountries(countries);

    } else{
      const search = filterContinentCountries(
        option.querySelector("input").value
      );
      optionsContainer.classList.remove("active");
      viewFullCountries(search);
      // optionsContainer.classList.remove("active");
  
    }
  });
});

/*dar lick al logo y regresar al home*/
logo.addEventListener("click", (e) => {
  const params = location.hash.split("/")[0];
  inputBox.value='';
  if (params !== "#home" || params === "#home") {
    showHeader("flex");
    hideShowContainerLabel("main", "none");
    viewFullCountries(countries)
  }
  setTimeout(() => {
    hideShowContainerLabel("main", "block");
    hideShowContainerLabel("header", "flex");
    container_details.style.display = "none";
    container_home.style.display = "flex";
    changeRoutes("#home");
    showHeader("none");
  }, [2000]);
});


/*functions*/
/*llamar a la api*/
const getCountries = async () => {
  try {
    const data = await fetch("https://restcountries.com/v3.1/all");
    const result = await data.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};


/*search countries*/
const searchCountries = (countrie) => {
  const search = filterNameCountries(convertTextUpper(countrie));
  if (search.length === 0) {
    hideShowContainerLabel("main", "block");
    container_home.style.display = "none";
    container__loader.style.display='none';
    search_countries.style.display = "none";
    notfound.style.display='flex';
    changeRoutes('#notfound');

  } else {
    clearInfoDetails();
    viewCountries(search);
    setTimeout(() => {
      changeRoutes(`#search_${search[0].translations.spa?.common}`);
      hideShowContainerLabel("main", "block");
      container_home.style.display = "none";
      search_countries.style.display = "flex";
      showHeader("none");
    }, [2000]);

  }
};

/*pintar los paises den el div*/
const viewCountries = (data) => {
  const {
    translations,
    region,
    continents: continent,
    flags,
    capital: Capital,
    population,
  } = data[0];
  name_countries.textContent = translations.spa?.common;
  continent_countries.textContent = region;
  img_search_countries.style.backgroundImage = `url(${flags.png})`;
  countries_capital.textContent = Capital[0];
  countries_poblation.textContent = population;
};

/*detalles de los paises*/
const viewInfoDetails = (data) => {
  console.log(data);
  const {
    altSpellings,
    timezones,
    region,
    flags,
    capital,
    population,
    coatOfArms,
    borders,
    languages,
    name
  } = data[0];
  
  document.getElementById("details_img_flags").src = flags.png;
  document.getElementById(
    "details_name"
  ).textContent = name?.official? `Name: ${name?.official}` : `Name: ${altSpellings[0]}`;
  document.getElementById(
    "details_capital"
  ).textContent = `Capital: ${capital}`;
  document.getElementById("details_escudo").src = coatOfArms.png;
  document.getElementById(
    "details_lenguage"
  ).textContent = `Lenguages: ${addSpaceClean(
    Object.keys(languages)
  ).toUpperCase()}`;
  document.getElementById("details_fronters").textContent = `Borders: ${
    borders ? addSpaceClean(borders) : ""
  }`;
  document.getElementById("details_region").textContent = `Region: ${region}`;
  document.getElementById(
    "details_population"
  ).textContent = `Population: ${population}`;
  document.getElementById(
    "details_time_zone"
  ).textContent = `Time Zone: ${addSpaceClean(timezones)}`;
};

/*borrar la informacion*/
const clearInfoDetails = () => {
  document.getElementById("details_img_flags").src = "";
  document.getElementById("details_name").textContent = "";
  document.getElementById("details_capital").textContent = "";
  document.getElementById("details_escudo").src = "";
  document.getElementById("details_lenguage").textContent = "";
  document.getElementById("details_fronters").textContent = "";
  document.getElementById("details_region").textContent = "";
  document.getElementById("details_population").textContent = "";
  document.getElementById("details_time_zone").textContent = "";
};

/*pintar los paises en el home*/
const viewFullCountries = (data) => {
  let cards = "";
  console.log(data);
  const container_card = document.getElementById("container__card");

  if (data) {
    data.forEach((element, i) => {
      cards += `
      <article
      class="card_container"
      id="article-countries"
      data-id=${element.altSpellings[0]}
      >

      <div class="card_linear"></div>
        <div 
        class="card_img"
        id="img_search_countries"
       style="background-image:url(${element.flags.png})"
       data-id=${element.altSpellings[0]}
        >
        <div
        class="card_info_aditional"
        >
        <div><img class="card_info_icon" id="countries_poblation_icon" src="./images/grupo.png" /> <span id="countries_poblation">${element.population}</span> </div>
        <div><img class="card_info_icon" id="countries_capital_icon" src="./images/mundo.png" /> 
        <span id="countries_capital">${element.capital}</span></div>
        </div>
        </div>
        
        <div class="card_info">
          <p id="name_countries">${element.translations.spa?.common}</p>
          <p id="continent_countires">${element?.region}</p>
        </div>
      </article>
      `;
    });
    container_card.classList.add("container_card");
    container_card.innerHTML = cards;
  }
};

/*enable disable loader*/
const showHeader = (views) => (container__loader.style.display = views);

/*observador para poder filtrar la data*/
function observeElement(element, property, callback, delay = 0) {
  let elementPrototype = Object.getPrototypeOf(element);
  if (elementPrototype.hasOwnProperty(property)) {
      let descriptor = Object.getOwnPropertyDescriptor(elementPrototype, property);
      Object.defineProperty(element, property, {
          get: function() {
              return descriptor.get.apply(this, arguments);
          },
          set: function () {
              let oldValue = this[property];
              descriptor.set.apply(this, arguments);
              let newValue = this[property];
              if (typeof callback == "function") {
                  setTimeout(callback.bind(this, oldValue, newValue), delay);
              }
              return newValue;
          }
      });
  }
}


/*filter countries*/
const filterNameCountries = (name) => countries.filter( (item) => item.translations.spa?.common.startsWith(name) || item.name.common.startsWith(name));
/*filter code countries*/
const filterFieldsCountries = (name) => countries.filter((item) => item.altSpellings[0] === name);
/*filter continent*/
const filterContinentCountries = (name) => countries.filter((item) => item.region === name);

/*space clean*/
const addSpaceClean = (val) => val.join().replace(/,/g, ", ");
const spaceClean = (val) => val.join().replace(/,/g, ", ");

/*no found*/
const hideShowContainerLabel = (label, view) => { document.getElementsByTagName(label)[0].style.display = view;
};

const hideShowContainerID = (label, view) => { document.getElementById(label).style.display = view;
};

const changeRoutes = (location_name) => { location.hash = location_name;
};

/*convert string */
const convertTextUpper = (text) => {
  if(text === '') return ''
  if(text.length === 1) return text[0].toUpperCase();
  if(text.length > 1) return text[0].toUpperCase() + text.substring(1).toLowerCase();
  
};