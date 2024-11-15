export type Story = {
  id: string;
  title: string;
  description: string | null;
  projectId: string;
  status: "PENDING" | "IN_PROGRESS" | "ESTIMATED" | "COMPLETED";
  finalPoints: number | null;
  createdAt: Date;
  updatedAt: Date;
  estimations?: Estimation[];
};

export type EstimationCriteria = {
  complexity: number;
  effort: number;
  risk: number;
  dependencies: number;
};

export type Estimation = EstimationCriteria & {
  id: string;
  storyId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
