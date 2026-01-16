import { updateClicks } from './click.repository.js'

async function processClick(clickData) {
    try {
        const { short_code } = clickData;
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



export {
    processClick
};
