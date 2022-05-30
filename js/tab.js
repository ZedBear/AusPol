var tabinsert = document.querySelector('.tab')

tabinsert.insertAdjacentHTML('beforeend', "<form action='index.html' method='get'><button style='float: left;'>Candidate List (HoR)</button></form><form action='senate.html?s=Overview' method='get'><button style='float: left;'>Candidate List (Senate)</button></form><form action='' method='get'><button style='float: left;'>COMING SOON</button></form><form action='' method='post'><button style='float: left;'>COMING SOON</button></form><form action='' method='get'><button style='float: left;'>COMING SOON</button></form><form action='' method='get'><button style='float: right'>COMING SOON</button>")

if ( window.history.replaceState ) {
  window.history.replaceState( null, null, window.location.href )
}
