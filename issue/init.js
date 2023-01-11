/*!

  Radancy: Custom Form - Google Sheet

  Contributor(s):
  Michael "Spell" Spellacy, Email: michael.spellacy@radancy.com, Twitter: @spellacy, GitHub: michaelspellacy
  Dependencies: None
  Sheet: https://docs.google.com/spreadsheets/d/1u6PQ_u9AApQLTI4zQ8mXzwAmDnu0Ot0eBUUOAP1l12Y/edit#gid=0

*/

const scriptURL = "https://script.google.com/macros/s/AKfycbysjs7lUQBKrD1d8CiBCZ0oPP4Rw-YQlg9i9Fd6Dd4QF-M2pyasLoGwlYgO_ezU2fhptg/exec"
const form = document.forms["radancy-form"];
const formMsg = document.getElementById("form-message");
    
form.addEventListener("submit", e => {
    
    e.preventDefault()
    
    fetch(scriptURL, { method: "POST", body: new FormData(form)}).then((response) => {

        formMsg.classList.remove("radancy-form__error");
        formMsg.classList.add("radancy-form__success");
        formMsg.innerHTML = "Success! Your issue has been sent.";
        console.log("Success!", response);


    }).catch((error) => {

        formMsg.classList.remove("radancy-form__success");
        formMsg.classList.add("radancy-form__error");
        formMsg.innerHTML="Uh-oh! Something went wrong! Please <a href='mailto:michael.spellacy@radancy.com'>let us know about it</a>.";
        console.log("Error!", error);

    });

    formMsg.focus();
    form.reset();
    
})