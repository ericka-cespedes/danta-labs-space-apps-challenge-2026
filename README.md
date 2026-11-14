# 🚀 Danta Labs

**NASA Space Apps Challenge 2026 | Costa Rica 🇨🇷**

### About the Project

Danta Labs is a six-member team from Costa Rica taking part in the [NASA Space Apps Challenge 2026](https://www.spaceappschallenge.org/). Our name comes from the danta (tapir), an animal native to Costa Rica, and reflects our connection to nature, science, space exploration, and creativity.

Our working project title is **Abandoned but Not Forgotten**. This is an introduction to a project in its earliest stage; its concept and direction will take shape during the hackathon.

### The Challenge

We are participating in [Abandoned but Not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars](https://www.spaceappschallenge.org/2026/challenges/abandoned-but-not-forgotten-storytelling-about-nasas-discarded-equipment-on-the-moon-and-mars/). The challenge explores NASA equipment across the solar system, from the Moon and Mars to deep space, highlighting the scientific discoveries and lasting legacy of space exploration. This includes rovers, landers, scientific instruments, and spacecraft; some have completed their original missions, while others continue operating or traveling.

### Our Vision

We hope to connect young space enthusiasts with the history, scientific discoveries, and continuing legacy of this equipment. The focus is scientific storytelling—not simply objects left behind.

### Meet the Team

- **Celeste** — Team Leader
- Ericka
- Luis
- Ulises
- Pedro
- Sally

### Project Status

**Pre-hackathon** — Project development has not started yet.

Development has not started. We are preparing for the NASA Space Apps Challenge, and the concept, mechanics, and implementation details will evolve during the hackathon.

### License

This project is intended to be licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

---

Made with curiosity, creativity, and a little pura vida 🇨🇷

## Copilot planning and implementation

This repository includes framework-neutral Copilot skills and supporting agents.
They do not require a database, API, P&G design system, or deployment workflows.

1. Create a GitHub issue describing the webpage, its scope, and acceptance criteria. For a parent issue with scoped sub-issues, optionally run `/danta-labs-issue-orchestrator <idea-or-parent-issue-url>` first. It proposes the hierarchy and asks for approval before making issue changes; no custom issue types or GitHub Project are required.
2. In a Copilot environment with a checkout of this repository and authenticated GitHub access, run `/issue-planner <issue-number-or-url>`.
3. Review the generated plan and work items under `docs-local/`, then run `/orchestrator docs-local/issue-<number>-pbis.md`.
4. Review implementation and QA results. The `testing-plan` agent produces manual cases marked `NOT RUN`; the optional `automated-testing` agent can execute them when a running application and Playwright tools are available.
5. Run `/open-pr <issue-number-or-url>` to validate the changes and open an issue-linked feature PR against `main`. This does not merge or deploy the PR.

Definitions: [danta-labs-issue-orchestrator](.github/skills/danta-labs-issue-orchestrator/SKILL.md), [issue-planner](.github/skills/issue-planner/SKILL.md), [orchestrator](.github/skills/orchestrator/SKILL.md), [open-pr](.github/skills/open-pr/SKILL.md), and [supporting agents](.github/agents/).

`docs-local/` is ignored by Git: plans, internal work-item identifiers, and manual execution records remain local. The implementation agent follows the framework and tooling actually chosen for the webpage rather than assuming a particular stack.
