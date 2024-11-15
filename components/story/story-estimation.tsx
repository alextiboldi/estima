"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { EstimationCriteria } from "@/lib/types";
import PusherClient from "pusher-js";

interface StoryEstimationProps {
  storyId: string;
}

type EstimationCriteriaScore = {
  complexity: string;
  effort: string;
  risk: string;
  dependencies: string;
};
enum EstimationScore {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export function StoryEstimation({ storyId }: StoryEstimationProps) {
  const [estimation, setEstimation] = useState<EstimationCriteria>({
    complexity: 1,
    effort: 1,
    risk: 1,
    dependencies: 1,
  });

  const [estimationScore, setEstimationScore] =
    useState<EstimationCriteriaScore>({
      complexity: EstimationScore.Low,
      effort: EstimationScore.Low,
      risk: EstimationScore.Low,
      dependencies: EstimationScore.Low,
    });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storyPoints, setStoryPoints] = useState<number | null>(null);

  const handleEstimationChange = (
    criteria: keyof EstimationCriteria,
    value: number[]
  ) => {
    setEstimationScore((prev) => {
      const updatedEstimationScore = {
        ...prev,
        [criteria]:
          value[0] === 1
            ? EstimationScore.Low
            : value[0] === 2
            ? EstimationScore.Medium
            : EstimationScore.High,
      };
      return updatedEstimationScore;
    });

    setEstimation((prev) => {
      const updatedEstimation = {
        ...prev,
        [criteria]: value[0],
      };

      // Calculate total score based on the updated state
      const totalScore =
        updatedEstimation.complexity +
        updatedEstimation.effort +
        updatedEstimation.risk +
        updatedEstimation.dependencies;

      // Calculate story points
      const storyPoints = calculateStoryPoints(totalScore);
      setStoryPoints(storyPoints);

      return updatedEstimation;
    });
  };

  function calculateStoryPoints(totalScore: number): number {
    console.log("TotalScore: ", totalScore);
    if (totalScore >= 4 && totalScore <= 5) {
      return 1;
    } else if (totalScore >= 6 && totalScore <= 7) {
      return 2;
    } else if (totalScore >= 8 && totalScore <= 9) {
      return 3;
    } else if (totalScore >= 10 && totalScore <= 11) {
      return 5;
    } else if (totalScore === 12) {
      return 8;
    } else {
      throw new Error(
        "Invalid total score: The value is out of the accepted range."
      );
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/stories/${storyId}/estimate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estimation),
      });

      if (!response.ok) throw new Error("Failed to submit estimation");

      toast.success("Estimation submitted successfully");
    } catch (error) {
      toast.error("Failed to submit estimation");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Story Estimation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Complexity</Label>
            <p className="text-xs text-gray-400">
              How complex is the story in terms of logic, technical
              requirements, or scope?
            </p>
            <div className="flex items-center space-x-4">
              <Slider
                value={[estimation.complexity]}
                onValueChange={(value) =>
                  handleEstimationChange("complexity", value)
                }
                min={1}
                max={3}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-center">
                {estimationScore.complexity}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Effort</Label>
            <p className="text-xs text-gray-400">
              How much time and energy will be needed to complete it?
            </p>
            <div className="flex items-center space-x-4">
              <Slider
                value={[estimation.effort]}
                onValueChange={(value) =>
                  handleEstimationChange("effort", value)
                }
                min={1}
                max={3}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-center">{estimationScore.effort}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Risk</Label>
            <p className="text-xs text-gray-400">
              What’s the level of uncertainty? Are there any potential blockers
              or unknowns?
            </p>
            <div className="flex items-center space-x-4">
              <Slider
                value={[estimation.risk]}
                onValueChange={(value) => handleEstimationChange("risk", value)}
                min={1}
                max={3}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-center">{estimationScore.risk}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dependencies</Label>
            <p className="text-xs text-gray-400">
              Are there any dependencies on other teams, stories, or external
              resources?
            </p>
            <div className="flex items-center space-x-4">
              <Slider
                value={[estimation.dependencies]}
                onValueChange={(value) =>
                  handleEstimationChange("dependencies", value)
                }
                min={1}
                max={3}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-center">
                {estimationScore.dependencies}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full mb-10">
          <h2 className="text-5xl">Total Score: </h2>
          <h1 className="text-5xl font-bold">{storyPoints}</h1>
        </div>
        <Button
          onClick={handleSubmit}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Estimation"}
        </Button>
      </CardContent>
    </Card>
  );
}
