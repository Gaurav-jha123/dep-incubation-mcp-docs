import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, within, cleanup } from "@testing-library/react";
import SkillCoverage from "./SkillCoverage";
import skillMatrix from "@/mocks/skillMatrix";

afterEach(() => {
	cleanup();
});

const getExpectedSkillCoverage = () => {
	const coverage = skillMatrix.topics.map((topic) => {
		const skillsForTopic = skillMatrix.skills.filter((skill) => skill.topicId === topic.id);
		const experts = skillsForTopic.filter((skill) => skill.value >= 80).length;
		const advanced = skillsForTopic.filter((skill) => skill.value >= 60 && skill.value < 80).length;
		const intermediate = skillsForTopic.filter((skill) => skill.value >= 40 && skill.value < 60).length;
		const beginners = skillsForTopic.filter((skill) => skill.value < 40).length;
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
			topicId: topic.id,
			averageScore,
			totalUsers,
			riskLevel,
			segments: [experts, advanced, intermediate, beginners],
		};
	});

	return coverage.sort((a, b) => b.averageScore - a.averageScore).slice(0, 8);
};

describe("SkillCoverage", () => {
	it("renders section title and up to eight topic cards", () => {
		render(<SkillCoverage />);

		expect(screen.getByText("📊 Skill Coverage Analysis")).toBeTruthy();

		const topicHeadings = screen.queryAllByRole("heading", { level: 3 });
		expect(topicHeadings.length).toBeGreaterThan(0);
		expect(topicHeadings.length).toBeLessThanOrEqual(8);
	});

	it("renders top topics sorted by average score descending", () => {
		const { container } = render(<SkillCoverage />);
		const cards = Array.from(
			container.querySelectorAll(".p-4.rounded-xl.border.border-gray-200")
		) as HTMLElement[];

		const renderedAverages = cards.map((card) => {
			const averageNode = card.querySelector(".text-sm.font-bold.text-gray-800");
			return Number(averageNode?.textContent?.replace("/100", "") ?? -1);
		});

		expect(renderedAverages.length).toBeGreaterThan(0);
		expect(renderedAverages.length).toBeLessThanOrEqual(8);

		for (let index = 1; index < renderedAverages.length; index += 1) {
			expect(renderedAverages[index - 1]).toBeGreaterThanOrEqual(renderedAverages[index]);
		}
	});

	it("renders expected average, risk level and assessed-team labels for each displayed topic", () => {
		const { container } = render(<SkillCoverage />);

		const expectedCoverage = getExpectedSkillCoverage();
		const cards = Array.from(
			container.querySelectorAll(".p-4.rounded-xl.border.border-gray-200")
		) as HTMLElement[];

		expect(cards.length).toBe(expectedCoverage.length);

		expectedCoverage.forEach((item, index) => {
			const card = cards[index];
			expect(within(card).getByRole("heading", { level: 3, name: item.topic })).toBeTruthy();
			expect(within(card).getByText(`${item.totalUsers} team members assessed`)).toBeTruthy();
			expect(within(card).getByText(`${item.averageScore}/100`)).toBeTruthy();
			expect(within(card).getByText(item.riskLevel.toUpperCase())).toBeTruthy();
		});
	});

	it("renders distribution bars with percentage widths", () => {
		const { container } = render(<SkillCoverage />);

		const progressSegments = Array.from(container.querySelectorAll('[style*="width:"]')) as HTMLDivElement[];

		expect(progressSegments.length).toBeGreaterThan(0);
		progressSegments.forEach((segment) => {
			expect(segment.style.width).toMatch(/%$/);
		});
	});

	it("renders medium risk badge and icon for medium-risk coverage data", async () => {
		vi.resetModules();

		vi.doMock("@/mocks/skillMatrix", () => ({
			default: {
				topics: [{ id: "topic_a", label: "Topic A" }],
				users: [{ id: "u1", name: "User One" }],
				skills: [{ userId: "u1", topicId: "topic_a", value: 60 }],
			},
		}));

		const { default: MockedSkillCoverage } = await import("./SkillCoverage");
		const { container } = render(<MockedSkillCoverage />);

		expect(screen.getByText("⚡")).toBeTruthy();
		expect(screen.getByText("MEDIUM")).toBeTruthy();

		const mediumBadge = container.querySelector(".bg-yellow-100.border-yellow-300.text-yellow-800");
		expect(mediumBadge).toBeTruthy();

		vi.doUnmock("@/mocks/skillMatrix");
		vi.resetModules();
	});
});