export type Tree = {
  id: string;
  name: string;
  branch?: Tree[];
};

export const TREE_LIST: Tree[] = [
  {
    id: "A",
    name: "Category A",
    branch: [
      {
        id: "A1",
        name: "Subcategory A1",
        branch: [
          {
            id: "A1-1",
            name: "Item A1-1",
            branch: [{ id: "A2-1", name: "Item A2-1 hello" }],
          },
          { id: "A1-2", name: "Item A1-2" },
          { id: "A1-3", name: "Item A1-3" },
        ],
      },
      {
        id: "A2",
        name: "Subcategory A2",
        branch: [
          { id: "A2-1", name: "Item A2-1" },
          { id: "A2-2", name: "Item A2-2" },
          { id: "A2-3", name: "Item A2-3" },
        ],
      },
    ],
  },
  {
    id: "B",
    name: "Category B",
    branch: [
      {
        id: "B1",
        name: "Subcategory B1",
        branch: [
          { id: "B1-1", name: "Item B1-1" },
          { id: "B1-2", name: "Item B1-2" },
        ],
      },
    ],
  },
  {
    id: "C",
    name: "Category C",
    branch: [
      { id: "C1", name: "Item C1" },
      { id: "C2", name: "Item C2" },
      //　省略
    ],
  },
];

import React, { useState } from "react";

type Props = {
  items: Tree[];
  level: number;
};

export const TreeList: React.FC<Props> = ({ items, level }) => {
  const [openItems, setOpenItems] = useState<{
    [key: Tree["id"]]: boolean;
  }>({});

  const toggleItem = (id: Tree["id"]) => {
    setOpenItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <>
      {items.map((item) => (
        <div key={item.id}>
          <div onClick={() => item.branch && toggleItem(item.id)}>
            {item.branch ? (openItems[item.id] ? "▼ " : "▶ ") : "●"}
            {item.name}
          </div>
          {item.branch && openItems[item.id] && (
            <TreeList items={item.branch} level={level + 1} />
          )}
        </div>
      ))}
    </>
  );
};

export default function Index() {
  return <TreeList items={TREE_LIST} level={0} />;
}
