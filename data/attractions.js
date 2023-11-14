import * as helpers from '../helpers.js';
import { attractions, businesses } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import e from 'express';
import { getBusinessById, getBusinessByUsername } from './business.js';
// no error checking for ids yet, need to add in photo
const createAttraction = async (businessId, attractionName, pointsOffered, description, bonusPoints, date, startTime, endTime, image, tags) => {
    if (!businessId || !pointsOffered || !description || !bonusPoints || !date || !startTime || !endTime || !attractionName || !tags || !image) {
      throw 'Error: All fields need to have valid values';
    }
    description = helpers.checkString(description, "Attraction description");
    date = helpers.checkString(date, "Attraction date");
    attractionName = helpers.checkString(attractionName, "Attraction name");
    date = helpers.checkDate(date);
    startTime = helpers.checkString(startTime, "Attraction start time");
    endTime = helpers.checkString(endTime, "Attraction end time");
    let regexNum = /^[0-9]*$/;
    let splitStartTime = startTime.split(':');
    let splitEndTime = endTime.split(':');
    if (
      splitStartTime.length != 2 ||
      splitStartTime[0].length != 2 ||
      splitStartTime[1].length != 2 ||
      !regexNum.test(splitStartTime[0]) ||
      !regexNum.test(splitStartTime[1])
    ) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (
      splitEndTime.length != 2 ||
      splitEndTime[0].length != 2 ||
      splitEndTime[1].length != 2 ||
      !regexNum.test(splitEndTime[0]) ||
      !regexNum.test(splitEndTime[1])
    ) {
      throw 'Error: Must provide end time in HH:MM format';
    }
    if (splitStartTime[0] * 1 < 0 || splitStartTime[0] * 1 > 23) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (splitStartTime[1] * 1 < 0 || splitStartTime[1] * 1 > 59) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (splitEndTime[0] * 1 < 0 || splitEndTime[0] * 1 > 23) {
      throw 'Error: Must provide end time in HH:MM format';
    }
    if (splitEndTime[1] * 1 < 0 || splitEndTime[1] * 1 > 59) {
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

    const businessCollection = await businesses();
    const existingBusiness = await businessCollection.findOne({ _id: new ObjectId(businessId) });

    if (existingBusiness)
    {
        await businessCollection.updateOne(
            {_id: new ObjectId(businessId)},
            {$inc: {numPosted: 1}}
        );
    }
    else
    {
        throw 'Error: businessId not associated with a business';
    }

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
      submissions: [],
      image: image,
      tags: tags
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

//editAttraction()
const editAttraction = async (businessId, attractionId, submissions, attractionName, pointsOffered, description, bonusPoints, date, startTime, endTime, image, tags) => {
    if (!businessId || !attractionId || !submissions || !attractionName || !date || !startTime || !pointsOffered || !description || !bonusPoints  ||!endTime || !image || !tags ) {
        throw 'Error: All fields need to have valid values';
    }
    description = helpers.checkString(description, "Attraction description");
    date = helpers.checkString(date, "Attraction date");
    attractionName = helpers.checkString(attractionName, "Attraction name");
    let regexNum = /^[0-9]*$/;
    startTime = helpers.checkString(startTime, "Attraction start time");
    endTime = helpers.checkString(endTime, "Attraction end time");
    let time = helpers.checkTime(startTime, endTime);
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
        startTime: time.startTime,
        endTime: time.endTime,
        pointsOffered: pointsOffered,
        bonusPoints: bonusPoints,
        description: description,
        submissions: submissions,
        image: image,
        tags: tags
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

const getAttractionsInChronologicalOrder = async () => {
  const attractionCollection = await attractions();
  const attractionList = await attractionCollection.find({}).toArray();
  const sortedAttractions = attractionList.sort((a, b) => {
    const dateComparison = new Date(a.date) - new Date(b.date)
    if (dateComparison !== 0) {
      return dateComparison;
    }
    
    return new Date(`1970-01-01T${a.startTime}`) - new Date(`1970-01-01T${b.startTime}`)
  });
  if (!sortedAttractions) {
    return [];
  } 
  else{
    return sortedAttractions;
  }
}

export { createAttraction, editAttraction, deleteAttraction, getAllAttractions, getAllAttractionsByBusinessId, get, getAttractionByBusinessName, getByName, getBusinessNameByAttractionName, getAttractionsInChronologicalOrder };