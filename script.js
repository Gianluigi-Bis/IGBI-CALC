var espressione = "";
var errore = false;  //variabile per tener traccia dell'errore

document.addEventListener('keydown', function(event) {
    const key = event.key;
    let valore;
    
    if (!isNaN(key)) { // Se è un numero
        valore = key;
    } else {
        switch(key) {
            case '+':
            case '-':
            case '/':
            case '*':
                valore = key;
                break;
            case 'Enter':
            case '=':
                valore = '=';
                break;
            case 'Backspace':
                valore = 'undo';
                break;
            case 'Escape':
                valore = 'CE';
                break;
            case '.':
                valore = '.';
                break;
            default:
                return; 
        }
    }
    pressButton({ target: { getAttribute: () => valore } });
});


function pressButton(e) {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    let eventoScatenante = e?.target;
    let valore = eventoScatenante.getAttribute("value");

    // Se c'è un errore e l'utente preme un numero, resetta l'espressione e l'errore
    if (errore && valore != 'CE') {
        if (!isNaN(valore)) {
            espressione = valore;
            errore = false;
            aggiornaRisultato();
        }
        return; // Impedisce l'inserimento di qualsiasi cosa non sia un numero
    }

    let isLastNumberSpecialCharacter = false;

    if (valore == "+" || valore == "-" || valore == "%" || valore == "x" || valore == "X" || valore == "/") {
        isLastNumberSpecialCharacter = isLastNumberSpecialCaracter();
    }

    // Evitare l'inserimento di caratteri speciali o virgola come prima cifra
    if ((espressione === "" || espressione === "0") && (valore == "+" || valore == "-" || valore == "%" || valore == "x" || valore == "X" || valore == "/")) {
        return;
    }

   

    // Evitare due virgole nello stesso numero
    if (valore == "." && isCurrentNumberContainsDot()) {
        return;
    }

    if (valore == "=") {
        espressione = calcolaRisultato();
        aggiornaRisultato();
        return;
    }

    if (valore == "CE") {
        azzeraRisultato();
        return;
    }

    if (valore == "undo") {

      // Aggiungi questa condizione per impedire la cancellazione di "0"
       if (espressione == "0"||espressione =="") {
           return;
       }


        if (espressione == null) {
            espressione = document.getElementById("schermo").innerText;
        } else {
            espressione = espressione.toString();
        }

        espressione = espressione?.slice(0, -1);
        aggiornaRisultato();
        return;
    }

    if (!isLastNumberSpecialCharacter) {
        if (espressione == '0' && !isNaN(valore)) {
            espressione = valore;
        } else {
            if(espressione =="" && valore =="."){espressione  = "0."}
            else{espressione += valore;}
        }

        aggiornaRisultato();
    }
}


function aggiornaRisultato() {
    document.getElementById("schermo").innerText = espressione;
}

function calcolaRisultato() {
    let espressioneDaCalcolare = document.getElementById("schermo").innerText;
    let risultato = evaluateExpression(espressioneDaCalcolare);

    if (risultato === "Impossibile") {
        errore = true; // Segnala l'errore
    }

    return risultato;
}

function azzeraRisultato() {
    espressione = "";
    errore = false; // Reset dell'errore
    document.getElementById("schermo").innerText = 0;
}


function isLastNumberSpecialCaracter() {

    if(espressione!=null)
        espressione = espressione.toString();
    
    let ultimoCarattere = espressione?.slice(-1);
    if (ultimoCarattere == "+" || ultimoCarattere == "-" || ultimoCarattere == "%" || ultimoCarattere == "." || ultimoCarattere == "x" || ultimoCarattere == "X"|| ultimoCarattere == "/") {
        return true;
    }
    return false;
}

function isCurrentNumberContainsDot() {
    let lastNumber = espressione.split(/[\+\-\x\/]/).pop(); // Ottieni l'ultimo numero
    return lastNumber.includes(".");
}

function evaluateExpression(expression) {
    expression = expression.replace(/x/g, '*').replace(/%/g, '/');

    // Controllo divisione per zero
    if (/\/0/.test(expression)) {
        return "Impossibile";
    }

    try {
        let result = eval(expression);
        return result;
    } catch (error) {
        console.error("Errore nella valutazione dell'espressione:", error);
        return "Impossibile";
    }
}



function toggleThemePopup() {
    const popup = document.getElementById('theme-popup');
    popup.classList.toggle('hidden');
}

function changeTheme(themeName) {
    document.documentElement.className = themeName;
    toggleThemePopup(); // Chiude il popup dopo la selezione del tema
}
