document.addEventListener('DOMContentLoaded', () => {

    const inputField = document.getElementById('n1');
    const inputField2 = document.getElementById('n2');
    const secondGroup = document.getElementById('second-input-group');
    const infoField = document.getElementById('info');

    let globalOperand = null;
    let globalOperator = null;
    let powerMode = false; // Controla si estamos pidiendo exponente para la potencia

    // --- AMPLIACIÓN 1: Espacio para información mejorado con mensajes personalizados ---
    const fillInfo = (text) => {
        infoField.innerHTML = text;
    };

    // --- GESTIÓN DE ERRORES / VALIDACIÓN ---
    const validate = (value) => {
        if (value.trim() === "") {
            alert("Error: Se han dejado campos vacíos.");
            fillInfo("Error: Se han dejado campos vacíos.");
            return false;
        }
        return true;
    };

    // Limpiar input al hacer clic (UX)
    inputField.addEventListener('click', () => {
        inputField.value = "";
    });

    // --- OPERACIONES UNARIAS ---

    document.getElementById('b-square').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        let num = Number(val);
        if (isNaN(num)) { alert("Error: No es un número válido."); return; }
        
        let result = num * num;
        inputField.value = result;
        fillInfo(`Operación: Cuadrado. El resultado es ${result}`);
    });

    document.getElementById('b-modulo').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        let num = Number(val);
        if (isNaN(num)) { alert("Error: No es un número válido."); return; }

        let result = num < 0 ? -num : num;
        inputField.value = result;
        fillInfo(`Operación: Módulo / Valor absoluto. El resultado es ${result}`);
    });

    document.getElementById('b-factorial').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        let num = Number(val);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
            alert("Error: El factorial requiere un número entero positivo.");
            return;
        }
        let fact = 1;
        for (let i = 1; i <= num; i++) { fact *= i; }
        inputField.value = fact;
        fillInfo(`Operación: Factorial. El resultado es ${fact}`);
    });


    // --- AMPLIACIÓN 2: NUEVAS OPERACIONES (Raíz Cuadrada y Potenciación) ---

    document.getElementById('b-sqrt').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        let num = Number(val);
        if (isNaN(num)) { alert("Error: No es un número válido."); return; }

        if (num < 0) {
            fillInfo(`Info: El número introducido (${num}) es negativo. No se puede calcular la raíz cuadrada real.`);
            alert("Error: El número es negativo.");
        } else {
            let result = Math.sqrt(num);
            inputField.value = result;
            fillInfo(`Info: El número es positivo. Raíz cuadrada: ${result}`);
        }
    });

    document.getElementById('b-power').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        globalOperand = Number(val);
        if (isNaN(globalOperand)) { alert("Error: Base no válida."); return; }

        powerMode = true;
        secondGroup.style.display = "block"; // Muestra el segundo campo de texto para la potencia
        fillInfo("Operación: Potencia. Introduce el exponente en el segundo campo y pulsa '='");
    });


    // --- OPERACIONES BINARIAS (Suma, Resta, Multiplicación y División) ---

   document.getElementById('b-suma').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        globalOperand = Number(val);
        globalOperator = '+';
        fillInfo(`Operación: Suma. Primer operando guardado: ${globalOperand}`);
        inputField.value = "";
    });

    // Nuevo botón de Resta (-)
    document.getElementById('b-resta').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        globalOperand = Number(val);
        globalOperator = '-';
        fillInfo(`Operación: Resta. Primer operando guardado: ${globalOperand}`);
        inputField.value = "";
    });

    document.getElementById('b-mult').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        globalOperand = Number(val);
        globalOperator = '*';
        fillInfo(`Operación: Multiplicación. Primer operando guardado: ${globalOperand}`);
        inputField.value = "";
    });

    // Nuevo botón de División (÷)
    document.getElementById('b-div').addEventListener('click', () => {
        let val = inputField.value;
        if (!validate(val)) return;
        globalOperand = Number(val);
        globalOperator = '/';
        fillInfo(`Operación: División. Primer operando guardado: ${globalOperand}`);
        inputField.value = "";
    });

    document.getElementById('b-igual').addEventListener('click', () => {
        if (powerMode) {
            let val2 = inputField2.value;
            if (!validate(val2)) return;
            let exponent = Number(val2);
            let result = Math.pow(globalOperand, exponent);
            inputField.value = result;
            fillInfo(`Operación: Potenciación. El resultado es ${result}`);
            powerMode = false;
            secondGroup.style.display = "none";
            inputField2.value = "";
            return;
        }

        let val = inputField.value;
        if (!validate(val)) return;
        let secondOperand = Number(val);
        let result = 0;

        if (globalOperator === '+') {
            result = globalOperand + secondOperand;
            fillInfo(`Operación: Suma. El resultado es ${result}`);
        } else if (globalOperator === '-') {
            result = globalOperand - secondOperand;
            fillInfo(`Operación: Resta. El resultado es ${result}`);
        } else if (globalOperator === '*') {
            result = globalOperand * secondOperand;
            fillInfo(`Operación: Multiplicación. El resultado es ${result}`);
        } else if (globalOperator === '/') {
            if (secondOperand === 0) {
                alert("Error: Se ha intentado dividir entre 0.");
                fillInfo("Error: Se ha intentado dividir entre 0.");
                return;
            }
            result = globalOperand / secondOperand;
            fillInfo(`Operación: División. El resultado es ${result}`);
        } else {
            fillInfo("Error: No hay operación seleccionada.");
            return;
        }

        inputField.value = result;
        globalOperand = null;
        globalOperator = null;
    });

    // --- AMPLIACIÓN 3: OPERACIONES CSV AMPLIADAS ---

    const getCsvArray = () => {
        let val = inputField.value;
        if (!validate(val)) return null;
        let parts = val.split(",");
        let arr = [];
        for (let i = 0; i < parts.length; i++) {
            let num = Number(parts[i].trim());
            if (isNaN(num)) {
                alert("Error: La lista CSV contiene elementos no numéricos.");
                return null;
            }
            arr.push(num);
        }
        if (arr.length === 0) {
            alert("Error: Lista CSV vacía.");
            return null;
        }
        return arr;
    };

    document.getElementById('b-sum-csv').addEventListener('click', () => {
        let arr = getCsvArray();
        if (!arr) return;
        let sum = 0;
        for (let i = 0; i < arr.length; i++) { sum += arr[i]; }
        inputField.value = sum;
        fillInfo(`Lista de valores procesada: se han sumado los valores. El resultado es ${sum}`);
    });

    // Operación Media / Mean (Ampliación 3)
    document.getElementById('b-mean-csv').addEventListener('click', () => {
        let arr = getCsvArray();
        if (!arr) return;
        let sum = 0;
        for (let i = 0; i < arr.length; i++) { sum += arr[i]; }
        let mean = sum / arr.length;
        inputField.value = mean;
        fillInfo(`Lista de valores procesada: se ha calculado la media. El resultado es ${mean}`);
    });

    document.getElementById('b-sort-csv').addEventListener('click', () => {
        let arr = getCsvArray();
        if (!arr) return;
        arr.sort((a, b) => a - b);
        inputField.value = arr.join(",");
        fillInfo("Lista de valores procesada: se han ordenado los valores en orden ascendente.");
    });

    document.getElementById('b-reverse-csv').addEventListener('click', () => {
        let arr = getCsvArray();
        if (!arr) return;
        arr.reverse();
        inputField.value = arr.join(",");
        fillInfo("Lista de valores procesada: se ha invertido el orden de la lista.");
    });

    document.getElementById('b-removelast').addEventListener('click', () => {
        let arr = getCsvArray();
        if (!arr) return;
        arr.pop();
        inputField.value = arr.join(",");
        fillInfo("Lista de valores procesada: se ha eliminado el último elemento de la lista.");
    });

});








