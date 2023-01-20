const axios = require("axios");
const url =
	"https://www.jumia.co.ke/sugar/-clovers---naturalli--brown--kabras--kakira--nature-s-choice--nutrameal/#catalog-listing";
const cheerio = require("cheerio");
const pg = require("pg");

// Connect to the DB
const conString =
	"postgres://qsrqsoqw:vkGR6ENEhHoBUf7oajDNf-DbqDX0oHsE@rosie.db.elephantsql.com/qsrqsoqw"; //Can be found in the Details page
const client = new pg.Client(conString);
client.connect(function (err) {
	if (err) {
		return console.error("could not connect to postgres", err);
	}
	client.query("SELECT * FROM sugar_data", function (err, result) {
		if (err) {
			return console.error("error running query", err);
		}
		console.log("from DB", result.rows);
		// >> output: 2018-08-23T14:02:57.117Z
		// client.end();
	});
});

const items = [];
axios(url)
	.then((response) => {
		const html = response.data;
		const $ = cheerio.load(html);

		$(".prd").each(function (i, el) {
			const price = $(el).children().attr("data-price");
			const name = $(el).find(".name").text();
			const item_id = $(el).children().attr("data-id");
			const country = "Kenya";
			let date = new Date().toLocaleDateString();
			items.push({
				item_id,
				price,
				name,
				country,
				date,
			});

			// console.log(item_id);
		});

		// console.log('============= Finished scrapping ======================')
		console.table(items);
		//     write the items to the database
		items.forEach((item) => {
			const query = `INSERT INTO sugar_data (item_id, price, name, date, country) VALUES ('${item.item_id}','${item.price}','${item.name}', '${item.date}', '${item.country}')`;
			client.query(query, (err, res) => {
				if (err) {
					console.log(err.stack);
				} else {
					console.log(`${item.name} inserted successfully!`);
				}
			});
		});
	})
	.catch(console.error);
