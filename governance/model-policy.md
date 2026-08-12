# Model and parallelism policy

- Main work uses the session model. Use the strongest available model for ambiguous architecture, security, consequential business decisions, or synthesis across conflicting evidence.
- Use a less expensive model for bounded extraction, classification, or mechanical review when the result is independently verifiable.
- Custom subagents default to Sonnet. `research-scout` uses medium effort; independent security and UX reviews use high effort.
- Do not create a subagent for work that shares changing state with the main task, requires writing, takes less context than its delegation overhead, or can be checked deterministically.
- Maximum custom subagents: two active concurrently and three total per user task. Each agent has a turn cap and cannot call another agent.
- Parallelize only independent read-only branches. Merge evidence in the main conversation before any write.
- Never retry the same failed delegation more than once without changing the task or evidence. Never recursively ask an agent to continue until satisfied.
