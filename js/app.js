const api = "https://restcountries.eu/rest/v2/all";
// const api = "https://restcountries.eu/rest/v2/name/united";
const container = document.querySelector(".countries");

let countryData;
const displayCountryCards = async data => {
  let temp = "";
  data.forEach(({ name, population, region, capital }) => {
    temp += `
      <div class="country">
        <img src="" class="flag" />
        <div class="details">
        <h2 class="country-name">${name}</h2>
            <p><span class="prop-name">Population</span>: ${population}</p>
            <p>Region: <span class="region-name">${region}</span></p>
            <p><span class="prop-name">Capital</span>: ${capital}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = temp;
  container.style.display = "grid";
};

const fetchCountryData = async () => {
  const res = await fetch(api);
  countryData = await res.json();

  displayCountryCards(countryData);

  const countryCards = document.querySelectorAll(".flag");
  for (let i = 0; i < countryData.length; i++) {
    // const res = fetch(countryData[i].flag);
    // const blob = res.blob();
    countryCards[i].src = countryData[i].flag;
  }
};

fetchCountryData();

//////////////////////////////////////////////////////////////////////////////

//display modal
const createModal = event => {
  let elClicked = event.target;
  console.log(elClicked);
  if (
    elClicked.classList.contains("country") ||
    elClicked.classList.contains("border-country")
  ) {
    if (document.querySelector(".country-modal")) {
      document.querySelector(".country-modal").remove();
    }
    const countryName =
      elClicked.localName === "div"
        ? elClicked.querySelector(".country-name").textContent
        : elClicked.textContent;
    const match = countryData.find(
      ({ name }) => name.toLowerCase() === countryName.toLowerCase()
    );
    const {
      name,
      nativeName,
      population,
      region,
      subregion,
      capital,
      topLevelDomain,
      currencies,
      flag,
      languages
    } = match;

    let modal = `
      <div class="country-modal">
        <button class="back-btn">Back</button>
        <img src="${flag}" class="modal-flag">
        <div class="modal-details">
        <h2 class="country-name prop">${name}</h2>
        <div class="primary-details">
            <p class="prop">Native Name: <span class="value">${nativeName}</span></p>
            <p class="prop">Population: <span class="value">${population}</span></p>
            <p class="prop">Region: <span class="value">${region}</span></p>
            <p class="prop">Sub-region: <span class="value">${subregion}</span></p>
            <p class="prop">Capital: <span class="value">${capital}</span></p>
        </div>
          <div class="other-details">
            <p class="prop">Top Level Domain: <span class="value">${topLevelDomain[0]}</span></p>
            <p class="prop">Currency: <span class="value">${currencies[0].name}</span></p>
            <p class="prop">Languages: <span class="value">${languages[0].name}</span></p>
          </div>

          <div class="border-countries">
            <h3 class="borders-title">Border Countries</h3>
          </div>
        </div>
      </div>
  `;

    container.innerHTML += modal;
    const cards = document.querySelectorAll(".country").forEach(card => {
      card.style.display = "none";
    });
    document.querySelector(".search-items").style.display = "none";

    const { borders } = match;

    countryData.forEach(country => {
      borders.forEach(border => {
        if (border === country.alpha3Code) {
          const bordersContainer = document.querySelector(".border-countries");
          bordersContainer.innerHTML += `<button class="border-country">${country.name}</button>`;
        }
      });
    });
  }
};
const countryCards = document.querySelectorAll(".country");
countryCards.forEach(country => {
  country.addEventListener("click", createModal);
});
container.addEventListener("click", createModal);

//hide modal
container.addEventListener("click", ev => {
  if (ev.target.classList.contains("back-btn")) {
    document.querySelector(".country-modal").remove();
    const cards = document.querySelectorAll(".country").forEach(card => {
      card.style.display = "grid";
    });
    document.querySelector(".search-items").style.display = "flex";
  }
});
/////////////// filter actions //////////////////////
// fileter the countries3

const searchBox = document.querySelector("#search-box");
const filterCountries = event => {
  const countryNames = document.querySelectorAll(".country-name");

  countryNames.forEach(name => {
    const searchValue = event.target.value.toLowerCase();
    console.log(searchValue);

    if (name.textContent.toLowerCase().startsWith(searchValue)) {
      name.parentElement.parentElement.style.display = "grid";
    } else {
      name.parentElement.parentElement.style.display = "none";
    }
  });
};

searchBox.addEventListener("keyup", filterCountries);

// filter by region
const regionBtn = document.querySelector(".region-filter");
const filter = document.querySelector(".filter");

regionBtn.addEventListener("click", event => {
  const regionNames = document.querySelectorAll(".region-name");
  const clicked = event.target;

  if (clicked.classList.contains("region-filter")) {
    regionBtn.firstElementChild.classList.toggle("closed");
  } else {
    regionNames.forEach(name => {
      if (
        clicked.textContent.toLowerCase() === name.textContent.toLowerCase()
      ) {
        name.parentElement.parentElement.parentElement.style.display = "grid";
        filter.textContent = name.textContent;
        filter.style.display = "inline-block";
        regionBtn.firstElementChild.classList.toggle("closed");
      } else {
        name.parentElement.parentElement.parentElement.style.display = "none";
        regionBtn.firstElementChild.classList.toggle("closed");
      }
    });
  }
});

filter.addEventListener("click", ev => {
  const countries = document.querySelectorAll(".country");
  countries.forEach(card => {
    card.style.display = "grid";
    filter.style.display = "none";
  });
});
