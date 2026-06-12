const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String },
    category: { type: String },
    type: {
      type: String,
      enum: ["Remote", "Full-Time", "Part-Time", "Internship", "Contract"],
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Employer

    salaryMin: { type: Number, min: [0, "Salary cannot be negative"] },
    salaryMax: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= this.salaryMin;
        },
        message: "Maximum salary must be greater than minimum salary",
      },
    },
    isClosed: { type: Boolean, default: false },
    isUrgent: { type: Boolean, default: false },
    shiftStartTime: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
