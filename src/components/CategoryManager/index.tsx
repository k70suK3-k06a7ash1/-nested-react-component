import { produce } from "immer";
import React, { useReducer } from "react";
import { Category, Item, State } from "./interfaces";

type Action =
  | { type: "ADD_CATEGORY"; payload: { path: number[]; name: string } }
  | { type: "ADD_ITEM"; payload: { path: number[]; item: Item } };

// 初期状態
const initialState: State = {
  categories: {
    id: "root",
    name: "Root",
    subcategories: [],
    items: [],
  },
};

// リデューサー関数
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_CATEGORY":
      return addCategory(state, action.payload.path, action.payload.name);
    case "ADD_ITEM":
      return addItem(state, action.payload.path, action.payload.item);
    default:
      return state;
  }
}

// カテゴリを追加する関数
function addCategory(state: State, path: number[], name: string): State {
  return produce(state, (draft) => {
    const addCategoryRecursive = (
      category: Category,
      remainingPath: number[]
    ) => {
      if (remainingPath.length === 0) {
        category.subcategories.push({
          id: `category-${Date.now()}`,
          name,
          subcategories: [],
          items: [],
        });
      } else {
        const [currentIndex, ...restPath] = remainingPath;
        addCategoryRecursive(category.subcategories[currentIndex], restPath);
      }
    };

    addCategoryRecursive(draft.categories, path);
  });
}

function addItem(state: State, path: number[], item: Item): State {
  return produce(state, (draft) => {
    const addItemRecursive = (category: Category, remainingPath: number[]) => {
      if (remainingPath.length === 0) {
        category.items.push(item);
      } else {
        const [currentIndex, ...restPath] = remainingPath;
        if (currentIndex >= 0 && currentIndex < category.subcategories.length) {
          addItemRecursive(category.subcategories[currentIndex], restPath);
        } else {
          throw new Error(
            `Invalid path: subcategory at index ${currentIndex} does not exist`
          );
        }
      }
    };

    addItemRecursive(draft.categories, path);
  });
}

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
            dispatch({
              type: "ADD_CATEGORY",
              payload: {
                path,
                name: `New Category ${category.subcategories.length + 1}`,
              },
            })
          }
        >
          Add Subcategory
        </button>
        <button
          onClick={() =>
            dispatch({
              type: "ADD_ITEM",
              payload: {
                path,
                item: {
                  id: `item-${Date.now()}`,
                  name: `New Item ${category.items.length + 1}`,
                },
              },
            })
          }
        >
          Add Item
        </button>
        <ul>
          {category.items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
        {category.subcategories.map((subcat, index) => (
          <div key={subcat.id}>{renderCategory(subcat, [...path, index])}</div>
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
