'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../initial_data/accessories.json');

const TABLE_NAME = 'Accessories';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert(TABLE_NAME, data.map(item => ({
      ...item,
      description: JSON.stringify(item.description)
    })));
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};

