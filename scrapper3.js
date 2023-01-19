const axios = require("axios");
const url = "https://www.jumia.ug/sugar-3999/";
const cheerio = require("cheerio");

const items = [];
axios(url)
    .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $(".prd").each(function (i, el) {
            const price = $(el).find(".prc").text();
            const name = $(el).find(".name").text();
            const country = "Uganda"
            let date = new Date().toLocaleDateString()
            items.push({
                price,
                name,
                country,
                date
            })

        });
        console.log('============= Finished scrapping ======================')
        console.table(items)
        //     write the items to the database


    })
    .catch(console.error);
