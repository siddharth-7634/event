var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
document.addEventListener("DOMContentLoaded", function () {
    var amount = document.getElementById("amount");
    var fromCurrency = document.getElementById("fromCurrency");
    var toCurrency = document.getElementById("toCurrency");
    var convertBtn = document.querySelector(".convert-btn");
    var result = document.getElementById("result");
    var error = document.getElementById("error");
    var loading = document.getElementById("loading");
    var updateTime = document.getElementById("updateTime");
    function getCurrencies() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, currencyData, _i, data_1, country, code, _a, currencyData_1, currency, option1, option2, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch("https://restcountries.com/v3.1/all?fields=name,currencies,flag")];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _b.sent();
                        currencyData = [];
                        for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                            country = data_1[_i];
                            if (country.currencies) {
                                for (code in country.currencies) {
                                    currencyData.push({
                                        code: code,
                                        name: country.currencies[code].name,
                                        flag: country.flag
                                    });
                                }
                            }
                        }
                        currencyData.sort(function (a, b) {
                            if (a.code < b.code)
                                return -1;
                            if (a.code > b.code)
                                return 1;
                            return 0;
                        });
                        for (_a = 0, currencyData_1 = currencyData; _a < currencyData_1.length; _a++) {
                            currency = currencyData_1[_a];
                            option1 = document.createElement("option");
                            option2 = document.createElement("option");
                            option1.value = currency.code;
                            option1.textContent = "".concat(currency.code, " - ").concat(currency.name);
                            option2.value = currency.code;
                            option2.textContent = "".concat(currency.code, " - ").concat(currency.name);
                            fromCurrency.add(option1);
                            toCurrency.add(option2);
                        }
                        fromCurrency.value = "USD";
                        toCurrency.value = "INR";
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        showErrorMessage("Couldn't load currencies, please try again");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function convert() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, rate, convertedAmount, updateDate, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!amount.value) {
                            showErrorMessage("Please type in an amount");
                            return [2 /*return*/];
                        }
                        loading.style.display = "block";
                        result.style.display = "none";
                        error.style.display = "none";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch("https://v6.exchangerate-api.com/v6/57343c2a7b4f07a7d16fc6bd/latest/".concat(fromCurrency.value))];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        if (data.result === "success") {
                            rate = data.conversion_rates[toCurrency.value];
                            convertedAmount = Number(amount.value) * rate;
                            showResult("".concat(amount.value, " ").concat(fromCurrency.value, " = ").concat(convertedAmount.toFixed(2), " ").concat(toCurrency.value));
                            updateDate = new Date(data.time_last_update_utc);
                            updateTime.textContent = "Last updated: ".concat(updateDate.toLocaleString());
                            updateTime.style.display = "block";
                        }
                        else {
                            showErrorMessage("Couldn't convert currency");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        showErrorMessage("Something went wrong, please try again");
                        return [3 /*break*/, 5];
                    case 5:
                        loading.style.display = "none";
                        return [2 /*return*/];
                }
            });
        });
    }
    function showResult(message) {
        result.style.display = "block";
        error.style.display = "none";
        result.textContent = message;
    }
    function showErrorMessage(message) {
        result.style.display = "none";
        error.style.display = "block";
        error.textContent = message;
        loading.style.display = "none";
    }
    convertBtn.addEventListener("click", convert);
    amount.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            convert();
        }
    });
    getCurrencies();
});
