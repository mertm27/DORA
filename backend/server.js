const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Initialize Express app
const app = express();

// Configuration
const PORT = process.env.PORT || 5001;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://intecsystemdev:pOPyP9rLW6FhiF4w@cluster0.oriwr.mongodb.net/nda-survey-db?retryWrites=true&w=majority&appName=Cluster0";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5176";

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
app.use(
  cors({
    origin: [
      FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// MongoDB Schema for Survey Submissions
const surveySchema = new mongoose.Schema(
  {
    // NDA Details
    ndaDetails: {
      bankName: { type: String, required: true },
      bankAddress: { type: String, required: true },
      bankRegNumber: { type: String, required: true },
      bankContactName: { type: String, required: true },
      bankContactPosition: { type: String, required: true },
      receiverName: { type: String, required: true },
      receiverAddress: { type: String, required: true },
      receiverRegNumber: { type: String, required: true },
      receiverContactName: { type: String, required: true },
      receiverContactPosition: { type: String, required: true },
      ndaPurpose: { type: String, required: true },
      ndaDurationYears: { type: String, required: true },
      ndaEffectiveDate: { type: String, required: true },
    },

    // Questionnaire Data - Using Mixed type for flexibility
    questionnaireData: mongoose.Schema.Types.Mixed,

    // Metadata
    submissionDate: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed"],
      default: "submitted",
    },
    reviewNotes: String,
  },
  {
    timestamps: true,
  }
);

const Survey = mongoose.model("Survey", surveySchema);

// API Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Submit survey data
app.post("/api/surveys", async (req, res) => {
  try {
    const { ndaDetails, questionnaireData } = req.body;

    // Log the received data for debugging
    console.log("Received survey submission:");
    console.log("NDA Details:", JSON.stringify(ndaDetails, null, 2));
    console.log(
      "Questionnaire Data:",
      JSON.stringify(questionnaireData, null, 2)
    );
    console.log(
      "Questionnaire Data keys:",
      Object.keys(questionnaireData || {})
    );

    // Validate required fields
    if (!ndaDetails || !ndaDetails.bankName) {
      return res.status(400).json({
        success: false,
        message: "NDA details are required",
      });
    }

    const surveyData = {
      ndaDetails,
      questionnaireData: questionnaireData || {},
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent") || "Unknown",
    };

    const survey = new Survey(surveyData);
    const savedSurvey = await survey.save();

    console.log("Survey saved successfully with ID:", savedSurvey._id);
    console.log(
      "Saved questionnaire data keys:",
      Object.keys(savedSurvey.questionnaireData || {})
    );

    res.status(201).json({
      success: true,
      message: "Survey submitted successfully",
      data: {
        id: savedSurvey._id,
        submissionDate: savedSurvey.submissionDate,
      },
    });
  } catch (error) {
    console.error("Error saving survey:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save survey data",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Get all surveys with pagination and filtering
app.get("/api/surveys", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      sortBy = "submissionDate",
      sortOrder = "desc",
      startDate = "",
      endDate = "",
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { "ndaDetails.bankName": { $regex: search, $options: "i" } },
        { "ndaDetails.bankContactName": { $regex: search, $options: "i" } },
        { "ndaDetails.receiverName": { $regex: search, $options: "i" } },
        {
          "questionnaireData.contactPersonEmail": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (startDate && endDate) {
      filter.submissionDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [surveys, total] = await Promise.all([
      Survey.find(filter).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Survey.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: surveys,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch surveys",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Get single survey by ID
app.get("/api/surveys/:id", async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    res.json({
      success: true,
      data: survey,
    });
  } catch (error) {
    console.error("Error fetching survey:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch survey",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Update survey status (for admin review)
app.patch("/api/surveys/:id/status", async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!["draft", "submitted", "reviewed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const survey = await Survey.findByIdAndUpdate(
      req.params.id,
      { status, reviewNotes },
      { new: true }
    );

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: "Survey not found",
      });
    }

    res.json({
      success: true,
      data: survey,
      message: "Survey status updated successfully",
    });
  } catch (error) {
    console.error("Error updating survey:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update survey",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Get survey statistics
app.get("/api/surveys/stats/overview", async (req, res) => {
  try {
    const stats = await Survey.aggregate([
      {
        $group: {
          _id: null,
          totalSurveys: { $sum: 1 },
          submittedSurveys: {
            $sum: { $cond: [{ $eq: ["$status", "submitted"] }, 1, 0] },
          },
          reviewedSurveys: {
            $sum: { $cond: [{ $eq: ["$status", "reviewed"] }, 1, 0] },
          },
          draftSurveys: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats[0] || {
      totalSurveys: 0,
      submittedSurveys: 0,
      reviewedSurveys: 0,
      draftSurveys: 0,
    };

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
});

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
      console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⏹️  Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
