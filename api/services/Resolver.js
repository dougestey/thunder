/**
 * Resolver
 *
 * @description :: Enriches data.
 * @help        :: See https://next.sailsjs.com/documentation/concepts/services
 */

let Resolver = {

  async nearestCelestial(position, systemId) {
    let {
      itemName,
      typeid: typeId,
      itemid: itemId } = await Fuzzworks.nearestCelestial(position, systemId);

    // Unfortunately Fuzzworks doesn't give us an itemName for stargates.
    // It does seem to handle belts and stations fine. More testing req'd.
    if (!itemName) {
      let type = await Swagger.type(typeId);

      if (type && type.name && type.name.indexOf('Stargate') !== -1) {
        let { name } = await Swagger.stargate(itemId);

        itemName = name;
      }
    }

    return itemName ? itemName : 'Unknown';
  },

  async composition(ids, characters) {

    sails.log.debug(`[Resolver.composition] Begin`);

    // ids: [] of pilots, each one containing `character_id` and `ship_type_id`
    // characters: [] of character records

    let shipTypeIds = [];

    // Strip hash into [] for Swagger.names
    _.forEach(ids, (shipTypeId) => {
      shipTypeIds.push(shipTypeId);
    });

    let resolvedShipTypes = await Swagger.names(_.uniq(shipTypeIds));

    _.forEach(ids, (shipTypeId, characterId) => {
      let charIndex = _.findIndex(characters, 'characterId', parseInt(characterId)),
          shipIndex = _.findIndex(resolvedShipTypes, 'id', shipTypeId);

      if (charIndex !== -1)
        characters[charIndex].ship = resolvedShipTypes[shipIndex];
    });

    sails.log.debug(`[Resolver.composition] End`);

    return characters;
  }

};

module.exports = Resolver;