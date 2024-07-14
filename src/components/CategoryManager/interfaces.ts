// 型定義
export interface RuleAndPolicy {
  id: string;
  name: string;
}

export interface Condition {
  id: string;
  name: string;
  conditionGroup: Condition[];
  ruleAndPolicies: RuleAndPolicy[];
}

export interface State {
  condition: Condition;
}
