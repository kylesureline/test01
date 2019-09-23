document.addEventListener('DOMContentLoaded', (e) => {

  const main = document.querySelector('main');
  const body = document.querySelector('body');
  const search = document.querySelector('.search input');
  let people = [];

  // fetch helper functions
  const checkStatus = (response) => {
    if(response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }
  const fetchData = (url) => {
    return fetch(url)
              .then(checkStatus)
              .then(res => res.json())
              .catch(error => console.log('Looks like there was a problem', error));
  }

  const fadeInCards = () => {
    const cards = main.querySelectorAll('.card');
    let time = 50;
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove('fade-out');
      }, (time * index));
    });
  }

  const placeCards = () => {
    main.innerHTML = '';

    people.forEach((person, index) => {
      let div = `
        <div id="card-${index}" class="card fade-out">
          <img class="profile" src="${person.picture}" alt=""/>
          <div>
            <div class="contact primary">
              <h2 class="name">${person.name}</h2>
            </div>
          </div>
        </div>
      `;
      main.innerHTML += div;
    });
  } // end placeCards

  const init = () => {

    main.innerHTML = '<div class="loading"><p>Loading...</p></div>';

    let loadingP = main.querySelector('.loading p');
    let dotInterval = setInterval(() => {
      if(loadingP.textContent.length > 12) {
        loadingP.textContent = 'Loading...';
      } else {
        loadingP.textContent += '.';
      }
    }, 400);

    fetchData('https://5d7a59779edf7400140aa043.mockapi.io/scheuerlein')
      .then(data => {
        clearInterval(dotInterval);
        data.forEach(user => {
          let userObj = {
            picture: user.avatar,
            name: user.name
          };
          people.push(userObj);
        })
      })
      .then(e => placeCards())
      .then(e => fadeInCards());
  } // end init

  const displayModal = (personIndex) => {

    const person = people[personIndex];

    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = `
      <div class="modal-content">
        <span class="close"><img src="icons/close.svg" alt></span>
        <span class="arrow left"><img src="icons/arrow_left.svg" alt></span>
        <span class="arrow right"><img src="icons/arrow_right.svg" alt></span>
        <img class="profile" src="${person.picture}" alt="">
        <div>
          <div class="contact primary">
            <h2 class="name">${person.name}</h2>
          </div>
        </div>
      </div>
    `;

    modal.innerHTML = modalContent;

    body.insertBefore(modal, body.children[0]);

    modal.querySelector('.close').addEventListener('click', (e) => {
      body.removeChild(modal);
    });

    modal.querySelector('.right').addEventListener('click', (e) => {
      body.removeChild(modal);
      if(personIndex < (people.length - 1)) {
        displayModal(personIndex + 1);
      } else {
        displayModal(0);
      }
    });

    modal.querySelector('.left').addEventListener('click', (e) => {
      body.removeChild(modal);
      if(personIndex > 0) {
        displayModal(personIndex - 1);
      } else {
        displayModal(people.length - 1);
      }
    });

  } // end displayModal

  main.addEventListener('click', (e) => {

    const getCardDiv = (target) => {
      if(target.className === 'card') {
        return target;
      } else {
        return getCardDiv(target.parentNode);
      }
    }

    if(e.target.tagName !== 'MAIN') {
      const cardId = getCardDiv(e.target).id;
      const personIndex = parseInt(cardId.split('-')[1]);
      displayModal(personIndex);
    }

  });

  search.addEventListener('keyup', (e) => {

    const searchStr = search.value.toLowerCase();
    const cards = main.children;

    const showAllCards = () => {
      for(let i = 0; i < cards.length; i += 1) {
        let card = cards[i];
        card.classList.remove('hidden');
      }
    }

    if(search.value === '') {
      showAllCards();
    } else {
      for(let i = 0; i < cards.length; i += 1) {
        let card = cards[i];
        let name = card.querySelector('.name').textContent.toLowerCase();
        if(!name.includes(searchStr)) {
          card.classList.add('hidden');
        }
      }
    }

  });

  init();

});
