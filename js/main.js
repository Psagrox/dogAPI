const API_URL = 'https://api.thedogapi.com/v1';
const API_KEY = 'live_iZFyfoCQhNYnSMFCR3KhwkqnBsd8M2FoXbI3a75KZuCadju3P2RA7RlUev9LlqSP';

const swiper = () =>{ new Swiper(".swiperHome", {
  spaceBetween: 20,
  centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
        slidesPerView: 1,
        spaceBetween: 20,
    },
    768: {
        slidesPerView: 2,
        spaceBetween: 20,
    },
    1024: {
        slidesPerView: 3,
        spaceBetween: 30,
    },
  },
  });
}

async function loadRamdomDogs () {
  try {
    const response = await fetch(`${API_URL}/images/search?limit=6`);
    const status = response.status;

    if(status !== 200) throw Error(`Dogs Random: ${status}`);

    const data = await response.json();
    console.log(data);

    btn1.firstElementChild.src = 'img/corazonvacio.png';
    btn2.firstElementChild.src = 'img/corazonvacio.png';
    btn3.firstElementChild.src = 'img/corazonvacio.png';
    btn4.firstElementChild.src = 'img/corazonvacio.png';
    btn5.firstElementChild.src = 'img/corazonvacio.png';
    btn6.firstElementChild.src = 'img/corazonvacio.png';
    
    for (i=0; i< data.length; i++) {
      const imgId = `img${i + 1}`;
      const btnId = `btn${i + 1}`;
      
      const imgElement = document.getElementById(imgId);
      const btnElement = document.getElementById(btnId);
      
      if (imgElement) {
          imgElement.src = data[i].url;
      }

      if (btnElement) {
          
          btnElement.setAttribute("dataId", data[i].id);
          btnElement.setAttribute("dataId", data[i].id);
          btnElement.onclick = () => saveFavoriteCat(btnElement.getAttribute("dataId"));
          btnElement.addEventListener('click', () => {
            btnElement.firstElementChild.src = 'img/corazonlleno.png';
          });
      }
  } 

  }catch (error) {
    alert(`Housteon, we have an error:  ${error}`);
  }
}

async function loadFavoritesDogs () {
  try{
    const contenedor = document.querySelector('#contenedor-fav');
    const response = await fetch(`${API_URL}/favourites?order=DESC&`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
      },
    });

    const status = response.status;
    
    contenedor.innerHTML = '';

    if(status !== 200) throw Error(`Favorites Dogs: ${status}`);

    const data = await response.json();
    
    if (data.length <= 0) {
      contenedor.innerHTML = `<span class="text-4xl w-full text-center text-white">Upss... You don't have any favorite dogs :(</span>`;
    } else {
      data.forEach((element) => {
        contenedor.innerHTML += `
        <div class="swiper-slide bg-[#f99f9f]/50 rounded-lg w-[300px] h-[300px] relative">
          <button value="${element.id}" onclick="" class="absolute right-0 w-[30px]"><img src="img/corazonlleno.png" alt=""></button>
          <img class="size-full rounded-xl" src="${element.image.url}"  alt="">
        </div>
        `;
      });
      
    }
  }catch (error) {
    alert(`Ups... error ${error}`);
  } finally {
    const favoritos = document.querySelectorAll('.swiper-slide');
    favoritos.forEach((element) => {
      element.firstElementChild.onclick = () => deleteFavoriteDogs (element.firstElementChild.value);
    });
    swiper();
  }
}

async function saveFavoriteCat (id) {
  console.log(id);
  try {
    const response = await fetch(`${API_URL}/favourites`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_id: id,
        "sub_id":"user-123"
      }),
    });

    const status = response.status;
    console.log(status);
    if(status !== 200) throw Error(`Dog Saved: ${status}`);
  
  }catch(error) {
    alert(`Ups... dogs with erros ${error}`);
  } finally {
    loadFavoritesDogs();
  }
}

async function deleteFavoriteDogs (id) {
  try {
    const response = await fetch(`${API_URL}/favourites/${id}`, {
      method: 'DELETE',
      headers: {
        'x-api-key': API_KEY,
      },
    });

    const status = response.status;
    console.log(status);
    if(status !== 200) throw Error(`Dog delete: ${status}`);

  }catch(error) {
    alert(`Ups... Dogs with errors ${error}`);
  } finally {
    loadFavoritesDogs();
  }
}

async function uploadDogPhoto () {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);

  try {
    const response = await fetch(`${API_URL}/images/upload`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: formData,
    });

    const status = response.status;

    if(status !== 201) throw Error(`Dog uploaded: ${status}`);

    const data = await response.json();

    saveFavoriteCat(data.id);

    const preview = document.getElementById("preview-container");
  
    if(preview.hasChildNodes()){
      const mini = document.getElementById("mini");
      preview.removeChild(mini);
    }

  }catch (error){
    alert(`Ups... error ${error}`);
  }
}

function miniatura() {
  const form = document.getElementById('uploadingForm');
  const formData = new FormData(form);
  const preview = document.getElementById("preview-container");
  const reader = new FileReader();

  reader.readAsDataURL(formData.get('file'));

  if(preview.hasChildNodes()){
    const mini = document.getElementById("mini");
    preview.removeChild(mini);
  }

  reader.onload = () => {
    const previewImage = document.createElement('img');
    previewImage.id = 'mini';
    previewImage.width = 150;
    previewImage.src = reader.result;
    preview.appendChild(previewImage);
  }
}

loadRamdomDogs();
loadFavoritesDogs();