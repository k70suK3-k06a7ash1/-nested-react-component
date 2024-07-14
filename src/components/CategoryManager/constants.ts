import { Condition, RuleAndPolicy, State } from "./interfaces";

const createDummyRuleAndPolicy = (id: string): RuleAndPolicy => ({
  id,
  subject: `Subject ${id}`,
  operator: ["equal", "not equal", "contains", "not contains"][
    Math.floor(Math.random() * 4)
  ],
  object: `Object ${id}`,
});

const createDummyCondition = (id: string, depth: number): Condition => {
  const condition: Condition = {
    id,
    joinOperator: Math.random().toString(),
    conditionGroup: [],
    ruleAndPolicies: [],
  };

  // Add some rules and policies
  for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
    condition.ruleAndPolicies.push(createDummyRuleAndPolicy(`rule-${id}-${i}`));
  }

  // Add nested conditions if depth allows
  if (depth > 0) {
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      condition.conditionGroup.push(
        createDummyCondition(`${id}-${i}`, depth - 1)
      );
    }
  }

  return condition;
};

export const dummyInitialState: State = {
  condition: createDummyCondition("root", 3),
};
