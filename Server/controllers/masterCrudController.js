const buildSearchQuery = (searchFields, search) => {
  if (!search || !searchFields?.length) {
    return {};
  }

  return {
    $or: searchFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    })),
  };
};

const runDuplicateChecks = async ({
  Model,
  checks = [],
  body,
  excludeId,
}) => {
  for (const check of checks) {
    const value = body[check.field];

    if (!value) {
      continue;
    }

    const query = {
      [check.field]: value,
      isActive: true,
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const exists = await Model.findOne(query);

    if (exists) {
      return `${check.label} already exists`;
    }
  }

  return null;
};

export const createMasterCrudController = ({
  Model,
  moduleName,
  searchFields = [],
  duplicateChecks = [],
  validate,
  buildDuplicateQuery,
}) => {
  const getAll = async (req, res) => {
    try {
      const {
        search = "",
        page,
        limit,
      } = req.query;

      const query = {
        isActive: true,
        ...buildSearchQuery(searchFields, search),
      };

      let recordsQuery = Model.find(query).sort({ createdAt: -1 });

      if (page && limit) {
        const skip =
          (Number(page) - 1) * Number(limit);

        recordsQuery = recordsQuery
          .skip(skip)
          .limit(Number(limit));
      }

      const [records, total] = await Promise.all([
        recordsQuery,
        Model.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        message: `${moduleName} fetched successfully`,
        count: records.length,
        total,
        data: records,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  const create = async (req, res) => {
    try {
      const validationMessage = validate?.(req.body);

      if (validationMessage) {
        return res.status(400).json({
          success: false,
          message: validationMessage,
        });
      }

      if (buildDuplicateQuery) {
        const duplicate = await Model.findOne(
          buildDuplicateQuery(req.body)
        );

        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: `${moduleName} already exists`,
          });
        }
      }

      const duplicateMessage =
        await runDuplicateChecks({
          Model,
          checks: duplicateChecks,
          body: req.body,
        });

      if (duplicateMessage) {
        return res.status(400).json({
          success: false,
          message: duplicateMessage,
        });
      }

      const record = await Model.create({
        ...req.body,
        createdBy: req.user?.id,
        updatedBy: req.user?.id,
      });

      res.status(201).json({
        success: true,
        message: `${moduleName} created successfully`,
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  const update = async (req, res) => {
    try {
      const { id } = req.params;
      const validationMessage = validate?.(req.body);

      if (validationMessage) {
        return res.status(400).json({
          success: false,
          message: validationMessage,
        });
      }

      if (buildDuplicateQuery) {
        const duplicate = await Model.findOne({
          ...buildDuplicateQuery(req.body),
          _id: { $ne: id },
        });

        if (duplicate) {
          return res.status(400).json({
            success: false,
            message: `${moduleName} already exists`,
          });
        }
      }

      const duplicateMessage =
        await runDuplicateChecks({
          Model,
          checks: duplicateChecks,
          body: req.body,
          excludeId: id,
        });

      if (duplicateMessage) {
        return res.status(400).json({
          success: false,
          message: duplicateMessage,
        });
      }

      const record = await Model.findByIdAndUpdate(
        id,
        {
          ...req.body,
          updatedBy: req.user?.id,
        },
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${moduleName} not found`,
        });
      }

      res.status(200).json({
        success: true,
        message: `${moduleName} updated successfully`,
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  const remove = async (req, res) => {
    try {
      const { id } = req.params;

      const record = await Model.findByIdAndUpdate(
        id,
        {
          isActive: false,
          updatedBy: req.user?.id,
        },
        {
          returnDocument: "after",
        }
      );

      if (!record) {
        return res.status(404).json({
          success: false,
          message: `${moduleName} not found`,
        });
      }

      res.status(200).json({
        success: true,
        message: `${moduleName} deleted successfully`,
        data: record,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  return {
    getAll,
    create,
    update,
    remove,
  };
};
