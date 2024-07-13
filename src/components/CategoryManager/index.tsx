import React, { useReducer } from "react";
import { Category, State } from "./interfaces";
import {
  addCategory,
  addItem,
  copyCategory,
  copyItem,
  reducer,
  removeCategory,
  removeItem,
} from "./functions";

// 初期状態
const initialState: State = {
  categories: {
    id: "root",
    name: "Root",
    subcategories: [],
    items: [],
  },
};

const CategoryManager: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const renderCategory = (
    category: Category,
    path: number[] = []
  ): JSX.Element => {
    return (
      <div style={{ marginLeft: "20px" }}>
        <h3>{category.name}</h3>
        <button
          onClick={() =>
            dispatch(
              addCategory(
                path,
                `New Category ${category.subcategories.length + 1}`
              )
            )
          }
        >
          Add Subcategory
        </button>
        <button
          onClick={() =>
            dispatch(
              addItem(path, {
                id: `item-${Date.now()}`,
                name: `New Item ${category.items.length + 1}`,
              })
            )
          }
        >
          Add Item
        </button>
        <button onClick={() => dispatch(removeCategory(path))}>
          Remove This Category
        </button>
        <ul>
          {category.items.map((item) => (
            <li key={item.id}>
              {item.name}
              <button onClick={() => dispatch(removeItem(path, item.id))}>
                Remove
              </button>
              <button onClick={() => dispatch(copyItem(path, item.id, path))}>
                Copy
              </button>
            </li>
          ))}
        </ul>
        {category.subcategories.map((subcat, index) => (
          <div key={subcat.id}>
            {renderCategory(subcat, [...path, index])}
            <button
              onClick={() => dispatch(copyCategory([...path, index], path))}
            >
              Copy This Category
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>Category Manager</h2>
      {renderCategory(state.categories)}
    </div>
  );
};

export default CategoryManager;
