import * as helpers from '../helpers.js';
import { attractions, businesses } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import e from 'express';
import { getBusinessById, getBusinessByUsername } from './business.js';
// no error checking for ids yet, need to add in photo
const createAttraction = async (businessId, submissions, attractionName, pointsOffered, description, bonusPoints, date, startTime, endTime, image) => {
    if (!businessId || !submissions || !pointsOffered || !description || !bonusPoints || !date || !startTime || !endTime || !attractionName) {
      throw 'Error: All fields need to have valid values';
    }
    description = helpers.checkString(description, "Attraction description");
    date = helpers.checkString(date, "Attraction date");
    attractionName = helpers.checkString(attractionName, "Attraction name");
    let splitDate = date.split('/');
    if (splitDate.length !== 3) {
      throw 'Error: Date must be in MM/DD/YYYY format';
    }
    let regexNum = /^[0-9]*$/;
    if (
      splitDate[0].length !== 2 ||
      splitDate[1].length !== 2 ||
      splitDate[2].length !== 4 ||
      !regexNum.test(splitDate[0]) ||
      !regexNum.test(splitDate[1]) ||
      !regexNum.test(splitDate[2])
    ) {
      throw 'Error: Date must be in MM/DD/YYYY format';
    }
    if (splitDate[0] * 1 < 1 || splitDate[0] * 1 > 12) {
      throw 'Error: Date must be in MM/DD/YYYY format';
    }
    if (splitDate[1] * 1 < 1 || splitDate[1] * 1 > 31) {
      throw 'Error: Date must be in MM/DD/YYYY format';
    }
    startTime = helpers.checkString(startTime, "Attraction start time");
    endTime = helpers.checkString(endTime, "Attraction end time");
    let st = startTime.split(':');
    let et = endTime.split(':');
    if (
      st.length != 2 ||
      st[0].length != 2 ||
      st[1].length != 2 ||
      !regexNum.test(st[0]) ||
      !regexNum.test(st[1])
    ) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (
      et.length != 2 ||
      et[0].length != 2 ||
      et[1].length != 2 ||
      !regexNum.test(et[0]) ||
      !regexNum.test(et[1])
    ) {
      throw 'Error: Must provide end time in HH:MM format';
    }
    if (st[0] * 1 < 0 || st[0] * 1 > 23) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (st[1] * 1 < 0 || st[1] * 1 > 59) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (et[0] * 1 < 0 || et[0] * 1 > 23) {
      throw 'Error: Must provide end time in HH:MM format';
    }
    if (et[1] * 1 < 0 || et[1] * 1 > 59) {
      throw 'Error: Must provide end time in HH:MM format';
    }
    if (!regexNum.test(pointsOffered)) {
      throw 'Points offered must be a number';
    }
    if (!regexNum.test(bonusPoints)) {
        throw 'Bonus Points must be a number';
    }
    pointsOffered = parseInt(pointsOffered);
    bonusPoints = parseInt(bonusPoints);

    let newAttraction = {
      _id: new ObjectId(),
      businessId: businessId,
      attractionName: attractionName,
      date: date,
      startTime: startTime,
      endTime: endTime,
      pointsOffered: pointsOffered,
      bonusPoints: bonusPoints,
      description: description,
      submissions: submissions,
      image: image
    };
    const attractionCollection = await attractions();
    if (await attractionCollection.findOne({ attractionName: attractionName })) {
        throw 'Error: Attraction name already exists';
    }
    const insertInfo = await attractionCollection.insertOne(newAttraction);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add trip';
    const attraction = await get(newAttraction._id.toString());
    return attraction;
  };

//getAllAttractions()
const getAllAttractionsByBusinessId = async (businessId) => {
    if (!businessId) {
      throw 'You must provide an id to search for';
    }
    businessId = helpers.checkString(businessId, "Business ID");
    const attractionCollection = await attractions();
    const attractionsList = await attractionCollection.find({ businessId: businessId }).toArray();
    if (!attractionsList) throw 'Could not get all attractions';
    return attractionsList;
};

const getAllAttractions = async () => {
    const attractionCollection = await attractions();
    const attractionList = await attractionCollection.find({}).toArray();
    return attractionList;
};

//getAttractionByID()
const get = async (attractionId) => {
    if (!attractionId) {
      throw 'You must provide an id to search for';
    }
    attractionId = helpers.checkString(attractionId, "Attraction ID");
    if (!ObjectId.isValid(attractionId)) {
        throw 'Error: Invalid Object Id';
      }
      const attractionCollection = await attractions();
      const attraction = await attractionCollection.findOne({ _id: new ObjectId(attractionId) });
      if (!attraction) throw 'Error: Attraction not found';
      attraction._id = attraction._id.toString();
      return attraction;
  };

  const getByName = async (attractionName) => {
    if (!attractionName) {
      throw 'You must provide an attraction name to search for';
    }
    attractionName = helpers.checkString(attractionName, "Attraction Name");
      const attractionCollection = await attractions();
      const attraction = await attractionCollection.findOne({ attractionName: attractionName });
      if (!attraction) throw 'Error: Attraction not found';
      return attraction;
  };

