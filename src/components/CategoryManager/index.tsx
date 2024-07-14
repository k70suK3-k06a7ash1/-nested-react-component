import React, { useReducer } from "react";
import type { Condition, RuleAndPolicy, State } from "./interfaces";
import {
  Action,
  addCondition,
  addRuleAndPolicy,
  copyCondition,
  copyItem,
  reducer,
  removeCondition,
  removeRuleAndPolicy,
} from "./functions";

const initialState: State = {
  condition: {
    id: "root",
    joinOperator: "AND",
    conditionGroup: [],
    ruleAndPolicies: [],
  },
};

const RuleAndPolicy: React.FC<{
  ruleAndPolicy: RuleAndPolicy;
  path: number[];
  dispatch: React.Dispatch<Action>;
}> = ({ ruleAndPolicy, path, dispatch }) => (
  <li>
    {ruleAndPolicy.subject} {ruleAndPolicy.operator} {ruleAndPolicy.object}
    <button
      onClick={() => dispatch(removeRuleAndPolicy(path, ruleAndPolicy.id))}
    >
      Remove
    </button>
    <button onClick={() => dispatch(copyItem(path, ruleAndPolicy.id, path))}>
      Copy
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
      <h2>{condition.joinOperator}</h2>
      <button onClick={() => dispatch(addCondition(path, "AND"))}>
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
      <ul>
        {condition.ruleAndPolicies.map((ruleAndPolicy) => (
          <div style={{ display: "flex" }}>
            <RuleAndPolicy
              key={ruleAndPolicy.id}
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
        </div>
      ))}
    </div>
  );
};

const ConditionManager: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
