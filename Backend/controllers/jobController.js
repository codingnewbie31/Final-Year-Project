const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// @desc    Create a new job (Employer only)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({
        message: "Only employers can post jobs",
      });
    }

    if (req.body.isUrgent) {
      if (!req.body.shiftStartTime) {
        return res.status(400).json({
          message: "Shift start time is required for urgent jobs",
        });
      }

      const shiftDate = new Date(req.body.shiftStartTime);

      if (isNaN(shiftDate.getTime())) {
        return res.status(400).json({
          message: "Invalid shift start time",
        });
      }

      if (shiftDate <= new Date()) {
        return res.status(400).json({
          message: "Shift start time must be in the future",
        });
      }
    }

    const job = await Job.create({
      ...req.body,
      company: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// @desc    Get jobs
exports.getJobs = async (req, res) => {
  const {
    keyword,
    location,
    category,
    type,
    minSalary,
    maxSalary,
    page = 1,
    limit = 6,
  } = req.query;
  const userId = req.user?._id || req.query.userId;

  const query = {
    isClosed: false,
    // Auto-expire urgent jobs
    $or: [
      { isUrgent: false },
      { isUrgent: true, shiftStartTime: { $gte: new Date() } },
      { isUrgent: { $exists: false } },
    ],
    ...(keyword && { title: { $regex: keyword, $options: "i" } }),
    ...(location && { location: { $regex: location, $options: "i" } }),
    ...(category && { category }),
    ...(type && { type }),
  };

  if (minSalary || maxSalary) {
    query.$and = [];

    if (minSalary) {
      query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
    }

    if (maxSalary) {
      query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
    }

    if (query.$and.length === 0) {
      delete query.$and;
    }
  }
  try {
    const skip = (Number(page) - 1) * Number(limit);
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / Number(limit));

    const jobs = await Job.find(query)
      .populate("company", "name companyName companyLogo")
      .sort({ isUrgent: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    let savedJobIds = [];
    let appliedJobStatusMap = {};

    if (userId) {
      // Saved Jobs
      const savedJobs = await SavedJob.find({ jobseeker: userId }).select(
        "job",
      );
      savedJobIds = savedJobs.map((s) => String(s.job));

      // Applications
      const applications = await Application.find({ applicant: userId }).select(
        "job status",
      );
      applications.forEach((app) => {
        appliedJobStatusMap[String(app.job)] = app.status;
      });
    }

    // Add isSaved and applicationStatus to each job
    const jobsWithExtras = await Promise.all(
      jobs.map(async (job) => {
        const jobIdStr = String(job._id);
        const applicantCount = await Application.countDocuments({
          job: job._id,
        });
        return {
          ...job.toObject(),
          isSaved: savedJobIds.includes(jobIdStr),
          applicationStatus: appliedJobStatusMap[jobIdStr] || null,
          applicantCount,
        };
      }),
    );

    res.json({
      jobs: jobsWithExtras,
      page: Number(page),
      totalPages,
      totalJobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get jobs for logged in user (Employer can see posted jobs)
exports.getJobsEmployer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;

    if (role !== "employer") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get all jobs posted by employer
    const jobs = await Job.find({ company: userId })
      .populate("company", "name companyName companyLogo")
      .lean(); // .lean() makes jobs plain JS objects so we can add new fields

    // Count applications for each job
    const jobsWithApplicationCounts = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({
          job: job._id,
        });
        return {
          ...job,
          applicationCount,
        };
      }),
    );

    res.json(jobsWithApplicationCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const { userId } = req.query;

    const job = await Job.findById(req.params.id).populate(
      "company",
      "name companyName companyLogo",
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let applicationStatus = null;

    if (userId) {
      const application = await Application.findOne({
        job: job._id,
        applicant: userId,
      }).select("status");

      if (application) {
        applicationStatus = application.status;
      }
    }
    res.json({
      ...job.toObject(),
      applicationStatus,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a job (Employer only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    Object.assign(job, req.body);
    const updated = await job.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete a job (Employer only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Toggle Close Status for a job (Employer only)
exports.toggleCloseJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to close this job" });
    }

    job.isClosed = !job.isClosed;
    await job.save();

    res.json({
      message: job.isClosed ? "Job marked as closed" : "Job marked as open",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
