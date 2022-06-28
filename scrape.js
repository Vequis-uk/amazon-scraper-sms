//Packages
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const url = 'https://www.amazon.co.uk/MSI-GeForce-3090-GAMING-TRIO/dp/B09Q315PGB/ref=sr_1_1?crid=2MBYRNJRXVPFU&keywords=3090+ti&qid=1656405846&sprefix=3090+ti%2Caps%2C100&sr=8-1';

const product = {name: "", price: "", link: ""};

//Set interval - runs every 20 seconds
const handle = setInterval(scarape, 20000);

async function scrape(){
    //Fetch the data
    const { data } = await axios.get(url);
    //Load the HTML
    const $ = cheerio.load(data);
    const item = $("div#dp-container");
    //Extract the data that we need
    product.name = $(item).find("h1 span#productTitle").text();
    product.link = url;
    const price = $(item)
        .find("span .a-price-whole")
        .first()
        .text()
        .replace(/[,.]/g, "");
    const priceNum = parseInt(price);
    product.price = priceNum;
    
    //Send a SMS
    if(priceNum < 2000){
        client.messages
        .create({
            body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
            from: "+18576754136",
            to: '+447787269003',
        })
        .then((message) => {
            console.log(message);
            //Stops when succeeds
            clearInterval(handle);
        });
    }
}

scrape();