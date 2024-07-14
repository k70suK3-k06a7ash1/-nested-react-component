// 型定義
export interface RuleAndPolicy {
  id: string;
  subject: string; // ENUM
  operator: string; // ENUM
  object: string; // string[] or string or number or number[]
}

// export type JoinOperator = "AND" | "OR";

export interface Condition {
  id: string;
  joinOperator: string;
  conditionGroup: Condition[];
  ruleAndPolicies: RuleAndPolicy[];
}

export interface State {
  condition: Condition;
}
