import { produce } from "immer";
import { Category, Item, State } from "./interfaces";

// アクションの型定義を改善
export type Action =
  | { type: "ADD_CATEGORY"; payload: { path: number[]; name: string } }
  | { type: "ADD_ITEM"; payload: { path: number[]; item: Item } }
  | { type: "REMOVE_CATEGORY"; payload: { path: number[] } }
  | { type: "REMOVE_ITEM"; payload: { path: number[]; itemId: string } }
  | {
      type: "COPY_CATEGORY";
      payload: { sourcePath: number[]; destinationPath: number[] };
    }
  | {
      type: "COPY_ITEM";
      payload: {
        sourcePath: number[];
        itemId: string;
        destinationPath: number[];
      };
    };

// アクションクリエーターを定義
export const addCategory = (path: number[], name: string): Action => ({
  type: "ADD_CATEGORY",
  payload: { path, name },
});

export const addItem = (path: number[], item: Item): Action => ({
  type: "ADD_ITEM",
  payload: { path, item },
});

export const removeCategory = (path: number[]): Action => ({
  type: "REMOVE_CATEGORY",
  payload: { path },
});

export const removeItem = (path: number[], itemId: string): Action => ({
  type: "REMOVE_ITEM",
  payload: { path, itemId },
});

export const copyCategory = (
  sourcePath: number[],
  destinationPath: number[]
): Action => ({
  type: "COPY_CATEGORY",
  payload: { sourcePath, destinationPath },
});

export const copyItem = (
  sourcePath: number[],
  itemId: string,
  destinationPath: number[]
): Action => ({
  type: "COPY_ITEM",
  payload: { sourcePath, itemId, destinationPath },
});

// リデューサー関数
export function reducer(state: State, action: Action): State {
  return produce(state, (draft) => {
    const getCategory = (path: number[]): Category | null => {
      let current: Category = draft.categories;
      for (const index of path) {
        if (index < 0 || index >= current.subcategories.length) {
          return null;
        }
        current = current.subcategories[index];
      }
      return current;
    };

    //   const updateRecursive = (
    //     category: Category,
    //     path: number[],
    //     updater: (category: Category) => void
    //   ) => {
    //     if (path.length === 0) {
    //       updater(category);
    //     } else {
    //       const [currentIndex, ...restPath] = path;
    //       if (
    //         currentIndex >= 0 &&
    //         currentIndex < category.subcategories.length
    //       ) {
    //         updateRecursive(
    //           category.subcategories[currentIndex],
    //           restPath,
    //           updater
    //         );
    //       } else {
    //         throw new Error(
    //           `Invalid path: subcategory at index ${currentIndex} does not exist`
    //         );
    //       }
    //     }
    //   };
    const updateRecursive = (
      category: Category,
      path: number[],
      updater: (category: Category) => void
    ) => {
      if (path.length === 0) {
        updater(category);
      } else {
        const [currentIndex, ...restPath] = path;
        if (currentIndex >= 0 && currentIndex < category.subcategories.length) {
          updateRecursive(
            category.subcategories[currentIndex],
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
      case "ADD_CATEGORY":
        updateRecursive(draft.categories, action.payload.path, (category) => {
          category.subcategories.push({
            id: `category-${Date.now()}`,
            name: action.payload.name,
            subcategories: [],
            items: [],
          });
        });
        break;

      case "ADD_ITEM":
        updateRecursive(draft.categories, action.payload.path, (category) => {
          category.items.push(action.payload.item);
        });
        break;

      case "REMOVE_CATEGORY":
        if (action.payload.path.length > 0) {
          const parentPath = action.payload.path.slice(0, -1);
          const lastIndex = action.payload.path[action.payload.path.length - 1];
          updateRecursive(draft.categories, parentPath, (category) => {
            category.subcategories.splice(lastIndex, 1);
          });
        }
        break;

      case "REMOVE_ITEM":
        updateRecursive(draft.categories, action.payload.path, (category) => {
          const index = category.items.findIndex(
            (item) => item.id === action.payload.itemId
          );
          if (index !== -1) {
            category.items.splice(index, 1);
          }
        });
        break;

      case "COPY_CATEGORY":
        const sourceCategory = getCategory(action.payload.sourcePath);
        if (sourceCategory) {
          const copiedCategory: Category = JSON.parse(
            JSON.stringify(sourceCategory)
          );
          copiedCategory.id = `category-${Date.now()}`; // 新しいIDを割り当て
          updateRecursive(
            draft.categories,
            action.payload.destinationPath,
            (category) => {
              category.subcategories.push(copiedCategory);
            }
          );
        }
        break;

      case "COPY_ITEM":
        const sourceCategory2 = getCategory(action.payload.sourcePath);
        if (sourceCategory2) {
          const itemToCopy = sourceCategory2.items.find(
            (item) => item.id === action.payload.itemId
          );
          if (itemToCopy) {
            const copiedItem: Item = {
              ...itemToCopy,
              id: `item-${Date.now()}`,
            }; // 新しいIDを割り当て
            updateRecursive(
              draft.categories,
              action.payload.destinationPath,
              (category) => {
                category.items.push(copiedItem);
              }
            );
          }
        }
        break;

      default:
        // 型チェックを厳密に行うため、never型を使用
        const _exhaustiveCheck: never = action;
        return _exhaustiveCheck;
    }
  });
}
