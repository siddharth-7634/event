document.addEventListener("DOMContentLoaded", () => {
    const amount =<HTMLInputElement> document.getElementById("amount");
    const fromCurrency =<HTMLSelectElement> document.getElementById("fromCurrency") 
    const toCurrency = document.getElementById("toCurrency") as HTMLSelectElement;
    const convertBtn = document.querySelector(".convert-btn") as HTMLButtonElement;
    const result = document.getElementById("result") as HTMLDivElement;
    const error = document.getElementById("error") as HTMLDivElement;
    const loading = document.getElementById("loading") as HTMLDivElement;
    const updateTime = document.getElementById("updateTime") as HTMLDivElement;

    type CurrencyList = {
        code: string,
        name: string,
        flag: string
    }

    async function fetchCurrency(): Promise<void>  {
        try {
            const response = await fetch("https://restcountries.com/v3.1/all?fields=name,currencies,flag");
            const data = await response.json();
            
            let currencyData: CurrencyList[] = [];
            
            for(let country of data) {
                if(country.currencies) {
                    for(let code in country.currencies) {
                        currencyData.push({
                            code: code,
                            name: country.currencies[code].name,
                            flag: country.flag
                        });
                    }
                }
            }

            currencyData.sort((a, b) => {
                if(a.code < b.code) return -1;
                if(a.code > b.code) return 1;
                return 0;
            });

            for(let currency of currencyData) {
                let option1 = document.createElement("option");
                let option2 = document.createElement("option");
                
                option1.value = currency.code;
                option1.textContent = `${currency.code} - ${currency.name}`;
                option2.value = currency.code;
                option2.textContent = `${currency.code} - ${currency.name}`;
                
                fromCurrency.add(option1);
                toCurrency.add(option2);
            }

            fromCurrency.value = "USD";
            toCurrency.value = "INR";
        } catch(error) {
            showErrorMessage("Couldn't load currencies, please try again");
        }
    }

    async function convert() :Promise<void> {
        if(!amount.value) {
            showErrorMessage("Please type in an amount");
            return;
        }

        loading.style.display = "block";
        result.style.display = "none";
        error.style.display = "none";

        try {
            let response = await fetch(`https://v6.exchangerate-api.com/v6/57343c2a7b4f07a7d16fc6bd/latest/${fromCurrency.value}`);
            let data = await response.json();

            if(data.result === "success") {
                let rate = data.conversion_rates[toCurrency.value];
                let convertedAmount = Number(amount.value) * rate;
                
                showResult(`${amount.value} ${fromCurrency.value} = ${convertedAmount.toFixed(2)} ${toCurrency.value}`);
                
                let updateDate = new Date(data.time_last_update_utc);
                updateTime.textContent = `Last updated: ${updateDate.toLocaleString()}`;
                updateTime.style.display = "block";
            } else {
                showErrorMessage("Couldn't convert currency");
            }
        } catch(error) {
            showErrorMessage("Something went wrong, please try again");
        }

        loading.style.display = "none";
    }

    function showResult(message: string):void {
        result.style.display = "block";
        error.style.display = "none";
        result.textContent = message;
    }

    function showErrorMessage(message: string):void {
        result.style.display = "none";
        error.style.display = "block";
        error.textContent = message;
        loading.style.display = "none";
    }

    convertBtn.addEventListener("click", convert);
    
    amount.addEventListener("keyup", (e) => {
        if(e.key === "Enter") {
            convert();
        }
    });

    fetchCurrency();
});
