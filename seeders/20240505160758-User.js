"use strict";

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const hashedPassword = await bcrypt.hash("qwerty123", 10);

    await queryInterface.bulkInsert("users", [
      {
        name: "Alex",
        surname: "Thompson",
        email: "alex@email.com",
        password: hashedPassword,
        uuid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Lucas",
        surname: "Rodriguez",
        email: "lucas@email.com",
        password: hashedPassword,
        uuid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Leo",
        surname: "Smith",
        email: "leo@email.com",
        password: hashedPassword,
        uuid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "John",
        surname: "Cox",
        email: "john@email.com",
        password: hashedPassword,
        uuid: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users");
  },
};
