const $ = (id) => document.getElementById(id);

$("brewButton").addEventListener("click", function(){
     const status = document.getElementById("brewStatus");
      status.textContent = "Coffee status: Loading...";
      setTimeout(() => {
        status.textContent = "Coffee status: Brewed ☕";
      }, 3000);
    });

    document.getElementById("toastButton").addEventListener("click", function () {
      const status = document.getElementById("toastStatus");
      status.textContent = "Toast status: Loading...";
      setTimeout(() => {
        status.textContent = "Toast status: Toasted 🍞";
      }, 2000);
    });

    document.getElementById("juiceButton").addEventListener("click", function () {
      const status = document.getElementById("juiceStatus");
      status.textContent = "Juice status: Loading...";
      setTimeout(() => {
        status.textContent = "Juice status: Poured 🧃";
      }, 1000);
    });
