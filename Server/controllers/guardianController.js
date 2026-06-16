import Guardian from "../models/Guardian.js";

export const createGuardian =
async (req, res) => {
  try {

    const guardian =
      await Guardian.create(req.body);

    res.status(201).json(guardian);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};