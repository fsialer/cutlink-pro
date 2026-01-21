import cron from 'node-cron'
import config from '../../config/index.js'
import scheduleService from './schedule.service.js'

function startSchedule() {
    console.log('Initializing schedule tasks...')

    const cronExpress = config.cronSchedule || '*/5 * * * *'

    // Define the sanitation task
    const sanitationTask = async () => {
        console.log('Start sanitation process')
        try {
            // Calculate date 120 days ago in UTC
            const now = new Date();
            const date120daysAgo = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() - 120,
                0, 0, 0, 0
            ));

            console.log(`Current UTC time: ${now.toISOString()}`)
            console.log(`Deleting URLs older than: ${date120daysAgo.toISOString()}`)

            // Delete all data older than 120 days
            const result = await scheduleService.deleteUrl(date120daysAgo)
            if (result.affectedRows > 0) {
                console.log(`✓ Deleted ${result.affectedRows} old URLs`)
            } else {
                console.log('No old URLs to delete')
            }
        } catch (error) {
            console.error('Error in sanitation process:', error)
        }
    }

    // Run every 5 minutes (for testing) - Change to '0 0 * * *' for daily at midnight
    cron.schedule(cronExpress, sanitationTask, {
        timezone: "GMT"
    })

    console.log('✓ Schedule tasks initialized successfully (GMT timezone)')
    console.log('Cron pattern: ' + cronExpress)

    // Run immediately on startup for testing
    console.log('Running initial sanitation check...')
    sanitationTask()
}

export default startSchedule