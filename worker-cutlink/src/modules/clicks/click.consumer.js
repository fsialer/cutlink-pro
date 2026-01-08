const { updateClicks } = require('./click.repository')

async function processClick(clickData) {
    try {
        console.log("clickData: ", clickData)
        const { short_code } = clickData;
        console.log(`[Worker] Processing click for ID: ${short_code}`);
        const result = await updateClicks(short_code)

        if (result.affectedRows === 0) {
            console.warn(`[Worker] Warning: No URL found for ID ${short_code} or clicks not updated.`);
        } else {
            console.log(`[Worker] Updated click count for URL ID: ${short_code} `);
        }

    } catch (error) {
        console.error('Error processing click in consumer', error);
        throw error;
    }
}



module.exports = {
    processClick
};
