import React, { useReducer } from "react";
import { Category, Item, State } from "./interfaces";
import {
  Action,
  addCategory,
  addItem,
  copyCategory,
  copyItem,
  reducer,
  removeCategory,
  removeItem,
} from "./functions";

const initialState: State = {
  categories: {
    id: "root",
    name: "Root",
    subcategories: [],
    items: [],
  },
};

const CategoryItem: React.FC<{
  item: Item;
  path: number[];
  dispatch: React.Dispatch<Action>;
}> = ({ item, path, dispatch }) => (
  <li>
    {item.name}
    <button onClick={() => dispatch(removeItem(path, item.id))}>Remove</button>
    <button onClick={() => dispatch(copyItem(path, item.id, path))}>
      Copy
    </button>
  </li>
);

// CategoryComponent
const CategoryComponent: React.FC<{
  category: Category;
  path: number[];
  dispatch: React.Dispatch<Action>;
}> = ({ category, path, dispatch }) => {
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
      {path.length > 0 && (
        <button onClick={() => dispatch(removeCategory(path))}>
          Remove This Category
        </button>
      )}
      <ul>
        {category.items.map((item) => (
          <CategoryItem
            key={item.id}
            item={item}
            path={path}
            dispatch={dispatch}
          />
        ))}
      </ul>
      {category.subcategories.map((subcategory, index) => (
        <div key={subcategory.id}>
          <CategoryComponent
            category={subcategory}
            path={[...path, index]}
            dispatch={dispatch}
          />
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

const CategoryManager: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h2>Category Manager</h2>
      <CategoryComponent
        category={state.categories}
        path={[]}
        dispatch={dispatch}
      />
    </div>
  );
};

export default CategoryManager;
