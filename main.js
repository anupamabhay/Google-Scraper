const container = document.querySelector(".container")
const form = document.getElementsByClassName("form"); 
const input = document.getElementById("query-input");
const resultCount = document.getElementById("result-count");
const btn = document.getElementById("btn");

const output = document.createElement("p");
output.setAttribute("id", "query-output");

function handleSubmit(e) {
    e.preventDefault();
    let inputValue = input.value.trim();
    if(inputValue !== "" || inputValue !== null){
        output.innerHTML = `<p id="query-header">Query: "${inputValue}"</p>`;
        container.appendChild(output);
    }
    let resultCountValue = resultCount.value;
    //API Request
    axios.get('https://app.scrapingbee.com/api/v1/store/google', {
        params: {
            'api_key': 'YOUR_API_KEY',
            'search': inputValue.toString(),
            'language': 'en',
            'nb_results': resultCountValue, //the documentation tells you to add this header to limit the number of results to be returned but even after adding nb_results: 5, the number of results keep varrying between 3-5. When I use 6, it shows anything between 4-6. It's not consistent and that's not my fault.
        }
    }).then(function (response) {
        // handle success
        const resultData = (response.data);
        const organicData = resultData.organic_results;
        const topUrl = organicData.map((res) => res.url);
        const topTitle = organicData.map((res) => res.title);
        const topDisUrl = organicData.map((res) => res.displayed_url);
        const topDesc = organicData.map((res) => res.description);

        output.innerHTML += `<p id="result-header">Results</p>`;
        for(let i = 0; i < organicData.length; i++) {
            output.innerHTML += 
            `<div id="result-item">   
                <p id="result-title">${topTitle[i]}</p>
                <a href="${topUrl[i]}" target="_blank"rel="noopener noreferrer" id="result-url">${topDisUrl[i]}</a>
                <p id="result-description">${topDesc[i]}</p>
            </div>
            `;
        }
    }).catch(function (reject) {
        //handle error
        console.log(reject);
    })
    input.value = "";
    resultCount.value = null;
}

