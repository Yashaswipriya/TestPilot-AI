import mongoose, { Schema, Document } from "mongoose";

export interface IRepository extends Document {
  userId: mongoose.Types.ObjectId;
  repoId: number;
  owner: string;
  repoName: string;
  cloneUrl: string;
  defaultBranch: string;
  language: string;
  visibility: "public" | "private";
  githubUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const repositorySchema = new Schema<IRepository>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repoId: {
      type: Number,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    cloneUrl: {
      type: String,
      required: true,
    },
    defaultBranch: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: "",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },
    githubUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
repositorySchema.index({ userId: 1, repoId: 1 }, { unique: true });

export default mongoose.model<IRepository>("Repository", repositorySchema);