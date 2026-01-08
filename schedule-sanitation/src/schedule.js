const startSchedule = require('./modules/schedule/schedule.consumer');

console.log('Starting schedule worker...');

try {
    startSchedule();
    console.log('✓ Schedule worker started successfully');
    console.log('Cron job will run daily at midnight (00:00)');
} catch (error) {
    console.error('✗ Failed to start schedule worker:', error);
    process.exit(1);
}

// Keep the process running
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});