"use strict";

// // BANKIST APP

// // Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
      movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2024-10-14T14:11:59.604Z",
    "2024-10-20T17:01:17.194Z",
    "2024-10-21T23:36:17.929Z",
    "2024-10-22T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
     movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

// const account1 = {
//   owner: "Jonas Schmedtmann",
//   movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,

  
// };

// const account2 = {
//   owner: "Jessica Davis",
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,

 
// };

// const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");





// the use case for the map method here, which was perfect,

// because it allowed us to create a new simple array,

// which only contains the initials of name it is used on.

// And then on the other hand, the for each method,

// it was a great use case to produce

// some so called side effects(In general, any lasting effect that occurs in a function, not through its return value, is called a side effect ).

// So in other words, to simply do some work

// without returning anything.

// And so that's what we did here,

// we simply looped over the accounts array,

// and in each iteration,

// we manipulated the current account object,

// and edit a username to it

// based on the account owner,

// plus all of these transformations

// const user = ' K N Chakrawarthy'; // knc
// const userName = user
// .toLowerCase()
// .split(' ')
// .map(function(name){
//   return name[0];
// })
// .join('');
// console.log(userName);


/////////////////////////////////////////////////////////////////////
// functions

const formatMovementDate = function(date, locale){

  const calcDayspassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDayspassed(new Date(),date);
  // console.log(daysPassed);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`
  
 
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth()}`.padStart(2, 0);
  // const year = date.getFullYear();
  //  return `${day}/${month}/${year}`;

  return new Intl.DateTimeFormat(locale).format(date);

  
};

// converting ito INR standars using INTL

const formatCurrency = function(value, locale, currency){
   return new Intl.NumberFormat(locale, {
     style: "currency",
     // currency: acc.currency,
     currency: currency,
   }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  // .textContent = 0

  const movs = sort ? acc.movements.splice().sort((a, b) =>
   a - b): movements;
  movs.forEach(function (mov, i) {
    // to determine withdraw or deposite

    const type = mov > 0 ? "deposit" : "withdrawal";

     const date = new Date(acc.movementsDates[i]);

     const displayDate = formatMovementDate(date, acc.locale);
    
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);
    
    
    const html = `
     <div class="movements__row">
        <div class="movements__type movements__type--${type}">
         ${i + 1} ${type} </div>

         <div class="movements__date">${displayDate}</div>
      
        <div class="movements__value">${formattedMov}></div>
      </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


// Balance



const calcDisplayBalance = function (acc) {
   acc.balance = acc.movements.reduce((acc, mov) => acc + mov,0);
  // labelBalance.textContent = `${acc.balance.toFixed(2)} Rs`;
    labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
};



// Summary


// Deposits summary
const calcDisplaySummary = function (/*movements*/ acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumIn.textContent = `${incomes.toFixed(2)}`;
  labelSumIn.textContent = formatCurrency(
    incomes,
    acc.locale,
    acc.currency
  );

  // Withdraw summary
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  // labelSumOut.textContent = `${Math.abs(out)}`;
  labelSumOut.textContent = formatCurrency(
    incomes, 
    acc.locale, 
    acc.currency);;

  // Intrests

  const intrests = acc.movements
  .filter(mov => mov > 0)
  .map((deposit => (deposit * acc.interestRate)/100))
  .reduce((acc, int) => acc + int,0);
  labelSumInterest.textContent = `${intrests.toFixed(2)}`;
};



// Map

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

 const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


// creat user Name

