import React, { useReducer } from "react";
import type { Condition, RuleAndPolicy } from "./interfaces";
import {
  Action,
  addCondition,
  addRuleAndPolicy,
  copyCondition,
  copyItem,
  moveCondition,
  moveRuleAndPolicy,
  reducer,
  removeCondition,
  removeRuleAndPolicy,
} from "./functions";
import { dummyInitialState } from "./constants";

const RuleAndPolicy: React.FC<{
  ruleAndPolicy: RuleAndPolicy;
  index: number;
  path: number[];
  dispatch: React.Dispatch<Action>;
}> = ({ ruleAndPolicy, index, path, dispatch }) => (
  <li>
    {ruleAndPolicy.subject} {ruleAndPolicy.operator} {ruleAndPolicy.object}{" "}
    {index}
    <button
      onClick={() => dispatch(removeRuleAndPolicy(path, ruleAndPolicy.id))}
    >
      Remove
    </button>
    <button onClick={() => dispatch(copyItem(path, ruleAndPolicy.id, path))}>
      Copy
    </button>
    <button
      onClick={() =>
        dispatch(moveRuleAndPolicy(path, index, Math.max(0, index - 1)))
      }
      disabled={index === 0}
    >
      Move Up
    </button>
    <button onClick={() => dispatch(moveRuleAndPolicy(path, index, index + 1))}>
      Move Down
    </button>
  </li>
);

// CategoryComponent
const ConditionComponent: React.FC<{
  condition: Condition;
  path: number[];
  dispatch: React.Dispatch<Action>;
}> = ({ condition, path, dispatch }) => {
  return (
    <div style={{ marginLeft: "80px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2>{condition.joinOperator}</h2>
        <button
          onClick={() => dispatch(addCondition(path, Math.random().toString()))}
        >
          Add Condition Group
        </button>
        <button
          onClick={() =>
            dispatch(
              addRuleAndPolicy(path, {
                id: `item-${Date.now()}`,
                subject: "new",
                operator: "equal",
                object: "this",
              })
            )
          }
        >
          Add Rule And Policy
        </button>
        {path.length > 0 && (
          <button onClick={() => dispatch(removeCondition(path))}>
            Remove This Condition
          </button>
        )}
        <span>{JSON.stringify(path)}</span>
      </div>
      <ul>
        {condition.ruleAndPolicies.map((ruleAndPolicy, index) => (
          <div style={{ display: "flex" }}>
            <RuleAndPolicy
              key={ruleAndPolicy.id}
              index={index}
              ruleAndPolicy={ruleAndPolicy}
              path={path}
              dispatch={dispatch}
            />
            <p>{JSON.stringify(path)}</p>
          </div>
        ))}
      </ul>
      {condition.conditionGroup.map((condition, index) => (
        <div key={condition.id}>
          <ConditionComponent
            condition={condition}
            path={[...path, index]}
            dispatch={dispatch}
          />
          <button
            onClick={() => dispatch(copyCondition([...path, index], path))}
          >
            Copy This Condition
          </button>
          <button
            onClick={() =>
              dispatch(moveCondition(path, index, Math.max(0, index - 1)))
            }
            disabled={index === 0}
          >
            Move Up
          </button>
          <button
            onClick={() => dispatch(moveCondition(path, index, index + 1))}
            disabled={index === condition.conditionGroup.length - 1}
          >
            Move Down
          </button>
        </div>
      ))}
    </div>
  );
};

const ConditionManager: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, dummyInitialState);

  return (
    <div>
      <h2>Rule And Policy Condition Group Manager</h2>
      <ConditionComponent
        condition={state.condition}
        path={[]}
        dispatch={dispatch}
      />
    </div>
  );
};

export default ConditionManager;
