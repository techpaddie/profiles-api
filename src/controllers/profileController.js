const {
  createProfile,
  getProfileById,
  getAllProfiles,
  deleteProfileById
} = require("../services/profileService");
const { validateNameInput } = require("../utils/validator");

async function createProfileHandler(req, res, next) {
  try {
    const { name } = req.body;
    validateNameInput(name);

    const result = await createProfile(name);
    if (result.alreadyExists) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: result.profile
      });
    }

    return res.status(201).json({
      status: "success",
      data: result.profile
    });
  } catch (error) {
    return next(error);
  }
}

async function getProfileByIdHandler(req, res, next) {
  try {
    const profile = await getProfileById(req.params.id);
    return res.status(200).json({
      status: "success",
      data: profile
    });
  } catch (error) {
    return next(error);
  }
}

async function getAllProfilesHandler(req, res, next) {
  try {
    const profiles = await getAllProfiles(req.query);
    return res.status(200).json({
      status: "success",
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteProfileByIdHandler(req, res, next) {
  try {
    await deleteProfileById(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createProfileHandler,
  getProfileByIdHandler,
  getAllProfilesHandler,
  deleteProfileByIdHandler
};
