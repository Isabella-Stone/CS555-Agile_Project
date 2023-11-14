import * as helpers from '../helpers.js';
import { attractions, businesses } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { getBusinessById, getBusinessByUsername } from './business.js';
import { getUserById } from './getUsers.js';
import { get } from './attractions.js';

const newSubmission = async (attractionId, userId, image, comment, rating, date, time, status) => {
    //TODO: time and date range checks?
    //status: (approved, declined, pending), optional param
    if (!attractionId || !userId || !image || !comment || !rating || !date || !time) {
        throw 'Error: All fields need to have valid values';
    }
    //check for image?
    attractionId = helpers.checkString(attractionId, "Attraction ID");
    if (!ObjectId.isValid(attractionId)) {
        throw 'Error: Invalid attractionId';
    }
    try {
        let user = await getUserById(userId);
    }
    catch (e)
    {
        throw 'Error: userId does not belong to a user';
    }
    comment = helpers.checkString(comment, "comment");
    rating = helpers.checkRating(rating);
    date = helpers.checkDate(date);
    time = helpers.checkString(time, "time");
    let regexNum = /^[0-9]*$/;
    let splitTime = time.split(':');
    if (
        splitTime.length != 2 ||
        splitTime[0].length != 2 ||
        splitTime[1].length != 2 ||
      !regexNum.test(splitTime[0]) ||
      !regexNum.test(splitTime[1])
    ) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (splitTime[0] * 1 < 0 || splitTime[0] * 1 > 23) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (splitTime[1] * 1 < 0 || splitTime[1] * 1 > 59) {
      throw 'Error: Must provide start time in HH:MM format';
    }
    if (!status)
    {
        status = "pending";
    }
    status = status.toLowerCase();
    status = helpers.checkStatus(status);

    //ensure attractionId exists in an attraction
    try {
        const attraction = await get(attractionId);
    }
    catch (e)
    {
        throw 'Error: attractionId not associated to an attraction'
    }

    let attractionsListForAUser = await getSubmissionsByUserId(userId, attractionId);
    if (attractionsListForAUser.length>0)
    {
        throw 'Error: User already made a submission';
    }

    let newSubmission = {
        _id: new ObjectId(),
        userId: userId,
        image: image,
        comment: comment,
        rating: rating,
        date: date,
        time: time,
        status: status
      };
    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne(
        { _id: new ObjectId(attractionId) },
        { $push: { submissions: newSubmission } }
    );
    if (!updateInfo.acknowledged || updateInfo.modifiedCount != 1) throw 'Could not add submission';
    newSubmission._id = newSubmission._id.toString();
    return newSubmission;
};
const getSubmissionsByUserId = async (userId, attractionId) => {
    if (!userId) {
        throw 'Error: User ID is required';
    }
    userId = helpers.checkString(userId, "User ID");

    const attractionCollection = await attractions();
    let submissionsForAUser = await attractionCollection.find({
        'submissions.userId': userId,
        '_id': new ObjectId(attractionId)
    }).toArray();

    return submissionsForAUser;
};
const getSubmissions = async (attractionId) => {
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
    return attraction.submissions;
};
const getApprovedSubmissions = async (attractionId) => {
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
    let fullSubList = attraction.submissions;
    
    let approvedSubsList = [];
    for (let i=0;i<fullSubList.length;i++)
    {
        let currentSub = fullSubList[i];
        if (currentSub.status.localeCompare('approved') == 0)
        {
            approvedSubsList.push(fullSubList[i]);
        }
    }
    return approvedSubsList;
};
const getSubmission = async (id) => {
    if (!id) {
        throw 'Error: ID is required';
    }
    id = helpers.checkString(id, "User ID");
    const attractionCollection = await attractions();
    
    let attraction = await attractionCollection.findOne(
        { 'submissions._id': new ObjectId(id) },
        { projection: { submissions: { $elemMatch: { _id: new ObjectId(id) } } } }
    );
    if (!attraction || !attraction.submissions || attraction.submissions.length == 0) {
        throw 'Error: Submission not found';
    }
    let submission = attraction.submissions[0];
    submission._id = submission._id.toString();
    return submission;
};
const approveSubmission = async (id) => {
    if (!id) {
        throw 'Error: ID is required';
    }
    id = helpers.checkString(id, "User ID");

    let submission = await getSubmission(id);
    if (submission.status === 'approved') {
        throw "Error: status is already approved";
    }

    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne(
        { 'submissions._id': new ObjectId(id) },
        { $set: { 'submissions.$.status': 'approved' } }
    );
    if (!updateInfo.acknowledged || updateInfo.modifiedCount != 1) throw 'Could not approve submission';
    submission = await getSubmission(id);
    return submission;
};
const declineSubmission = async (id) => {
    if (!id) {
        throw 'Error: ID is required';
    }
    id = helpers.checkString(id, "User ID");

    let submission = await getSubmission(id);
    if (submission.status === 'declined') {
        throw "Error: status is already declined";
    }

    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne(
        { 'submissions._id': new ObjectId(id) },
        { $set: { 'submissions.$.status': 'declined' } }
    );
    if (!updateInfo.acknowledged || updateInfo.modifiedCount != 1) throw 'Could not decline submission';
    submission = await getSubmission(id);
    return submission;
};
const editSubmission = async () => {
    //may not need
};

export { newSubmission, getSubmissions, getSubmission, getApprovedSubmissions, approveSubmission, declineSubmission, editSubmission};