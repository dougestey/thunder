/**
 * ZkillResolve
 *
 * @description :: Resolves zKill data to local model types.
 * @help        :: https://github.com/zKillboard/RedisQ
 */

module.exports = {

  async kill(package) {

    let { killmail } = package;

    if (!killmail)
      return;

    let {
      killmail_id: killId,
      killmail_time: time,
      solar_system_id: systemId,
      victim: {
        character_id: characterId,
        position,
        ship_type_id: shipTypeId
      }
    } = killmail;

    // Check for local record. If it exists, cancel further logic.
    let existingRecord = await Kill.find({ killId });

    if (existingRecord.length)
      return existingRecord[0];

    let { id: ship } = await Swagger.type(shipTypeId),
        { id: victim } = await Swagger.character(characterId),
        { id: system } = await Swagger.system(systemId);

    let kill = await Kill.create({
      killId,
      time,
      position,
      ship,
      victim,
      system
    }).fetch();

    if (!package.zkb.npc)
      Identifier.fleet(package.killmail, system, kill);

    return kill;
  }

};
