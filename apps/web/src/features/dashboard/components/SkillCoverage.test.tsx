import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SkillCoverage from "./SkillCoverage";
import skillMatrix from "@/mocks/skillMatrix";

afterEach(() => {
    cleanup();
    vi.doUnmock("@/mocks/skillMatrix");
    vi.resetModules();
});

const getExpectedTopCoverage = () => {
    const data = skillMatrix.topics.map((topic) => {
        const skillsForTopic = skillMatrix.skills.filter((skill) => skill.topicId === topic.id);

        const experts = skillsForTopic.filter((skill) => skill.value >= 80).length;
        const totalUsers = skillsForTopic.length;
        const averageScore = totalUsers
            ? Math.round(skillsForTopic.reduce((sum, skill) => sum + skill.value, 0) / totalUsers)
            : 0;

        const expertPercentage = totalUsers ? (experts / totalUsers) * 100 : 0;
        let riskLevel: "high" | "medium" | "low" = "low";
        if (expertPercentage < 20 && averageScore < 50) riskLevel = "high";
        else if (expertPercentage < 40 && averageScore < 65) riskLevel = "medium";

        return {
            topic: topic.label,
            totalUsers,
            averageScore,
            riskLevel,
        };
    });

    return data.sort((a, b) => b.averageScore - a.averageScore).slice(0, 8);
};

describe("SkillCoverage (semantic)", () => {
    it("renders section title and up to eight topic cards", () => {
        render(<SkillCoverage />);

        expect(screen.getByText(/Skill Coverage Analysis/i)).toBeTruthy();

        const topicHeadings = screen.getAllByRole("heading", { level: 3 });
        expect(topicHeadings.length).toBeGreaterThan(0);
        expect(topicHeadings.length).toBeLessThanOrEqual(8);
    });

    it("renders expected top topics with average scores, assessed counts, and risk labels", () => {
        render(<SkillCoverage />);

        const expected = getExpectedTopCoverage();

        const renderedTopics = screen
            .getAllByRole("heading", { level: 3 })
            .map((el) => el.textContent ?? "");

        const renderedAverages = screen
            .getAllByText(/^\d+\/100$/)
            .map((el) => el.textContent ?? "");

        const renderedCounts = screen
            .getAllByText(/\d+\s+team members assessed$/i)
            .map((el) => el.textContent ?? "");

        const renderedRiskLabels = screen
            .getAllByText(/^(HIGH|MEDIUM|LOW)$/)
            .map((el) => el.textContent ?? "");

        expect(renderedTopics).toEqual(expected.map((item) => item.topic));
        expect(renderedAverages).toEqual(expected.map((item) => `${item.averageScore}/100`));
        expect(renderedCounts).toEqual(expected.map((item) => `${item.totalUsers} team members assessed`));
        expect(renderedRiskLabels).toEqual(expected.map((item) => item.riskLevel.toUpperCase()));
    });

    it("renders averages in descending order", () => {
        render(<SkillCoverage />);

        const averages = screen.getAllByText(/^\d+\/100$/).map((node) => {
            const text = node.textContent ?? "0/100";
            return Number(text.replace("/100", ""));
        });

        expect(averages.length).toBeGreaterThan(0);
        for (let i = 1; i < averages.length; i += 1) {
            expect(averages[i - 1]).toBeGreaterThanOrEqual(averages[i]);
        }
    });

    it("renders medium risk label for medium-risk mocked data", async () => {
        vi.doMock("@/mocks/skillMatrix", () => ({
            default: {
                topics: [{ id: "topic_a", label: "Topic A" }],
                users: [{ id: "u1", name: "User One" }],
                skills: [{ userId: "u1", topicId: "topic_a", value: 60 }],
            },
        }));

        const { default: MockedSkillCoverage } = await import("./SkillCoverage");
        render(<MockedSkillCoverage />);

        expect(screen.getByText("MEDIUM")).toBeTruthy();
        expect(screen.getByRole("heading", { level: 3, name: "Topic A" })).toBeTruthy();
    });
});