//STILL NEEDS TO RECEIVE NEW IMAGE FROM EDITATTRACTION PAGE CURRENTLY HARDCODED
//editAttraction()
const editAttraction = async (businessId, attractionId, submissions, attractionName, pointsOffered, description, bonusPoints, date, startTime, endTime) => {
    if (!businessId || !attractionId || !submissions || !attractionName || !date || !startTime || !pointsOffered || !description || !bonusPoints  ||!endTime ) {
        throw 'Error: All fields need to have valid values';
    }
    description = helpers.checkString(description, "Attraction description");
    date = helpers.checkString(date, "Attraction date");
    attractionName = helpers.checkString(attractionName, "Attraction name");
    let regexNum = /^[0-9]*$/;
    startTime = helpers.checkString(startTime, "Attraction start time");
    endTime = helpers.checkString(endTime, "Attraction end time");
    let st = startTime.split(':');
    let et = endTime.split(':');
    if (
        st.length != 2 ||
        st[0].length != 2 ||
        st[1].length != 2 ||
        !regexNum.test(st[0]) ||
        !regexNum.test(st[1])
    ) {
        throw 'Error: Must provide start time in HH:MM format';
    }
    if (
        et.length != 2 ||
        et[0].length != 2 ||
        et[1].length != 2 ||
        !regexNum.test(et[0]) ||
        !regexNum.test(et[1])
    ) {
        throw 'Error: Must provide end time in HH:MM format';
    }
    if (st[0] * 1 < 0 || st[0] * 1 > 23) {
        throw 'Error: Must provide start time in HH:MM format';
    }
      if (st[1] * 1 < 0 || st[1] * 1 > 59) {
        throw 'Error: Must provide start time in HH:MM format';
      }
      if (et[0] * 1 < 0 || et[0] * 1 > 23) {
        throw 'Error: Must provide end time in HH:MM format';
      }
      if (et[1] * 1 < 0 || et[1] * 1 > 59) {
        throw 'Error: Must provide end time in HH:MM format';
      }
      if (!regexNum.test(pointsOffered)) {
        throw 'Points offered must be a number';
      }
      if (!regexNum.test(bonusPoints)) {
          throw 'Bonus Points must be a number';
      }
      pointsOffered = parseInt(pointsOffered);
      bonusPoints = parseInt(bonusPoints);

    const attractionCollection = await attractions();
    // let attraction = await attractionCollection.findOne({ _id: new ObjectId(attractionId) });
    const updatedAttraction = {
        businessId: businessId,
        attractionName: attractionName,
        date: date,
        startTime: startTime,
        endTime: endTime,
        pointsOffered: pointsOffered,
        bonusPoints: bonusPoints,
        description: description,
        submissions: submissions,
        image: "https://res.cloudinary.com/djllvfvts/image/upload/v1698704366/j9vlidni3pknclfw8qtn.png"
    };
    const updatedInfo = await attractionCollection.replaceOne({ _id: new ObjectId(attractionId) }, updatedAttraction);
  
    if (updatedInfo.modifiedCount === 0) {
      throw 'Could not update attraction successfully';
    }
  
    let newInfo = await getByName(attractionName);
    return newInfo;
};

//deleteAttraction() //shouldn't be able to delete event after its start time
const deleteAttraction = async (attractionId) => {
    if (!attractionId) {
        throw `Error: Id must be inputted`;
      }
      if (!ObjectId.isValid(attractionId)) {
        throw 'Error: Invalid Object Id';
      }
      const attractionCollection = await attractions();
      const deletionInfo = await attractionCollection.findOneAndDelete({
        _id: new ObjectId(id)
      });
      if (deletionInfo.lastErrorObject.n === 0) throw `Error: Could not delete attraction with id of ${id}`;
    
      return { ...deletionInfo.value, deleted: true };
};

const getAttractionByBusinessName = async (bis_name) => {
  if (!bis_name) {
    throw `Error: Business name must be inputed`;
  }
  bis_name = helpers.checkString(bis_name);
  let business = await getBusinessByUsername(bis_name);
  let id = business._id.toString();
  const attractionCollection = await attractions();
  const attraction = await attractionCollection.find({ businessId: id }).toArray();
  if (!attraction) {
    return [];
  } 
  else{
    return attraction;
  }
 
};

//Returns the name of the business that created the attraction with the given name
const getBusinessNameByAttractionName = async (attName) => {
  if (!attName) {
    throw `Error: Attraction name must be inputed`;
  }
  attName = helpers.checkString(attName);
  let attr = await getByName(attName);
  let business = await getBusinessById(attr.businessId); 
  return business.name;
 
};

export { createAttraction, editAttraction, deleteAttraction, getAllAttractions, getAllAttractionsByBusinessId, get, getAttractionByBusinessName, getByName, getBusinessNameByAttractionName };