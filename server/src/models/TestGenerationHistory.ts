import mongoose, { Document, Schema } from "mongoose";

export interface ITestGenerationHistory extends Document {
  userId: mongoose.Types.ObjectId;

  repository: {
    owner: string;
    name: string;
  };

  files: {
    sourceFilePath: string;
    testFilePath: string;
    framework: string;
  }[];

  generatedTests: {
    sourceFilePath: string;
    testFilePath: string;
    testCode: string;
    framework: string;
    explanation: string;
  }[];

  status: "completed" | "failed";

  createdAt: Date;
  updatedAt: Date;
}

const GeneratedTestSchema = new Schema(
  {
    sourceFilePath: {
      type: String,
      required: true,
    },

    testFilePath: {
      type: String,
      required: true,
    },

    testCode: {
      type: String,
      required: true,
    },

    framework: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const TestGenerationHistorySchema =
  new Schema<ITestGenerationHistory>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      repository: {
        owner: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },
      },

      files: [
        {
          sourceFilePath: {
            type: String,
            required: true,
          },

          testFilePath: {
            type: String,
            required: true,
          },

          framework: {
            type: String,
            required: true,
          },
        },
      ],

      generatedTests: {
        type: [GeneratedTestSchema],
        default: [],
      },

      status: {
        type: String,
        enum: ["completed", "failed"],
        required: true,
        default: "completed",
      },
    },
    {
      timestamps: true,
    }
  );

export const TestGenerationHistory =
  mongoose.model<ITestGenerationHistory>(
    "TestGenerationHistory",
    TestGenerationHistorySchema
  );