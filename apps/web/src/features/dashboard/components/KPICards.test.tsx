import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import KPICards from "./KPICards";
import skillMatrix from "@/mocks/skillMatrix";

const expectCardValue = (label: string, expectedValue: string) => {
    const labelNode = screen.getAllByText(label)[0];
    const card = labelNode.closest("div");

    expect(card).toBeTruthy();
    expect(within(card as HTMLElement).getByText(expectedValue)).toBeTruthy();
};

describe("KPICards", () => {
    it("renders all KPI card labels", () => {
        render(<KPICards />);

        expect(screen.getByText("Total Users")).toBeTruthy();
        expect(screen.getByText("Topics")).toBeTruthy();
        expect(screen.getByText("Total Skills")).toBeTruthy();
        expect(screen.getByText("Skills per User")).toBeTruthy();
        expect(screen.getByText("Topics Covered")).toBeTruthy();
    });

    it("renders KPI values based on skillMatrix data", () => {
        const totalUsers = skillMatrix.users.length;
        const totalTopics = skillMatrix.topics.length;
        const totalSkills = skillMatrix.skills.length;
        const avgSkillsPerUser = (totalSkills / totalUsers).toFixed(1);

        render(<KPICards />);

        expectCardValue("Total Users", String(totalUsers));
        expectCardValue("Topics", String(totalTopics));
        expectCardValue("Total Skills", String(totalSkills));
        expectCardValue("Skills per User", avgSkillsPerUser);
        expectCardValue("Topics Covered", String(totalTopics));
    });
});