// DroppableTableBody.js
import React from 'react';
import { useDrop } from 'react-dnd';

const DroppableTableBody = ({ onDrop, children }) => {
  const [, drop] = useDrop({
    accept: 'ROW',
    drop: (item) => {
      if (item.index !== undefined) {
        onDrop(item);
      }
    },
  });

  return <tbody ref={drop}>{children}</tbody>;
};

export default DroppableTableBody;
