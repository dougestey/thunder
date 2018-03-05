/**
 * Scheduler
 *
 * @description :: Schedules jobs in Kue.
 * @help        :: https://github.com/Automattic/kue
 */

module.exports = {

  readKillStream() {
    let job = sails.config.jobs.create('read_kill_stream');

    job.on('failed', function(err) {
      console.error('[Scheduler.readKillStream] Job failed');
      console.error(err);
    });

    job.save();
  },

  determineFleetLife() {
    let job = sails.config.jobs.create('determine_fleet_life');

    job.on('failed', function(err) {
      console.error('[Scheduler.readKillStream] Job failed');
      console.error(err);
    });

    job.save();
  }

};
