
import countries from './countries.json'
import convertActionContent from './convertActionContent'

const Utils = {
    formatCurrency(amount, decimalCount = 8, decimal = ".", thousands = ",") {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 8 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseFloat(parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()).toString()
        let j = (i.length > 3) ? i.length % 3 : 0;

        let decimalPart = decimalCount ? Math.abs(amount - i).toFixed(decimalCount).slice(2) : ""
        decimalPart = '0.' + decimalPart

        if (parseFloat(decimalPart) === 0) {
            decimalPart = ''
        } else {
            decimalPart = parseFloat(decimalPart).toString().substring(1, decimalPart.length)
        }

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + decimalPart;
    },

    convertDate(nanoTime) {
        var timestamp = nanoTime / 10**9
        var a = new Date(timestamp * 1000);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    },

    countryCodeToContryName(code) {
        const filter = countries.filter(value => {return value.code === code})
        if(filter.length === 0) return "Unknown"
        return filter[0].name
    },

    getTransactionErrorMessage(message) {
        let regex = /Stack tree: \nError: (.*)/gm;
        let m = regex.exec(message)

        if(m && m[1]) return m[1]

        regex = /error: (.*)/gm;
        m = regex.exec(message)

        if(m && m[1]) {
            try {
                const json = JSON.parse(m[1])
                return json.message
            } catch {
                return m[1]
            }
        }

        return "Can't get error message"
    },

    properCase(string) {
        return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },

    convertActionContent: convertActionContent
}

export default Utils