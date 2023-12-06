import { getUserData, editUserData, businessData, attractionData, submissionData } from '../data/index.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';

//lets drop the database each time this is run
const db = await dbConnection();
await db.dropDatabase();

async function main() {
  let user1, user2, user3, user4, user5, user6;
  let business1, business2, business3, business4, business5;
  let business1_attraction1, business1_attraction2, business2_attraction1, business3_attraction1, business4_attraction1, business4_attraction2, business5_attraction1;
  let attraction1_submission1, attraction1_submission2, attraction1_submission3, attraction1_submission4;
  let attraction4_submission1, attraction4_submission2;
  let attraction6_submission1;
  try {
    user1 = await editUserData.createUser(
        "Areeb", 
        "Chaudhry", 
        "areeb1@gmail.com", 
        "Qwertyuiop@123", 
        "kash123", 
        21,
        ["City-wide Events", "Business/Restaurant Events"]
    );
    user2 = await editUserData.createUser(
        'Shailaja', 
        'Vyas', 
        'svyaslol@gmail.com',
        'Hello!123',
        "svyas456",
        22,
        ["Business/Restaurant Events", "Art Events", "Cultural Events", "Volunteering Events"]
    );
    user3 = await editUserData.createUser(
        "Mariam", 
        "Dardir", 
        "mariamd@gmail.com", 
        "Happy123!", 
        "mxrixm", 
        21,
        ["Volunteering Events"]
    );
    user4 = await editUserData.createUser(
        "Patrick", 
        "Hill", 
        "pattyhills@gmail.com", 
        "Abcd123!!", 
        "pattyhill", 
        48,
        ["Cultural Events", "Volunteering Events"]
    );
    user5 = await editUserData.createUser(
        "Megan", 
        "Sanford", 
        "msanford@gmail.com", 
        "Abc123!!", 
        "megsan", 
        21,
        ["City-wide Events", "Cultural Events", "Volunteering Events"]
    );
    user6 = await editUserData.createUser(
      "Ryan", 
      "Giovanniello", 
      "rcgiovanniello@gmail.com", 
      "Wrong123!", 
      "rgiova", 
      21,
      ["City-wide Events", "Business/Restaurant Events", "Art Events", "Cultural Events"]
  );
  } catch (e) {
    console.log('User: ' + e);
  }
  try {
    business1 = await businessData.createBusiness
    (
        'Fred', 
        'Bagel', 
        'OBagel', 
        'obagel@gmail.com',
        'Hello123!',
        'obagel_official',
        20
    );
    business2 = await businessData.createBusiness
    (
        'Joe', 
        'Giovanni', 
        'Giovannis Italian',
        'giovannis@gmail.com',
        'Hello!123',
        'giovannis_italian',
        30
    );
    business3 = await businessData.createBusiness
    (
        'Peter', 
        'Pan', 
        'Piki Poke',
        'pikipoke@gmail.com', 
        'Hello!!123',
        'piki_poke',
        40
    );
    business4 = await businessData.createBusiness
    (
        'Ravi', 
        'Bhalla', 
        'City of Hoboken',
        'cityHoboken@gmail.com', 
        'Hello!!123',
        'city_of_hoboken',
        49
    );
    business5 = await businessData.createBusiness
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
    business1_attraction1 = await attractionData.createAttraction(
        business1._id.toString(),
        "Bagel Party", 
        "50", 
        "early bird special", 
        "0", 
        "12/05/2023", 
        "08:00", 
        "12:00",
        "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
        ["Business/Restaurant Events"],
        [user1._id.toString(), user2._id.toString()]
      );
      business1_attraction2 = await attractionData.createAttraction(
        business1._id.toString(),
        "Thanskgiving Brunch", 
        "50", 
        "Share Thanksgiving as a Community", 
        "5", 
        "11/23/2023", 
        "10:00", 
        "12:30",
        "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
        ["City-wide Events", "Business/Restaurant Events", "Cultural Events"],
        []
      );
      business2_attraction1 = await attractionData.createAttraction(
          business2._id.toString(),
          "Italian Festival", 
          "100", 
          "Exploring Italian Culture", 
          "0", 
          "12/25/2023", 
          "17:00", 
          "20:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
          ["Cultural Events"],
          [user2._id.toString()]
      );
        business3_attraction1 = await attractionData.createAttraction(
          business3._id.toString(),
          "Grand Opening", 
          "50", 
          "Free Sushi Samples to Celebrate", 
          "0", 
          "12/10/2023", 
          "12:00", 
          "14:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
          ["Business/Restaurant Events"],
          []

      );
      business4_attraction1 = await attractionData.createAttraction(
          business4._id.toString(),
          "Waterfront City Celebration", 
          "300", 
          "Community Get Together", 
          "200", 
          "12/07/2023", 
          "12:00", 
          "20:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
          ["City-wide Events"],
          []
        );
        business4_attraction2 = await attractionData.createAttraction(
          business4._id.toString(),
          "Park Cleanup", 
          "100", 
          "Park Cleanup Volunteering Event", 
          "0", 
          "12/27/2023", 
          "08:00", 
          "14:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
          ["City-wide Events", "Volunteering Events"],
          []
        );
      business5_attraction1 = await attractionData.createAttraction(
          business5._id.toString(),
          "Boys and Girls Club Mural Revealing", 
          "50", 
          "Fundraising and Community Outreach Event", 
          "1", 
          "12/05/2023", 
          "15:00", 
          "19:00",
          "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
          ["City-wide Events", "Art Events"],
          []
      );
    // let attending1 = await attractionData.rsvp(business1_attraction1._id, 'rsvp', user1._id);
    // let attending2 = await attractionData.rsvp(business1_attraction1._id, 'rsvp', user2._id);
    // let attending3 = await attractionData.rsvp(business1_attraction1._id, 'rsvp', user3._id);
    // let notattending = await attractionData.rsvp(business1_attraction1._id, 'undo', user2._id);
  } catch (e) {
    console.log('Business/Attraction: ' + e);
  }
  try {
    attraction1_submission1 = await submissionData.newSubmission(
      //attractionId, userId, image, comment, rating, date, time, status
      business1_attraction1._id.toString(),
      user4._id.toString(),
      "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
      "I love bagels", 
      4,
      "12/05/2023", 
      "10:30",
      "approved"
    );
    await editUserData.awardPoints(user4._id.toString(), business1_attraction1.pointsOffered);
    attraction1_submission2 = await submissionData.newSubmission(
      business1_attraction1._id.toString(),
      user2._id.toString(),
      "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
      "I've never had such a good breakfast sandwich!", 
      5,
      "12/05/2023", 
      "11:00",
      "approved"
    );
    await editUserData.awardPoints(user2._id.toString(), business1_attraction1.pointsOffered);
    attraction1_submission3 = await submissionData.newSubmission(
      business1_attraction1._id.toString(),
      user3._id.toString(),
      "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
      "This bagel is bussin", 
      5,
      "12/05/2023", 
      "11:15",
      "pending"
    );
    attraction1_submission4 = await submissionData.newSubmission(
      business1_attraction1._id.toString(),
      user6._id.toString(),
      "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
      "This food was awful! Never coming back", 
      1,
      "12/05/2023", 
      "11:00",
      "declined"
    );
    attraction4_submission1 = await submissionData.newSubmission(
      business4_attraction1._id.toString(),
      user1._id.toString(),
      "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
      "I love sushi", 
      5,
      "12/07/2023", 
      "13:30",
      "approved"
    );
    await editUserData.awardPoints(user1._id.toString(), business4_attraction1.pointsOffered+business4_attraction1.bonusPoints);
    attraction4_submission2 = await submissionData.newSubmission(
      business4_attraction1._id.toString(),
      user2._id.toString(),
      "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
      "The sushi brings back memories", 
      4,
      "12/07/2023", 
      "13:00",
      "pending"
    );

    attraction6_submission1 = await submissionData.newSubmission(
      business1_attraction2._id.toString(),
      user2._id.toString(),
      "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png",
      "I'm thankful for a good breakfast", 
      3,
      "11/23/2023", 
      "11:00",
      "approved"
    );
    await editUserData.awardPoints(user2._id.toString(), business1_attraction2.pointsOffered);
  }
  catch (e) {
    console.log('Submission: ' + e);
  }
}

await main();
await closeConnection();
