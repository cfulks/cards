function createGame() {
  var modal = document.getElementById("cmodal");
  var btn = document.getElementById("c");
  var span = document.getElementsByClassName("close1")[0];
  btn.onclick = function() {
    modal.style.display = "block";
  }
  span.onclick = function() {
    modal.style.display = "none";
  }
}

function joinCode() {
  var modal = document.getElementById("jmodal");
  var btn = document.getElementById("j");
  var span = document.getElementsByClassName("close2")[0];
  btn.onclick = function() {
    modal.style.display = "block";
  }
  span.onclick = function() {
    modal.style.display = "none";
  }
}

function joinRando() {
  var modal = document.getElementById("rmodal");
  var btn = document.getElementById("r");
  var span = document.getElementsByClassName("close3")[0];
  btn.onclick = function() {
    modal.style.display = "block";
  }
  span.onclick = function() {
    modal.style.display = "none";
  }
}
