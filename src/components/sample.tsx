import React, { useReducer } from "react";

// 型定義
interface Item {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories: Category[];
  items: Item[];
}

interface State {
  categories: Category;
}

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
  const newState = JSON.parse(JSON.stringify(state)) as State; // ディープコピー
  let current = newState.categories;

  for (const index of path) {
    current = current.subcategories[index];
  }

  current.subcategories.push({
    id: `category-${Date.now()}`,
    name,
    subcategories: [],
    items: [],
  });

  return newState;
}

// アイテムを追加する関数
function addItem(state: State, path: number[], item: Item): State {
  const newState = JSON.parse(JSON.stringify(state)) as State; // ディープコピー
  let current = newState.categories;

  for (const index of path) {
    current = current.subcategories[index];
  }

  current.items.push(item);

  return newState;
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