const createUserName = function (acco) {
  acco.forEach(function (accu) {
    accu.userName = accu.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserName(accounts);


const updateUI  = function(acc){
  // displayMovements
    displayMovements(acc);

    // DisplayBalance
    calcDisplayBalance(acc);

    // DisplaySummary
    calcDisplaySummary(acc);   
};


// Logout timer

const startLogOutTimer = function() {
  const tick = function (){
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    // in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    //decrese 1s
    time--;
  }
  // set timeout to 5 minutes 
  let time = 300;

  // call the timer every second 
  tick();
   const timer = setInterval(tick, 1000);
   return timer;
}






// Event handlers

// because we need it more often so let it be like OG orginal Global

let currentAccount, timer;


// fake the account login
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


// Experimenting API



btnLogin.addEventListener('click' , function(e){
  // to prevent default behavior of html form element which reload's everytym you click so to overcome this we use 'e'
  //  e.preventDefault()
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message

    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  }
    containerApp.style.opacity = 100;

    //   Create current date

    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };

    const locale = navigator.language;
    // console.log(locale);
    // labelDate.textContent = new Intl.DateTimeFormat
    // ('en-IN', options).format(now);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);



    // clear inputfields

     inputLoginUsername.value = inputLoginPin.value= '';
    
      inputLoginPin.blur();

      if(timer) clearInterval(timer);
      timer = startLogOutTimer();

      // updateUI
    updateUI(currentAccount)


})


// Transfer 

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amount, receiverAcc);


  // clearing the input fields 
  inputTransferAmount.value =inputTransferTo.value = '';
  
  // check the conditions to transfering amount 

  if(amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName != currentAccount.userName
  ){
    // Doing the transfer

    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());


    // updateUI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
})

// closing account 
btnClose.addEventListener('click', function(e){
  e.preventDefault();

  if(
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin 
  )
  {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    // console.log(`${index} deleted`);

    // delete the account 
    accounts.splice(index, 1);

    // to remove the UI 
     containerApp.style.opacity = 0; 
  }
  inputCloseUsername.value = inputClosePin.value = "";

  labelWelcome.textContent = 'Log in to get started';
})

// Loan

 btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount*0.1)){
    setTimeout(function (){
      currentAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      // updateUI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
      
    }, 2500);
  }

  inputLoanAmount.value = '';
 });


//  Sort btn 
let sorted = false;

btnSort.addEventListener('click', function(e){
 e.preventDefault();
 displayMovements(currentAccount.acc.movements, !sorted);
 sorted = !sorted;
});





// map don't mutate it will create new array so store it in variable.
// converting USD into INR
// const usdToINR = 80.24;
// const movementsUSD = movements.map(function(mov){
//   return mov* usdToINR;
// })
// console.log(movementsUSD);

// const movementsUSD = movements.map( (mov)=> {
//   return mov * usdToINR;
// });
// console.log(movementsUSD);

// for of loop method
// const moveUSd =  []
// for (const move of movements) {
//   moveUSd.push(usdToINR*move);

// }
// console.log(moveUSd);

const movementsDescription = movements.map(
  (mov, i) =>
    `movement ${i + 1}: you${
      mov > 0 ? "deposited" : "withdraw"
    } $(Math.abs(mov))`
);

// console.log(movementsDescription);

// const deposits = movements.filter(function (mov, i, arr){
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositfor = []
// for(const mov of movements)
//   if (mov > 0) depositfor.push(mov);

// console.log(depositfor);

const withdrawals = movements.filter((mov) => mov < 0);

// console.log(withdrawals);

const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

// challenge
// [5,2,4,1,15,8,3]
// [16,6,10,5,6,1,4]

// const calcAverageHumanAge = function(ages){
//   const humanAge = ages.map(age => (age <=2 ? 2 * age : 16 + age * 4));

//   const adults = humanAge.filter(age => age >= 18);

//   const average = adults.reduce((acc, age, i, arr ) => acc + age / arr.length,0);
//   return average;
// }

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// console.log(avg1,avg2);

// const usdToINR = 1.1;
//  const toataldepositsUSD = movements.filter(mov => mov > 0)
//  .map((mov, i, arr) => {
//   console.log(arr);
//   return mov*usdToINR
//  })
//  .reduce((acc, mov) => acc * mov, 0);
//  console.log(toataldepositsUSD);


