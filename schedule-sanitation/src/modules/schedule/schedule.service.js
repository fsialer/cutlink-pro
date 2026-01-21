import scheduleRepository from "./schedule.repository.js";

export default {
    deleteUrl
}

async function deleteUrl(created_at) {
    const result = await scheduleRepository.deleteUrl(created_at)
    return result
}