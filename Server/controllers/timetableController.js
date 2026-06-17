import Timetable from '../models/Timetable.js';

// Helper to check for time overlaps
const isOverlapping = async (data, excludeId = null) => {
    const { className, section, day, startTime, endTime } = data;
    const query = {
        className,
        section,
        day,
        _id: { $ne: excludeId },
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    };
    const overlap = await Timetable.findOne(query);
    return !!overlap;
};

export const getTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find()
            .populate("classId", "className")
            .populate("sectionId", "sectionName")
            .populate("subjectId", "subjectName")
            .populate("teacherId", "name")
            .sort({ day: 1, startTime: 1 });
        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getTimetableById = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);
        if (!timetable) return res.status(404).json({ message: 'Not found' });
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTimetable = async (req, res) => {
    try {
        if (req.body.endTime <= req.body.startTime) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        if (await isOverlapping(req.body)) {
            return res.status(400).json({ message: 'This time slot is already occupied for this class/section' });
        }

        const newTimetable = new Timetable(req.body);
        await newTimetable.save();
        res.status(201).json(newTimetable);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export const updateTimetable = async (req, res) => {
    try {
        if (req.body.endTime <= req.body.startTime) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        if (await isOverlapping(req.body, req.params.id)) {
            return res.status(400).json({ message: 'Updating to this slot causes an overlap' });
        }

        const updated = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTimetable = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};