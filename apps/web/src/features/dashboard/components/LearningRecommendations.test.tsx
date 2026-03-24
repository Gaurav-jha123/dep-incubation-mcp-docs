import { describe, it, expect, afterEach, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import LearningRecommendations from "./LearningRecommendations";
import skillMatrix from "@/mocks/skillMatrix";

afterEach(() => {
	cleanup();
	vi.resetModules();
	vi.doUnmock("@/mocks/skillMatrix");
});

const getAverageForUser = (userName: string) => {
	const user = skillMatrix.users.find((item) => item.name === userName);
	if (!user) return 0;

	const userSkills = skillMatrix.skills.filter((skill) => skill.userId === user.id);
	return userSkills.length
		? Math.round(userSkills.reduce((sum, skill) => sum + skill.value, 0) / userSkills.length)
		: 0;
};

describe("LearningRecommendations", () => {
	it("renders section title and up to six user recommendation cards", () => {
		render(<LearningRecommendations />);

		expect(screen.getByText("🎓 Learning Recommendations")).toBeTruthy();

		const averageLabels = screen.queryAllByText(/^Avg Score:/);
		expect(averageLabels.length).toBeGreaterThan(0);
		expect(averageLabels.length).toBeLessThanOrEqual(6);
	});

	it("renders valid user cards with matching average scores", () => {
		render(<LearningRecommendations />);

		const renderedUserNames = screen
			.queryAllByRole("heading", { level: 3 })
			.map((heading) => heading.textContent ?? "");

		const renderedAverageLabels = screen.queryAllByText(/^Avg Score:/).map((element) => element.textContent);

		expect(renderedUserNames.length).toBeGreaterThan(0);
		expect(renderedUserNames.length).toBeLessThanOrEqual(6);
		expect(renderedAverageLabels.length).toBe(renderedUserNames.length);

		renderedUserNames.forEach((userName, index) => {
			expect(renderedAverageLabels[index]).toBe(`Avg Score: ${getAverageForUser(userName)}/100`);
		});
	});

	it("renders expected average score labels for displayed users", () => {
		render(<LearningRecommendations />);

		const renderedUserNames = screen
			.getAllByRole("heading", { level: 3 })
			.map((heading) => heading.textContent ?? "");

		const renderedAverageLabels = screen.getAllByText(/^Avg Score:/).map((element) => element.textContent);

		const expectedAverageLabels = renderedUserNames.map(
			(userName) => `Avg Score: ${getAverageForUser(userName)}/100`
		);

		expect(renderedAverageLabels).toEqual(expectedAverageLabels);
	});

	it("renders recommendation details including priority, reason and progress widths", () => {
		const { container } = render(<LearningRecommendations />);

		const priorityBadges = screen.getAllByText(/^(HIGH|MEDIUM|LOW)$/);
		expect(priorityBadges.length).toBeGreaterThan(0);

		const reasonLines = screen.getAllByText(
			/Foundation building needed|Close to next level|Team priority|Complements your strength/
		);
		expect(reasonLines.length).toBeGreaterThan(0);

		const progressBars = Array.from(container.querySelectorAll('[style*="width:"]')) as HTMLDivElement[];

		expect(progressBars.length).toBeGreaterThan(0);
		progressBars.forEach((bar) => {
			expect(bar.style.width).toMatch(/^\d+%$/);
		});
	});

	it("renders knowledge-gap and synergy recommendations with medium/low styling for branch coverage", async () => {
		vi.resetModules();
		vi.doUnmock("@/mocks/skillMatrix");

		const mockedSkillMatrix = {
			topics: [
				{ id: "problem_solving", label: "Problem solving" },
				{ id: "shared_skill", label: "Shared Skill" },
				{ id: "react", label: "React" },
				{ id: "nextjs", label: "Next.js" },
			],
			users: [
				{ id: "target", name: "Target User" },
				{ id: "u1", name: "User 1" },
				{ id: "u2", name: "User 2" },
				{ id: "u3", name: "User 3" },
				{ id: "u4", name: "User 4" },
				{ id: "u5", name: "User 5" },
				{ id: "u6", name: "User 6" },
			],
			skills: [
				{ userId: "target", topicId: "problem_solving", value: 35 },
				{ userId: "target", topicId: "react", value: 75 },
				{ userId: "u1", topicId: "shared_skill", value: 80 },
				{ userId: "u2", topicId: "shared_skill", value: 80 },
				{ userId: "u3", topicId: "shared_skill", value: 80 },
				{ userId: "u4", topicId: "shared_skill", value: 80 },
				{ userId: "u5", topicId: "shared_skill", value: 80 },
				{ userId: "u6", topicId: "shared_skill", value: 80 },
			],
		};

		vi.doMock("@/mocks/skillMatrix", () => ({
			default: mockedSkillMatrix,
		}));

		const { default: MockedLearningRecommendations } = await import("./LearningRecommendations");
		render(<MockedLearningRecommendations />);

		expect(screen.getByText(/Team priority - many colleagues skilled/)).toBeTruthy();
		expect(screen.getByText(/Complements your strength in/)).toBeTruthy();
		expect(screen.getByText("🎯")).toBeTruthy();
		expect(screen.getByText("🔄")).toBeTruthy();

		const mediumBadges = screen.getAllByText("MEDIUM");
		expect(mediumBadges.length).toBeGreaterThan(0);
		const lowBadges = screen.getAllByText("LOW");
		expect(lowBadges.length).toBeGreaterThan(0);
	});
});