// // Equality 
// console.log(movements.includes(-130));

// // some 
// console.log(movements.some(mov => mov === -130));

// // every  
// // account4(true )
// console.log(movements.every((mov) => mov > 0));


// sorting 

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// sorting Numbers
//  console.log(movements); 
// sorted as a strings not on basis of integers
// console.log(movements.sort()); 
//  to make  it work we need to give callback function 
// here a b are intial and next element

/* Function used to determine the order of the elements. 
It is expected to return a negative value if the first 
argument is less than the second argument, zero 
if they're equal, and a positive value otherwise. 
If omitted, the elements are sorted in ascending, 
ASCII character order. */

// return < 0, A, B (keep order) 
// return > 0, B, A (switch order)

// Ascending 
// movements.sort((a, b)=> {
//   if(a > b) return 1;
//   if(a < b) return -1;
// })

movements.sort((a, b) => a - b)
// console.log(movements );

// Descending 
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a, b) => b-a )
// console.log(movements);


// fill arrays
 const arr = [1, 2, 3, 4, 5, 6, 7]; 
//  console.log(arr);
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

//  Empty array + fill method
 const x = new Array(7);
//  console.log(x);
// console.log(x.map(()=> 5));

x.fill(1, 3, 5);
// x.fill(1); it mutates the array 
// console.log(x);

arr.fill(23, 2, 6);
// console.log(arr);

// array.from
// use  this one has it is more convinient 
const y = Array.from({ length: 7}, () => 1);
// console.log(y); 

const z = Array.from({length: 7 }, (_, i) => i + 1);
// console.log(z);


labelBalance.addEventListener('click', function(){
  const movementUI = Array.from(
    document.querySelectorAll(".movements__value"),
    (el) => Number(el.textContent.split(' ')[0].replace('Rs', ''))
  );
  // console.log(movementUI);

  // const movementUI2 =[...document.querySelectorAll('.movements__value')]
  
})

// practice 

// 1 
// const bankDepositSum = accounts.map(acc => acc.movements).flat(); 
// const bankDepositSum = accounts.flatMap(acc => acc.movements)
// .filter(mov => mov > 0)
// .reduce((sum, cur) => sum + cur);

// console.log(bankDepositSum);

// 2 

const numDeposits = accounts
// .flatMap(acc => acc.movements)
// .filter(mov => mov >= 1000).length;

// .flatMap(acc => acc.movements)
// .filter(mov => mov >= 1000)
// .reduce((count, cur) => (cur >= 1000 ? count+1 : count), 0);
// console.log(numDeposits);


// 3 create a object using reduce

// const sums = accounts.flatMap(acc => acc.movements)
// .reduce((sums, curr) => {
//   curr > 0 ? (sums.depositss += curr) : (sums.withdrawalls += curr);
//   return sums
// }, {depositss :0, withdrawalls:0}
// )

// console.log(sums);

const {depositss, withdrawalls} = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, curr) => {
      sums[curr > 0 ? 'depositss' : 'withdrawalls'] +=curr
      return sums;
    },
    
    { depositss: 0, withdrawalls: 0 }
  );

// console.log(depositss, withdrawalls);

const  convertTitleCase =  function(title) {

  const capatalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'and', 'with', 'have', 'or', 'in', 'but'];

  const titleCase = title.toLowerCase().split(' ')
  .map(word => exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1))
  .join(' ');
  return capatalize(titleCase);

};

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase("this is a nice LonG but not too LONGtiTle"));
// console.log(convertTitleCase("And with another title for example"));



// dates

const future = new Date(2037, 10, 19, 15, 23);
// console.log(+future); // returns milliseconds we can use it to convert day


// 1000 * 60 * 60 * 24 (milliseconds * seconds * minutes * hours)
const calcDayspassed = (date1, date2) => 
  Math.abs((date2 - date1)/(1000 * 60 * 60 * 24));
const days1 = calcDayspassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
// console.log(days1);














 




 






 




