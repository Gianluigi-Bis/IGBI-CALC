var espressione   = "";

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



function pressButton(e){
    let eventoScatenante = e?.target;
    let valore = eventoScatenante.getAttribute("value");   
    let isLastNumberSpecialCharacter = false; 
     
   if(valore =="+" || valore =="-" ||valore =="%" ||valore =="."||valore =="x"||valore =="X" ){
        isLastNumberSpecialCharacter = isLastNumberSpecialCaracter();
   }     

    if(valore == "="){
        espressione = calcolaRisultato()
        aggiornaRisultato();
        return; 
    }

    if(valore == "CE"){
        azzeraRisultato();
        return;
    }
    
    if(valore == "undo"){

        if (espressione == null){
            espressione = document.getElementById("schermo").innerText;
        }else {
            espressione = espressione.toString();
        }

        espressione = espressione?.slice(0, -1);
        aggiornaRisultato();
        return;
    }

    if(!isLastNumberSpecialCharacter){
        espressione+= valore;
        aggiornaRisultato();
    }
   
}


function aggiornaRisultato()  {
    document.getElementById("schermo").innerText = espressione;
}


function calcolaRisultato()  {
    document.getElementById("schermo");
    let espressioneDaCalcolare = document.getElementById("schermo").innerText;
    return evaluateExpression(espressioneDaCalcolare);
}


function azzeraRisultato()  {
     espressione = "";
     document.getElementById("schermo").innerText = 0;
}

function isLastNumberSpecialCaracter()  {
    if (espressione == null){
        espressione = document.getElementById("schermo").innerText;
    }else {
        espressione = espressione.toString();
    }
    
    let ultimoCarattere =  espressione?.slice(-1);
    if(ultimoCarattere =="+" || ultimoCarattere =="-" ||ultimoCarattere =="%" ||ultimoCarattere =="."   ||ultimoCarattere =="x"||ultimoCarattere =="X"){
        return true;
       }  

       return false;
}

function evaluateExpression(expression) {
    expression = expression.replace(/x/g, '*').replace(/%/g, '/');
    try {
        // Utilizza eval per valutare l'espressione
        let result = eval(expression);
        return result;
    } catch (error) {
        console.error("Errore nella valutazione dell'espressione:", error);
        return null;
    }
}
