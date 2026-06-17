import SchoolProfile from "../models/schoolProfileModel.js";

// Get Profile
export const getSchoolProfile = async (req, res) => {
  try {
    const profile = await SchoolProfile.findOne();

    res.status(200).json(profile || {});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create / Update Profile
export const saveSchoolProfile = async (req, res) => {
  try {
    let profile = await SchoolProfile.findOne();

    if (profile) {
      profile = await SchoolProfile.findByIdAndUpdate(
        profile._id,
        req.body,
        { new: true }
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        data: profile,
      });
    }

    profile = await SchoolProfile.create(req.body);

    res.status(201).json({
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};