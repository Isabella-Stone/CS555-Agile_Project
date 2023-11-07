import { getUserData, editUserData, businessData, attractionData } from '../data/index.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

async function main() {
  try {
    const user1 = await editUserData.createUser(
        "Areeb", 
        "Chaudhry", 
        "areeb1@gmail.com", 
        "Qwertyuiop@123", 
        "kash123", 
        21
    );
    const user2 = await editUserData.createUser(
        'Shailaja', 
        'Vyas', 
        'svyaslol@gmail.com',
        'Hello!123',
        "svyas456",
        22
    );
    const user3 = await editUserData.createUser(
        "Mariam", 
        "Dardir", 
        "mariamd@gmail.com", 
        "Happy123!", 
        "mxrixm", 
        21
    );
    const user4 = await editUserData.createUser(
        "Patrick", 
        "Hill", 
        "pattyhills@gmail.com", 
        "Abcd123!!", 
        "pattyhill", 
        48
    );
    const user5 = await editUserData.createUser(
        "Megan", 
        "Sanford", 
        "msanford@gmail.com", 
        "Abc123!!", 
        "megsan", 
        21
    );
  } catch (e) {
    console.log('User: ' + e);
  }
  try {
    const business1 = await businessData.createBusiness
    (
        'Fred', 
        'Bagel', 
        'OBagel', 
        'obagel@gmail.com',
        'Hello123!',
        'obagel_official',
        20
    );
    const business2 = await businessData.createBusiness
    (
        'Joe', 
        'Giovanni', 
        'Giovannis Italian',
        'giovannis@gmail.com',
        'Hello!123',
        'giovannis_italian',
        30
    );
    const business3 = await businessData.createBusiness
    (
        'Peter', 
        'Pan', 
        'Piki Poke',
        'pikipoke@gmail.com', 
        'Hello!!123',
        'piki_poke',
        40
    );
    const business4 = await businessData.createBusiness
    (
        'Ravi', 
        'Bhalla', 
        'City of Hoboken',
        'cityHoboken@gmail.com', 
        'Hello!!123',
        'city_of_hoboken',
        49
    );
    const business5 = await businessData.createBusiness
    (
        'Janet', 
        'Wallach',
        'Boys and Girls Club',
        'boysandgirls@gmail.com', 
        'Hello!0123',
        'bgc_official',
        67
    );

  //change this once business id is no longer used to reference attractions
    const business1_attraction1 = await attractionData.createAttraction(
        business1._id.toString(),
        "none", 
        "Bagel Party", 
        "50", 
        "early bird special", 
        "0", 
        "11/14/2023", 
        "08:00", 
        "12:00",
        "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"
      );
      const business2_attraction1 = await attractionData.createAttraction(
          business2._id.toString(),
          "none", 
          "Italian Festival", 
          "100", 
          "Exploring Italian Culture", 
          "0", 
          "11/25/2023", 
          "17:00", 
          "20:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"

      );
        const business3_attraction1 = await attractionData.createAttraction(
          business3._id.toString(),
          "none", 
          "Grand Opening", 
          "50", 
          "Free Sushi Samples to Celebrate", 
          "0", 
          "11/10/2023", 
          "12:00", 
          "14:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"

      );
      const business4_attraction1 = await attractionData.createAttraction(
          business4._id.toString(),
          "none", 
          "Waterfront City Celebration", 
          "100", 
          "Community Get Together", 
          "0", 
          "11/24/2023", 
          "12:00", 
          "20:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"

        );
      const business5_attraction1 = await attractionData.createAttraction(
          business5._id.toString(),
          "none", 
          "Boys and Girls Club Mural Revealing", 
          "50", 
          "Fundraising and Community Outreach Event", 
          "1", 
          "12/05/2023", 
          "15:00", 
          "19:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"

      );
  } catch (e) {
    console.log('Business: ' + e);
  }
}

await main();
await closeConnection();
