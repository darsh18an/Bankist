"use strict";







class Workout {

  date = new Date();
  id = (Date.now() + '').slice(-10);
  
  constructor(coords, distance, duration){

    // this.date =... 
    this.coords = coords; // [lat lng]
    this.distance = distance; // in km
    this.duration; //in min
    

  }

  _setDescription(){
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadance = cadance;
    this.calcPace();
    this._setDescription();
  }
  calcPace() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

class Cycling extends Workout {
  type ='cycling';
   constructor(coords, distance, duration, elevationGain){
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
}
calcSpeed(){ 
  // km/hr
    this.speed = this.distance / (this.duration/60);
    return this.speed;
}
}
// const run1 = new Running([39 -12], 5.2, 24, 178);
// const Cycling1 = new Running([39 - 12], 27, 95, 523);
// console.log(run1, Cycling1);



////////////////////////////////////////
// Application Architecture

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");



// let map, mapEvent;

class App {
  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  #workouts = [];
  constructor() {
    // get user positions
    this._getPosition();

    // get data from local storage
    this._getlocalStorage();

    // Attach event handlers
    form.addEventListener("submit", this._newWorkout.bind(this));
    // here we the event handler function will point out to the element which is attached
    // i.e form element not the app class so again we use bind to overcome this
    // whenever we have event handlers we will be binding the this keywords all the time
    // otherwise many code will not work

    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkouts.addEventListener("click", this._moveToPopup.bind);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Allow to acess location");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);

    const coords = [latitude, longitude];
    // console.log(this); // undefined understand this brother its importAnt
    // this.loadMap treated as regular function call not has a method call
    //  as we lewarned before regular function call the this keyword is set to undefined
    // so that is the reason we got undefined
    // to overcome this we have bind keyword
    // as we know bind simply return a new function

    // console.log(this);

    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);
    // console.log(map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));

     this.#workouts.forEach((work) => {
       
       this._renderWorkoutMarker(work);
     });
  }

  _showForm(mapE) {
    // Handling clicks on map

    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    // Empty the inputs
    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        "";
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 100);
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout() {
    e.preventDefault(e);

    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every((inp) => 0);

    // Get data from form

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDistance.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // check if data is valid

    //  If workout running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      // check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive numbers");

      workout = new Running([lat, lng], distance, duration, cadence);
      this.#workouts.push(workout);
    }

    //  If workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      // check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert("Inputs have to be positive numbers");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array

    this.#workouts.push(workout);
    console.log(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);
    // Hide form  + clear input fields

    // clear input fields

    // inputCadence.value =
    //   inputDistance.value =
    //   inputDuration.value =
    //   inputElevation.value =
    //     "";
    this._hideForm();
    //  console.log(mapEvent);

    // set local storage to all workouts
    this._setLocalStorage();
  }

  // Dispaly marker
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${
              workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
            }</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>`;

    if (workout === "running")
      html += `
           <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

    if (workout === "cycling")
      html += `
           <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${Workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;

    form.insertAdjacentHTML("afterend", html);
  }

  _moveToPopup(e){
    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);

    if(!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);
     
    this.#map.setView(workout, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration : 1,
      },
    } );
    

  }

  _setLocalStorage(){
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage(){
    const data = JSON.parse(localStorage.getItem('workouts'));
    console.log(data);
    
    if(!data) return;

    this.#workouts = data;


    this.#workouts.forEach( work => {
      this._renderWorkout(work);
      
    })
  }
  reset(){
    localStorage.removeItem('workouts')
    location.reload();
  }
} 

const app = new App();
app._getPosition();


