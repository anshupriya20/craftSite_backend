const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "Untitled Page",
    },
    canvasItems: {
      type: mongoose.Schema.Types.Mixed, // recursive tree — don't force a rigid shape
      default: [],
    },
  },
  { _id: false } // prevents Mongo from auto-adding its own _id to each page sub-object
);

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      default: "Untitled Project",
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",              // links this project to the User model
      required: true,
    },

    pages: {
      type: [pageSchema],
      default: [],
    },

    activePageId: {
      type: String,
      default: "home",
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedPages: {
      type: mongoose.Schema.Types.Mixed, // snapshot of pages at time of publish
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;