const container = document.querySelector(".container")
const form = document.getElementsByClassName("form"); 
const input = document.getElementById("query-input");
const btn = document.getElementById("btn");

const output = document.createElement("p");
output.setAttribute("id", "query-output");

function handleSubmit(e) {
    e.preventDefault();
    let inputValue = input.value.trim();
    if(inputValue !== "" || inputValue !== null){
        output.innerHTML = `Searched for: ${inputValue} <br><br>`;
        container.appendChild(output);
    }
    //API Request
    axios.get('https://app.scrapingbee.com/api/v1/store/google', {
        params: {
            'api_key': 'YOUR_API_KEY',
            'search': inputValue.toString(),
            'language': 'en',
            'nb_results': 6, //the documentation tells you to add this header to limit the number of results to be returned but even after adding nb_results: 5, the number of results keep varrying between 3-5. When I use 6, it shows anything between 4-6. It's not consistent and that's not my fault.
        }
    }).then(function (response) {
        // handle success
        const resultData = (response.data);
        const organicData = resultData.organic_results;
        const top5Url = organicData.map((res) => res.url);
        const top5Title = organicData.map((res) => res.title);
        const top5DisUrl = organicData.map((res) => res.displayed_url);
        const top5Desc = organicData.map((res) => res.description);

        output.innerHTML += "<u>The top 5 results are:</u> <br><br>";
        for(i = 0; i < organicData.length; i++) {
            output.innerHTML += 
            `
                <span id="result-title">${top5Title[i]}</span> <br>
                <a href="${top5Url[i]}" target="_blank"rel="noopener noreferrer" id="result-url">${top5DisUrl[i]}</a> <br>
                <span id="result-description">${top5Desc[i]}</span> <br><br>
            `;
        }
    }).catch(function (reject) {
        //handle error
        console.log(reject);
    })
    input.value = "";
}

