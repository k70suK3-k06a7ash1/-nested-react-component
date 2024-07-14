import { produce } from "immer";
import { Condition, RuleAndPolicy, State } from "./interfaces";

export type Action =
  | {
      type: "ADD_CONDITION";
      payload: { path: number[]; joinOperator: string };
    }
  | {
      type: "ADD_RULE_AND_POLICY";
      payload: { path: number[]; ruleAndPolicy: RuleAndPolicy };
    }
  | { type: "REMOVE_CONDITION"; payload: { path: number[] } }
  | {
      type: "REMOVE_RULE_AND_POLICY";
      payload: { path: number[]; itemId: string };
    }
  | {
      type: "COPY_CONDITION";
      payload: { sourcePath: number[]; destinationPath: number[] };
    }
  | {
      type: "COPY_RULE_AND_POLICY";
      payload: {
        sourcePath: number[];
        itemId: string;
        destinationPath: number[];
      };
    }
  | {
      type: "MOVE_CONDITION";
      payload: { path: number[]; fromIndex: number; toIndex: number };
    }
  | {
      type: "MOVE_RULE_AND_POLICY";
      payload: { path: number[]; fromIndex: number; toIndex: number };
    };

export const moveCondition = (
  path: number[],
  fromIndex: number,
  toIndex: number
): Action => ({
  type: "MOVE_CONDITION",
  payload: { path, fromIndex, toIndex },
});

export const moveRuleAndPolicy = (
  path: number[],
  fromIndex: number,
  toIndex: number
): Action => ({
  type: "MOVE_RULE_AND_POLICY",
  payload: { path, fromIndex, toIndex },
});

export const addCondition = (path: number[], joinOperator: string): Action => ({
  type: "ADD_CONDITION",
  payload: { path, joinOperator },
});

export const addRuleAndPolicy = (
  path: number[],
  ruleAndPolicy: RuleAndPolicy
): Action => ({
  type: "ADD_RULE_AND_POLICY",
  payload: { path, ruleAndPolicy },
});

export const removeCondition = (path: number[]): Action => ({
  type: "REMOVE_CONDITION",
  payload: { path },
});

export const removeRuleAndPolicy = (
  path: number[],
  itemId: string
): Action => ({
  type: "REMOVE_RULE_AND_POLICY",
  payload: { path, itemId },
});

export const copyCondition = (
  sourcePath: number[],
  destinationPath: number[]
): Action => ({
  type: "COPY_CONDITION",
  payload: { sourcePath, destinationPath },
});

export const copyItem = (
  sourcePath: number[],
  itemId: string,
  destinationPath: number[]
): Action => ({
  type: "COPY_RULE_AND_POLICY",
  payload: { sourcePath, itemId, destinationPath },
});

export function reducer(state: State, action: Action): State {
  return produce(state, (draft) => {
    const getCondition = (path: number[]): Condition | null => {
      let current: Condition = draft.condition;
      for (const index of path) {
        if (index < 0 || index >= current.conditionGroup.length) {
          return null;
        }
        current = current.conditionGroup[index];
      }
      return current;
    };

    const updateRecursive = (
      condition: Condition,
      path: number[],
      updater: (condition: Condition) => void
    ) => {
      if (path.length === 0) {
        updater(condition);
      } else {
        const [currentIndex, ...restPath] = path;
        if (
          currentIndex >= 0 &&
          currentIndex < condition.conditionGroup.length
        ) {
          updateRecursive(
            condition.conditionGroup[currentIndex],
            restPath,
            updater
          );
        } else {
          throw new Error(
            `Invalid path: subcategory at index ${currentIndex} does not exist`
          );
        }
      }
    };

    switch (action.type) {
      case "ADD_CONDITION":
        updateRecursive(draft.condition, action.payload.path, (condition) => {
          condition.conditionGroup.push({
            id: `category-${Date.now()}`,
            joinOperator: Math.random().toString(),
            conditionGroup: [],
            ruleAndPolicies: [],
          });
        });
        break;

      case "ADD_RULE_AND_POLICY":
        updateRecursive(draft.condition, action.payload.path, (category) => {
          category.ruleAndPolicies.push(action.payload.ruleAndPolicy);
        });
        break;

      case "REMOVE_CONDITION":
        if (action.payload.path.length > 0) {
          const parentPath = action.payload.path.slice(0, -1);
          const lastIndex = action.payload.path[action.payload.path.length - 1];
          updateRecursive(draft.condition, parentPath, (category) => {
            category.conditionGroup.splice(lastIndex, 1);
          });
        }
        break;

      case "REMOVE_RULE_AND_POLICY":
        updateRecursive(draft.condition, action.payload.path, (category) => {
          const index = category.ruleAndPolicies.findIndex(
            (ruleAndPolicy) => ruleAndPolicy.id === action.payload.itemId
          );
          if (index !== -1) {
            category.ruleAndPolicies.splice(index, 1);
          }
        });
        break;

      case "COPY_CONDITION":
        const sourceCategory = getCondition(action.payload.sourcePath);
        if (sourceCategory) {
          const copiedCategory: Condition = JSON.parse(
            JSON.stringify(sourceCategory)
          );
          copiedCategory.id = `category-${Date.now()}`;
          updateRecursive(
            draft.condition,
            action.payload.destinationPath,
            (category) => {
              category.conditionGroup.push(copiedCategory);
            }
          );
        }
        break;

      case "COPY_RULE_AND_POLICY":
        const sourceCategory2 = getCondition(action.payload.sourcePath);
        if (sourceCategory2) {
          const itemToCopy = sourceCategory2.ruleAndPolicies.find(
            (ruleAndPolicy) => ruleAndPolicy.id === action.payload.itemId
          );
          if (itemToCopy) {
            const copiedRuleAndPolicy: RuleAndPolicy = {
              ...itemToCopy,
              id: `item-${Date.now()}`,
            };
            updateRecursive(
              draft.condition,
              action.payload.destinationPath,
              (category) => {
                category.ruleAndPolicies.push(copiedRuleAndPolicy);
              }
            );
          }
        }
        break;
      case "MOVE_CONDITION":
        updateRecursive(draft.condition, action.payload.path, (condition) => {
          const [removed] = condition.conditionGroup.splice(
            action.payload.fromIndex,
            1
          );
          condition.conditionGroup.splice(action.payload.toIndex, 0, removed);
        });
        break;

      case "MOVE_RULE_AND_POLICY":
        updateRecursive(draft.condition, action.payload.path, (condition) => {
          const [removed] = condition.ruleAndPolicies.splice(
            action.payload.fromIndex,
            1
          );
          condition.ruleAndPolicies.splice(action.payload.toIndex, 0, removed);
        });
        break;
      default:
        const _exhaustiveCheck: never = action;
        return _exhaustiveCheck;
    }
  });
}
