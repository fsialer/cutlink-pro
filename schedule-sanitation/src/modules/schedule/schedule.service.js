const scheduleRepository = require("./schedule.repository");

module.exports = {
    deleteUrl
}

async function deleteUrl(created_at) {
    const result = await scheduleRepository.deleteUrl(created_at)
    return result
}