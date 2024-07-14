// 型定義
export interface RuleAndPolicy {
  id: string;
  subject: string;
  operator: string;
  object: string;
}

export type JoinOperator = "AND" | "OR";

export interface Condition {
  id: string;
  joinOperator: JoinOperator;
  conditionGroup: Condition[];
  ruleAndPolicies: RuleAndPolicy[];
}

export interface State {
  condition: Condition;
}
