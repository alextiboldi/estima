import { EstimationCriteria } from "./types";

export function calculateStoryPoints(estimations: EstimationCriteria[]): number {
  if (!estimations.length) return 0;

  // Calculate average scores for each criterion
  const averages = estimations.reduce(
    (acc, estimation) => ({
      complexity: acc.complexity + estimation.complexity,
      effort: acc.effort + estimation.effort,
      risk: acc.risk + estimation.risk,
      dependencies: acc.dependencies + estimation.dependencies,
    }),
    { complexity: 0, effort: 0, risk: 0, dependencies: 0 }
  );

  Object.keys(averages).forEach((key) => {
    averages[key as keyof EstimationCriteria] /= estimations.length;
  });

  // Weight factors for each criterion
  const weights = {
    complexity: 0.3,
    effort: 0.3,
    risk: 0.2,
    dependencies: 0.2,
  };

  // Calculate weighted score
  const weightedScore =
    averages.complexity * weights.complexity +
    averages.effort * weights.effort +
    averages.risk * weights.risk +
    averages.dependencies * weights.dependencies;

  // Convert to Fibonacci-like scale: 1, 2, 3, 5, 8, 13
  const fibonacciScale = [1, 2, 3, 5, 8, 13];
  const normalizedScore = weightedScore * (13 / 3); // Scale up to max story points

  // Find closest Fibonacci number
  return fibonacciScale.reduce((prev, curr) =>
    Math.abs(curr - normalizedScore) < Math.abs(prev - normalizedScore) ? curr : prev
  );
}