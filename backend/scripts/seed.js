require("dotenv").config();

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("../src/models/User");
const Salon = require("../src/models/Salon");
const Service = require("../src/models/Service");

const connectDB = require("../src/config/db");


const seedDatabase = async () => {

  try {

    await connectDB();

    console.log("Database connected");


    /* CLEAR OLD DATA */

    await User.deleteMany();
    await Salon.deleteMany();
    await Service.deleteMany();

    console.log("Old data cleared");


    /* CREATE USERS */

    const users = [];

    for (let i = 0; i < 15; i++) {

      users.push({
        name: faker.person.fullName(),
        phone: faker.phone.number("9#########"),
        role: "user"
      });

    }

    /* CREATE OWNERS */

    for (let i = 0; i < 5; i++) {

      users.push({
        name: faker.person.fullName(),
        phone: faker.phone.number("8#########"),
        role: "owner"
      });

    }

    const createdUsers = await User.insertMany(users);

    console.log("Users created");


    const owners = createdUsers.filter(
      user => user.role === "owner"
    );


    /* CREATE SALONS */

    const salons = [];

    for (let i = 0; i < 10; i++) {

      const owner =
        owners[Math.floor(Math.random() * owners.length)];

      salons.push({

        name: faker.company.name(),
        description: faker.company.catchPhrase(),

        ownerId: owner._id,

        phone: faker.phone.number("9#########"),

        address: faker.location.streetAddress(),

        city: faker.location.city(),

        location: {
          type: "Point",
          coordinates: [
            Number(faker.location.longitude()),
            Number(faker.location.latitude())
          ]
        },

        rating: faker.number.float({
          min: 3,
          max: 5
        }),

        isApproved: true

      });

    }

    const createdSalons = await Salon.insertMany(salons);

    console.log("Salons created");


    /* CREATE SERVICES */

    const services = [];

    createdSalons.forEach((salon) => {

      for (let i = 0; i < 5; i++) {

        services.push({

          salonId: salon._id,

          name: faker.commerce.productName(),

          price: faker.number.int({
            min: 200,
            max: 1500
          }),

          duration: faker.number.int({
            min: 20,
            max: 60
          }),

          category: faker.helpers.arrayElement([
            "haircut",
            "beard",
            "facial",
            "spa"
          ])

        });

      }

    });

    await Service.insertMany(services);

    console.log("Services created");


    console.log("Database seeding completed successfully");


    await mongoose.connection.close();

    process.exit();

  } catch (error) {

    console.error("Seeding error:", error);

    process.exit(1);

  }

};


seedDatabase();